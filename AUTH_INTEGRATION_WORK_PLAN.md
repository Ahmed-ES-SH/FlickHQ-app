# Auth Integration — Frontend Work Plan

> **Goal:** Align the existing FlickHQ frontend auth logic with the new backend Auth Module (HttpOnly cookies, `{ data }` envelope, no token in response body).
>
> **Reference docs:**
> - `integrations/AUTH_MODULE_INTEGRATION.md` (auth endpoints, cookie flow, response/error format)
> - `integrations/USER_MODULE_INTEGRATION.md` (register, verify-email, full user profile)

---

## 1. Architecture Decision — Cookie Handling Strategy

### Problem

The new backend sets the JWT as an **HttpOnly cookie** via the `Set-Cookie` response header on login. The token is **no longer returned in the response body**. The current frontend architecture:

1. A **server action** calls `globalRequest()` → backend
2. Backend returns `{ user, access_token }` in the body
3. Server action calls `setAuthCookie(access_token)` to set the httpOnly cookie via Next.js `cookies()` API

With the new backend, step 2 changes to `{ data: { user } }` — no `access_token`. The cookie is set by the backend via `Set-Cookie`, but since the server action runs on the Next.js server (not the browser), the `Set-Cookie` from the backend's response goes to the Next.js server, not the browser.

### Solution: Server Action with Set-Cookie Forwarding

**Keep the current server action architecture** but change the login/logout actions to:

1. Call the backend directly with `fetch()` (not through `globalRequest`)
2. Read the `Set-Cookie` header from the backend's response
3. Use `cookies().set()` (via the existing `setAuthCookie` helper) to set the cookie in the browser's response

This keeps the component layer unchanged (SigninForm still calls `loginAction()`, UserButton still calls `logoutAction()`), avoids CORS/SameSite issues, and requires no Route Handler BFF layer.

For all **other** auth operations (register, verify-email, reset-password, etc.) that don't manage cookies, keep using `globalRequest` with minor adjustments for the new response envelope.

---

## 2. Files That Require NO Changes

These files are correct as-is and need no modifications:

| File | Reason |
|------|--------|
| `app/_stores/authStore.ts` | Store interface is generic enough; `User` type will be updated |
| `app/_components/_globalComponents/ClientLayout.tsx` | Receives `User | null` from server — no structural change |
| `app/_components/_client/auth/AuthBootstrap.tsx` | Already handles `?refresh=1` + `setUser()` — works with any user shape |
| `proxy.ts` | Only checks cookie presence/freshness — works regardless of who sets the cookie |
| `app/context/*` | No auth logic |
| `app/hooks/*` | No auth logic |
| `next.config.ts` | No auth-related config needed |
| `.env.example`, `.env.local` | Env vars already correct |

---

## 3. Files Requiring Changes — Detailed Breakdown

---

### 3.1 Types — `app/types/auth.ts`

**What changed:**
- `LoginResponse` no longer has `access_token` (token is now in `Set-Cookie` header)
- `CurrentUserResponse` returns JWT payload only (`id, email, role`) — but with lowercase role/status values
- New `UserFull` type matches the backend user entity
- Role/Status enum values are now lowercase (`'user'` not `'USER'`)
- New fields: `googleId`, `stripeCustomerId`

**Changes:**
```typescript
// Align with backend User entity (from USER_MODULE_INTEGRATION.md)
export type UserRole = 'user' | 'admin';
export type UserStatus = 'active' | 'inactive' | 'banned';

export interface User {
  id: number;
  email: string;
  name?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  isEmailVerified: boolean;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
  googleId?: string;
  stripeCustomerId?: string;
}

// Login response: no more access_token
export interface LoginResponse {
  user: User;
}

// Register response: raw user object (no wrapping)
export interface RegisterResponse extends User {}

// Current user: JWT payload only (id, email, role)
export interface CurrentUserResponse {
  id: number;
  email: string;
  role: UserRole;
}
```

**Remove `LoginResponse.access_token`.**  
**Remove `RegisterResponse` duplicated type** (use `User` directly).  
**Update `CurrentUserResponse.role`** to `UserRole` (lowercase).

---

### 3.2 Session Helper — `app/_helpers/session.ts`

**Minor change:** The `cookie.set()` in production uses `sameSite: "none"`. The backend uses `sameSite: "lax"`. For consistency, consider aligning to `"lax"` in production too — but this is a backend-side decision. The frontend only needs to set the cookie value it extracts from the backend's `Set-Cookie`.

**No changes needed** — `setAuthCookie`, `deleteAuthCookie`, `getAuthCookie`, `getServerAuthCookieHeader` all work correctly for server-side cookie management.

---

### 3.3 Global Request — `app/_helpers/globalRequest.ts`

**What changed:**
- The backend wraps all successful auth responses in `{ data: <body> }`
- The error format changes to `{ statusCode, message, errors?, timestamp, path }`

**Changes needed:**
1. Add automatic `{ data }` unwrapping for the new response envelope
2. Update error message extraction for new format

**Detailed implementation:**
- After parsing the JSON response, if `result.data` exists and the endpoint is an auth endpoint, unwrap `result.data`
- For error handling, extract `message` from the new format (`result.message` instead of `result.message || result.error`)

```typescript
// In the success handler (after line 193):
// Unwrap { data: ... } envelope for auth endpoints
const finalData = transform
  ? transform(result)
  : returnRaw
    ? result
    : result?.data ?? result;  // NEW: unwrap { data } envelope

// In the error handler (line 183):
return {
  success: false,
  message: result?.message || defaultErrorMessage,  // NEW format: result.message
  statusCode: response.status,
  errors: result?.errors,
};
```

**Key decision:** Whether to add an option for `{ data }` unwrapping or do it automatically. Adding an option (`unwrapData: boolean`) is cleaner and backward-compatible. Default: `true` for auth endpoints.

---

### 3.4 Server Actions — `app/_actions/auth.ts` (MAJOR CHANGES)

#### 3.4.1 `loginAction`

**Current behavior:**
- Calls `globalRequest()` to login
- Extracts `{ user, access_token }` from response
- Calls `setAuthCookie(access_token)`

**New behavior:**
- Calls backend directly with `fetch()` (to access `Set-Cookie` header)
- Extracts the JWT from the `Set-Cookie` header
- Calls `setAuthCookie(token)` to set the httpOnly cookie
- Returns `{ user }` from `{ data: { user } }`

```typescript
export async function loginAction(credentials: {
  email: string;
  password: string;
}): Promise<AuthActionResult<{ user: User }>> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) {
    return { success: false, message: "Backend URL not configured", field: "general" };
  }

  let res: Response;
  try {
    res = await fetch(`${backendUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
  } catch (error) {
    return { success: false, message: "Network error. Please try again.", field: "general" };
  }

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    return {
      success: false,
      message: json.message || "Login failed",
      statusCode: res.status,
      field: inferField(res.status, json.message || ""),
    };
  }

  // Extract JWT from Set-Cookie header
  const setCookieHeader = res.headers.get("set-cookie");
  if (setCookieHeader) {
    const cookieName = process.env.NEXT_PUBLIC_AUTH_TOKEN ?? "flick_auth_token";
    const match = setCookieHeader.match(new RegExp(`${cookieName}=([^;]+)`));
    if (match) {
      await setAuthCookie(decodeURIComponent(match[1]));
    }
  }

  const user = json?.data?.user;
  if (!user) {
    return { success: false, message: "Invalid response from server", field: "general" };
  }

  return {
    success: true,
    message: "Logged in successfully",
    data: { user },
    statusCode: res.status,
  };
}
```

#### 3.4.2 `logoutAction`

**Current behavior:**
- Reads token from cookie
- Sends `{ token }` in request body to backend
- Calls `deleteAuthCookie()`

**New behavior:**
- Calls backend with the cookie forwarded
- Backend reads cookie, blacklists JWT, clears the cookie
- Calls `deleteAuthCookie()` to also clear on our side

```typescript
export async function logoutAction(): Promise<AuthActionResult> {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backendUrl) {
    return { success: false, message: "Logout failed", field: "general" };
  }

  const authCookieHeader = await getServerAuthCookieHeader();

  try {
    await fetch(`${backendUrl}/api/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authCookieHeader ? { Cookie: authCookieHeader } : {}),
      },
    });
  } catch {
    // best-effort: still clear the cookie locally
  }

  await deleteAuthCookie();

  return {
    success: true,
    message: "Signed out successfully",
  };
}
```

#### 3.4.3 `fetchCurrentUserAction`

**What changed:**
- Response is now `{ data: { id, email, role } }` — JWT payload only (not full User)
- Return type changes from `Promise<AuthActionResult<User>>` to `Promise<AuthActionResult<CurrentUserResponse>>`

```typescript
import type { CurrentUserResponse } from "@/app/types/auth";

export async function fetchCurrentUserAction(): Promise<
  AuthActionResult<CurrentUserResponse>
> {
  const res = await globalRequest({
    endpoint: API_ENDPOINTS.AUTH.currentUser,
    method: "GET",
    defaultErrorMessage: "Not authenticated",
  });

  if (!res.success || !res.data) {
    return {
      success: false,
      message: normalizeErrorMessage(res.message, "Not authenticated"),
      statusCode: res.statusCode,
    };
  }

  // res.data is now { id, email, role } (CurrentUserResponse)
  return {
    success: true,
    message: res.message,
    data: res.data as CurrentUserResponse,
    statusCode: res.statusCode,
  };
}
```

#### 3.4.4 `registerAction`

**What changed:**
- Response may be wrapped in `{ data }` envelope (if the global TransformInterceptor applies)
- User module returns the user entity directly (id, email, name, avatar, role, status, etc.)
- No cookie is set (user must verify email first)

**Changes:**
- No structural changes needed — `globalRequest` handles the response
- Ensure the response type matches the new User interface

```typescript
// Minimal change: the endpoint stays the same, globalRequest handles the envelope
export async function registerAction(payload: {
  email: string;
  password: string;
  name?: string;
  avatar?: string;
}): Promise<AuthActionResult> {
  const res = await globalRequest({
    endpoint: API_ENDPOINTS.AUTH.register,
    method: "POST",
    body: payload,
    defaultErrorMessage: "Registration failed",
  });

  return {
    success: res.success,
    message: normalizeErrorMessage(res.message, "Registration failed"),
    statusCode: res.statusCode,
    errors: res.errors,
    field: inferField(res.statusCode, res.message),
  };
}
```

#### 3.4.5 Other actions (`verifyEmailAction`, `sendResetPasswordAction`, `verifyResetTokenAction`, `resetPasswordAction`)

**What changed:**
- Response is now `{ data: { message } }` instead of `{ message }`
- Error format is `{ statusCode, message, errors?, timestamp, path }`

**Changes:**
- `sendResetPasswordAction`: Extract message from `res.data?.message` instead of `res.data.message`
- `verifyResetTokenAction`: Extract `userId` from `res.data?.userId` instead of `res.data.userId`
- All actions: Error message extraction already handles the new format via `globalRequest`'s error handling

```typescript
// Example: sendResetPasswordAction
export async function sendResetPasswordAction(
  email: string,
): Promise<AuthActionResult> {
  const res = await globalRequest({
    endpoint: API_ENDPOINTS.AUTH.sendResetPassword,
    method: "POST",
    body: { email },
    defaultErrorMessage:
      "If an account exists with this email, a reset link has been sent.",
  });

  // Note: data is now { data: { message: "..." } }
  // globalRequest returns result.data, so res.data = { message: "..." }
  const backendMessage =
    res.success && res.data?.message
      ? (res.data as { message: string }).message
      : null;

  return {
    success: res.success,
    message:
      res.success && backendMessage
        ? backendMessage
        : "If an account exists with this email, a reset link has been sent.",
    statusCode: res.statusCode,
    errors: res.errors,
  };
}
```

#### 3.4.6 `inferField` function

**Update** to handle new status codes:
- 403 → `"email"` (email not verified)
- 429 → `"general"` (rate limited — new case)
- 400 with "email" in message → `"email"`
- 400 with "password" in message → `"password"`

No changes needed to the function itself — it already handles these cases.

---

### 3.5 Root Layout — `app/layout.tsx`

**What changed:**
- `getInitialUser()` currently expects `res.data` to be a full `User` object
- New `currentUser` endpoint returns `CurrentUserResponse` (`{ id, email, role }`)
- For the full user profile, need a separate call to `GET /api/user/:id`

**Implications:**
- The root layout's `initialUser` will now be a `CurrentUserResponse` (minimal)
- Components that rely on `user.name`, `user.avatar`, etc. (Navbar, UserButton) need the full User
- Strategy: Fetch full user on demand or change the initial flow

**Recommended approach:**
1. `getInitialUser()` returns `CurrentUserResponse | null` (JWT payload only)
2. Rename `initialUser` prop in `ClientLayout` to `initialAuth` (or keep as-is but changed type)
3. In `AuthBootstrap`, store the `CurrentUserResponse` initially
4. If the full user profile is needed (name, avatar), make a deferred call to `GET /api/user/:id` via a server action or client-side fetch
5. The Zustand store holds the full `User` (merged from currentUser + user profile)

**Alternative (simpler):** `fetchCurrentUserAction` already returns the full user from a dedicated profile endpoint. We could create a new action that:
1. Calls `currentUser` to get `{ id, email, role }`
2. If authenticated, calls `GET /api/user/:id` to get full profile
3. Returns the merged result

But this adds latency to every page load. Instead, the plan should be:
1. Root layout fetches current user (JWT payload only) for auth check
2. Navbar/UserButton lazily fetch the full profile when needed
3. Or: Add a `fetchFullUserAction()` that can be called on demand

**For initial implementation (simplest):**
- Create a `fetchFullUserAction(userId: number)` server action that calls `GET /api/user/:id`
- The `AuthBootstrap` component, after setting the initial `CurrentUserResponse`, can optionally call `fetchFullUserAction` to hydrate the full user
- The Zustand store retains the full `User` type, with fields populated lazily

**Changes to `app/layout.tsx`:**

```typescript
import type { CurrentUserResponse } from "./types/auth";

async function getInitialUser(): Promise<CurrentUserResponse | null> {
  try {
    const res = await globalRequest({
      endpoint: API_ENDPOINTS.AUTH.currentUser,
      method: "GET",
      defaultErrorMessage: "Not authenticated",
    });
    if (res.success && res.data) {
      return res.data as CurrentUserResponse;
    }
  } catch {
    // silent fail
  }
  return null;
}
```

---

### 3.6 AuthBootstrap — `app/_components/_client/auth/AuthBootstrap.tsx`

**What changed:**
- `initialUser` is now `CurrentUserResponse | null` instead of `User | null`
- `fetchCurrentUserAction` now returns `CurrentUserResponse` instead of `User`
- Need to optionally fetch full user profile

**Changes:**
```typescript
import type { CurrentUserResponse } from "@/app/types/auth";

interface AuthBootstrapProps {
  initialUser: CurrentUserResponse | null;
}

export default function AuthBootstrap({ initialUser }: AuthBootstrapProps) {
  // ... same logic, but type changes

  useEffect(() => {
    // Fetch full user profile if needed
    if (initialUser?.id) {
      // Optionally: fetchFullUserAction(initialUser.id).then(...)
      // This is deferred — not blocking the initial render
    }
  }, [initialUser?.id]);
}
```

---

### 3.7 SigninForm — `app/_components/_client/auth/SigninForm.tsx`

**What changed:**
- `loginAction` no longer returns `access_token` (cookie handled by server action internally)
- The component code stays the same: `res.data?.user` still works

**No changes needed** in the component — it only uses `res.data?.user` and `res.success`, `res.message`, `res.field`. The internals of `loginAction` change but the return type is the same (`AuthActionResult<{ user: User }>`).

---

### 3.8 UserButton — `app/_components/_client/navbar/UserButton.tsx`

**What changed:**
- `user.name` and `user.avatar` may not be available immediately if we only have `CurrentUserResponse`
- Need to handle partial user data gracefully

**Changes:**
- Fallback display when `name`/`avatar` is missing (already handled with optional chaining)
- Consider lazy-loading the full profile on mount

```typescript
// Already handles undefined gracefully:
const { user?.avatar || "/website/avatar.jpg" }
const { user?.name || user?.email }
```

No changes needed for the fallback behavior — it already works.

---

### 3.9 Signinbtn — `app/_components/_client/navbar/Signinbtn.tsx`

Same as UserButton — already handles missing `name`/`avatar` gracefully via optional chaining.

**No changes needed.**

---

### 3.10 VerifyEmail Page — `app/verify-email/page.tsx`

**What changed:**
- Endpoint response is now `{ data: { message } }` instead of `{ message }`
- Error format is `{ statusCode, message, errors?, timestamp, path }`

**Changes:**
- The action `verifyEmailAction` handles the envelope internally
- **No changes needed** in the page component

---

### 3.11 Reset Password Page — `app/reset-password/page.tsx`

**What changed:**
- `verifyResetTokenAction` now returns `data` inside `{ data: { userId } }`
- The action handles unwrapping internally

**No changes needed** in the page component.

---

### 3.12 Forget Password Page — `app/forget-password/page.tsx`

**What changed:**
- `sendResetPasswordAction` response envelope changes
- Action handles it internally

**No changes needed** in the page component.

---

### 3.13 VerifyCode — `app/_components/_client/auth/VerifyCode.tsx`

**Bug note:** Currently uses `sendResetPasswordAction` (reset password send) to resend the verification email. This is incorrect — it should use a "resend verification email" endpoint. The user module has `POST /user/verify-email` which sends the token as JSON body `{ token }`. But for resending, there's no dedicated endpoint documented.

**For the plan:** Keep as-is for now. The auth module doesn't document a separate "resend verification" endpoint, and the login page triggers resending when a 403 (email not verified) occurs. The current behavior (calling `sendResetPasswordAction`) works for now but should be flagged for future review.

---

### 3.14 OtherMethods — `app/_components/_client/auth/OtherMethods.tsx`

**What changed:**
- Google OAuth flow already works (redirect to backend, backend redirects back with `?refresh=1`)
- `?refresh=1` is already handled by `AuthBootstrap`
- The `fetchCurrentUserAction` used in `AuthBootstrap` will correctly return `CurrentUserResponse`

**No changes needed.**

---

### 3.15 Navbar — `app/_components/_globalComponents/Navbar.tsx`

Server component — renders `<UserButton />`. No auth logic directly.

**No changes needed.**

---

### 3.16 Constants — `app/constants/apis.tsx`

**What changed:**
- `verifyEmailJson` endpoint is defined but unused. Should be removed or kept for future use.
- All other endpoints are correct.

**No changes needed** (keep `verifyEmailJson` for reference, or remove if not needed).

---

### 3.17 API Endpoint Alignment

**Potential endpoint mismatch:**

| Operation | Current Endpoint | Backend Auth Module | Backend User Module | Action |
|-----------|-----------------|--------------------|--------------------|--------|
| Login | `POST /api/auth/login` | ✅ `POST /api/auth/login` | — | Keep |
| Register | `POST /api/user` | — | ✅ `POST /user` | Keep (base URL adds `/api`) |
| Logout | `POST /api/auth/logout` | ✅ `POST /api/auth/logout` | — | Keep |
| Current User | `GET /api/auth/current-user` | ✅ `GET /api/auth/current-user` | — | Keep |
| Verify Email | `POST /api/auth/verify-email?token=` | ✅ `POST /api/auth/verify-email?token=` | ✅ `POST /user/verify-email` (JSON body) | **Verify** — use auth module endpoint |
| Send Reset Password | `POST /api/auth/reset-password/send` | ✅ | — | Keep |
| Verify Reset Token | `POST /api/auth/reset-password/verify` | ✅ | — | Keep |
| Reset Password | `POST /api/auth/reset-password` | ✅ | — | Keep |
| Google OAuth | `GET /api/auth/google` | ✅ | — | Keep |
| Google Callback | `GET /api/auth/google/callback` | ✅ (redirect) | — | Keep |

**Note:** The auth module and user module each define a `verify-email` endpoint with different request formats (query param vs JSON body). The current code uses the auth module endpoint (`/api/auth/verify-email?token=`). Verify with the backend team which endpoint is correct. The auth module doc's endpoint is used here.

---

## 4. Test Changes Required

### 4.1 `app/_actions/__tests__/auth.test.ts`

**Major refactor needed:**

| Test | Change |
|------|--------|
| `loginAction` — success | Remove `access_token` from mock response. Update mock to return new format `{ data: { user } }`. Update assertions to not expect `setAuthCookie` call (or change how it's tested — the new implementation directly calls `fetch` and `setAuthCookie`). |
| `loginAction` — failure | Add test cases for new error format (`{ statusCode, message }`). |
| `loginAction` — rate limit | Add test: 429 response → `field: "general"`. |
| `logoutAction` — success | Change mock: no body sent, just cookies. Update assertions. |
| `logoutAction` — no cookie | Keep as-is (skip backend call). |
| `logoutAction` — error | Keep as-is (still clear cookie). |
| `registerAction` | Update mock to return new format `{ data: { ...user } }`. |
| `fetchCurrentUserAction` | Update mock to return `CurrentUserResponse` (`{ id, email, role }`). |
| All actions | Update mocks to use `{ data }` envelope where applicable. |

**New mocks needed:**
- Mock `fetch` directly (or create a helper that doesn't use `globalRequest` for login/logout)
- Mock `setAuthCookie` and `deleteAuthCookie` (already mocked)
- Add test for `Set-Cookie` header extraction in `loginAction`

### 4.2 `app/_helpers/__tests__/session.test.ts`

**No changes needed** — session helpers are unchanged.

### 4.3 `app/_stores/__tests__/authStore.test.ts`

**Minor change:**
- Update `fakeUser` to use lowercase `role: "user"` and `status: "active"`
- No structural changes

### 4.4 `proxy.test.ts`

**No changes needed** — proxy only checks cookie presence.

---

## 5. New Files to Create

### 5.1 Full User Action — `app/_actions/user.ts`

New server action for fetching the full user profile from the User module:

```typescript
"use server";

import { globalRequest } from "@/app/_helpers/globalRequest";
import { API_ENDPOINTS } from "@/app/constants/apis"; // Note: need to add user endpoints
import type { User } from "@/app/types/auth";

export async function fetchUserProfileAction(
  userId: number,
): Promise<{ success: boolean; data?: User; message?: string }> {
  const res = await globalRequest({
    endpoint: `/api/user/${userId}`,
    method: "GET",
    defaultErrorMessage: "Failed to fetch user profile",
  });

  if (!res.success || !res.data) {
    return { success: false, message: res.message };
  }

  return { success: true, data: res.data as User };
}
```

**Note:** The user module response format may not be wrapped in `{ data }`. The `globalRequest` function's `unwrap` option (added in section 3.3) should handle this. If the user module returns raw objects, set `unwrapData: false` or let the `globalRequest` logic handle it.

### 5.2 Updated API Constants

Add user module endpoints to `app/constants/apis.ts`:

```typescript
export const API_ENDPOINTS = {
  AUTH: {
    // ... existing endpoints
  },
  USER: {
    list: "/api/user",              // Admin: list users
    stats: "/api/user/stats",       // Admin: user stats
    profile: (id: number) => `/api/user/${id}`,  // Get/update user by ID
  },
  // ... existing sections
};
```

---

## 6. Execution Order

The work should be done in this sequence to avoid broken states:

### Phase 1: Types & Infrastructure
1. Update `app/types/auth.ts` — new `User`, `CurrentUserResponse`, `LoginResponse` types
2. Update `app/constants/apis.ts` — add user module endpoints
3. Update `app/_helpers/globalRequest.ts` — add `{ data }` envelope unwrapping

### Phase 2: Server Actions
4. Rewrite `app/_actions/auth.ts` — login/logout use direct fetch, others adjust envelope
5. Create `app/_actions/user.ts` — `fetchUserProfileAction`

### Phase 3: Root Layout & Bootstrap
6. Update `app/layout.tsx` — `getInitialUser()` returns `CurrentUserResponse`
7. Update `app/_components/_client/auth/AuthBootstrap.tsx` — accept `CurrentUserResponse`, optional full profile fetch

### Phase 4: Tests
8. Update `app/_actions/__tests__/auth.test.ts` — all 26+ tests
9. Update `app/_stores/__tests__/authStore.test.ts` — fakeUser type alignment
10. Run full test suite: `pnpm test`

### Phase 5: Verification
11. Verify all auth flows work end-to-end:
    - Register → See "Check your inbox"
    - Login → Cookie set → Redirect to home → User name visible
    - Logout → Cookie cleared → Redirect to signin
    - Reset password → Full flow
    - Protected routes redirect when not authenticated
    - Public auth routes redirect when authenticated

---

## 7. Potential Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| `SameSite=Lax` + cross-origin cookie blocking | Server action approach avoids this (cookie set via Next.js `cookies()` API, same-origin) |
| Backend `Set-Cookie` format changes (e.g., cookie name) | The cookie name is configurable via `NEXT_PUBLIC_AUTH_TOKEN` env var — will match backend |
| User module response format differs from auth module (raw vs `{ data }`) | `globalRequest` may need to handle both — add `unwrapData` option |
| Register endpoint returns different shape than expected | Test against running backend before finalizing |
| `verifyEmailJson` vs auth module verify-email | Confirm with backend team which verify-email endpoint is active |
| Rate limiting (429) not handled in UI | Add toast/error state for 429 responses in login form |
| Full user profile not available in Navbar after login (name/avatar missing) | Lazy-load profile via `fetchUserProfileAction` in `AuthBootstrap` or `UserButton` |

---

## 8. Summary of All Files

| # | File | Action | Complexity |
|---|------|--------|------------|
| 1 | `app/types/auth.ts` | **Update** — new types, lowercase enums | Medium |
| 2 | `app/_helpers/globalRequest.ts` | **Update** — add `{ data }` unwrapping | Low |
| 3 | `app/_actions/auth.ts` | **Rewrite** — login/logout use direct fetch | High |
| 4 | `app/_actions/user.ts` | **Create** — new server action | Low |
| 5 | `app/constants/apis.ts` | **Update** — add user endpoints | Low |
| 6 | `app/layout.tsx` | **Update** — `getInitialUser` returns `CurrentUserResponse` | Low |
| 7 | `app/_components/_client/auth/AuthBootstrap.tsx` | **Update** — handle `CurrentUserResponse` | Low |
| 8 | `app/_actions/__tests__/auth.test.ts` | **Refactor** — all 26+ tests | High |
| 9 | `app/_stores/__tests__/authStore.test.ts` | **Update** — lowercase role/status in fakeUser | Low |
| 10 | All UI components (SigninForm, UserButton, etc.) | **Verify** — should work as-is | None |
| 11 | `proxy.ts`, `proxy.test.ts` | **No change** — cookie check works regardless | None |
| 12 | `app/_helpers/session.ts`, its tests | **No change** — helpers unchanged | None |

---

## 9. Acceptance Criteria

- [ ] User can register (POST /api/user)
- [ ] User sees "Check your inbox" after registration
- [ ] User can log in with email/password
- [ ] HttpOnly cookie is set in the browser after login
- [ ] User can see their name in the navbar after login
- [ ] User can access protected routes (/profile/*)
- [ ] User is redirected to /signin when not authenticated
- [ ] Authenticated user is redirected to / from auth pages
- [ ] User can log out
- [ ] Cookie is cleared in the browser after logout
- [ ] User can reset password (full flow: send → verify → reset)
- [ ] User can verify email
- [ ] Google OAuth flow works (redirect to backend → back to frontend with ?refresh=1)
- [ ] All 40+ existing tests pass
- [ ] 99%+ test coverage maintained on auth files
- [ ] No dead code (old LoginResponse.access_token, old inferField patterns, etc.)

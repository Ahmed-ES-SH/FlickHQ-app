import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

// Mock fetch for login/logout (they use direct fetch, not globalRequest)
const mockFetch = vi.fn();
const originalFetch = globalThis.fetch;
globalThis.fetch = mockFetch as any;

vi.mock("@/app/_helpers/globalRequest", () => ({
  globalRequest: vi.fn(),
}));

vi.mock("@/app/_helpers/session", () => ({
  setAuthCookie: vi.fn(),
  deleteAuthCookie: vi.fn(),
  getAuthCookie: vi.fn(),
  getServerAuthCookieHeader: vi.fn(),
}));

import { globalRequest } from "@/app/_helpers/globalRequest";
import {
  setAuthCookie,
  deleteAuthCookie,
  getAuthCookie,
  getServerAuthCookieHeader,
} from "@/app/_helpers/session";
import { API_ENDPOINTS } from "@/app/constants/apis";
import {
  loginAction,
  registerAction,
  logoutAction,
  verifyEmailAction,
  sendResetPasswordAction,
  verifyResetTokenAction,
  resetPasswordAction,
  fetchCurrentUserAction,
} from "@/app/_actions/auth";
import type { User, CurrentUserResponse } from "@/app/types/auth";

const mockedGlobalRequest = vi.mocked(globalRequest);
const mockedSetAuthCookie = vi.mocked(setAuthCookie);
const mockedDeleteAuthCookie = vi.mocked(deleteAuthCookie);
const mockedGetAuthCookie = vi.mocked(getAuthCookie);
const mockedGetServerAuthCookieHeader = vi.mocked(getServerAuthCookieHeader);

const fakeUser: User = {
  id: 42,
  email: "user@example.com",
  name: "User",
  role: "user",
  status: "active",
  isEmailVerified: true,
  isPremium: false,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
};

const currentUserResponse: CurrentUserResponse = {
  id: 42,
  email: "user@example.com",
  role: "user",
};

function createMockResponse(
  body: any,
  options?: { status?: number; headers?: Record<string, string> },
) {
  const status = options?.status ?? 200;
  const headers = options?.headers ?? {};
  return {
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(body),
    headers: {
      get: vi.fn((name: string) => headers[name] ?? null),
    },
  };
}

beforeEach(() => {
  mockedGlobalRequest.mockReset();
  mockedSetAuthCookie.mockReset();
  mockedDeleteAuthCookie.mockReset();
  mockedGetAuthCookie.mockReset();
  mockedGetServerAuthCookieHeader.mockReset();
  mockFetch.mockReset();
});

afterAll(() => {
  globalThis.fetch = originalFetch;
});

/* ========================================================================
   loginAction
   ======================================================================== */

describe("loginAction", () => {
  it("POSTs credentials, extracts JWT from Set-Cookie, sets the cookie, and returns the user", async () => {
    mockFetch.mockResolvedValueOnce(
      createMockResponse(
        { data: { user: fakeUser }, message: "Logged in" },
        {
          status: 200,
          headers: {
            "set-cookie":
              "flick_auth_token=abc123; Path=/; HttpOnly; SameSite=Lax",
          },
        },
      ),
    );

    const res = await loginAction({ email: "user@example.com", password: "pw" });

    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_ENDPOINTS.AUTH.login}`,
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "user@example.com", password: "pw" }),
      }),
    );
    expect(mockedSetAuthCookie).toHaveBeenCalledWith("abc123");
    expect(res).toEqual({
      success: true,
      message: "Logged in",
      data: { user: fakeUser },
      statusCode: 200,
    });
  });

  it("returns network error when fetch throws", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network failure"));

    const res = await loginAction({ email: "x@x.com", password: "pw" });

    expect(mockedSetAuthCookie).not.toHaveBeenCalled();
    expect(res).toEqual({
      success: false,
      message: "Network error. Please try again.",
      field: "general",
    });
  });

  it("returns error response with inferred field on failure", async () => {
    mockFetch.mockResolvedValueOnce(
      createMockResponse(
        { message: "Invalid credentials", errors: { email: ["Invalid"] } },
        { status: 400 },
      ),
    );

    const res = await loginAction({ email: "x@x.com", password: "pw" });

    expect(mockedSetAuthCookie).not.toHaveBeenCalled();
    expect(res).toEqual({
      success: false,
      message: "Invalid credentials",
      statusCode: 400,
      errors: { email: ["Invalid"] },
      field: "general",
    });
  });

  it("infers field='email' on 403 (email not verified)", async () => {
    mockFetch.mockResolvedValueOnce(
      createMockResponse({ message: "Email not verified" }, { status: 403 }),
    );

    const res = await loginAction({ email: "x@x.com", password: "pw" });
    expect(res.field).toBe("email");
  });

  it("infers field='general' on 429 (rate limited)", async () => {
    mockFetch.mockResolvedValueOnce(
      createMockResponse({ message: "Too many requests" }, { status: 429 }),
    );

    const res = await loginAction({ email: "x@x.com", password: "pw" });
    expect(res.field).toBe("general");
  });

  it("infers field='email' on 400 with 'email' in message", async () => {
    mockFetch.mockResolvedValueOnce(
      createMockResponse({ message: "Email already in use" }, { status: 400 }),
    );

    const res = await loginAction({ email: "x@x.com", password: "pw" });
    expect(res.field).toBe("email");
  });

  it("infers field='password' on 400 with 'password' in message", async () => {
    mockFetch.mockResolvedValueOnce(
      createMockResponse({ message: "password too short" }, { status: 400 }),
    );

    const res = await loginAction({ email: "x@x.com", password: "pw" });
    expect(res.field).toBe("password");
  });

  it("returns error when response is missing user data", async () => {
    mockFetch.mockResolvedValueOnce(
      createMockResponse({ data: {} }, { status: 200 }),
    );

    const res = await loginAction({ email: "x@x.com", password: "pw" });
    expect(res).toEqual({
      success: false,
      message: "Invalid response from server",
      field: "general",
    });
  });

  it("handles missing Set-Cookie header gracefully (no cookie set)", async () => {
    mockFetch.mockResolvedValueOnce(
      createMockResponse(
        { data: { user: fakeUser }, message: "Logged in" },
        { status: 200 }, // no headers → no set-cookie
      ),
    );

    const res = await loginAction({ email: "user@example.com", password: "pw" });

    expect(mockedSetAuthCookie).not.toHaveBeenCalled();
    expect(res.success).toBe(true);
    expect(res.data).toEqual({ user: fakeUser });
  });

  it("ignores Set-Cookie header when cookie name does not match", async () => {
    mockFetch.mockResolvedValueOnce(
      createMockResponse(
        { data: { user: fakeUser }, message: "Logged in" },
        {
          status: 200,
          headers: {
            "set-cookie": "OtherCookie=val; Path=/",
          },
        },
      ),
    );

    const res = await loginAction({ email: "user@example.com", password: "pw" });

    expect(mockedSetAuthCookie).not.toHaveBeenCalled();
    expect(res.success).toBe(true);
  });

  it("handles missing NEXT_PUBLIC_BACKEND_URL", async () => {
    vi.stubEnv("NEXT_PUBLIC_BACKEND_URL", "");

    const res = await loginAction({ email: "x@x.com", password: "pw" });

    vi.unstubAllEnvs();
    expect(res).toEqual({
      success: false,
      message: "Backend URL not configured",
      field: "general",
    });
  });

  it("falls back to 'Login failed' when error response has no message", async () => {
    mockFetch.mockResolvedValueOnce(
      createMockResponse({}, { status: 400 }),
    );

    const res = await loginAction({ email: "x@x.com", password: "pw" });
    expect(res.success).toBe(false);
    expect(res.message).toBe("Login failed");
  });

  it("falls back to 'Logged in successfully' when success response has no message", async () => {
    mockFetch.mockResolvedValueOnce(
      createMockResponse(
        { data: { user: fakeUser } },
        {
          status: 200,
          headers: {
            "set-cookie": "flick_auth_token=abc123; Path=/; HttpOnly",
          },
        },
      ),
    );

    const res = await loginAction({ email: "user@example.com", password: "pw" });
    expect(res.success).toBe(true);
    expect(res.message).toBe("Logged in successfully");
  });

  it("uses fallback cookie name when NEXT_PUBLIC_AUTH_TOKEN is not set", async () => {
    vi.stubEnv("NEXT_PUBLIC_AUTH_TOKEN", undefined as any);
    mockFetch.mockResolvedValueOnce(
      createMockResponse(
        { data: { user: fakeUser }, message: "Logged in" },
        {
          status: 200,
          headers: {
            "set-cookie": "flick_auth_token=fallback-cookie; Path=/; HttpOnly",
          },
        },
      ),
    );

    const res = await loginAction({ email: "user@example.com", password: "pw" });
    expect(mockedSetAuthCookie).toHaveBeenCalledWith("fallback-cookie");
    expect(res.success).toBe(true);
  });

  it("handles JSON parse failure by falling back to empty object", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: vi.fn().mockRejectedValueOnce(new Error("Invalid JSON")),
      headers: { get: vi.fn().mockReturnValue(null) },
    });

    const res = await loginAction({ email: "x@x.com", password: "pw" });
    expect(res.success).toBe(false);
    expect(res.statusCode).toBe(500);
    expect(res.message).toBe("Login failed");
  });
});

/* ========================================================================
   registerAction
   ======================================================================== */

describe("registerAction", () => {
  it("posts the payload and returns the normalized result (no cookie)", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: true,
      message: "Registered",
      statusCode: 201,
    });

    const res = await registerAction({
      email: "new@example.com",
      password: "pw",
      name: "New",
    });

    expect(mockedGlobalRequest).toHaveBeenCalledWith({
      endpoint: API_ENDPOINTS.AUTH.register,
      method: "POST",
      body: { email: "new@example.com", password: "pw", name: "New" },
      defaultErrorMessage: "Registration failed",
    });
    expect(mockedSetAuthCookie).not.toHaveBeenCalled();
    expect(res.success).toBe(true);
    expect(res.statusCode).toBe(201);
  });

  it("returns generic message on failure with inferred field", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: false,
      message: 1234 as any,
      statusCode: 400,
    });

    const res = await registerAction({ email: "x@x.com", password: "pw" });
    expect(res.success).toBe(false);
    expect(res.message).toBe("Registration failed");
    expect(res.field).toBe("general");
  });

  it("joins array error messages", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: false,
      message: ["Validation failed", "Email taken"] as any,
      statusCode: 400,
    });

    const res = await registerAction({ email: "x@x.com", password: "pw" });
    expect(res.message).toBe("Validation failed, Email taken");
  });

  it("infers field='general' when no statusCode is returned", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: false,
      message: "unknown error",
    });

    const res = await registerAction({ email: "x@x.com", password: "pw" });
    expect(res.field).toBe("general");
  });
});

/* ========================================================================
   logoutAction
   ======================================================================== */

describe("logoutAction", () => {
  it("calls backend /auth/logout with the cookie forwarded, then deletes the cookie", async () => {
    mockedGetServerAuthCookieHeader.mockResolvedValueOnce(
      "flick_auth_token=stored-token",
    );
    mockFetch.mockResolvedValueOnce(createMockResponse({}, { status: 200 }));

    const res = await logoutAction();

    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}${API_ENDPOINTS.AUTH.logout}`,
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: "flick_auth_token=stored-token",
        },
      }),
    );
    expect(mockedDeleteAuthCookie).toHaveBeenCalledTimes(1);
    expect(res).toEqual({
      success: true,
      message: "Signed out successfully",
    });
  });

  it("still calls backend when no cookie header is present, and deletes the cookie", async () => {
    mockedGetServerAuthCookieHeader.mockResolvedValueOnce(null);
    mockFetch.mockResolvedValueOnce(createMockResponse({}, { status: 200 }));

    const res = await logoutAction();

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" }, // no Cookie header
      }),
    );
    expect(mockedDeleteAuthCookie).toHaveBeenCalledTimes(1);
    expect(res.success).toBe(true);
  });

  it("still deletes the cookie when the backend logout throws", async () => {
    mockedGetServerAuthCookieHeader.mockResolvedValueOnce(
      "flick_auth_token=stored-token",
    );
    mockFetch.mockRejectedValueOnce(new Error("network down"));

    const res = await logoutAction();

    expect(mockedDeleteAuthCookie).toHaveBeenCalledTimes(1);
    expect(res.success).toBe(true);
  });

  it("skips the backend call when no backend URL is configured, still deletes the cookie", async () => {
    vi.stubEnv("NEXT_PUBLIC_BACKEND_URL", "");

    const res = await logoutAction();

    vi.unstubAllEnvs();
    expect(mockFetch).not.toHaveBeenCalled();
    expect(mockedDeleteAuthCookie).toHaveBeenCalledTimes(1);
    expect(res.success).toBe(true);
  });
});

/* ========================================================================
   verifyEmailAction
   ======================================================================== */

describe("verifyEmailAction", () => {
  it("appends the token to the endpoint and POSTs", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: true,
      message: "Verified",
      statusCode: 200,
    });

    const res = await verifyEmailAction("tok-1");
    expect(mockedGlobalRequest).toHaveBeenCalledWith({
      endpoint: `${API_ENDPOINTS.AUTH.verifyEmail}?token=tok-1`,
      method: "POST",
      defaultErrorMessage: "Verification failed",
    });
    expect(res.success).toBe(true);
  });

  it("does not append empty token", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: true,
      message: "Verified",
      statusCode: 200,
    });

    await verifyEmailAction("");
    expect(mockedGlobalRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: API_ENDPOINTS.AUTH.verifyEmail,
      }),
    );
  });

  it("infers field=email on 403", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: false,
      message: "expired",
      statusCode: 403,
    });

    const res = await verifyEmailAction("tok");
    expect(res.field).toBe("email");
  });
});

/* ========================================================================
   sendResetPasswordAction
   ======================================================================== */

describe("sendResetPasswordAction", () => {
  it("uses backend message on success when provided", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: true,
      message: "ok",
      data: { message: "Reset link sent" },
      statusCode: 200,
    });

    const res = await sendResetPasswordAction("u@example.com");
    expect(res.success).toBe(true);
    expect(res.message).toBe("Reset link sent");
  });

  it("falls back to the constant message when backend has no data.message", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: true,
      message: "ok",
      data: {},
      statusCode: 200,
    });

    const res = await sendResetPasswordAction("u@example.com");
    expect(res.message).toBe(
      "If an account exists with this email, a reset link has been sent.",
    );
  });

  it("uses the constant fallback on failure (does not leak backend error)", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: false,
      message: "internal error xyz",
      statusCode: 500,
    });

    const res = await sendResetPasswordAction("u@example.com");
    expect(res.success).toBe(false);
    expect(res.message).toBe(
      "If an account exists with this email, a reset link has been sent.",
    );
  });
});

/* ========================================================================
   verifyResetTokenAction
   ======================================================================== */

describe("verifyResetTokenAction", () => {
  it("returns userId on success", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: true,
      message: "ok",
      data: { userId: 7 },
      statusCode: 200,
    });

    const res = await verifyResetTokenAction({
      token: "t",
      email: "e@e.com",
    });
    expect(mockedGlobalRequest).toHaveBeenCalledWith({
      endpoint: API_ENDPOINTS.AUTH.verifyResetToken,
      method: "POST",
      body: { token: "t", email: "e@e.com" },
      defaultErrorMessage: "Invalid or expired reset link",
    });
    expect(res.success).toBe(true);
    expect(res.data).toEqual({ userId: 7 });
  });

  it("returns a normalized error on failure (no field inferred for this action)", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: false,
      message: 1234 as any,
      statusCode: 400,
    });

    const res = await verifyResetTokenAction({
      token: "t",
      email: "e@e.com",
    });
    expect(res.success).toBe(false);
    expect(res.message).toBe("Invalid or expired reset link");
    expect(res.field).toBeUndefined();
  });
});

/* ========================================================================
   resetPasswordAction
   ======================================================================== */

describe("resetPasswordAction", () => {
  it("posts and returns the normalized result", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: true,
      message: "Reset",
      statusCode: 200,
    });

    const res = await resetPasswordAction({
      email: "e@e.com",
      token: "t",
      password: "newpw",
    });
    expect(mockedGlobalRequest).toHaveBeenCalledWith({
      endpoint: API_ENDPOINTS.AUTH.resetPassword,
      method: "POST",
      body: { email: "e@e.com", token: "t", password: "newpw" },
      defaultErrorMessage: "Password reset failed",
    });
    expect(res.success).toBe(true);
  });

  it("infers field on failure", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: false,
      message: "weak password",
      statusCode: 400,
    });

    const res = await resetPasswordAction({
      email: "e@e.com",
      token: "t",
      password: "x",
    });
    expect(res.field).toBe("password");
  });
});

/* ========================================================================
   fetchCurrentUserAction
   ======================================================================== */

describe("fetchCurrentUserAction", () => {
  it("GETs the endpoint and returns CurrentUserResponse on success", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: true,
      message: "ok",
      data: currentUserResponse,
      statusCode: 200,
    });

    const res = await fetchCurrentUserAction();
    expect(mockedGlobalRequest).toHaveBeenCalledWith({
      endpoint: API_ENDPOINTS.AUTH.currentUser,
      method: "GET",
      defaultErrorMessage: "Not authenticated",
    });
    expect(res.success).toBe(true);
    expect(res.data).toEqual(currentUserResponse);
  });

  it("returns default 'Not authenticated' on failure with no field", async () => {
    mockedGlobalRequest.mockResolvedValueOnce({
      success: false,
      message: 1234 as any,
      statusCode: 401,
    });

    const res = await fetchCurrentUserAction();
    expect(res.success).toBe(false);
    expect(res.message).toBe("Not authenticated");
    expect(res.statusCode).toBe(401);
    expect(res.field).toBeUndefined();
  });
});

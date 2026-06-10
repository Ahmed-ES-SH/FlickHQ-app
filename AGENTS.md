# AGENTS.md — FlickHQ Frontend

> This file helps AI agents and contributors understand the project quickly.

## Project Overview

FlickHQ is a movie/TV-show discovery and streaming frontend built with Next.js 16 (App Router). It integrates with the TMDB API for media data and a custom backend for user authentication. The UI is a dark, Netflix-inspired theme with framer-motion animations and a responsive layout.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16.2.6 (App Router, Turbopack) |
| React | React 19 |
| Language | TypeScript 5 (strict, bundler module resolution) |
| Styling | Tailwind CSS v4 (PostCSS plugin, no tailwind.config file) + CSS custom properties |
| UI Library | shadcn/ui (new-york style, zinc base, lucide icons) — configured in `components.json` |
| State Management | Zustand (auth store) + React Context (3 providers) |
| Data Fetching (Server) | `globalRequest()` — centralized fetch wrapper with auth forwarding |
| Data Fetching (Client) | React Query (`@tanstack/react-query`) + Axios |
| Animations | Framer Motion |
| Notifications | Sonner (toasts) |
| Sliders | Swiper |
| Icons | react-icons (Fa, Ti, Tb, etc.) |
| Package Manager | pnpm |
| Testing | Vitest 4.1.8 + V8 coverage + jsdom |
| Linting | ESLint 9 (flat config) + next/core-web-vitals + next/typescript |

## Development Commands

```bash
pnpm dev              # Start dev server (Turbopack)
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm test             # Run all tests once
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Run tests + v8 coverage report
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_BACKEND_URL` | Yes | Backend API base URL |
| `NEXT_PUBLIC_AUTH_TOKEN` | No | Auth cookie name (default: `flick_auth_token`) |
| `TMDB_AUTH_TOKEN` | Yes | TMDB API Bearer token (used in `AxiosTool.tsx`) |

See `.env.example` for the template.

## Project Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (server): fonts, metadata, globalRequest, providers
│   ├── page.tsx                  # Homepage (/)
│   ├── not-found.tsx             # Custom 404 page
│   ├── globals.css               # Tailwind v4 + CSS custom properties (dark theme)
│   ├── favicon.ico
│   │
│   ├── (auth)/                   # Route group (no URL segment)
│   │   ├── signin/page.tsx       # /signin
│   │   └── signup/page.tsx       # /signup
│   │
│   ├── movies/                   # /movies + /movies/[movie]
│   │   ├── page.tsx
│   │   └── [movie]/page.tsx
│   ├── shows/                    # /shows + /shows/[title]
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   └── [title]/page.tsx
│   ├── profile/                  # Protected routes (/profile/*)
│   │   ├── layout.tsx            # Adds Sidebar
│   │   ├── page.tsx
│   │   ├── watchlist/page.tsx
│   │   ├── watched/page.tsx
│   │   └── favouritlist/page.tsx
│   │
│   ├── about/page.tsx            # /about
│   ├── contactus/page.tsx        # /contactus
│   ├── pricing/page.tsx          # /pricing
│   ├── privacypolicy/page.tsx    # /privacypolicy
│   ├── forget-password/page.tsx  # /forget-password
│   ├── reset-password/page.tsx   # /reset-password
│   ├── verify-email/page.tsx     # /verify-email
│   │
│   ├── _components/              # Components (underscore prefix = excluded from routing)
│   │   ├── _globalComponents/    # Shared: Navbar, Footer, ClientLayout, Pagination, Img, MotionDiv
│   │   ├── _client/              # Client-only components
│   │   │   ├── auth/             # AuthBootstrap, SigninForm, SignupForm, VerifyCode, OtherMethods
│   │   │   ├── movies/           # Media page components (comments, reviews, action bar, trailer)
│   │   │   ├── mediaPage/        # Media detail sidebar, review/comment form
│   │   │   ├── navbar/           # Signinbtn
│   │   │   └── Sliders/          # HeroSlider, SliderTrending, SliderHeader
│   │   └── _website/             # Server/SSR page components
│   │       ├── _Home/            # HeroSection, MoviesSection, TopRated, Plans, Trending
│   │       ├── _movies/          # MediaCard, MoviesGrid, GenreSidebar, CategoryTabs
│   │       ├── _shows/           # ShowsBody, ShowDetails
│   │       ├── _pricing/         # SwiperBartners
│   │       └── _profile/         # Sidebar
│   │
│   ├── _helpers/                 # Server-side utilities
│   │   ├── globalRequest.ts      # "use server" — centralized fetch wrapper (all requests go through here)
│   │   ├── session.ts            # "use server" — cookie get/set/delete (httpOnly)
│   │   └── helpers.tsx           # Utility functions (formatTitle, metadata, formatDateTime)
│   ├── _stores/                  # Zustand stores
│   │   └── authStore.ts          # "use client" — user, loading, isAuthenticated, setUser, clear
│   ├── _actions/                 # Server actions
│   │   └── auth.ts               # "use server" — login, register, logout, verify, reset password
│   │
│   ├── context/                  # React Context providers
│   │   ├── DataContext.tsx        # Genres data
│   │   ├── ListContext.tsx        # Favorites, watched, watchlist (localStorage)
│   │   └── VariablesContext.tsx   # UI state (scroll, mobile, sidebar, trailer, etc.)
│   ├── hooks/                    # Custom hooks
│   │   ├── FetchData.tsx         # Server-side TMDB data fetching
│   │   ├── FetchClientData.tsx   # Client-side React Query + Axios
│   │   ├── FetchGenres.ts        # Genre fetching
│   │   └── useClickOutside.tsx   # Click outside detection
│   ├── types/                    # TypeScript type definitions
│   │   ├── auth.ts               # User, LoginResponse, RegisterResponse, CurrentUserResponse
│   │   ├── ContextType.ts        # Context type definitions
│   │   ├── global.ts             # PaginationMeta, Category
│   │   └── websiteTypes.ts       # movieType, ShowType, fullMovie, commentType, ReviewType
│   ├── constants/                # Constants
│   │   ├── apis.tsx              # API_ENDPOINTS (backend) + TMDB paths
│   │   └── website.tsx           # navLinks, plans, comments, reviews, partners, features
│   └── Css/
│       └── loader.css            # Loading spinner styles
│
├── proxy.ts                      # Route protection middleware (Next.js proxy convention)
├── proxy.test.ts                 # Tests for proxy.ts
├── vitest.config.ts              # Vitest config (node env, v8 coverage, @/ alias)
├── vitest.setup.ts               # Test setup (env defaults, restoreAllMocks)
├── next.config.ts                # Next.js config (remote image patterns)
├── tsconfig.json                 # TypeScript config (ES2017, strict, bundler resolution, @/* alias)
├── postcss.config.mjs            # PostCSS (Tailwind v4 plugin)
├── eslint.config.mjs             # ESLint flat config
├── components.json               # shadcn/ui configuration
├── package.json                  # Dependencies + scripts
└── public/                       # Static assets (logo, background images, partner logos)
```

## Architecture Patterns

### Routing & Layout

- **App Router** with route groups `(auth)` and dynamic segments `[movie]`, `[title]`.
- **Underscore-prefixed folders** (`_components`, `_helpers`, `_stores`, `_actions`) are excluded from Next.js routing.
- **Root layout** (`app/layout.tsx`) is a server component that fetches the current user via `globalRequest()` and passes it to `ClientLayout`.
- **Profile layout** (`app/profile/layout.tsx`) adds a sidebar for nested profile pages.
- No `middleware.ts` — route protection is handled by `proxy.ts` (Next.js 16 proxy convention).

### Data Flow

```
Root Layout (Server)
  └─ globalRequest({ endpoint, method })  ← fetches initial user
       └─ getServerAuthCookieHeader()     ← reads httpOnly cookie, forwards to backend
            └─ next/headers cookies()     ← reads server-side cookies

Client Components
  └─ useAuthStore()                       ← Zustand (hydrated by AuthBootstrap)
  └─ loginAction() / registerAction()     ← server actions → globalRequest → backend
       └─ setAuthCookie() / deleteAuthCookie()  ← server-side cookie manipulation
```

### Auth Architecture

- **Cookie name:** `flick_auth_token` (configurable via `NEXT_PUBLIC_AUTH_TOKEN`)
- **Cookie type:** httpOnly, sameSite `none` in production / `lax` in development, secure in production
- **Token never exposed to client JS** — no `document.cookie`, no `js-cookie`, no `Authorization` header from client
- **All requests** (server and client) go through `globalRequest()` which reads the cookie server-side via `next/headers` and forwards it as a `Cookie` header
- **Route protection:** `proxy.ts` checks for the auth cookie:
  - Protected routes (`/profile/*`): redirect to `/signin?next=<path>` if no cookie
  - Public auth routes (`/signin`, `/signup`, `/forget-password`, `/reset-password`, `/verify-email`): redirect to `/` if already authenticated

### Server Actions (`app/_actions/auth.ts`)

| Action | Method | Endpoint |
|--------|--------|----------|
| `loginAction` | POST | `/auth/login` |
| `registerAction` | POST | `/user` |
| `logoutAction` | POST | `/auth/logout` |
| `verifyEmailAction` | POST | `/auth/verify-email` |
| `sendResetPasswordAction` | POST | `/auth/reset-password/send` |
| `verifyResetTokenAction` | POST | `/auth/reset-password/verify` |
| `resetPasswordAction` | POST | `/auth/reset-password` |
| `fetchCurrentUserAction` | GET | `/auth/current-user` |

All actions return `AuthActionResult<T>` with `success`, `message`, `data?`, `statusCode?`, `errors?`, `field?`.

### Zustand Store (`app/_stores/authStore.ts`)

```ts
useAuthStore: {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  setUser(user)     // Sets user + isAuthenticated + loading=false
  setLoading(bool)
  clear()           // Resets to logged-out state
}
```

Hydrated by `AuthBootstrap` component on mount (reads `initialUser` from root layout).

### Theming (CSS Custom Properties)

| Variable | Value | Tailwind Token |
|----------|-------|----------------|
| `--accent` | `#E50914` (Netflix red) | `accent` |
| `--panel_bg` | `#0b0b0b` | `panel_bg` |
| `--main_bg` | `#000000` | `main_bg` |
| `--glass_bg` | `rgba(20,20,20,0.4)` | `glass_bg` |
| `--secondery` | `#eaa71c` (gold) | `secondery` |
| `--purble` | `#6b56f9` (purple) | `purble` |
| `--success` | `#28a745` | `success` |
| `--danger` | `#dc3545` | `danger` |

Usage: `className="bg-accent text-panel_bg"`, `className="border-glass_border"`.

### Utility Classes

| Class | Description |
|-------|-------------|
| `.custom-container` | Centered container: `xl:w-[80%] lg:w-[95%] w-[95%] mx-auto p-4` |
| `.touch-target` | Minimum touch target: `min-h-[44px] min-w-[44px]` |
| `.scrollbar-hide` | Hides scrollbar |
| `.text-balance` | `text-wrap: balance` |

### Path Alias

`@/*` maps to the project root. Always use `@/` for imports:

```ts
import { useAuthStore } from "@/app/_stores/authStore";
import { globalRequest } from "@/app/_helpers/globalRequest";
import type { User } from "@/app/types/auth";
```

## Testing

### Framework

Vitest 4.1.8 with:
- `environment: "node"` (server-side code only)
- `globals: true` (no need to import `describe`, `it`, `expect`)
- `@vitejs/plugin-react` for JSX transform
- `@vitest/coverage-v8` for coverage
- `jsdom` available for DOM simulation

### Test Files

| File | Tests | What It Covers |
|------|-------|----------------|
| `app/_stores/__tests__/authStore.test.ts` | 6 | Zustand store: state, setUser, setLoading, clear, immutability |
| `app/_actions/__tests__/auth.test.ts` | 26 | All server actions: success/failure paths, field inference, error normalization |
| `app/_helpers/__tests__/session.test.ts` | 9 | Cookie helpers: get/set/delete, httpOnly, sameSite, env var fallback |
| `proxy.test.ts` | 11 | Route protection: protected routes, public auth routes, cookie name resolution |

### Mocking Strategy

- Mock `globalRequest` (one level above `fetch`) for cleaner action tests
- Mock `next/headers` `cookies()` for session tests
- Mock `next/server` `NextResponse.redirect`/`.next` for proxy tests
- Use `vi.resetModules()` + dynamic `await import()` for env-dependent module constants
- Use `vi.restoreAllMocks()` in `beforeEach` (automatic via setup)

### Coverage

Coverage scope (configured in `vitest.config.ts`):
- `app/_stores/authStore.ts`
- `app/_actions/auth.ts`
- `app/_helpers/session.ts`
- `proxy.ts`

Current coverage: **99% statements, 98% branches, 100% functions, 100% lines**.

## Code Conventions

### File Naming

| Pattern | Example | Purpose |
|---------|---------|---------|
| `PascalCase.tsx` | `Navbar.tsx` | React components |
| `camelCase.ts` | `authStore.ts` | TypeScript files (stores, types, utils) |
| `kebab-case.css` | `loader.css` | CSS files |
| `__tests__/` | `app/_stores/__tests__/` | Test files co-located with source |
| `_prefix/` | `_components/`, `_helpers/` | Excluded from Next.js routing |

### Component Conventions

- `"use client"` directive on all client components
- Server components are the default (no directive needed)
- Server actions use `"use server"` directive
- `globalRequest.ts` and `session.ts` are server-only files
- Use Zustand (`useAuthStore`) for auth state, React Context for UI/data state
- Framer Motion for animations (use `MotionDiv` wrapper or import `motion` directly)
- `sonner` for toasts: `import { toast } from "sonner"` then `toast.success()` / `toast.error()`

### Import Conventions

```ts
// Always use @/ alias
import { useAuthStore } from "@/app/_stores/authStore";
import { globalRequest } from "@/app/_helpers/globalRequest";
import { API_ENDPOINTS } from "@/app/constants/apis";
import type { User } from "@/app/types/auth";

// React/Next imports
import { use } from "react";
import Link from "next/link";
import Image from "next/image";

// External packages
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
```

### Styling Conventions

- Use Tailwind utility classes exclusively
- Reference theme colors via Tailwind tokens: `bg-accent`, `text-panel_bg`, `border-glass_border`
- Responsive: `max-md:`, `md:`, `lg:`, `xl:`, `2xl:` breakpoints
- Custom container: `<div className="custom-container">`
- Dark theme is default — all colors assume dark background
- Framer Motion for page transitions and interactive elements

### Backend Communication

- **All requests** go through `globalRequest()` — never use raw `fetch()` directly
- Backend endpoints have no `/api` prefix (e.g., `/auth/login`, `/user`)
- TMDB API requests use `AxiosTool.tsx` (Axios instance with Bearer token)
- Server components can use `globalRequest()` directly (it's `"use server"`)
- Client components call server actions which use `globalRequest()` internally

## Common Errors

These are known pitfalls that occur frequently when working with this codebase.

### `react-icons/lu` — Icon name doesn't exist in target module

**Error:** `Export LuXxx doesn't exist in target module` when importing from `react-icons/lu`.

**Cause:** The `react-icons/lu` package only exports icons that exist in the **Lucide** icon set. Not every intuitive icon name is available — for example `LuAlertCircle` does not exist, but `LuTriangleAlert` does.

**Fix:** Always check which Lucide icon names are actually available by looking at existing usages in the codebase (grep for `from "react-icons/lu"`) or by checking the [Lucide icon catalog](https://lucide.dev/icons). If an icon isn't available in `react-icons/lu`, use a different icon set from `react-icons` (e.g., `Fa`, `Md`, `Tb`, `Bi`, `Ci`) or find the correct Lucide name.

**Common available Lu icons used in this project:** `LuUser`, `LuMail`, `LuEye`, `LuHeart`, `LuBookmark`, `LuList`, `LuRadio`, `LuMenu`, `LuX`, `LuLoader`, `LuCheck`, `LuCheckCircle`, `LuTriangleAlert`, `LuClock`, `LuSend`, `LuArrowLeft`, `LuSearch`, `LuShield`, `LuLogOut`, `LuCreditCard`, `LuCrown`, `LuZap`, `LuCalendar`, `LuReceipt`, `LuExternalLink`, `LuInbox`, `LuMessageSquare`, `LuPencil`, `LuSave`, `LuCamera`, `LuRefreshCw`, `LuPlay`, `LuHistory`, `LuStar`, `LuDownload`, `LuBadgeCheck`, `LuTrash2`, `LuCopy`, `LuMoreHorizontal`.

### framer-motion `Variants` type errors

**Error:** `Type '{ hidden: ... }' is not assignable to type 'Variants'` (seen in `ShowsBody.tsx`, `about/page.tsx`, `Sidebar.tsx`, `MoviesGrid.tsx`).

**Cause:** framer-motion expects the `transition.type` field to use the `AnimationGeneratorType` union type (e.g., `"spring"`, `"tween"`, `"keyframes"`), not a plain `string`. When you use `as const` or type the variants explicitly, this error surfaces.

**Fix:** Use `as const` on the variants object or explicitly type `type` with the string literal. If not fixing the variants, suppress with a `// @ts-expect-error` and a reason comment.

---

## Pre-existing Issues

These are known issues in the codebase (not introduced by test work):

- **framer-motion `Variants` type:** Some components (`ShowsBody.tsx`, `about/page.tsx`, `Sidebar.tsx`) have TypeScript errors with framer-motion variant definitions. See Common Errors above.
- **`useFetchData` arity:** `DataContext.tsx` has a TypeScript error due to mismatched function signature
- **`pnpm lint`:** Fails because Next.js 16 removed the `next lint` command (needs ESLint CLI migration)

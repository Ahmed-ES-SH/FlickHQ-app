# FlickHQ

**FlickHQ** is a premium, cinema-grade entertainment discovery and streaming frontend built with **Next.js 16**. It integrates with the **TMDB API** for rich media metadata and a custom **NestJS backend** for authentication, subscriptions, billing, and user lists — all wrapped in a dark, Netflix-inspired UI with fluid animations and full bilingual (English/Arabic) RTL support.

> Immersive. Cinematic. Obsidian.

---

## Product Vision

A premium, highly responsive entertainment hub that helps users discover cinematic media, view rich details, manage personalized watchlists, subscribe to plans, and explore trending movies and TV shows — all wrapped in a highly immersive web app interface with desktop-grade animations and full localization support.

**Target audience:** Cinephiles, casual viewers, and movie enthusiasts seeking a premium platform to explore media trends, curate personal collections, and enjoy a high-fidelity cinematic catalog experience.

---

## ✨ Features

- 🔥 **Trending & Top-Rated** — Browse trending movies/TV shows, top-rated lists, popular picks, now playing, and upcoming releases
- 🎬 **Rich Media Details** — View comprehensive information: synopsis, ratings, genres, runtime, cast, seasons, trailers, and more
- ⭐ **Custom Watchlists** — Create and manage personal lists (favorites, watchlist, watched) with full CRUD and custom list support
- 🔐 **Authentication** — Secure auth via httpOnly cookies with token-based session management (never exposed to client JS)
- 💳 **Stripe Subscriptions** — Tiered subscription plans with Stripe Checkout integration, billing portal, and payment history
- 🌍 **Bilingual RTL/LTR** — Full English and Arabic support with symmetric typography and mirrored layouts
- 📱 **Fully Responsive** — Mobile-first, responsive design with touch-friendly targets and optimized layouts for all screen sizes
- 🎨 **Fluid Animations** — Framer Motion micro-interactions, smooth hover scaling, cinematic transitions, and carousel sweeps
- 🔔 **Toast Notifications** — Elegant notifications powered by Sonner
- 🧭 **Advanced Search & Filters** — Genre-based filtering, category tabs, and responsive search bar

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| **React** | [React 19](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) (strict mode, bundler resolution) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) (PostCSS plugin, no config file) + CSS custom properties |
| **UI Library** | [shadcn/ui](https://ui.shadcn.com/) (new-york style, zinc base) |
| **Icons** | [Lucide](https://lucide.dev/) + [react-icons](https://react-icons.github.io/react-icons/) (Fa, Ti, Tb, etc.) |
| **State (Zustand)** | Auth store, list store, subscription store |
| **State (Context)** | Genres data context + UI variables context |
| **Data Fetching (Server)** | `globalRequest()` — centralized fetch wrapper with auth forwarding |
| **Data Fetching (Client)** | [React Query](https://tanstack.com/query) + [Axios](https://axios-http.com/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) |
| **Payments** | [Stripe](https://stripe.com/) (Checkout Sessions, Payment Elements, Billing Portal) |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski/) |
| **Carousels** | [Swiper](https://swiperjs.com/) |
| **Testing** | [Vitest](https://vitest.dev/) + V8 coverage + jsdom |
| **Linting** | [ESLint 9](https://eslint.org/) (flat config) |
| **Package Manager** | pnpm |

---

## 📁 Project Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout: fonts, metadata, providers
│   ├── page.tsx                  # Homepage (/)
│   ├── not-found.tsx             # Custom 404 page
│   ├── globals.css               # Tailwind v4 + CSS custom properties (dark theme)
│   │
│   ├── (auth)/                   # Auth routes (/signin, /signup)
│   ├── movies/                   # /movies + /movies/[movie]
│   ├── shows/                    # /shows + /shows/[title]
│   ├── profile/                  # /profile/* (protected)
│   ├── checkout/                 # /checkout/* (protected, Stripe)
│   ├── userpanal/                # /userpanal/* (protected, subscription management)
│   ├── admin/                    # /admin/* (admin panel)
│   ├── pricing/                  # /pricing
│   ├── about/                    # /about
│   ├── contactus/                # /contactus
│   ├── privacypolicy/            # /privacypolicy
│   ├── forget-password/          # /forget-password
│   ├── reset-password/           # /reset-password
│   ├── verify-email/             # /verify-email
│   │
│   ├── _components/              # Components (excluded from routing)
│   │   ├── _globalComponents/    # Navbar, Footer, ClientLayout, Pagination, MotionDiv, etc.
│   │   ├── _client/              # Client-only: auth, lists, mediaPage, navbar, Sliders
│   │   ├── _website/             # Server/SSR: Home, movies, shows, pricing, profile, about
│   │   ├── _checkout/            # Stripe checkout components
│   │   ├── _userpanal/           # User panel components
│   │   └── _admin/               # Admin components
│   │
│   ├── _actions/                 # Server actions (auth, billing, checkout, contact, lists, plans, profile, user)
│   ├── _helpers/                 # Server utilities (globalRequest, session, helpers, localListFallback)
│   ├── _stores/                  # Zustand stores (authStore, listStore, subscriptionStore)
│   ├── context/                  # React Context (DataContext, VariablesContext)
│   ├── hooks/                    # Custom hooks (FetchClientData, FetchData, FetchGenres, useCheckout, useClickOutside)
│   ├── types/                    # TypeScript definitions (auth, lists, subscriptions, movies, shows, contact, etc.)
│   ├── constants/                # API endpoints + static data (plans, nav links, partners, features)
│   └── Css/                      # Additional styles (loader.css)
│
├── proxy.ts                      # Route protection middleware (Next.js 16 proxy convention)
├── proxy.test.ts                 # Tests for proxy.ts — 11 tests
├── vitest.config.ts              # Vitest configuration
├── vitest.setup.ts               # Test setup (env defaults, mocks)
├── next.config.ts                # Next.js config (remote image patterns)
├── tsconfig.json                 # TypeScript strict config (@/* alias)
├── eslint.config.mjs             # ESLint flat config
├── components.json               # shadcn/ui configuration
├── postcss.config.mjs            # PostCSS (Tailwind v4 plugin)
├── package.json                  # Dependencies & scripts
├── AGENTS.md                     # AI agent reference
├── DESIGN.md                     # Full design system documentation
├── PRODUCT.md                    # Product specification
└── public/                       # Static assets (logo, backgrounds)
```

---

## 🎨 Design System

Built on **"The Midnight Cinema Canopy"** concept — dark, light-absorbing obsidian foundations with hot crimson spotlights.

### Theming

| Variable | Value | Tailwind Token | Usage |
|----------|-------|----------------|-------|
| `--accent` | `#E50914` | `accent` | Primary CTAs, active indicators, scrollbar |
| `--panel_bg` | `#0b0b0b` | `panel_bg` | Card & panel backgrounds |
| `--main_bg` | `#000000` | `main_bg` | Page canvas (pure black) |
| `--glass_bg` | `rgba(20,20,20,0.4)` | `glass_bg` | Translucent overlays |
| `--glass_border` | `rgba(255,255,255,0.1)` | `glass_border` | Subtle borders |
| `--secondery` | `#eaa71c` | `secondery` | Ratings, premium highlights |
| `--success` | `#28a745` | `success` | Success states |
| `--danger` | `#dc3545` | `danger` | Error/danger states |
| `--purble` | `#6b56f9` | `purble` | Accent purple |

### Typography

| Style | Weight | Size | Usage |
|-------|--------|------|-------|
| Display | 800 | `clamp(2.5rem, 6vw, 4rem)` | Hero titles |
| Headline | 700 | `1.875rem` | Section headers |
| Title | 600 | `1.25rem` | Card names, popups |
| Body | 300 | `1rem` (max 75ch) | Descriptions, reviews |
| Label | 500 | `0.875rem` | Badges, metadata |

### Key Utility Classes

| Class | Purpose |
|-------|---------|
| `.custom-container` | `xl:w-[80%] lg:w-[95%] w-[95%] mx-auto p-4` |
| `.touch-target` | `min-h-[44px] min-w-[44px]` |
| `.scrollbar-hide` | Hides scrollbar across browsers |
| `.text-balance` | `text-wrap: balance` |

---

## 🏗️ Architecture

### Routing & Layout

- **App Router** with route groups (`(auth)`) and dynamic segments (`[movie]`, `[title]`)
- **Underscore-prefixed folders** (`_components`, `_helpers`, `_stores`, `_actions`) are excluded from routing
- **Root layout** (`app/layout.tsx`) fetches the current user server-side and passes it to `ClientLayout`
- **Route protection** handled by `proxy.ts` (Next.js 16 proxy convention — no `middleware.ts`)

### Data Flow

```
Root Layout (Server)
  └─ globalRequest() ── reads httpOnly cookie via next/headers
       └─ forwards Cookie header to backend
            └─ returns current user + subscription

Client Components
  └─ useAuthStore() (Zustand) ── hydrated by AuthBootstrap
  └─ Server Actions ── loginAction, registerAction, etc.
       └─ globalRequest() ── backend communication
```

### Provider Hierarchy

```
QueryClientProvider
  ├── AuthBootstrap           → Hydrates authStore
  ├── SubscriptionBootstrap   → Hydrates subscriptionStore
  ├── ListBootstrap           → Loads listStore from API
  └── VariablesContext        → UI state (scroll, sidebar, trailer, search)
       └── DataContext        → Genres data (movies + shows)
```

### Auth Architecture

- **httpOnly cookies** — token never exposed to client JavaScript
- **Cookie name:** `flick_auth_token` (configurable via `NEXT_PUBLIC_AUTH_TOKEN`)
- **All requests** go through `globalRequest()` which reads the cookie server-side
- **Route protection:** `proxy.ts` redirects unauthenticated users from `/profile/*`, `/checkout/*`, `/userpanal/*` to `/signin`

### State Management

| Concern | Mechanism |
|---------|-----------|
| Auth state | Zustand (`authStore.ts`) |
| Lists (favorites, watchlist, watched, custom) | Zustand (`listStore.ts`) — optimistic updates |
| Subscription | Zustand (`subscriptionStore.ts`) |
| Genres data | React Context (`DataContext.tsx`) |
| UI state | React Context (`VariablesContext.tsx`) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+
- **pnpm** (recommended) or npm
- **TMDB API Key** — get one at [themoviedb.org](https://www.themoviedb.org/settings/api)
- **Backend** — A running NestJS backend instance (see `.env.example`)

### Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
TMDB_AUTH_TOKEN=your_tmdb_api_read_access_token
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_AUTH_TOKEN=flick_auth_token
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxx
```

### Installation

```bash
# Install dependencies
pnpm install

# Start development server (Turbopack)
pnpm dev

# Production build
pnpm build

# Start production server
pnpm start
```

Visit [http://localhost:3000](http://localhost:3000) — the app expects a running backend at `NEXT_PUBLIC_BACKEND_URL`.

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server with Turbopack |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm test` | Run all tests (Vitest) |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:coverage` | Run tests with V8 coverage report |

---

## 🧪 Testing

**Framework:** Vitest 4 with V8 coverage provider and jsdom.

Test suite includes **46+ tests** across:

| File | Tests | Coverage |
|------|-------|----------|
| `app/_stores/__tests__/authStore.test.ts` | 6 | Zustand auth store operations |
| `app/_actions/__tests__/auth.test.ts` | 26 | All server actions (login, register, logout, verify, reset) |
| `app/_helpers/__tests__/session.test.ts` | 9 | Cookie get/set/delete helpers |
| `proxy.test.ts` | 11 | Route protection middleware |

```bash
pnpm test              # Run once
pnpm test:coverage     # With coverage report
```

Coverage scope: `authStore.ts`, `listStore.ts`, `auth.ts`, `lists.ts`, `session.ts`, `proxy.ts` — currently **99% statements**.

---

## 🔌 API Integration

### TMDB API (Media Data)

- **Server components:** `FetchData.tsx` — direct TMDB calls via Axios with Bearer token (`TMDB_AUTH_TOKEN`)
- **Client components:** `FetchClientData.tsx` — React Query + Axios (`AxiosTool.tsx`)
- **Base URL:** `https://api.themoviedb.org/3`

### Backend API (Auth, Lists, Billing)

- **All requests** go through `globalRequest()` (server-only, `"use server"` directive)
- **Endpoints** are `/api/*` prefixed (e.g., `/api/auth/login`, `/api/lists`, `/api/billing/checkout/subscription`)
- **Auth** is handled transparently via httpOnly cookie forwarding

### Stripe Integration

- **Checkout Sessions** — `createCheckoutSessionAction()` for subscription, `createOneTimeCheckoutSessionAction()` for one-time
- **Payment Elements** — Embedded Stripe Elements UI for custom checkout forms
- **Billing Portal** — Stripe Customer Portal session for subscription management
- **Webhook-ready** — Backend handles Stripe webhooks for payment lifecycle events

---

## 📦 Key Packages

| Package | Purpose |
|---------|---------|
| `next` 16.2.6 | Framework with App Router |
| `react` 19 | UI library |
| `@tanstack/react-query` 5 | Client-side data fetching & caching |
| `zustand` 5 | Lightweight state management |
| `framer-motion` 12 | Declarative animations |
| `stripe` (react-stripe-js + stripe-js) | Payment processing |
| `tailwindcss` 4 | Utility-first CSS |
| `swiper` 11 | Touch-enabled carousels |
| `sonner` 2 | Toast notifications |
| `axios` 1 | HTTP client |
| `vitest` 4 | Unit testing |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is private and not licensed for public use.

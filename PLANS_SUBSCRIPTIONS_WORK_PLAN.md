# Plans & Subscriptions Module — Frontend Work Plan

> Generated from `integrations/PLANS_SUBSCRIPTIONS_INTEGRATION.md`
> **Target Backend:** NestJS module `src/plans-subscriptions` + `src/billing`
> **Auth Cookie:** `sanad_auth_token` (JWT httpOnly)

---

## Milestones Overview

| Milestone | Description | Deliverables |
|-----------|-------------|--------------|
| **M1 — Foundation** | Types, API layer, constants, enums | Type definitions, API endpoints config, enum constants, `globalRequest` extensions |
| **M2 — Public Pricing Page** | Update PlansSection, pricing page with live data | Dynamic plans from `GET /api/plans`, billing toggle, subscribe button |
| **M3 — Checkout Flow** | Subscription & one-time purchase flow | Checkout API calls, Stripe redirect, success page with polling |
| **M4 — User Subscriptions** | Subscription status, history, payment history | Current subscription badge, history pages, payment history, portal session |
| **M5 — Admin Plan Management** | Admin CRUD for plans & prices | Admin page with plan list, create/edit/archive, price management |
| **M6 — Testing** | Test all new features | Unit tests, integration tests, coverage |

---

## Phase Breakdown

---

### Phase 1 — Foundation (Week 1)

#### 1.1 Define Types (`app/types/subscriptions.ts`)

Create shared type definitions based on the integration plan's data models:

- `PlanResponseDto` — plan with prices
- `PriceResponseDto` — price details (minor units, interval, type)
- `UserSubscriptionHistoryItemDto` — current/historical subscription
- `SubscriptionHistoryResponseDto` — status change timeline entry
- `UserPaymentHistoryItemDto` — payment record
- `CheckoutSessionResponse` — `{ sessionId, url }`
- `PortalSessionResponse` — `{ url }`
- Enums: `BillingPlanStatus`, `BillingPriceType`, `BillingRecurringInterval`, `BillingSubscriptionStatus`, `BillingPaymentStatus`, `TransactionType`

#### 1.2 Add API Endpoints (`app/constants/apis.tsx`)

Add to `API_ENDPOINTS`:

```ts
PLANS: {
  list: "/api/plans",
},
SUBSCRIPTIONS: {
  current: "/api/subscriptions/current",
  history: "/api/subscriptions/history",
  historyDetail: (id: string) => `/api/subscriptions/history/${id}`,
},
PAYMENTS: {
  history: "/api/payments/history",
  detail: (id: string) => `/api/payments/${id}`,
},
BILLING: {
  checkoutSubscription: "/api/billing/checkout/subscription",
  checkoutOneTime: "/api/billing/checkout/one-time",
  portalSession: "/api/billing/portal/session",
  customer: "/api/billing/customer",
},
ADMIN_PLANS: {
  create: "/api/admin/plans",
  list: "/api/admin/plans",
  detail: (id: string) => `/api/admin/plans/${id}`,
  update: (id: string) => `/api/admin/plans/${id}`,
  archive: (id: string) => `/api/admin/plans/${id}/archive`,
  addPrice: (id: string) => `/api/admin/plans/${id}/prices`,
  listPrices: (id: string) => `/api/admin/plans/${id}/prices`,
  deactivatePrice: (priceId: string) => `/api/admin/plans/prices/${priceId}`,
},
```

#### 1.3 Create Server Actions (`app/_actions/plans.ts`)

Create server actions following the auth pattern in `auth.ts`:

- `fetchPlansAction()` — `GET /api/plans` (public, no JWT needed)
- `fetchCurrentSubscriptionAction()` — `GET /api/subscriptions/current`
- `fetchSubscriptionHistoryAction(page, limit)` — `GET /api/subscriptions/history`
- `fetchSubscriptionTimelineAction(subscriptionId)` — `GET /api/subscriptions/history/:id`
- `fetchPaymentHistoryAction(page, limit)` — `GET /api/payments/history`
- `fetchPaymentDetailAction(id)` — `GET /api/payments/:id`
- `createSubscriptionCheckoutAction(priceId, options)` — `POST /api/billing/checkout/subscription`
- `createOneTimeCheckoutAction(priceId, options)` — `POST /api/billing/checkout/one-time`
- `createPortalSessionAction()` — `POST /api/billing/portal/session`
- `ensureBillingCustomerAction()` — `GET /api/billing/customer`

All user/admin actions forward JWT via `globalRequest` (cookie forwarding built-in).

#### 1.4 Update `globalRequest` for Public Endpoints

Ensure `globalRequest` can skip auth for public endpoints (e.g., `GET /api/plans`). Add an option:

```ts
interface GlobalRequestOptions {
  // ...
  authenticated?: boolean; // default: true — skips cookie forwarding when false
}
```

---

### Phase 2 — Public Pricing Page (Week 2)

#### 2.1 Update `PlansSection.tsx` (Homepage)

Replace hardcoded `plans` and `sharedOptions` imports with live data from `fetchPlansAction()`:

- Fetch plans on mount (client component)
- Sort by `displayOrder` ascending
- Use `plan.highlight` for the "Most Popular" badge (instead of hardcoded index 1)
- Display features from `plan.features` (not `sharedOptions`)
- Format price: `price.unitAmount / 100` with currency symbol
- Show interval from `price.interval`
- Handle multiple prices per plan (pick first active recurring price)
- "Select {plan.name}" button calls `handleSubscribe(priceId, isRecurring)`

#### 2.2 Update `app/pricing/page.tsx`

Replace the fully hardcoded inline `plans` array with dynamic data from `fetchPlansAction()`:

- Fetch plans on mount (client component)
- Preserve existing: billing toggle (monthly/annual), feature cards, partners section
- For annual toggle: find a yearly interval price per plan if available; fall back to monthly
- "Select" button triggers checkout flow (Phase 3)
- Handle empty state (no plans returned → show message)
- Handle loading state (skeleton placeholders)
- Handle error state (toast + retry)

#### 2.3 Add Loading & Error States

- Create `PlansSkeleton` component for pricing page
- Create `PlanCardSkeleton` for homepage section
- Error boundary with retry capability

---

### Phase 3 — Checkout Flow (Week 3)

#### 3.1 Create Checkout Button Component (`app/_components/_website/_pricing/SubscribeButton.tsx`)

Reusable "Subscribe" / "Select Plan" button:

- Accepts `priceId: string`, `isRecurring: boolean`, `planName: string`
- On click:
  1. Generate `crypto.randomUUID()` for `Idempotency-Key`
  2. Call `ensureBillingCustomerAction()` first (if user is authenticated)
  3. Call `createSubscriptionCheckoutAction()` or `createOneTimeCheckoutAction()`
  4. Handle HTTP 409 (already subscribed → offer portal link)
  5. Handle HTTP 404 (plan unavailable → refresh plans)
  6. Store `sessionId` in `sessionStorage`
  7. Redirect to `session.url`
- Handle unauthenticated state → redirect to `/signin?next=/pricing`

#### 3.2 Create Success Page (`app/checkout/success/page.tsx`)

After Stripe redirect with `?session_id`:

- Read `session_id` from URL query params
- Show loading/confirmation pending state
- Poll `GET /api/subscriptions/current` (up to 15 attempts, 2s interval)
- On success → show subscription confirmation with plan name, amount, period
- On timeout → show "We're activating your subscription" with support link
- Clean up `sessionStorage`

#### 3.3 Create Cancel Page (`app/checkout/cancel/page.tsx`)

After Stripe cancel redirect:

- Show "Checkout canceled" message
- Link back to `/pricing`
- No polling needed

#### 3.4 Create Checkout API Hook (`app/hooks/useCheckout.ts`)

Client-side hook wrapping the checkout flow:

- `useCheckout()` returns `{ handleSubscribe, loading, error }`
- Manages `Idempotency-Key` generation and retry logic
- Handles error mapping (see Section 2.7 of integration plan)
- Integrates with `useAuthStore` for auth state

---

### Phase 4 — User Subscription Management (Week 4)

#### 4.1 Current Subscription Badge

Add to profile layout or navbar:

- Component `SubscriptionBadge` that calls `GET /api/subscriptions/current`
- Shows plan name + status with colour badge (green=active, blue=trialing, yellow=past_due, etc.)
- If `null`, show "Subscribe" CTA linking to `/pricing`
- Show `cancelAtPeriodEnd` warning if set
- Show trial end date if trialing

#### 4.2 Subscription History Page (`app/profile/subscriptions/page.tsx`)

New profile sub-page:

- Fetch paginated subscription history
- Table with columns: Plan Name, Status (badge), Period, Amount, Actions
- Row click navigates to subscription timeline
- Pagination component
- Empty state: "No subscription history"

#### 4.3 Subscription Timeline Page (`app/profile/subscriptions/[id]/page.tsx`)

Detail view for a single subscription's status change timeline:

- Fetch `GET /api/subscriptions/history/:subscriptionId`
- Vertical timeline UI showing `previousStatus → newStatus` transitions
- Display `reason` and `occurredAt` for each entry
- Show current period dates, trial end, cancel status

#### 4.4 Payment History Page (`app/profile/payments/page.tsx`)

New profile sub-page:

- Fetch `GET /api/payments/history?page=1&limit=20`
- Table: Amount (formatted from minor units), Status, Transaction Type (charge/refund), Invoice #, Date
- Status badges (succeeded=green, failed=red, refunded=gray, etc.)
- Refunded amounts shown with negative indicator
- Row click → payment detail
- Pagination

#### 4.5 Payment Detail Page (`app/profile/payments/[id]/page.tsx`)

Single payment receipt view:

- Fetch `GET /api/payments/:id`
- Display: amount, amount refunded, currency, status, description, linked subscription, invoice number
- Show `partially_refunded` state with amount breakdown

#### 4.6 Stripe Customer Portal Integration

Add "Manage Subscription" button on profile:

- Component `ManageSubscriptionButton`
- Calls `POST /api/billing/portal/session` with `Idempotency-Key`
- Redirects to portal URL
- Handles 401 (redirect to login)

#### 4.7 Update Profile Layout Navigation

Add links to new pages in the profile sidebar:

- Subscriptions → `/profile/subscriptions`
- Payment History → `/profile/payments`

---

### Phase 5 — Admin Plan Management (Week 5)

#### 5.1 Admin Plans List Page (`app/admin/plans/page.tsx`)

Protected admin route:

- Fetch `GET /api/admin/plans` (with optional status filter)
- Table: Code, Name, Status, Prices count, Display Order, Highlight, Created
- Status badges (draft=gray, active=green, archived=red)
- Filter by status (tabs or dropdown)
- "Create Plan" button → modal or create page
- Row actions: Edit, Archive, Manage Prices

#### 5.2 Admin Plan Create/Edit

- Form modal or separate page
- Fields: code (create only), name, description, features (tag input), displayOrder, icon URL, highlight toggle
- Create → `POST /api/admin/plans` → redirect to edit
- Edit → `PATCH /api/admin/plans/:id`
- Validation matching DTO constraints
- Error handling for 409 (archived plan) and 400 (validation)

#### 5.3 Admin Price Management

- Section within plan detail/edit page
- List prices: Currency, Amount (formatted), Type, Interval, Trial Days, Active status
- "Add Price" form: stripePriceId, currency, unitAmount, type, interval (if recurring), trialPeriodDays, active
- `POST /api/admin/plans/:id/prices`
- Deactivate price button → `PATCH /api/admin/plans/prices/:id` (sets active=false)
- No delete — deactivation only per integration spec

#### 5.4 Admin Plan Archive

- "Archive Plan" button on plan detail page
- `POST /api/admin/plans/:id/archive`
- Confirmation dialog
- 404 if plan not found
- Disable editing once archived (backend returns 409)

#### 5.5 Admin Route Protection

- Wrap admin pages in role guard
- Check JWT + ADMIN role before rendering
- Redirect non-admin users to `/` with toast

---

### Phase 6 — Testing (Week 6)

#### 6.1 Type Tests

- Verify all DTO interfaces match response shapes
- Enum value correctness

#### 6.2 Server Action Tests (`app/_actions/__tests__/plans.test.ts`)

- Mock `globalRequest` for each action
- Test success paths (plans list, subscription, payment history)
- Test failure paths (401, 404, 409, 400)
- Test edge cases (empty plans, null subscription, empty history)
- Test checkout idempotency key handling
- Test portal session creation

#### 6.3 Component Tests

- Pricing page renders plans from API
- Subscription badge shows correct status colors
- Checkout button handles auth states
- Success page polling logic
- Admin plan CRUD forms

#### 6.4 Integration / E2E Tests

- Full checkout flow (mocked Stripe redirect)
- Subscription status badge reflects API response
- Admin plan lifecycle (create → add price → activate → archive)

#### 6.5 Coverage Target

- ≥90% statements, branches, functions, lines for:
  - `app/_actions/plans.ts`
  - `app/types/subscriptions.ts`
  - `app/hooks/useCheckout.ts`
  - New profile page components

---

## Dependencies & Prerequisites

| Dependency | Notes |
|-----------|-------|
| Backend `plans-subscriptions` module deployed | All endpoints must be live |
| Backend `billing` module deployed | Checkout, portal, customer endpoints |
| Stripe product/price IDs configured in DB | Admin will create via Stripe Dashboard + admin API |
| `STRIPE_SUCCESS_URL` and `STRIPE_CANCEL_URL` env vars set | Configured server-side |
| User auth with JWT cookie working | Already implemented |

## File Creation Summary

### New Files

| File | Phase |
|------|-------|
| `app/types/subscriptions.ts` | P1 |
| `app/_actions/plans.ts` | P1 |
| `app/_components/_website/_pricing/SubscribeButton.tsx` | P3 |
| `app/checkout/success/page.tsx` | P3 |
| `app/checkout/cancel/page.tsx` | P3 |
| `app/hooks/useCheckout.ts` | P3 |
| `app/_components/_globalComponents/SubscriptionBadge.tsx` | P4 |
| `app/profile/subscriptions/page.tsx` | P4 |
| `app/profile/subscriptions/[id]/page.tsx` | P4 |
| `app/profile/payments/page.tsx` | P4 |
| `app/profile/payments/[id]/page.tsx` | P4 |
| `app/_components/_profile/ManageSubscriptionButton.tsx` | P4 |
| `app/admin/plans/page.tsx` | P5 |
| `app/admin/plans/create/page.tsx` | P5 |
| `app/admin/plans/[id]/page.tsx` | P5 |
| `app/_actions/__tests__/plans.test.ts` | P6 |

### Modified Files

| File | Phase | Changes |
|------|-------|---------|
| `app/constants/apis.tsx` | P1 | Add PLANS, SUBSCRIPTIONS, PAYMENTS, BILLING, ADMIN_PLANS endpoints |
| `app/_helpers/globalRequest.ts` | P1 | Add `authenticated` option for public endpoints |
| `app/_components/_website/_Home/PlansSection.tsx` | P2 | Replace hardcoded plans with live API data, dynamic features, proper price formatting |
| `app/pricing/page.tsx` | P2 | Replace hardcoded plans with live API data, integrate SubscribeButton |
| `app/profile/layout.tsx` | P4 | Add subscription/payment links to sidebar |

---

## Key Architectural Decisions

1. **Server Actions for all API calls** — Follow existing auth pattern. Even public `GET /api/plans` uses a server action (for consistency, and because it's already a server component pattern).

2. **Idempotency-Key generated client-side** — `crypto.randomUUID()` in the checkout hook. Stored in memory during the flow; regenerated on each fresh click.

3. **Minor unit conversion at display layer** — All `unitAmount` values are in cents. Divide by 100 only in presentation components. Store and transmit as integers.

4. **Polling on success page** — Simple `setInterval` with max attempts. No WebSocket or SSE needed for MVP.

5. **Stripe Portal for subscription management** — No custom cancel/upgrade endpoints. Admin panel handles plan CRUD only.

6. **Profile routes under `/profile/`** — Protected by `proxy.ts` which checks for auth cookie and redirects to `/signin` if missing.

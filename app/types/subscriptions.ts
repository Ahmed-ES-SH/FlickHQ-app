/* =========================================================
   Plans & Subscriptions — Type Definitions
   Based on backend plans-subscriptions + billing DTOs
   All monetary values in minor units (cents)
========================================================= */

// ────────────────────────────
// Enums
// ────────────────────────────

export enum BillingPlanStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  ARCHIVED = "archived",
}

export enum BillingPriceType {
  RECURRING = "recurring",
  ONE_TIME = "one_time",
}

export enum BillingRecurringInterval {
  DAY = "day",
  WEEK = "week",
  MONTH = "month",
  YEAR = "year",
}

export enum BillingSubscriptionStatus {
  INCOMPLETE = "incomplete",
  TRIALING = "trialing",
  ACTIVE = "active",
  PAST_DUE = "past_due",
  CANCELED = "canceled",
  UNPAID = "unpaid",
  PAUSED = "paused",
  INCOMPLETE_EXPIRED = "incomplete_expired",
}

export enum BillingPaymentStatus {
  CHECKOUT_CREATED = "checkout_created",
  PENDING = "pending",
  SUCCEEDED = "succeeded",
  FAILED = "failed",
  CANCELED = "canceled",
  REFUNDED = "refunded",
  PARTIALLY_REFUNDED = "partially_refunded",
}

export enum TransactionType {
  CHARGE = "charge",
  REFUND = "refund",
}

// ────────────────────────────
// DTOs — Plan & Price
// ────────────────────────────

export interface PriceResponseDto {
  id: string;
  planId: string;
  stripePriceId: string;
  stripeProductId: string | null;
  currency: string;
  /** Amount in cents (minor units). Divide by 100 for display. */
  unitAmount: number;
  type: BillingPriceType;
  interval: BillingRecurringInterval | null;
  trialPeriodDays: number | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PlanResponseDto {
  id: string;
  code: string;
  name: string;
  description: string | null;
  features: string[];
  displayOrder: number;
  icon: string | null;
  highlight: boolean;
  status: BillingPlanStatus;
  prices: PriceResponseDto[];
  createdAt: string;
  updatedAt: string;
}

// ────────────────────────────
// DTOs — Subscriptions
// ────────────────────────────

export interface UserSubscriptionHistoryItemDto {
  id: string;
  status: BillingSubscriptionStatus;
  planName: string | null;
  priceCurrency: string | null;
  /** Amount in cents (minor units). Divide by 100 for display. */
  priceUnitAmount: number | null;
  /** Day / week / month / year. */
  priceInterval: string | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  trialEnd: string | null;
  cancelAtPeriodEnd: boolean;
  canceledAt: string | null;
  createdAt: string;
}

export interface SubscriptionHistoryResponseDto {
  id: string;
  subscriptionId: string | null;
  previousStatus: string | null;
  newStatus: string;
  planId: string | null;
  priceId: string | null;
  reason: string | null;
  occurredAt: string;
  createdAt: string;
}

// ────────────────────────────
// DTOs — Payments
// ────────────────────────────

export interface UserPaymentHistoryItemDto {
  id: string;
  /** Amount in cents (minor units). */
  amount: number;
  /** Amount refunded in cents (minor units). */
  amountRefunded: number;
  currency: string;
  status: BillingPaymentStatus;
  transactionType: TransactionType;
  invoiceNumber: string | null;
  description: string | null;
  subscriptionId: string | null;
  createdAt: string;
}

// ────────────────────────────
// DTOs — Billing / Checkout
// ────────────────────────────

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

/** Response from the backend when `uiMode: 'embedded_page'` is used. */
export interface EmbeddedCheckoutSessionResponse {
  sessionId: string;
  clientSecret: string;
}

export interface PortalSessionResponse {
  url: string;
}

export interface CheckoutOptions {
  /** Override success redirect URL (default set server-side). */
  successUrl?: string;
  /** Override cancel redirect URL (default set server-side). */
  cancelUrl?: string;
  /** Optional metadata to attach to the checkout session. */
  metadata?: Record<string, string>;
}

export interface BillingCustomerResponse {
  id: string;
  email: string;
  name: string | null;
  stripeCustomerId: string | null;
}

// ────────────────────────────
// Action Results
// ────────────────────────────

// ────────────────────────────
// Admin — DTOs for create/update
// ────────────────────────────

// ────────────────────────────
// DTOs — Current-User Endpoint (user + subscription from /api/auth/current-user)
// ────────────────────────────

/** The plan object nested inside the subscription from the current-user endpoint.
 *  Flatter than PlanResponseDto — no prices array. */
export interface CurrentUserPlanDto {
  id: string;
  code: string;
  name: string;
  description: string | null;
  features: string[];
  icon: string | null;
  highlight: boolean;
}

/** The subscription object returned by the current-user endpoint.
 *  status can be "free", "active", "trialing", "canceled", etc.
 *  Billing fields (periodStart, periodEnd, etc.) are absent for free-tier users. */
export interface CurrentUserSubscriptionDto {
  plan: CurrentUserPlanDto;
  status: string;
  periodStart?: string | null;
  periodEnd?: string | null;
  trialEnd?: string | null;
  cancelAtPeriodEnd?: boolean;
  canceledAt?: string | null;
}

/** The full response from /api/auth/current-user after globalRequest unwraps { data }.
 *  Subscription is always present (free users get a "free" status plan). */
export interface CurrentUserResponseDto {
  user: import("./auth").User;
  subscription: CurrentUserSubscriptionDto | null;
}

// ────────────────────────────

export interface CreatePlanDto {
  code: string;
  name: string;
  description?: string | null;
  features?: string[];
  displayOrder?: number;
  icon?: string | null;
  highlight?: boolean;
  metadata?: Record<string, unknown>;
}

export interface UpdatePlanDto {
  name?: string;
  description?: string | null;
  features?: string[];
  displayOrder?: number;
  icon?: string | null;
  highlight?: boolean;
  metadata?: Record<string, unknown>;
}

export interface CreatePriceDto {
  stripePriceId: string;
  currency: string;
  unitAmount: number;
  type: BillingPriceType;
  interval?: BillingRecurringInterval | null;
  trialPeriodDays?: number | null;
  active?: boolean;
}

export interface PlansActionResult<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

export interface PaginatedPlansActionResult<T = unknown> extends PlansActionResult<T> {
  meta?: {
    page: number;
    limit: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
}

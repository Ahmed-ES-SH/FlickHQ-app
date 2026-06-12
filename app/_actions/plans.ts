"use server";

import { globalRequest } from "@/app/_helpers/globalRequest";
import { API_ENDPOINTS } from "@/app/constants/apis";
import type {
  PlanResponseDto,
  UserSubscriptionHistoryItemDto,
  SubscriptionHistoryResponseDto,
  UserPaymentHistoryItemDto,
  CheckoutSessionResponse,
  EmbeddedCheckoutSessionResponse,
  PortalSessionResponse,
  BillingCustomerResponse,
  CheckoutOptions,
  PlansActionResult,
  PaginatedPlansActionResult,
  CreatePlanDto,
  UpdatePlanDto,
  CreatePriceDto,
  PriceResponseDto,
  CreateSubscriptionResponse,
} from "@/app/types/subscriptions";

// ────────────────────────────
// Helpers
// ────────────────────────────

function buildEndpoint(
  path: string,
  query?: Record<string, string | number | undefined>,
): string {
  if (!query) return path;
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && `${value}` !== "") {
      params.append(key, String(value));
    }
  });
  const qs = params.toString();
  return qs ? `${path}?${qs}` : path;
}

function normalizeErrorMessage(message: unknown, defaultError: string): string {
  if (Array.isArray(message)) return message.join(", ");
  if (typeof message === "string") return message;
  return defaultError;
}

// ────────────────────────────
// Plans (Public)
// ────────────────────────────

/**
 * Fetch all active plans with their prices.
 * Public endpoint — no authentication required.
 */
export async function fetchPlansAction(): Promise<
  PaginatedPlansActionResult<PlanResponseDto[]>
> {
  const res = await globalRequest({
    endpoint: API_ENDPOINTS.PLANS.list,
    method: "GET",
    authenticated: false,
    defaultErrorMessage: "Failed to fetch plans",
  });

  if (!res.success) {
    return {
      success: false,
      message: normalizeErrorMessage(res.message, "Failed to fetch plans"),
      statusCode: res.statusCode,
      errors: res.errors,
    };
  }

  const _payload = res.data as any;
  const _items = Array.isArray(_payload)
    ? _payload
    : Array.isArray(_payload?.data)
      ? _payload.data
      : [];
  const _meta = _payload?.meta ?? res.meta;

  return {
    success: true,
    message: res.message,
    data: _items as PlanResponseDto[],
    statusCode: res.statusCode,
    meta: _meta,
  };
}

// ────────────────────────────
// Subscriptions (Authenticated)
// ────────────────────────────

/**
 * Fetch the current user's active subscription (or null if none).
 */
export async function fetchCurrentSubscriptionAction(): Promise<
  PlansActionResult<UserSubscriptionHistoryItemDto | null>
> {
  const res = await globalRequest({
    endpoint: API_ENDPOINTS.SUBSCRIPTIONS.current,
    method: "GET",
    defaultErrorMessage: "Failed to fetch current subscription",
  });

  if (!res.success) {
    // 404 means no subscription exists — not an error
    if (res.statusCode === 404) {
      return {
        success: true,
        message: "No active subscription",
        data: null,
        statusCode: 200,
      };
    }
    return {
      success: false,
      message: normalizeErrorMessage(
        res.message,
        "Failed to fetch current subscription",
      ),
      statusCode: res.statusCode,
      errors: res.errors,
    };
  }

  return {
    success: true,
    message: res.message,
    data: (res.data ?? null) as UserSubscriptionHistoryItemDto | null,
    statusCode: res.statusCode,
  };
}

/**
 * Fetch paginated subscription history for the current user.
 */
export async function fetchSubscriptionHistoryAction(
  page: number = 1,
  limit: number = 20,
): Promise<PaginatedPlansActionResult<UserSubscriptionHistoryItemDto[]>> {
  const endpoint = buildEndpoint(API_ENDPOINTS.SUBSCRIPTIONS.history, {
    page,
    limit,
  });

  const res = await globalRequest({
    endpoint,
    method: "GET",
    defaultErrorMessage: "Failed to fetch subscription history",
  });

  if (!res.success) {
    return {
      success: false,
      message: normalizeErrorMessage(
        res.message,
        "Failed to fetch subscription history",
      ),
      statusCode: res.statusCode,
      errors: res.errors,
    };
  }

  {
    const _payload = res.data as any;
    const _items = Array.isArray(_payload)
      ? _payload
      : Array.isArray(_payload?.data)
        ? _payload.data
        : [];
    const _meta = _payload?.meta ?? res.meta;

    return {
      success: true,
      message: res.message,
      data: _items as UserSubscriptionHistoryItemDto[],
      statusCode: res.statusCode,
      meta: _meta,
    };
  }
}

/**
 * Fetch the timeline (status changes) for a specific subscription.
 */
export async function fetchSubscriptionTimelineAction(
  subscriptionId: string,
): Promise<PlansActionResult<SubscriptionHistoryResponseDto[]>> {
  const res = await globalRequest({
    endpoint: API_ENDPOINTS.SUBSCRIPTIONS.historyDetail(subscriptionId),
    method: "GET",
    defaultErrorMessage: "Failed to fetch subscription timeline",
  });

  if (!res.success) {
    return {
      success: false,
      message: normalizeErrorMessage(
        res.message,
        "Failed to fetch subscription timeline",
      ),
      statusCode: res.statusCode,
      errors: res.errors,
    };
  }

  {
    const _payload = res.data as any;
    const _items = Array.isArray(_payload)
      ? _payload
      : Array.isArray(_payload?.data)
        ? _payload.data
        : [];

    return {
      success: true,
      message: res.message,
      data: _items as SubscriptionHistoryResponseDto[],
      statusCode: res.statusCode,
    };
  }
}

// ────────────────────────────
// Payments (Authenticated)
// ────────────────────────────

/**
 * Fetch paginated payment history for the current user.
 */
export async function fetchPaymentHistoryAction(
  page: number = 1,
  limit: number = 20,
): Promise<PaginatedPlansActionResult<UserPaymentHistoryItemDto[]>> {
  const endpoint = buildEndpoint(API_ENDPOINTS.PAYMENTS.history, {
    page,
    limit,
  });

  const res = await globalRequest({
    endpoint,
    method: "GET",
    defaultErrorMessage: "Failed to fetch payment history",
  });

  if (!res.success) {
    return {
      success: false,
      message: normalizeErrorMessage(
        res.message,
        "Failed to fetch payment history",
      ),
      statusCode: res.statusCode,
      errors: res.errors,
    };
  }

  {
    const _payload = res.data as any;
    const _items = Array.isArray(_payload)
      ? _payload
      : Array.isArray(_payload?.data)
        ? _payload.data
        : [];
    const _meta = _payload?.meta ?? res.meta;

    return {
      success: true,
      message: res.message,
      data: _items as UserPaymentHistoryItemDto[],
      statusCode: res.statusCode,
      meta: _meta,
    };
  }
}

/**
 * Fetch a single payment record by ID.
 */
export async function fetchPaymentDetailAction(
  id: string,
): Promise<PlansActionResult<UserPaymentHistoryItemDto>> {
  const res = await globalRequest({
    endpoint: API_ENDPOINTS.PAYMENTS.detail(id),
    method: "GET",
    defaultErrorMessage: "Failed to fetch payment detail",
  });

  if (!res.success) {
    return {
      success: false,
      message: normalizeErrorMessage(
        res.message,
        "Failed to fetch payment detail",
      ),
      statusCode: res.statusCode,
      errors: res.errors,
    };
  }

  return {
    success: true,
    message: res.message,
    data: res.data as UserPaymentHistoryItemDto,
    statusCode: res.statusCode,
  };
}

// ────────────────────────────
// Billing / Checkout (Authenticated)
// ────────────────────────────

/** Shared body type for checkout endpoints. */
type CheckoutBody = {
  priceId: string;
  successUrl?: string;
  cancelUrl?: string;
  metadata?: Record<string, string>;
  uiMode: "hosted_page" | "embedded_page";
};

/** Merge `CheckoutOptions` with optional idempotency key. */
export type CheckoutActionOptions = CheckoutOptions & {
  /** Client-generated UUID used as Idempotency-Key header. */
  idempotencyKey?: string;
};

/** Build headers for checkout requests including optional Idempotency-Key. */
function buildCheckoutHeaders(
  idempotencyKey?: string,
): HeadersInit | undefined {
  if (!idempotencyKey) return undefined;
  return { "Idempotency-Key": idempotencyKey };
}

/**
 * Create a Stripe Checkout Session for a recurring subscription.
 * Returns the session ID and redirect URL.
 */
export async function createSubscriptionCheckoutAction(
  priceId: string,
  options?: CheckoutActionOptions,
): Promise<PlansActionResult<CheckoutSessionResponse>> {
  const { idempotencyKey, ...rest } = options ?? {};
  const res = await globalRequest<CheckoutBody, CheckoutSessionResponse>({
    endpoint: API_ENDPOINTS.BILLING.checkoutSubscription,
    method: "POST",
    body: { priceId, uiMode: "hosted_page", ...rest },
    headers: buildCheckoutHeaders(idempotencyKey),
    defaultErrorMessage: "Failed to create checkout session",
  });

  if (!res.success || !res.data) {
    return {
      success: false,
      message: normalizeErrorMessage(
        res.message,
        "Failed to create checkout session",
      ),
      statusCode: res.statusCode,
      errors: res.errors,
    };
  }

  return {
    success: true,
    message: res.message,
    data: res.data as CheckoutSessionResponse,
    statusCode: res.statusCode,
  };
}

/**
 * Create a Stripe Checkout Session for a one-time purchase.
 */
export async function createEmbeddedCheckoutSessionAction(
  priceId: string,
  options?: {
    idempotencyKey?: string;
  },
): Promise<PlansActionResult<EmbeddedCheckoutSessionResponse>> {
  const { idempotencyKey } = options ?? {};
  const res = await globalRequest({
    endpoint: API_ENDPOINTS.BILLING.checkoutSubscription,
    method: "POST",
    body: { priceId, uiMode: "embedded_page" },
    headers: buildCheckoutHeaders(idempotencyKey),
    defaultErrorMessage: "Failed to create checkout session",
  });

  if (!res.success || !res.data) {
    return {
      success: false,
      message: normalizeErrorMessage(
        res.message,
        "Failed to create checkout session",
      ),
      statusCode: res.statusCode,
      errors: res.errors,
    };
  }

  return {
    success: true,
    message: res.message,
    data: res.data as EmbeddedCheckoutSessionResponse,
    statusCode: res.statusCode,
  };
}

/**
 * Create a Stripe Checkout Session for a one-time purchase.
 */
export async function createOneTimeCheckoutAction(
  priceId: string,
  options?: CheckoutActionOptions,
): Promise<PlansActionResult<CheckoutSessionResponse>> {
  const { idempotencyKey, ...rest } = options ?? {};
  const res = await globalRequest<CheckoutBody, CheckoutSessionResponse>({
    endpoint: API_ENDPOINTS.BILLING.checkoutOneTime,
    method: "POST",
    body: { priceId, uiMode: "hosted_page", ...rest },
    headers: buildCheckoutHeaders(idempotencyKey),
    defaultErrorMessage: "Failed to create checkout session",
  });

  if (!res.success || !res.data) {
    return {
      success: false,
      message: normalizeErrorMessage(
        res.message,
        "Failed to create checkout session",
      ),
      statusCode: res.statusCode,
      errors: res.errors,
    };
  }

  return {
    success: true,
    message: res.message,
    data: res.data as CheckoutSessionResponse,
    statusCode: res.statusCode,
  };
}

/** Options for createPortalSessionAction. */
type PortalSessionOptions = {
  idempotencyKey?: string;
};

/**
 * Create a Stripe Customer Portal session for subscription management.
 * Returns the portal redirect URL.
 */
export async function createPortalSessionAction(
  options?: PortalSessionOptions,
): Promise<PlansActionResult<PortalSessionResponse>> {
  const res = await globalRequest({
    endpoint: API_ENDPOINTS.BILLING.portalSession,
    method: "POST",
    headers: buildCheckoutHeaders(options?.idempotencyKey),
    defaultErrorMessage: "Failed to create portal session",
  });

  if (!res.success || !res.data) {
    return {
      success: false,
      message: normalizeErrorMessage(
        res.message,
        "Failed to create portal session",
      ),
      statusCode: res.statusCode,
      errors: res.errors,
    };
  }

  return {
    success: true,
    message: res.message,
    data: res.data as PortalSessionResponse,
    statusCode: res.statusCode,
  };
}

/**
 * Ensure the current user has a billing customer record.
 * Returns the customer details (creates one if it doesn't exist).
 */
// ────────────────────────────
// Admin — Plans (ADMIN role required)
// ────────────────────────────

/**
 * Fetch all plans (optionally filtered by status).
 * Requires ADMIN role.
 */
export async function fetchAdminPlansAction(
  status?: string,
): Promise<PaginatedPlansActionResult<PlanResponseDto[]>> {
  const endpoint = buildEndpoint(API_ENDPOINTS.ADMIN_PLANS.list, {
    ...(status ? { status } : {}),
  });

  const res = await globalRequest({
    endpoint,
    method: "GET",
    defaultErrorMessage: "Failed to fetch admin plans",
  });

  if (!res.success) {
    return {
      success: false,
      message: normalizeErrorMessage(
        res.message,
        "Failed to fetch admin plans",
      ),
      statusCode: res.statusCode,
      errors: res.errors,
    };
  }

  {
    const _payload = res.data as any;
    const _items = Array.isArray(_payload)
      ? _payload
      : Array.isArray(_payload?.data)
        ? _payload.data
        : [];

    return {
      success: true,
      message: res.message,
      data: _items as PlanResponseDto[],
      statusCode: res.statusCode,
    };
  }
}

/**
 * Fetch a single plan by ID with all prices.
 * Requires ADMIN role.
 */
export async function fetchAdminPlanDetailAction(
  id: string,
): Promise<PlansActionResult<PlanResponseDto>> {
  const res = await globalRequest({
    endpoint: API_ENDPOINTS.ADMIN_PLANS.detail(id),
    method: "GET",
    defaultErrorMessage: "Failed to fetch plan details",
  });

  if (!res.success || !res.data) {
    return {
      success: false,
      message: normalizeErrorMessage(
        res.message,
        "Failed to fetch plan details",
      ),
      statusCode: res.statusCode,
      errors: res.errors,
    };
  }

  return {
    success: true,
    message: res.message,
    data: res.data as PlanResponseDto,
    statusCode: res.statusCode,
  };
}

/**
 * Create a new plan.
 * Requires ADMIN role.
 */
export async function createAdminPlanAction(
  data: CreatePlanDto,
): Promise<PlansActionResult<PlanResponseDto>> {
  const res = await globalRequest<CreatePlanDto, { plan: PlanResponseDto }>({
    endpoint: API_ENDPOINTS.ADMIN_PLANS.create,
    method: "POST",
    body: data,
    defaultErrorMessage: "Failed to create plan",
  });

  if (!res.success || !res.data) {
    return {
      success: false,
      message: normalizeErrorMessage(res.message, "Failed to create plan"),
      statusCode: res.statusCode,
      errors: res.errors,
    };
  }

  return {
    success: true,
    message: res.message,
    data: (res.data as { plan: PlanResponseDto }).plan,
    statusCode: res.statusCode,
  };
}

/**
 * Update an existing plan.
 * Requires ADMIN role.
 */
export async function updateAdminPlanAction(
  id: string,
  data: UpdatePlanDto,
): Promise<PlansActionResult<PlanResponseDto>> {
  const res = await globalRequest<UpdatePlanDto, { plan: PlanResponseDto }>({
    endpoint: API_ENDPOINTS.ADMIN_PLANS.update(id),
    method: "PATCH",
    body: data,
    defaultErrorMessage: "Failed to update plan",
  });

  if (!res.success || !res.data) {
    return {
      success: false,
      message: normalizeErrorMessage(res.message, "Failed to update plan"),
      statusCode: res.statusCode,
      errors: res.errors,
    };
  }

  return {
    success: true,
    message: res.message,
    data: (res.data as { plan: PlanResponseDto }).plan,
    statusCode: res.statusCode,
  };
}

/**
 * Archive a plan (sets status to 'archived').
 * Requires ADMIN role.
 */
export async function archiveAdminPlanAction(
  id: string,
): Promise<PlansActionResult<PlanResponseDto>> {
  const res = await globalRequest({
    endpoint: API_ENDPOINTS.ADMIN_PLANS.archive(id),
    method: "POST",
    defaultErrorMessage: "Failed to archive plan",
  });

  if (!res.success || !res.data) {
    return {
      success: false,
      message: normalizeErrorMessage(res.message, "Failed to archive plan"),
      statusCode: res.statusCode,
      errors: res.errors,
    };
  }

  return {
    success: true,
    message: res.message,
    data: (res.data as { plan: PlanResponseDto }).plan,
    statusCode: res.statusCode,
  };
}

// ────────────────────────────
// Admin — Prices (ADMIN role required)
// ────────────────────────────

/**
 * Add a price to a plan.
 * Requires ADMIN role.
 */
export async function addAdminPriceAction(
  planId: string,
  data: CreatePriceDto,
): Promise<PlansActionResult<PriceResponseDto>> {
  const res = await globalRequest<CreatePriceDto, PriceResponseDto>({
    endpoint: API_ENDPOINTS.ADMIN_PLANS.addPrice(planId),
    method: "POST",
    body: data,
    defaultErrorMessage: "Failed to add price",
  });

  if (!res.success || !res.data) {
    return {
      success: false,
      message: normalizeErrorMessage(res.message, "Failed to add price"),
      statusCode: res.statusCode,
      errors: res.errors,
    };
  }

  return {
    success: true,
    message: res.message,
    data: res.data as PriceResponseDto,
    statusCode: res.statusCode,
  };
}

/**
 * Fetch all prices for a plan.
 * Requires ADMIN role.
 */
export async function fetchAdminPricesAction(
  planId: string,
): Promise<PlansActionResult<PriceResponseDto[]>> {
  const res = await globalRequest({
    endpoint: API_ENDPOINTS.ADMIN_PLANS.listPrices(planId),
    method: "GET",
    defaultErrorMessage: "Failed to fetch prices",
  });

  if (!res.success) {
    return {
      success: false,
      message: normalizeErrorMessage(res.message, "Failed to fetch prices"),
      statusCode: res.statusCode,
      errors: res.errors,
    };
  }

  {
    const _payload = res.data as any;
    const _items = Array.isArray(_payload)
      ? _payload
      : Array.isArray(_payload?.data)
        ? _payload.data
        : [];

    return {
      success: true,
      message: res.message,
      data: _items as PriceResponseDto[],
      statusCode: res.statusCode,
    };
  }
}

/**
 * Deactivate a price (sets active to false).
 * Requires ADMIN role.
 */
export async function deactivateAdminPriceAction(
  priceId: string,
): Promise<PlansActionResult<PriceResponseDto>> {
  const res = await globalRequest({
    endpoint: API_ENDPOINTS.ADMIN_PLANS.deactivatePrice(priceId),
    method: "PATCH",
    defaultErrorMessage: "Failed to deactivate price",
  });

  if (!res.success || !res.data) {
    return {
      success: false,
      message: normalizeErrorMessage(res.message, "Failed to deactivate price"),
      statusCode: res.statusCode,
      errors: res.errors,
    };
  }

  return {
    success: true,
    message: res.message,
    data: res.data as PriceResponseDto,
    statusCode: res.statusCode,
  };
}

/**
 * Create a subscription after a successful Elements payment.
 * Called on the success page after confirmPayment redirects back.
 * Sends the PaymentIntent ID and an Idempotency-Key.
 * 409 (Idempotency-Key reused) is treated as success.
 */
export async function createSubscriptionAction(
  paymentIntentId: string,
  idempotencyKey?: string,
): Promise<PlansActionResult<CreateSubscriptionResponse>> {
  const res = await globalRequest({
    endpoint: API_ENDPOINTS.SUBSCRIPTIONS.create,
    method: "POST",
    body: { paymentIntentId },
    headers: idempotencyKey
      ? { "Idempotency-Key": idempotencyKey }
      : undefined,
    defaultErrorMessage: "Failed to create subscription",
  });

  if (!res.success) {
    if (res.statusCode === 409) {
      return {
        success: true,
        message: "Subscription already exists",
        data: res.data as CreateSubscriptionResponse,
        statusCode: 200,
      };
    }
    return {
      success: false,
      message: normalizeErrorMessage(
        res.message,
        "Failed to create subscription",
      ),
      statusCode: res.statusCode,
      errors: res.errors,
    };
  }

  return {
    success: true,
    message: res.message,
    data: res.data as CreateSubscriptionResponse,
    statusCode: res.statusCode,
  };
}

export async function ensureBillingCustomerAction(): Promise<
  PlansActionResult<BillingCustomerResponse>
> {
  const res = await globalRequest({
    endpoint: API_ENDPOINTS.BILLING.customer,
    method: "GET",
    defaultErrorMessage: "Failed to fetch billing customer",
  });

  if (!res.success || !res.data) {
    return {
      success: false,
      message: normalizeErrorMessage(
        res.message,
        "Failed to fetch billing customer",
      ),
      statusCode: res.statusCode,
      errors: res.errors,
    };
  }

  return {
    success: true,
    message: res.message,
    data: res.data as BillingCustomerResponse,
    statusCode: res.statusCode,
  };
}

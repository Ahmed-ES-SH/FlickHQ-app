"use server";

import { globalRequest } from "@/app/_helpers/globalRequest";
import { API_ENDPOINTS } from "@/app/constants/apis";
import type { PlansActionResult } from "@/app/types/subscriptions";

// ─── Types ──────────────────────────────────────────

/**
 * Response from the new embedded-elements checkout endpoint.
 * The clientSecret here is a PaymentIntent client_secret (pi_*_secret_*),
 * used with <Elements> + <PaymentElement>.
 */
export interface ElementsCheckoutResponse {
  sessionId?: string;
  clientSecret: string;
  paymentIntentId?: string;
}

// ─── Server Action ──────────────────────────────────

/**
 * Creates a checkout session via the new embedded-elements endpoint
 * and returns the PaymentIntent clientSecret for Stripe Elements.
 *
 * Calls: POST /api/billing/checkout/embedded-elements
 *
 * NOTE: This is the NEW endpoint, NOT the existing
 * /api/billing/checkout/subscription. Do NOT send uiMode.
 */
export async function createElementsCheckoutSessionAction(
  priceId: string,
  options?: {
    idempotencyKey?: string;
    quantity?: number;
    trialDays?: number;
    allowPromotionCodes?: boolean;
  },
): Promise<PlansActionResult<ElementsCheckoutResponse>> {
  const headers: Record<string, string> = {};
  if (options?.idempotencyKey) {
    headers["Idempotency-Key"] = options.idempotencyKey;
  }

  const { idempotencyKey: _key, ...body } = options ?? {};

  console.log("[createElementsCheckoutSessionAction] Sending request:", {
    priceId,
    endpoint: API_ENDPOINTS.BILLING.checkoutElements,
  });

  const res = await globalRequest({
    endpoint: API_ENDPOINTS.BILLING.checkoutElements,
    method: "POST",
    body: { priceId, ...body },
    headers: Object.keys(headers).length > 0 ? headers : undefined,
    defaultErrorMessage: "Failed to create checkout session",
  });

  console.log("[createElementsCheckoutSessionAction] Raw response:", {
    success: res.success,
    statusCode: res.statusCode,
    message: res.message,
    data: res.data,
  });

  if (!res.success || !res.data) {
    console.log("[createElementsCheckoutSessionAction] Request failed");
    return {
      success: false,
      message: res.message || "Failed to create checkout session",
      statusCode: res.statusCode,
      errors: res.errors,
    };
  }

  const rawData = res.data as Record<string, unknown>;
  const clientSecret = (rawData.clientSecret ?? rawData.client_secret) as string | undefined;

  console.log("[createElementsCheckoutSessionAction] Extracted fields:", {
    sessionId: rawData.sessionId ?? rawData.session_id ?? rawData.id,
    clientSecret,
    rawKeys: Object.keys(rawData),
  });

  if (!clientSecret) {
    console.log("[createElementsCheckoutSessionAction] Missing clientSecret");
    return {
      success: false,
      message: "Checkout session response is missing client secret",
      statusCode: 500,
    };
  }

  return {
    success: true,
    message: res.message,
    data: {
      clientSecret,
      sessionId: (rawData.sessionId ?? rawData.session_id ?? rawData.id) as string | undefined,
      paymentIntentId: (rawData.paymentIntentId ?? rawData.payment_intent_id) as string | undefined,
    },
    statusCode: res.statusCode,
  };
}

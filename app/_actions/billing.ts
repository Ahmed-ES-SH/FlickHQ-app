"use server";

import { globalRequest } from "@/app/_helpers/globalRequest";
import { API_ENDPOINTS } from "@/app/constants/apis";

export interface BillingActionResult<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

/**
 * Create a Stripe Customer Portal session for managing billing settings.
 * Returns { url } which the client should redirect to.
 */
export async function createBillingPortalSessionAction(): Promise<
  BillingActionResult<{ url: string }>
> {
  const res = await globalRequest({
    endpoint: API_ENDPOINTS.BILLING.portalSession,
    method: "POST",
    defaultErrorMessage: "Failed to open billing portal",
  });

  if (!res.success || !res.data) {
    return {
      success: false,
      message: res.message || "Failed to open billing portal",
      statusCode: res.statusCode,
    };
  }

  return {
    success: true,
    message: res.message,
    data: res.data as { url: string },
    statusCode: res.statusCode,
  };
}

/**
 * Fetch the current subscription from the dedicated endpoint.
 * Used as a fallback/refresh when subscription data in the auth response is stale.
 */
export async function fetchCurrentSubscriptionAction(): Promise<
  BillingActionResult<unknown>
> {
  const res = await globalRequest({
    endpoint: API_ENDPOINTS.SUBSCRIPTIONS.current,
    method: "GET",
    defaultErrorMessage: "Failed to fetch subscription",
  });

  if (!res.success) {
    return {
      success: false,
      message: res.message || "Failed to fetch subscription",
      statusCode: res.statusCode,
    };
  }

  return {
    success: true,
    message: res.message,
    data: res.data,
    statusCode: res.statusCode,
  };
}

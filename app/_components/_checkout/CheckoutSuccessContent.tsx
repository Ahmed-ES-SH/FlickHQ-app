"use client";

import { useCheckoutSuccess } from "@/app/hooks/checkout/useCheckoutSuccess";
import { SuccessStates } from "@/app/_components/_checkout/SuccessStates";

// ─── Checkout Success Content ───────────────────────

/**
 * Client component that drives the checkout success flow.
 * Uses `useCheckoutSuccess` hook for polling and state management,
 * and renders the appropriate UI state via `SuccessStates`.
 */
export function CheckoutSuccessContent() {
  const { status, subscription, message } = useCheckoutSuccess();

  return (
    <SuccessStates
      status={status}
      subscription={subscription}
      message={message}
    />
  );
}

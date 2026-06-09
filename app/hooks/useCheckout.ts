"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/_stores/authStore";
import {
  createSubscriptionCheckoutAction,
  createOneTimeCheckoutAction,
  ensureBillingCustomerAction,
} from "@/app/_actions/plans";
import type { CheckoutOptions } from "@/app/types/subscriptions";

// ─── Types ──────────────────────────────────────────

export interface UseCheckoutReturn {
  /** Initiate a checkout flow for the given price. Redirects to Stripe on success. */
  handleSubscribe: (
    priceId: string,
    isRecurring: boolean,
    options?: CheckoutOptions,
  ) => Promise<void>;
  /** True while the checkout request is in-flight. */
  loading: boolean;
  /** Non-null when an error has occurred. */
  error: string | null;
  /** Clear the current error. */
  resetError: () => void;
}

// ─── Hook ───────────────────────────────────────────

/**
 * Client-side hook that manages the full Stripe Checkout flow:
 *  1. Verifies the user is authenticated (redirects to sign-in if not)
 *  2. Ensures a billing customer record exists server-side
 *  3. Creates a Stripe Checkout session via server action
 *  4. Stores the sessionId in sessionStorage and redirects to Stripe
 */
export function useCheckout(): UseCheckoutReturn {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetError = useCallback(() => setError(null), []);

  const handleSubscribe = useCallback(
    async (priceId: string, isRecurring: boolean, options?: CheckoutOptions) => {
      // ── 1. Auth gate ───────────────────────────
      if (!isAuthenticated) {
        const next = options?.cancelUrl ?? "/pricing";
        router.push(`/signin?next=${encodeURIComponent(next)}`);
        return;
      }

      setLoading(true);
      setError(null);

      // Generate a unique idempotency key for this request
      const idempotencyKey = crypto.randomUUID();

      try {
        // ── 2. Ensure billing customer exists ────
        const customerResult = await ensureBillingCustomerAction();
        if (!customerResult.success) {
          setError(
            customerResult.message || "Failed to set up billing customer.",
          );
          setLoading(false);
          return;
        }

        // ── 3. Create checkout session ───────────
        const checkoutAction = isRecurring
          ? createSubscriptionCheckoutAction
          : createOneTimeCheckoutAction;

        const result = await checkoutAction(priceId, {
          ...options,
          idempotencyKey,
        });

        if (!result.success) {
          // Map known HTTP status codes to user-friendly messages
          if (result.statusCode === 409) {
            setError(
              "You already have an active subscription. Manage it from your profile.",
            );
          } else if (result.statusCode === 404) {
            setError(
              "This plan is no longer available. Please refresh and try again.",
            );
          } else {
            setError(result.message || "Failed to start checkout.");
          }
          setLoading(false);
          return;
        }

        // ── 4. Store session ID & redirect ───────
        if (result.data?.sessionId) {
          try {
            sessionStorage.setItem("checkout_session_id", result.data.sessionId);
          } catch {
            // sessionStorage may be unavailable in some environments
          }
        }

        if (result.data?.url) {
          window.location.href = result.data.url;
        } else {
          setError("No checkout URL returned. Please try again.");
          setLoading(false);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred.",
        );
        setLoading(false);
      }
    },
    [isAuthenticated, router],
  );

  return { handleSubscribe, loading, error, resetError };
}

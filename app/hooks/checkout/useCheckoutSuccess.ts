"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import {
  fetchCurrentSubscriptionAction,
  createSubscriptionAction,
} from "@/app/_actions/plans";
import type { UserSubscriptionHistoryItemDto } from "@/app/types/subscriptions";
import {
  MAX_POLL_ATTEMPTS,
  POLL_INTERVAL_MS,
  DEFAULT_POLL_MESSAGE,
} from "@/app/data/checkout/success";

// ─── Types ──────────────────────────────────────────

export type CheckoutSuccessStatus =
  | "creating"
  | "polling"
  | "confirmed"
  | "pending"
  | "error";

export interface UseCheckoutSuccessReturn {
  status: CheckoutSuccessStatus;
  subscription: UserSubscriptionHistoryItemDto | null;
  message: string;
}

// ─── Hook ───────────────────────────────────────────

/**
 * Manages the checkout success flow:
 *  1. Reads URL params to detect flow (Elements vs Hosted)
 *  2. Elements flow: creates subscription via API, then polls
 *  3. Hosted flow: polls immediately
 *  4. Returns the current status, subscription data, and display message
 */
export function useCheckoutSuccess(): UseCheckoutSuccessReturn {
  const searchParams = useSearchParams();
  const urlSessionId = searchParams.get("session_id");
  const urlPaymentIntent = searchParams.get("payment_intent");
  const redirectStatus = searchParams.get("redirect_status");

  const [status, setStatus] = useState<CheckoutSuccessStatus>("polling");
  const [subscription, setSubscription] =
    useState<UserSubscriptionHistoryItemDto | null>(null);
  const [message, setMessage] = useState(DEFAULT_POLL_MESSAGE);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const attemptRef = useRef(0);
  const createAttemptedRef = useRef(false);
  const mountedRef = useRef(true);

  // ── Detect flow and create subscription for Elements flow ──
  useEffect(() => {
    mountedRef.current = true;

    // If redirect_status=failed, show error immediately
    if (redirectStatus === "failed") {
      setStatus("error");
      setMessage("Payment was not successful. Please try again.");
      return;
    }

    // Hosted flow: has session_id — poll immediately
    if (urlSessionId) {
      setStatus("polling");
      return;
    }

    // Elements flow: has payment_intent but no session_id
    if (urlPaymentIntent && !urlSessionId && !createAttemptedRef.current) {
      createAttemptedRef.current = true;
      setStatus("creating");
      setMessage("Finalizing your subscription...");

      const runCreate = async () => {
        const idempotencyKey =
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

        const result = await createSubscriptionAction(urlPaymentIntent, idempotencyKey);

        if (!mountedRef.current) return;

        if (result.success) {
          setStatus("polling");
          setMessage(DEFAULT_POLL_MESSAGE);
        } else {
          setStatus("error");
          setMessage(
            result.message ||
              "Failed to create subscription. Please contact support.",
          );
        }
      };

      runCreate();
      return;
    }

    // No params at all — error
    if (!urlSessionId && !urlPaymentIntent) {
      setStatus("error");
      setMessage("Missing payment information. Please contact support.");
    }

    return () => {
      mountedRef.current = false;
    };
  }, [urlSessionId, urlPaymentIntent, redirectStatus]);

  // ── Poll for subscription confirmation ─────────────────
  const poll = useCallback(async () => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(async () => {
      attemptRef.current += 1;

      const result = await fetchCurrentSubscriptionAction();

      if (!mountedRef.current) return;

      if (result.success && result.data) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setSubscription(result.data);
        setStatus("confirmed");
        setMessage("Your subscription is now active!");
        return;
      }

      if (attemptRef.current >= MAX_POLL_ATTEMPTS) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setStatus("pending");
        setMessage(
          "We're still activating your subscription. This usually takes just a moment.",
        );
      }
    }, POLL_INTERVAL_MS);
  }, []);

  // Start polling when status becomes "polling"
  useEffect(() => {
    if (status === "polling") {
      poll();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [status, poll]);

  return { status, subscription, message };
}

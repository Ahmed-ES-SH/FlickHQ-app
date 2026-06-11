"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { fetchCurrentSubscriptionAction } from "@/app/_actions/plans";
import type { UserSubscriptionHistoryItemDto } from "@/app/types/subscriptions";
import {
  MAX_POLL_ATTEMPTS,
  POLL_INTERVAL_MS,
  DEFAULT_POLL_MESSAGE,
} from "@/app/data/checkout/success";

// ─── Types ──────────────────────────────────────────

export type CheckoutSuccessStatus =
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
 *  1. Recovers the session ID from URL params or sessionStorage fallback
 *  2. Polls for subscription confirmation via `fetchCurrentSubscriptionAction`
 *  3. Returns the current status, subscription data, and display message
 */
export function useCheckoutSuccess(): UseCheckoutSuccessReturn {
  const searchParams = useSearchParams();
  const urlSessionId = searchParams.get("session_id");

  const [sessionId, setSessionId] = useState<string | null>(urlSessionId);
  const [status, setStatus] = useState<CheckoutSuccessStatus>("polling");
  const [subscription, setSubscription] =
    useState<UserSubscriptionHistoryItemDto | null>(null);
  const [message, setMessage] = useState(DEFAULT_POLL_MESSAGE);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const attemptRef = useRef(0);

  // ── Recover sessionId from sessionStorage if not in URL ──
  useEffect(() => {
    if (!urlSessionId) {
      try {
        const stored = sessionStorage.getItem("checkout_session_id");
        console.log("[CheckoutSuccess] sessionStorage fallback:", stored);
        if (stored) {
          setSessionId(stored);
          sessionStorage.removeItem("checkout_session_id");
        }
      } catch {
        // sessionStorage unavailable
      }
    }
  }, [urlSessionId]);

  // Log what we have for debugging
  console.log(
    "[CheckoutSuccess] sessionId:",
    sessionId,
    "urlSessionId:",
    urlSessionId,
  );

  // ── Poll for subscription confirmation ─────────────────
  const poll = useCallback(async () => {
    intervalRef.current = setInterval(async () => {
      attemptRef.current += 1;

      const result = await fetchCurrentSubscriptionAction();

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
        if (sessionId) {
          setStatus("pending");
          setMessage(
            "We're still activating your subscription. This usually takes just a moment.",
          );
        } else {
          setStatus("error");
          setMessage(
            "Missing session identifier. Please contact support if you were charged.",
          );
        }
      }
    }, POLL_INTERVAL_MS);
  }, [sessionId]);

  useEffect(() => {
    poll();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [poll]);

  return { status, subscription, message };
}

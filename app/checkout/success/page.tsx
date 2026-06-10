/* eslint-disable react/no-unescaped-entities */
"use client";

import { Suspense, useEffect, useRef, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { VscLoading } from "react-icons/vsc";
import { fetchCurrentSubscriptionAction } from "@/app/_actions/plans";
import type { UserSubscriptionHistoryItemDto } from "@/app/types/subscriptions";
import { SuccessStates } from "@/app/_components/_checkout/SuccessStates";

// ─── Constants ──────────────────────────────────────

const MAX_POLL_ATTEMPTS = 15;
const POLL_INTERVAL_MS = 2000;

// ─── Success Content ────────────────────────────────

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const urlSessionId = searchParams.get("session_id");

  const [sessionId, setSessionId] = useState<string | null>(urlSessionId);
  const [status, setStatus] = useState<
    "polling" | "confirmed" | "pending" | "error"
  >("polling");
  const [subscription, setSubscription] =
    useState<UserSubscriptionHistoryItemDto | null>(null);
  const [message, setMessage] = useState(
    "Confirming your subscription...",
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const attemptRef = useRef(0);

  // Recover sessionId from sessionStorage if not in URL
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
  console.log("[CheckoutSuccess] sessionId:", sessionId, "urlSessionId:", urlSessionId);

  // Poll for subscription confirmation (always runs regardless of sessionId)
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

  // ── Render ─────────────────────────────────────
  return (
    <SuccessStates
      status={status}
      subscription={subscription}
      message={message}
    />
  );
}

// ─── Page Export ────────────────────────────────────

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="relative w-full min-h-screen flex items-center justify-center bg-main_bg font-sans selection:bg-accent selection:text-white">
          <div className="text-center space-y-4">
            <VscLoading className="text-accent text-4xl animate-spin mx-auto" />
            <p className="text-second_text text-sm">Loading...</p>
          </div>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}

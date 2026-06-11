////////////////////////////////////////////////////////////////////////////////
///////// CheckoutContent — main checkout orchestration and layout /////////////
////////////////////////////////////////////////////////////////////////////////

"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Elements } from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import { LuArrowLeft } from "react-icons/lu";

import {
  fetchPlansAction,
  ensureBillingCustomerAction,
} from "@/app/_actions/plans";
import { createElementsCheckoutSessionAction } from "@/app/_actions/checkout";
import type { PlanResponseDto, PriceResponseDto } from "@/app/types/subscriptions";
import { stripePromise } from "@/app/_helpers/checkout/stripe";
import { findPlanAndPrice } from "@/app/_helpers/checkout/checkout";
import {
  CheckoutFormSkeleton,
} from "@/app/_components/_checkout/Skeleton";
import { CustomCheckoutForm } from "@/app/_components/_checkout/CustomCheckoutForm";
import { flickhqStripeAppearance } from "@/app/_components/_checkout/stripeAppearance";
import { TestCardNotice } from "@/app/_components/_checkout/TestCardNotice";
import { ErrorState } from "@/app/_components/_checkout/ErrorState";
import { OrderSummary } from "@/app/_components/_checkout/OrderSummary";

export default function CheckoutContent() {
  const searchParams = useSearchParams();

  const priceId = searchParams.get("priceId");

  // ── State ──────────────────────────────────────
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading",
  );
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<{
    plan: PlanResponseDto;
    price: PriceResponseDto;
  } | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const idempotencyKeyRef = useRef<string | null>(null);

  // Generate a stable idempotency key for the session
  if (!idempotencyKeyRef.current) {
    try {
      idempotencyKeyRef.current = crypto.randomUUID();
    } catch {
      idempotencyKeyRef.current = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }
  }

  // ── Load checkout data ─────────────────────────
  const loadCheckoutData = useCallback(async (pid: string) => {
    setStatus("loading");
    setError(null);

    try {
      // Fetch plans + ensure customer in parallel
      const [plansResult, customerResult] = await Promise.all([
        fetchPlansAction(),
        ensureBillingCustomerAction(),
      ]);

      if (!plansResult.success) {
        setError(plansResult.message || "Failed to load plan details.");
        setStatus("error");
        return;
      }

      if (!customerResult.success) {
        setError(customerResult.message || "Failed to set up billing.");
        setStatus("error");
        return;
      }

      // Find the matching plan and price
      const match = findPlanAndPrice(plansResult.data || [], pid);
      if (!match) {
        setError(
          "The selected plan is no longer available. Please go back and choose another.",
        );
        setStatus("error");
        return;
      }
      setPlan(match);

      // Create Elements checkout session via backend endpoint
      const sessionResult = await createElementsCheckoutSessionAction(pid, {
        idempotencyKey: idempotencyKeyRef.current!,
      });

      if (!sessionResult.success) {
        if (sessionResult.statusCode === 409) {
          setError(
            "You already have an active subscription. Manage it from your profile.",
          );
        } else if (sessionResult.statusCode === 404) {
          setError(
            "This plan is no longer available. Please refresh and try again.",
          );
        } else {
          setError(sessionResult.message || "Failed to start checkout.");
        }
        setStatus("error");
        return;
      }

      setClientSecret(sessionResult.data!.clientSecret);
      setSessionId(sessionResult.data!.sessionId ?? null);
      setStatus("ready");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred.",
      );
      setStatus("error");
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (!priceId) {
      setError("No plan selected. Please choose a plan first.");
      setStatus("error");
      return;
    }

    loadCheckoutData(priceId);
  }, [priceId, loadCheckoutData]);

  // ── Render ─────────────────────────────────────
  return (
    <div className="min-h-screen bg-main_bg pt-[72px]">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-200px)]">
        {/* ── Left: Payment Panel ─────────────────── */}
        <div className="bg-panel_bg border-r border-white/5 flex flex-col px-6 lg:px-10 py-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.1,
            }}
            className="flex flex-col flex-1"
          >
            {/* Back link */}
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1.5 text-sm text-light_text hover:text-white transition-colors duration-200 mb-6 w-fit"
            >
              <LuArrowLeft className="size-4" />
              <span>Back to plans</span>
            </Link>

            {/* Section header with crimson indicator */}
            <div className="flex items-center gap-2 mb-5">
              <span
                className="w-1 h-5 bg-accent rounded-full"
                aria-hidden="true"
              />
              <h2 className="text-lg font-bold text-white">Complete Payment</h2>
            </div>

            {status === "loading" && <CheckoutFormSkeleton />}

            {status === "error" && (
              <ErrorState
                error={error || "Something went wrong."}
                onRetry={() => priceId && loadCheckoutData(priceId)}
              />
            )}

            {status === "ready" && clientSecret && (
              <div className="flex-1 min-h-[400px]">
                {stripePromise ? (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: flickhqStripeAppearance,
                    }}
                  >
                    <CustomCheckoutForm sessionId={sessionId} />
                  </Elements>
                ) : (
                  <ErrorState
                    error="Stripe is not configured. Please contact support."
                    onRetry={() => {}}
                  />
                )}
              </div>
            )}
          </motion.div>
        </div>

        {/* ── Right: Order Summary Panel ──────────── */}
        <div className="bg-main_bg lg:sticky lg:top-[72px] lg:h-[calc(100vh-72px)] overflow-y-auto px-6 lg:px-10 py-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              ease: [0.16, 1, 0.3, 1],
              delay: 0.2,
            }}
          >
            <OrderSummary plan={plan} loading={status === "loading"} />
          </motion.div>
        </div>
      </div>

      {/* Test Card Notice (only visible in dev/test mode) */}
      <TestCardNotice />
    </div>
  );
}

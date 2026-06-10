"use client";

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import { VscLoading } from "react-icons/vsc";
import { IoCheckmarkCircle } from "react-icons/io5";
import { LuArrowLeft, LuTriangleAlert } from "react-icons/lu";

import {
  fetchPlansAction,
  ensureBillingCustomerAction,
  createEmbeddedCheckoutSessionAction,
} from "@/app/_actions/plans";
import type {
  PlanResponseDto,
  PriceResponseDto,
} from "@/app/types/subscriptions";
import { BillingRecurringInterval } from "@/app/types/subscriptions";
import { CinematicIcon } from "@/app/_components/_checkout/CinematicIcon";
import {
  CheckoutFormSkeleton,
  SummarySkeleton,
} from "@/app/_components/_checkout/Skeleton";

// ─── Stripe Promise (cached at module level) ─────────

const stripeKey =
  (typeof process !== "undefined" &&
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) ||
  "";

const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

// ─── Helpers ─────────────────────────────────────────

function findPlanAndPrice(
  plans: PlanResponseDto[],
  priceId: string,
): { plan: PlanResponseDto; price: PriceResponseDto } | null {
  for (const plan of plans) {
    const price = plan.prices.find((p) => p.id === priceId && p.active);
    if (price) return { plan, price };
  }
  return null;
}

function formatPrice(unitAmount: number): string {
  return `$${(unitAmount / 100).toFixed(2)}`;
}

function formatInterval(interval: BillingRecurringInterval): string {
  switch (interval) {
    case BillingRecurringInterval.DAY:
      return "day";
    case BillingRecurringInterval.WEEK:
      return "week";
    case BillingRecurringInterval.MONTH:
      return "month";
    case BillingRecurringInterval.YEAR:
      return "year";
    default:
      return interval;
  }
}

// ─── Error State ─────────────────────────────────────

function ErrorState({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  const isConflict = error.toLowerCase().includes("active subscription");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center text-center py-8 px-4"
    >
      <CinematicIcon variant="error">
        <LuTriangleAlert className="text-red-400 text-2xl" />
      </CinematicIcon>

      <h3 className="text-white text-lg font-semibold mt-5 mb-2">
        {isConflict ? "Already Subscribed" : "Checkout Unavailable"}
      </h3>
      <p className="text-second_text text-sm font-light max-w-sm mb-6">
        {error}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
        {isConflict ? (
          <Link
            href="/userpanal/subscription"
            className="flex-1 bg-accent text-white px-7 py-3.5 rounded text-sm font-medium hover:bg-[#b80710] transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-main_bg text-center"
          >
            Manage Subscription
          </Link>
        ) : (
          <button
            onClick={onRetry}
            className="flex-1 bg-accent text-white px-7 py-3.5 rounded text-sm font-medium hover:bg-[#b80710] transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-main_bg"
          >
            Try Again
          </button>
        )}
        <Link
          href="/pricing"
          className="flex-1 bg-[#1a1a1a] text-white px-7 py-3.5 rounded text-sm font-medium border border-white/5 hover:bg-[#222] hover:border-white/10 transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-main_bg text-center"
        >
          Back to Plans
        </Link>
      </div>
    </motion.div>
  );
}

// ─── Order Summary ───────────────────────────────────

function OrderSummary({
  plan,
  loading,
}: {
  plan: { plan: PlanResponseDto; price: PriceResponseDto } | null;
  loading: boolean;
}) {
  if (loading || !plan) return <SummarySkeleton />;

  const { plan: planData, price } = plan;
  const isRecurring = price.interval != null;

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <span className="w-1 h-5 bg-accent rounded-full" aria-hidden="true" />
        <h2 className="text-lg font-bold text-white">Order Summary</h2>
      </div>

      {/* Plan line */}
      <div className="flex justify-between items-center pb-4 border-b border-white/10">
        <div className="flex flex-col">
          <span className="text-white font-semibold">{planData.name}</span>
          <span className="text-sm text-second_text font-light">
            {isRecurring
              ? `${formatInterval(price.interval!)} subscription`
              : "One-time purchase"}
          </span>
        </div>
        <span className="text-lg font-semibold text-white">
          {formatPrice(price.unitAmount)}
        </span>
      </div>

      {/* Price breakdown */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-second_text font-light">Subtotal</span>
          <span className="text-white">{formatPrice(price.unitAmount)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-second_text font-light">Processing Fee</span>
          <span className="text-white">$0.00</span>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center pt-4 border-t border-white/20">
          <span className="text-xl font-bold text-white">Total</span>
          <span className="text-xl font-bold text-white">
            {formatPrice(price.unitAmount)}
            {isRecurring && `/${formatInterval(price.interval!).charAt(0)}`}
          </span>
        </div>
      </div>

      {/* Features */}
      {planData.features.length > 0 && (
        <div className="bg-[#0b0b0b] p-4 rounded-lg border border-white/5">
          <h3 className="text-sm font-medium text-accent mb-3 uppercase tracking-widest">
            What&apos;s Included
          </h3>
          <ul className="space-y-2.5">
            {planData.features.slice(0, 6).map((feature) => (
              <li className="flex items-start gap-2 text-sm" key={feature}>
                <IoCheckmarkCircle className="size-[18px] text-accent shrink-0 mt-0.5" />
                <span className="text-gray-300 font-light">{feature}</span>
              </li>
            ))}
            {planData.features.length > 6 && (
              <li className="text-xs text-light_text pt-1 font-light">
                +{planData.features.length - 6} more features
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Trial notice */}
      {price.trialPeriodDays && price.trialPeriodDays > 0 && (
        <div className="bg-[#0b0b0b] rounded-lg p-3 border border-white/10">
          <p className="text-sm text-second_text font-light">
            <span className="text-green-400 font-medium">Free trial:</span>{" "}
            You&apos;ll be charged after {price.trialPeriodDays} day
            {price.trialPeriodDays !== 1 ? "s" : ""}. Cancel anytime before then
            at no cost.
          </p>
        </div>
      )}

      {/* Security note */}
      <p className="text-xs text-light_text text-center font-light">
        Secured by Stripe. Your payment details are encrypted and never stored
        on our servers.
      </p>
    </div>
  );
}

// ─── Inner Checkout Content (needs Suspense for useSearchParams) ───────────

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

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

      // Create embedded checkout session
      // The backend sets the return_url server-side
      const sessionResult = await createEmbeddedCheckoutSessionAction(pid, {
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
      setSessionId(sessionResult.data!.sessionId);
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

  // ── Handle Stripe checkout complete ────────────
  const handleComplete = useCallback(() => {
    if (sessionId) {
      try {
        sessionStorage.setItem("checkout_session_id", sessionId);
      } catch {
        // sessionStorage may be unavailable
      }
      router.push(`/checkout/success?session_id=${sessionId}`);
    }
  }, [sessionId, router]);

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
                  <EmbeddedCheckoutProvider
                    stripe={stripePromise}
                    options={{ clientSecret, onComplete: handleComplete }}
                  >
                    <EmbeddedCheckout />
                  </EmbeddedCheckoutProvider>
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
    </div>
  );
}

// ─── Page Export (wrapped in Suspense for useSearchParams) ─────────────────

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-main_bg pt-[72px] flex items-center justify-center">
          <div className="text-center space-y-4">
            <VscLoading className="text-accent text-4xl animate-spin mx-auto" />
            <p className="text-second_text text-sm">Loading checkout...</p>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}

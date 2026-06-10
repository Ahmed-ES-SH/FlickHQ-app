/**
 * SubscriptionSuggestions — compact plan comparison cards for the user panel.
 *
 * Design differences from PlansSection:
 * - Compact cards (smaller padding, tighter spacing)
 * - Feature chips/tags instead of a full list
 * - Price prominently displayed with interval
 * - "Switch" action button (opens Stripe portal)
 * - "Recommended" inline tag instead of floating badge
 * - Current plan is excluded from the list
 * - Minimal, comparison-focused layout
 *
 * Follows the FlickHQ Design System:
 * - Shadow Velvet panels (#0b0b0b) with 8px rounded corners
 * - Thin white/5 borders (accent border-2 for recommended)
 * - Zero shadow at rest, subtle lift on hover
 * - Crimson used sparingly per the Spotlighting Rule
 * - Transitions: 200ms cubic-bezier(0.16, 1, 0.3, 1)
 */

"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  LuArrowRight,
  LuZap,
  LuTriangleAlert,
} from "react-icons/lu";
import { IoCheckmarkCircle } from "react-icons/io5";
import { fetchPlansAction } from "@/app/_actions/plans";
import type { PlanResponseDto, PriceResponseDto } from "@/app/types/subscriptions";
import {
  BillingRecurringInterval,
  BillingPriceType,
} from "@/app/types/subscriptions";
import { useAuthStore } from "@/app/_stores/authStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// ─── Helpers ──────────────────────────────────────────

function formatPrice(unitAmount: number): string {
  return `$${(unitAmount / 100).toFixed(2)}`;
}

function findMonthlyPrice(plan: PlanResponseDto): PriceResponseDto | undefined {
  return plan.prices.find(
    (p) =>
      p.active &&
      p.type === BillingPriceType.RECURRING &&
      p.interval === BillingRecurringInterval.MONTH,
  );
}

function findAnnualPrice(plan: PlanResponseDto): PriceResponseDto | undefined {
  return plan.prices.find(
    (p) =>
      p.active &&
      p.type === BillingPriceType.RECURRING &&
      p.interval === BillingRecurringInterval.YEAR,
  );
}

// ─── Props ────────────────────────────────────────────

interface SubscriptionSuggestionsProps {
  /** The plan code of the user's current subscription to exclude (e.g. "free", "premium") */
  currentPlanCode?: string;
  /** Whether the user is currently on a free plan */
  isFree?: boolean;
}

// ─── Skeleton ─────────────────────────────────────────

function SuggestionsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-panel_bg border border-white/5 rounded-lg p-5 space-y-4"
        >
          <div className="h-5 w-24 bg-white/10 rounded" />
          <div className="h-8 w-28 bg-white/10 rounded" />
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-white/10 rounded-full" />
            <div className="h-6 w-20 bg-white/10 rounded-full" />
          </div>
          <div className="h-3 w-full bg-white/10 rounded" />
          <div className="h-10 w-full bg-white/10 rounded" />
        </div>
      ))}
    </div>
  );
}

// ─── Component ────────────────────────────────────────

export default function SubscriptionSuggestions({
  currentPlanCode,
  isFree,
}: SubscriptionSuggestionsProps) {
  const [plans, setPlans] = useState<PlanResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const prefersReducedMotion = useReducedMotion();

  const loadPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchPlansAction();
      if (result.success && result.data) {
        setPlans(result.data);
      } else {
        setError(result.message || "Failed to load plans");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  // Sort by displayOrder and exclude the current plan
  const availablePlans = useMemo(() => {
    const sorted = [...plans].sort((a, b) => a.displayOrder - b.displayOrder);
    if (currentPlanCode) {
      return sorted.filter((p) => p.code !== currentPlanCode);
    }
    return sorted;
  }, [plans, currentPlanCode]);

  // ── Render ─────────────────────────────────────

  // Loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <SuggestionsSkeleton />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-panel_bg border border-white/5 rounded-lg p-6 text-center space-y-3">
        <LuTriangleAlert className="size-8 text-red-400 mx-auto" />
        <p className="text-sm text-red-400">{error}</p>
        <button
          onClick={loadPlans}
          className="px-4 py-2 bg-accent text-white rounded text-sm font-medium hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty state — no other plans to show
  if (availablePlans.length === 0) {
    return (
      <div className="bg-panel_bg border border-white/5 rounded-lg p-6 text-center">
        <div className="flex flex-col items-center gap-2">
          <LuZap className="size-8 text-gray-600" />
          <p className="text-sm text-second_text">
            No other plans are currently available.
          </p>
        </div>
      </div>
    );
  }

  const hasRecommendation = availablePlans.some((p) => p.highlight);

  return (
    <div className="space-y-4">
      {/* Subtle header hint */}
      <div className="text-center">
        <p className="text-xs text-second_text font-light max-w-xl mx-auto">
          {isFree
            ? "Choose the plan that fits your needs. Upgrade anytime to unlock premium features."
            : "Compare our plans and switch whenever you want. Changes take effect at the start of your next billing cycle."}
        </p>
      </div>

      {/* Plan cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
        {availablePlans.map((plan, index) => {
          const isRecommended = plan.highlight && !isFree && hasRecommendation;
          const monthlyPrice = findMonthlyPrice(plan);
          const annualPrice = findAnnualPrice(plan);
          const annualTotal = annualPrice?.unitAmount ?? null;

          // Show up to 4 features as compact chips
          const displayFeatures = plan.features.slice(0, 4);

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1],
                delay: index * 0.08,
              }}
              className={`relative rounded-lg p-5 flex flex-col ${
                isRecommended
                  ? "bg-panel_bg border-2 border-accent"
                  : "bg-panel_bg border border-white/5"
              }`}
              whileHover={
                !prefersReducedMotion
                  ? {
                      y: -4,
                      boxShadow: "0 0 30px rgba(229, 9, 20, 0.12)",
                      transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
                    }
                  : undefined
              }
            >
              {/* Recommended tag (inline, not floating) */}
              {isRecommended && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-accent bg-accent/10 px-2.5 py-0.5 rounded-full w-fit mb-3">
                  <LuZap className="size-3" />
                  Recommended
                </span>
              )}

              {/* Plan header */}
              <div className="mb-3">
                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                {plan.description && (
                  <p className="text-[12px] text-second_text mt-0.5 line-clamp-1">
                    {plan.description}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="mb-3">
                {monthlyPrice ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white">
                      {formatPrice(monthlyPrice.unitAmount)}
                    </span>
                    <span className="text-xs text-second_text">/mo</span>
                  </div>
                ) : (
                  <span className="text-xs text-second_text">
                    Price unavailable
                  </span>
                )}
                {annualTotal && (
                  <p className="text-[11px] text-second_text mt-0.5">
                    {formatPrice(annualTotal)}/yr when billed annually
                  </p>
                )}
              </div>

              {/* Feature chips */}
              {displayFeatures.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {displayFeatures.map((feat) => (
                    <span
                      key={feat}
                      className="inline-flex items-center gap-1 text-[11px] text-gray-300 bg-fourth_color px-2 py-0.5 rounded-full border border-white/5"
                    >
                      <IoCheckmarkCircle className="size-3 text-accent shrink-0" />
                      <span className="truncate max-w-[120px]">{feat}</span>
                    </span>
                  ))}
                </div>
              )}

              {/* Additional features count */}
              {plan.features.length > 4 && (
                <p className="text-[11px] text-second_text mb-3">
                  +{plan.features.length - 4} more features
                </p>
              )}

              {/* Spacer to push button to bottom */}
              <div className="flex-1" />

              {/* Switch action */}
              {isFree ? (
                <button
                  onClick={() => {
                    if (!monthlyPrice) {
                      toast.error("This plan is currently unavailable");
                      return;
                    }
                    const params = new URLSearchParams({
                      priceId: monthlyPrice.id,
                      isRecurring: "true",
                    });
                    if (user) {
                      router.push(`/checkout?${params.toString()}`);
                    } else {
                      router.push("/pricing");
                    }
                  }}
                  className="w-full bg-accent hover:bg-red-700 text-white py-2.5 rounded text-sm font-bold transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <LuZap className="size-4" />
                  Subscribe
                  <LuArrowRight className="size-4" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (!monthlyPrice) {
                      toast.error("This plan is currently unavailable");
                      return;
                    }
                    const params = new URLSearchParams({
                      priceId: monthlyPrice.id,
                      isRecurring: "true",
                    });
                    router.push(`/checkout?${params.toString()}`);
                  }}
                  className="w-full bg-accent hover:bg-red-700 text-white py-2.5 rounded text-sm font-bold transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <LuZap className="size-4" />
                  Switch to {plan.name}
                  <LuArrowRight className="size-4" />
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * PricingCard — a design-system-compliant subscription plan card.
 *
 * Matches the FlickHQ Design System:
 * - Shadow Velvet panel (#0b0b0b) with 8px rounded corners
 * - Thin white/5 border (accent border-2 for popular)
 * - Zero shadow at rest
 * - Hover: scale(1.02) + Crimson Halo (box-shadow)
 * - Transition: 200ms cubic-bezier(0.16, 1, 0.3, 1)
 * - Internal padding: p-6 (mobile) → p-8 (desktop)
 * - "Most Popular" badge: accent pill centered above card
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { IoCheckmarkOutline } from "react-icons/io5";
import SubscribeButton from "@/app/_components/_website/_pricing/SubscribeButton";
import type { PlanResponseDto, PriceResponseDto } from "@/app/types/subscriptions";
import { BillingRecurringInterval, BillingPriceType } from "@/app/types/subscriptions";

// ─── Helpers ──────────────────────────────────────────

function formatPrice(unitAmount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(unitAmount / 100);
}

function formatInterval(interval: BillingRecurringInterval): string {
  switch (interval) {
    case BillingRecurringInterval.MONTH:
      return "/mo";
    case BillingRecurringInterval.YEAR:
      return "/yr";
    case BillingRecurringInterval.WEEK:
      return "/wk";
    case BillingRecurringInterval.DAY:
      return "/day";
    default:
      return `/${interval}`;
  }
}

// ─── Props ───────────────────────────────────────────

interface PricingCardProps {
  plan: PlanResponseDto;
  activePrice: PriceResponseDto | undefined;
  isPopular: boolean;
  isAnnual: boolean;
  onSelect?: (priceId: string) => void;
}

// ─── Component ───────────────────────────────────────

export function PricingCard({
  plan,
  activePrice,
  isPopular,
  isAnnual,
}: PricingCardProps) {
  const prefersReducedMotion = useReducedMotion();

  // Annual bill total for display
  const annualTotal =
    isAnnual && activePrice && activePrice.interval === BillingRecurringInterval.YEAR
      ? activePrice.unitAmount
      : null;

  return (
    <motion.div
      className={`relative rounded-lg p-6 md:p-8 ${
        isPopular
          ? "bg-panel_bg border-2 border-accent"
          : "bg-panel_bg border border-white/5"
      }`}
      whileHover={
        !prefersReducedMotion
          ? {
              scale: 1.02,
              boxShadow: "0 0 30px rgba(229, 9, 20, 0.15)",
            }
          : undefined
      }
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      style={{ willChange: "transform" }}
    >
      {/* Most Popular badge */}
      {isPopular && (
        <motion.div
          className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap"
          initial={false}
          whileHover={
            !prefersReducedMotion ? { scale: 1.06 } : undefined
          }
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          Most Popular
        </motion.div>
      )}

      {/* Header */}
      <div className="mb-6">
        <h3 className="text-white text-xl font-semibold mb-1">
          {plan.name}
        </h3>
        {plan.description && (
          <p className="text-second_text text-sm mb-4">
            {plan.description}
          </p>
        )}
        <div className="flex items-baseline gap-1">
          {activePrice ? (
            <>
              <span className="text-white text-4xl font-extrabold">
                {formatPrice(activePrice.unitAmount, activePrice.currency)}
              </span>
              <span className="text-light_text text-sm">
                {formatInterval(activePrice.interval!)}
              </span>
            </>
          ) : (
            <span className="text-light_text text-sm">
              Price unavailable
            </span>
          )}
        </div>
        {annualTotal && activePrice && (
          <p className="text-second_text text-xs mt-1">
            Billed annually (
            {formatPrice(annualTotal, activePrice.currency)}
            /yr)
          </p>
        )}
      </div>

      {/* Features list */}
      <ul className="space-y-3 mb-8">
        {plan.features.length > 0 ? (
          plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3">
              <IoCheckmarkOutline className="size-5 text-accent shrink-0 mt-0.5" />
              <span className="text-sm text-gray-300 font-light">
                {feature}
              </span>
            </li>
          ))
        ) : (
          <li className="text-sm text-light_text">No features listed</li>
        )}
      </ul>

      {/* Subscribe button */}
      {activePrice ? (
        <div>
          <SubscribeButton
            priceId={activePrice.id}
            isRecurring={activePrice.type === BillingPriceType.RECURRING}
            planName={plan.name}
            variant={isPopular ? "primary" : "secondary"}
          />
          <p className="text-center text-xs text-light_text mt-3">
            Cancel anytime. No questions asked.
          </p>
        </div>
      ) : (
        <button
          disabled
          className="w-full py-3.5 rounded text-sm font-medium bg-[#1a1a1a] text-light_text border border-white/5 cursor-not-allowed touch-target"
          aria-label="Price unavailable"
        >
          Unavailable
        </button>
      )}
    </motion.div>
  );
}

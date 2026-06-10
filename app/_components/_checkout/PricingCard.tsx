/**
 * PricingCard — cinema-tier subscription plan card.
 *
 * Design:
 * - Glass-morphism panel with per-tier gradient accent strip at top
 * - Tier color assigned by index (sapphire → amber → crimson → violet)
 * - Diagonal ribbon badge for "Most Popular" with crown icon
 * - Colored checkmark features with subtle circle background
 * - Hover: lift + glow shadow matching tier color
 * - Transition: 300ms cubic-bezier(0.16, 1, 0.3, 1)
 */

"use client";

import { motion, useReducedMotion } from "framer-motion";
import { IoCheckmarkOutline } from "react-icons/io5";
import { LuCrown } from "react-icons/lu";
import SubscribeButton from "@/app/_components/_website/_pricing/SubscribeButton";
import type { PlanResponseDto, PriceResponseDto } from "@/app/types/subscriptions";
import { BillingRecurringInterval, BillingPriceType } from "@/app/types/subscriptions";

// ─── Tier color themes ────────────────────────────────

const TIER_THEMES = [
  {
    name: "sapphire",
    accent: "#3b82f6",
    accentLight: "rgba(59, 130, 246, 0.12)",
    glow: "0 0 35px rgba(59, 130, 246, 0.2)",
    badgeBg: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
  },
  {
    name: "amber",
    accent: "#f59e0b",
    accentLight: "rgba(245, 158, 11, 0.12)",
    glow: "0 0 35px rgba(245, 158, 11, 0.2)",
    badgeBg: "linear-gradient(135deg, #f59e0b, #d97706)",
  },
  {
    name: "crimson",
    accent: "#E50914",
    accentLight: "rgba(229, 9, 20, 0.12)",
    glow: "0 0 35px rgba(229, 9, 20, 0.2)",
    badgeBg: "linear-gradient(135deg, #E50914, #b80710)",
  },
  {
    name: "violet",
    accent: "#8b5cf6",
    accentLight: "rgba(139, 92, 246, 0.12)",
    glow: "0 0 35px rgba(139, 92, 246, 0.2)",
    badgeBg: "linear-gradient(135deg, #8b5cf6, #6d28d9)",
  },
];

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
  /** Index used to pick a tier color theme. Defaults to 0 (sapphire). */
  tierIndex?: number;
  onSelect?: (priceId: string) => void;
}

// ─── Component ───────────────────────────────────────

export function PricingCard({
  plan,
  activePrice,
  isPopular,
  isAnnual,
  tierIndex = 0,
}: PricingCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const theme = TIER_THEMES[tierIndex % TIER_THEMES.length];
  const isFree = plan.code === "free";

  // Annual bill total for display
  const annualTotal =
    isAnnual && activePrice && activePrice.interval === BillingRecurringInterval.YEAR
      ? activePrice.unitAmount
      : null;

  // Popular card gets a thicker border
  const borderStyle = isPopular
    ? `2px solid ${theme.accent}`
    : "1px solid rgba(255, 255, 255, 0.05)";

  return (
    <motion.div
      className="relative rounded-xl overflow-hidden h-full flex flex-col"
      whileHover={
        !prefersReducedMotion
          ? { y: -8, boxShadow: theme.glow }
          : undefined
      }
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      style={{ willChange: "transform" }}
    >
      {/* Glass background + gradient overlay */}
      <div
        className="absolute inset-0 rounded-xl"
        style={{
          background: `linear-gradient(180deg, ${theme.accentLight} 0%, rgba(11, 11, 11, 0.95) 35%, rgba(11, 11, 11, 1) 100%)`,
          border: borderStyle,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      />

      {/* Gradient accent strip */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px] z-[2]"
        style={{
          background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent}99, transparent)`,
        }}
      />

      {/* Most Popular — ribbon badge */}
      {isPopular && (
        <motion.div
          className="absolute top-3 right-3 z-10"
          initial={false}
          whileHover={!prefersReducedMotion ? { scale: 1.06 } : undefined}
          transition={{ duration: 0.2 }}
        >
          <div
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-white text-[11px] font-semibold shadow-lg"
            style={{ background: theme.badgeBg }}
          >
            <LuCrown className="size-3" />
            Most Popular
          </div>
        </motion.div>
      )}

      {/* Content */}
      <div className="relative z-[1] flex flex-col h-full p-6 md:p-7">
        {/* Header */}
        <div className="mb-5">
          <h3 className="text-white text-lg font-semibold mb-1">
            {plan.name}
          </h3>
          {plan.description && (
            <p className="text-second_text text-sm leading-relaxed">
              {plan.description}
            </p>
          )}
        </div>

        {/* Price */}
        <div className="mb-6">
          {activePrice ? (
            <>
              <div className="flex items-baseline gap-1">
                <span className="text-white text-4xl font-extrabold tracking-tight">
                  {formatPrice(activePrice.unitAmount, activePrice.currency)}
                </span>
                <span className="text-light_text text-sm">
                  {formatInterval(activePrice.interval!)}
                </span>
              </div>
              {annualTotal && activePrice && (
                <p className="text-second_text text-xs mt-1">
                  Billed annually (
                  {formatPrice(annualTotal, activePrice.currency)}
                  /yr)
                </p>
              )}
            </>
          ) : (
            <span className="text-light_text text-sm">Price unavailable</span>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 mb-5" />

        {/* Features */}
        <ul className="space-y-3 mb-8 flex-1">
          {plan.features.length > 0 ? (
            plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <span
                  className="size-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: theme.accentLight }}
                >
                  <IoCheckmarkOutline
                    className="size-3.5"
                    style={{ color: theme.accent }}
                  />
                </span>
                <span className="text-sm text-gray-300 font-light leading-snug">
                  {feature}
                </span>
              </li>
            ))
          ) : (
            <li className="text-sm text-light_text">No features listed</li>
          )}
        </ul>

        {/* Subscribe button */}
        {isFree ? null : activePrice ? (
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
            className="w-full py-3.5 rounded-lg text-sm font-medium bg-[#1a1a1a] text-light_text border border-white/5 cursor-not-allowed touch-target"
            aria-label="Price unavailable"
          >
            Unavailable
          </button>
        )}
      </div>
    </motion.div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { IoCheckmark } from "react-icons/io5";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { fetchPlansAction } from "@/app/_actions/plans";
import type { PlanResponseDto } from "@/app/types/subscriptions";
import {
  BillingRecurringInterval,
  BillingPriceType,
} from "@/app/types/subscriptions";
import PlanCardSkeleton from "../../_globalComponents/PlanCardSkeleton";
import SubscribeButton from "@/app/_components/_website/_pricing/SubscribeButton";

// ─── Constants ───────────────────────────────────────

/** Number of features visible before the "Show more" fold. */
const INITIAL_VISIBLE_FEATURES = 4;

/** Max height (px) used for the collapsed-features animation. */
const COLLAPSED_MAX_HEIGHT = 0;
const EXPANDED_MAX_HEIGHT = 2000;

// ─── Helpers ───────────────────────────────────────

function formatPrice(unitAmount: number): string {
  return `$${(unitAmount / 100).toFixed(2)}`;
}

function findMonthlyPrice(plan: PlanResponseDto) {
  return plan.prices.find(
    (p) =>
      p.active &&
      p.type === BillingPriceType.RECURRING &&
      p.interval === BillingRecurringInterval.MONTH,
  );
}

// ─── Component ─────────────────────────────────────

export default function PlansSection() {
  const [plans, setPlans] = useState<PlanResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPlans, setExpandedPlans] = useState<Set<string>>(new Set());
  const prefersReducedMotion = useReducedMotion();

  const toggleExpand = useCallback((planId: string) => {
    setExpandedPlans((prev) => {
      const next = new Set(prev);
      if (next.has(planId)) {
        next.delete(planId);
      } else {
        next.add(planId);
      }
      return next;
    });
  }, []);

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
      setError("An unexpected error occurred while loading plans");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  // ── Loading state ──────────────────────────────
  if (loading) {
    return (
      <section className="custom-container my-12 md:my-16 max-sm:my-8">
        <div className="mb-10 md:mb-14 max-sm:mb-8">
          <div className="h-10 w-64 rounded-lg bg-white/10 animate-pulse mb-3" />
          <div className="h-5 w-80 rounded bg-white/10 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 items-stretch">
          {Array.from({ length: 3 }).map((_, i) => (
            <PlanCardSkeleton key={i} popular={i === 1} />
          ))}
        </div>
      </section>
    );
  }

  // ── Error state ────────────────────────────────
  if (error) {
    return (
      <section className="custom-container my-12 md:my-16 max-sm:my-8">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">{error}</p>
          <button
            onClick={loadPlans}
            className="px-6 py-2.5 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent/90 transition-colors min-h-[44px]"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  // ── Empty state ────────────────────────────────
  if (plans.length === 0) {
    return (
      <section className="custom-container my-12 md:my-16 max-sm:my-8">
        <div className="text-center">
          <p className="text-gray-400 text-lg">
            No plans are currently available.
          </p>
          <p className="text-gray-400 text-sm mt-2">Please check back later.</p>
        </div>
      </section>
    );
  }

  // ── Sort by displayOrder ───────────────────────
  const sorted = [...plans].sort((a, b) => a.displayOrder - b.displayOrder);

  // ── Shared card renderer ──────────────────────
  const renderPlanCard = (plan: PlanResponseDto) => {
    const isPopular = plan.highlight;
    const activePrice = findMonthlyPrice(plan);
    const isExpanded = expandedPlans.has(plan.id);

    const initialFeatures = plan.features.slice(0, INITIAL_VISIBLE_FEATURES);
    const extraFeatures = plan.features.slice(INITIAL_VISIBLE_FEATURES);
    const hasMoreFeatures = extraFeatures.length > 0;

    return (
      <motion.div
        className={`relative h-full w-full flex flex-col p-6 md:p-8 rounded-lg border ${
          isPopular
            ? "bg-[#141414] border-2 border-accent"
            : "bg-[#0f0f0f] border border-white/5"
        }`}
        layout={!prefersReducedMotion}
        whileHover={
          !prefersReducedMotion
            ? { y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.4)" }
            : undefined
        }
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        style={{ willChange: "transform" }}
      >
        {isPopular && (
          <motion.div
            className="absolute -top-3 left-1/2 -translate-x-1/2 bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap"
            whileHover={!prefersReducedMotion ? { scale: 1.06 } : undefined}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            Most Popular
          </motion.div>
        )}

        <h2 className="text-white text-xl md:text-2xl font-semibold mb-6">
          {plan.name}
        </h2>

        {/* Features list — flex-1 so button area is pushed to bottom */}
        <div className="flex-1 flex flex-col">
          <ul className="flex flex-col gap-3 mb-6">
            {plan.features.length > 0 ? (
              <>
                {/* Always-visible initial features */}
                {initialFeatures.map((feature) => (
                  <li className="flex items-start gap-3" key={feature}>
                    <IoCheckmark className="size-5 shrink-0 mt-0.5 text-accent" />
                    <span className="text-sm leading-snug text-gray-300">
                      {feature}
                    </span>
                  </li>
                ))}

                {/* Collapsible extra features */}
                {hasMoreFeatures && (
                  <>
                    <AnimatePresence initial={false}>
                      <motion.div
                        key="extra-features"
                        initial={false}
                        animate={{
                          maxHeight: isExpanded
                            ? EXPANDED_MAX_HEIGHT
                            : COLLAPSED_MAX_HEIGHT,
                          opacity: isExpanded ? 1 : 0,
                        }}
                        transition={{
                          duration: 0.35,
                          ease: [0.4, 0, 0.2, 1],
                        }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-col gap-3">
                          {extraFeatures.map((feature) => (
                            <li
                              className="flex items-start gap-3"
                              key={feature}
                            >
                              <IoCheckmark className="size-5 shrink-0 mt-0.5 text-accent" />
                              <span className="text-sm leading-snug text-gray-300">
                                {feature}
                              </span>
                            </li>
                          ))}
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Toggle button */}
                    <motion.button
                      type="button"
                      onClick={() => toggleExpand(plan.id)}
                      className={`flex items-center gap-1.5 text-xs font-medium transition-colors mt-2 ${
                        isExpanded
                          ? "text-gray-400 hover:text-gray-200"
                          : "text-accent hover:text-accent/80"
                      }`}
                      whileHover={!prefersReducedMotion ? { x: 2 } : undefined}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }}
                      aria-expanded={isExpanded}
                      aria-controls={`plan-${plan.id}-extra-features`}
                    >
                      {isExpanded ? (
                        <>
                          Show less <IoChevronUp className="size-3.5" />
                        </>
                      ) : (
                        <>
                          Show {extraFeatures.length} more feature
                          {extraFeatures.length !== 1 ? "s" : ""}
                          <IoChevronDown className="size-3.5" />
                        </>
                      )}
                    </motion.button>
                  </>
                )}
              </>
            ) : (
              <li className="text-sm text-gray-400">No features listed</li>
            )}
          </ul>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mb-6" />

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-6">
          {activePrice ? (
            <>
              <span className="text-white text-3xl font-bold">
                {formatPrice(activePrice.unitAmount)}
              </span>
              <span className="text-sm text-gray-500">/month</span>
            </>
          ) : (
            <span className="text-gray-500 text-sm">Price unavailable</span>
          )}
        </div>

        {/* Subscribe button — sticky at bottom */}
        {activePrice ? (
          <div>
            <SubscribeButton
              priceId={activePrice.id}
              isRecurring={activePrice.type === BillingPriceType.RECURRING}
              planName={plan.name}
              variant={isPopular ? "primary" : "secondary"}
            />
            <p className="text-center text-xs text-gray-400 mt-3">
              Cancel anytime. No questions asked.
            </p>
          </div>
        ) : (
          <button
            disabled
            className="w-full py-3.5 rounded-md text-sm font-medium bg-[#1a1a1a] text-gray-500 border border-white/5 cursor-not-allowed min-h-[44px]"
            aria-label="Price unavailable"
          >
            Unavailable
          </button>
        )}
      </motion.div>
    );
  };

  // ── Render ─────────────────────────────────────
  return (
    <section className="custom-container my-12 md:my-16 max-sm:my-8">
      <div className="mb-10 md:mb-14 max-sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
          Select Your Plan
        </h1>
        <p className="text-gray-400 text-base md:text-lg font-light max-sm:text-sm">
          No hidden fees, equipment rentals, or installation appointments.
        </p>
      </div>

      {/* Mobile: Swiper carousel */}
      <div className="md:hidden -mx-2">
        <Swiper
          spaceBetween={16}
          slidesPerView={1.15}
          centeredSlides={false}
          grabCursor
        >
          {sorted.map((plan) => (
            <SwiperSlide key={plan.id}>{renderPlanCard(plan)}</SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Tablet+: responsive grid — items-stretch ensures all cards match height */}
      <div className="hidden md:grid md:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-4 gap-6 md:gap-8 items-stretch">
        {sorted.map((plan) => (
          <div key={plan.id} className="flex">
            {renderPlanCard(plan)}
          </div>
        ))}
      </div>
    </section>
  );
}

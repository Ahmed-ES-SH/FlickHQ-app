/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { TiBook } from "react-icons/ti";
import { TbTicket } from "react-icons/tb";
import { PiScreencastBold } from "react-icons/pi";
import { CiVideoOn } from "react-icons/ci";
import SwiperBartners from "@/app/_components/_website/_pricing/SwiperBartners";
import { PricingCard } from "@/app/_components/_checkout/PricingCard";
import PlansSkeleton from "@/app/_components/_globalComponents/PlansSkeleton";
import { fetchPlansAction } from "@/app/_actions/plans";
import type { PlanResponseDto, PriceResponseDto } from "@/app/types/subscriptions";
import { BillingRecurringInterval, BillingPriceType } from "@/app/types/subscriptions";

// ─── Feature Cards (static product features) ──────

const featureCards = [
  {
    title: "Curated Library",
    content:
      "Explore thousands of movies, series, and documentaries — from indie gems to blockbuster hits. Our editorial team handpicks every title so you spend less time searching and more time watching.",
    icon: <TiBook className="size-10 text-accent" />,
  },
  {
    title: "Digital Premieres",
    content:
      "Get front-row access to exclusive virtual screenings and early releases. Buy digital tickets for premiere events and watch new releases alongside a global community of film lovers.",
    icon: <TbTicket className="size-10 text-accent" />,
  },
  {
    title: "Interactive Screenings",
    content:
      "Watch together with synchronized playback, live chat, and real-time reactions. Host watch parties, vote on what to play next, and turn movie night into a shared experience.",
    icon: <PiScreencastBold className="size-10 text-accent" />,
  },
  {
    title: "Behind the Scenes",
    content:
      "Go beyond the screen with exclusive director's cuts, making-of documentaries, cast interviews, and behind-the-scenes footage. See how your favorite films come to life.",
    icon: <CiVideoOn className="size-10 text-accent" />,
  },
];

// ─── Helpers ───────────────────────────────────────

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

/** Pick the first active recurring price matching the given interval. */
function pickPrice(
  prices: PriceResponseDto[],
  interval: BillingRecurringInterval,
): PriceResponseDto | undefined {
  return prices.find(
    (p) =>
      p.active &&
      p.type === BillingPriceType.RECURRING &&
      p.interval === interval,
  );
}

/** Calculate annual savings percentage from the first plan that has both prices. */
function calculateSavings(plans: PlanResponseDto[]): number | null {
  for (const plan of plans) {
    const monthly = pickPrice(plan.prices, BillingRecurringInterval.MONTH);
    const annual = pickPrice(plan.prices, BillingRecurringInterval.YEAR);
    if (monthly && annual) {
      const yearlyTotal = monthly.unitAmount * 12;
      const saved = Math.round((1 - annual.unitAmount / yearlyTotal) * 100);
      return saved > 0 ? saved : null;
    }
  }
  return null;
}

// ─── Component ─────────────────────────────────────

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [plans, setPlans] = useState<PlanResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
      setError("An unexpected error occurred while loading plans");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  // Sort plans by displayOrder once they're loaded
  const sortedPlans = useMemo(
    () => [...plans].sort((a, b) => a.displayOrder - b.displayOrder),
    [plans],
  );

  // Calculate savings badge
  const annualSavings = useMemo(() => calculateSavings(sortedPlans), [sortedPlans]);

  // ── Render ─────────────────────────────────────
  return (
    <div className="lg:mt-28 mt-20 custom-container min-h-screen pb-20">
      {/* ── Header ──────────────────────────────── */}
      <section className="mb-16">
        <h1 className="text-white text-3xl xl:text-5xl font-bold mb-4 text-balance">
          Choose Your{" "}
          <span className="relative inline-block">
            Cinema Experience
            <span
              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent rounded-full"
              aria-hidden="true"
            />
          </span>
        </h1>
        <p className="text-second_text text-base xl:text-lg leading-relaxed max-w-[75ch] mb-4 font-light">
          Stream thousands of movies, series, and exclusive originals in stunning
          4K HDR. Select the plan that fits your lifestyle — upgrade, downgrade,
          or cancel whenever you want.
        </p>
        <p className="text-light_text text-sm leading-relaxed max-w-[65ch] font-light">
          All plans unlock FlickHQ Originals, personalized recommendations, and
          seamless streaming across all your devices.
        </p>
      </section>

      {/* ── Feature Cards (static) ──────────────── */}
      <section className="mb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featureCards.map((card) => (
            <motion.div
              key={card.title}
              className="flex gap-5 p-6 rounded-lg bg-panel_bg border border-white/5 hover:border-white/10 hover:-translate-y-0.5 transition-all duration-200"
              whileHover={
                !prefersReducedMotion
                  ? { y: -2 }
                  : undefined
              }
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="shrink-0 mt-1">{card.icon}</div>
              <div>
                <h2 className="text-white text-lg font-semibold mb-2">
                  {card.title}
                </h2>
                <p className="text-second_text text-sm leading-relaxed font-light max-w-[75ch]">
                  {card.content}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Billing Toggle ──────────────────────── */}
      <div className="flex items-center justify-center gap-4 mb-12">
        <span
          className={`text-sm font-medium transition-colors duration-200 ${
            !isAnnual ? "text-white" : "text-light_text"
          }`}
        >
          Monthly
        </span>
        <button
          onClick={() => setIsAnnual(!isAnnual)}
          className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${
            isAnnual ? "bg-accent" : "bg-[#2a2a2a]"
          }`}
          aria-label={
            isAnnual ? "Switch to monthly billing" : "Switch to annual billing"
          }
        >
          <span
            className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform duration-200 ${
              isAnnual ? "translate-x-7" : "translate-x-0"
            }`}
            style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
          />
        </button>
        <span
          className={`text-sm font-medium transition-colors duration-200 ${
            isAnnual ? "text-white" : "text-light_text"
          }`}
        >
          Annual
        </span>
        <AnimatePresence mode="wait">
          {isAnnual && annualSavings && (
            <motion.span
              key="savings-badge"
              initial={{ opacity: 0, scale: 0.8, x: -8 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-xs font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-full"
            >
              Save {annualSavings}%
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* ── Pricing Cards (dynamic) ─────────────── */}
      <section className="mb-20">
        {loading ? (
          <PlansSkeleton count={sortedPlans.length || 3} />
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-second_text text-lg mb-4 font-light">{error}</p>
            <button
              onClick={loadPlans}
              className="bg-accent text-white px-7 py-3.5 rounded text-sm font-medium hover:bg-[#b80710] transition-all duration-200 min-h-[44px] touch-target focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-main_bg"
            >
              Try Again
            </button>
          </div>
        ) : sortedPlans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-second_text text-lg font-light">No plans are currently available.</p>
            <p className="text-light_text text-sm mt-2 font-light">
              Please check back later for our subscription offerings.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile: Swiper carousel */}
            <div className="md:hidden -mx-2">
              <Swiper
                spaceBetween={16}
                slidesPerView={1.15}
                centeredSlides={false}
                grabCursor
              >
                {sortedPlans.map((plan) => (
                  <SwiperSlide key={plan.id}>
                    <PricingCard
                      plan={plan}
                      activePrice={
                        pickPrice(
                          plan.prices,
                          isAnnual
                            ? BillingRecurringInterval.YEAR
                            : BillingRecurringInterval.MONTH,
                        ) ??
                        (isAnnual
                          ? pickPrice(plan.prices, BillingRecurringInterval.MONTH)
                          : undefined)
                      }
                      isPopular={plan.highlight}
                      isAnnual={isAnnual}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Tablet+: responsive grid */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {sortedPlans.map((plan) => (
                <PricingCard
                  key={plan.id}
                  plan={plan}
                  activePrice={
                    pickPrice(
                      plan.prices,
                      isAnnual
                        ? BillingRecurringInterval.YEAR
                        : BillingRecurringInterval.MONTH,
                    ) ??
                    (isAnnual
                      ? pickPrice(plan.prices, BillingRecurringInterval.MONTH)
                      : undefined)
                  }
                  isPopular={plan.highlight}
                  isAnnual={isAnnual}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* ── Partners ────────────────────────────── */}
      <SwiperBartners />
    </div>
  );
}

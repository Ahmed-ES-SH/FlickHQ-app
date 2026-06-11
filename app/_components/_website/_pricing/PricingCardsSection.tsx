"use client";

////////////////////////////////////////////////////////////////////////////////
///////// Pricing page — pricing cards with loading/error/empty states ////////
///////// and responsive layouts (Swiper mobile, 2x2 tablet, row desktop) /////
////////////////////////////////////////////////////////////////////////////////

import { Swiper, SwiperSlide } from "swiper/react";
import { PricingCard } from "@/app/_components/_checkout/PricingCard";
import PlansSkeleton from "@/app/_components/_globalComponents/PlansSkeleton";
import { resolvePrice } from "@/app/_helpers/pricing/pricing";
import type { PlanResponseDto } from "@/app/types/subscriptions";
import "swiper/css";

interface PricingCardsSectionProps {
  sortedPlans: PlanResponseDto[];
  isAnnual: boolean;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export default function PricingCardsSection({
  sortedPlans,
  isAnnual,
  loading,
  error,
  onRetry,
}: PricingCardsSectionProps) {
  if (loading) {
    return <PlansSkeleton count={sortedPlans.length || 3} />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-second_text text-lg mb-4 font-light">{error}</p>
        <button
          onClick={onRetry}
          className="bg-accent text-white px-7 py-3.5 rounded text-sm font-medium hover:bg-[#b80710] transition-all duration-200 min-h-[44px] touch-target focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-main_bg"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (sortedPlans.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-second_text text-lg font-light">
          No plans are currently available.
        </p>
        <p className="text-light_text text-sm mt-2 font-light">
          Please check back later for our subscription offerings.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Very small mobile: Swiper carousel */}
      <div className="sm:hidden -mx-2">
        <Swiper spaceBetween={16} slidesPerView={1.2} centeredSlides={false} grabCursor>
          {sortedPlans.map((plan, index) => (
            <SwiperSlide key={plan.id}>
              <PricingCard
                plan={plan}
                activePrice={resolvePrice(plan.prices, isAnnual)}
                isPopular={plan.highlight}
                isAnnual={isAnnual}
                tierIndex={index}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Tablet: 2×2 grid */}
      <div className="hidden sm:grid lg:hidden grid-cols-2 gap-5">
        {sortedPlans.map((plan, index) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            activePrice={resolvePrice(plan.prices, isAnnual)}
            isPopular={plan.highlight}
            isAnnual={isAnnual}
            tierIndex={index}
          />
        ))}
      </div>

      {/* Desktop: single row */}
      <div className="hidden lg:flex lg:flex-row gap-5">
        {sortedPlans.map((plan, index) => (
          <div key={plan.id} className="flex-1 min-w-0">
            <PricingCard
              plan={plan}
              activePrice={resolvePrice(plan.prices, isAnnual)}
              isPopular={plan.highlight}
              isAnnual={isAnnual}
              tierIndex={index}
            />
          </div>
        ))}
      </div>
    </>
  );
}

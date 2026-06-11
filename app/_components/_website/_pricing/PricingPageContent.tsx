"use client";

////////////////////////////////////////////////////////////////////////////////
///////// Pricing page — main client component /////////////////////////////////
///////// Manages plans state, billing toggle, and composes all sections ///////
////////////////////////////////////////////////////////////////////////////////

import { useEffect, useState, useCallback, useMemo } from "react";
import { useReducedMotion } from "framer-motion";
import { fetchPlansAction } from "@/app/_actions/plans";
import { calculateSavings } from "@/app/_helpers/pricing/pricing";
import type { PlanResponseDto } from "@/app/types/subscriptions";
import PricingHeaderSection from "./PricingHeaderSection";
import FeatureCardsSection from "./FeatureCardsSection";
import BillingToggle from "./BillingToggle";
import PricingCardsSection from "./PricingCardsSection";
import SwiperBartners from "./SwiperBartners";

export default function PricingPageContent() {
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
  const annualSavings = useMemo(
    () => calculateSavings(sortedPlans),
    [sortedPlans],
  );

  return (
    <div className="lg:mt-28 mt-20 custom-container min-h-screen pb-20">
      <PricingHeaderSection />

      <FeatureCardsSection prefersReducedMotion={prefersReducedMotion} />

      <BillingToggle
        isAnnual={isAnnual}
        setIsAnnual={setIsAnnual}
        annualSavings={annualSavings}
      />

      <section className="mb-20">
        <PricingCardsSection
          sortedPlans={sortedPlans}
          isAnnual={isAnnual}
          loading={loading}
          error={error}
          onRetry={loadPlans}
        />
      </section>

      <SwiperBartners />
    </div>
  );
}

////////////////////////////////////////////////////////////////////////////////
///////// Pricing page — Server Component entry point //////////////////////////
////////////////////////////////////////////////////////////////////////////////

import { Suspense } from "react";
import { getSharedMetadata } from "@/app/_helpers/shared/SharedMetadata";
import type { Metadata } from "next";
import PricingPageContent from "@/app/_components/_website/_pricing/PricingPageContent";
import PlansSkeleton from "@/app/_components/_globalComponents/PlansSkeleton";

// This page is fully client-driven (plan fetching + billing toggle),
// so we opt out of static generation to avoid useSearchParams issues
// from global providers rendered in the layout tree.
export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  const title = "FlickHQ – Movies & TV Shows - Pricing Page";
  const description =
    "Choose your cinema experience. Browse FlickHQ's subscription plans and streaming options. Pick the plan that fits your lifestyle.";
  return getSharedMetadata(title, description);
}

export default function PricingPage() {
  return (
    <Suspense fallback={<PricingPageFallback />}>
      <PricingPageContent />
    </Suspense>
  );
}

/** Minimal skeleton shown while the client page hydrates. */
function PricingPageFallback() {
  return (
    <div className="lg:mt-28 mt-20 custom-container min-h-screen pb-20">
      <div className="mb-16" />
      <PlansSkeleton count={3} />
    </div>
  );
}

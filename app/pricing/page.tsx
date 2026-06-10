import { Suspense } from "react";
import PricingWrapper from "../_components/_website/_pricing/PricingPageWrapper";

export default function Pricing() {
  return (
    <Suspense fallback="Loading...">
      <PricingWrapper />
    </Suspense>
  );
}

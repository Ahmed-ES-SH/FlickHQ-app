import { Suspense } from "react";
import PrivacyPolicyWrapper from "../_components/_website/privacypolicy/PrivacyPlicyWrapper";

export default function PrivacyPolicy() {
  return (
    <Suspense fallback="Loading...">
      <PrivacyPolicyWrapper />
    </Suspense>
  );
}

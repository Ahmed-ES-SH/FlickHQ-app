////////////////////////////////////////////////////////////////////////////////
///////// Checkout Page — Server Component entry point /////////////////////////
////////////////////////////////////////////////////////////////////////////////

import { Suspense } from "react";
import type { Metadata } from "next";
import { VscLoading } from "react-icons/vsc";
import { getSharedMetadata } from "@/app/_helpers/shared/SharedMetadata";
import CheckoutContent from "@/app/_components/_checkout/CheckoutContent";

export function generateMetadata(): Metadata {
  const title = "FlickHQ – Movies & TV Shows - Checkout";
  const description =
    "Complete your subscription purchase securely with Stripe. Choose your plan and enjoy unlimited movies and TV shows on FlickHQ.";

  return getSharedMetadata(title, description);
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-main_bg pt-[72px] flex items-center justify-center">
          <div className="text-center space-y-4">
            <VscLoading className="text-accent text-4xl animate-spin mx-auto" />
            <p className="text-second_text text-sm">Loading checkout...</p>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}

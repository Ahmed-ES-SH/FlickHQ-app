import { Suspense } from "react";
import { VscLoading } from "react-icons/vsc";
import { CheckoutSuccessContent } from "@/app/_components/_checkout/CheckoutSuccessContent";
import { getSharedMetadata } from "@/app/_helpers/shared/SharedMetadata";

// ─── Metadata ───────────────────────────────────────

export function generateMetadata() {
  const title = "FlickHQ – Movies & TV Shows - Checkout Success";
  const description =
    "Your subscription is confirmed! Welcome to FlickHQ – start streaming movies and TV shows instantly.";

  return getSharedMetadata(title, description);
}

// ─── Page ───────────────────────────────────────────

export const dynamic = "force-dynamic";

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="relative w-full min-h-screen flex items-center justify-center bg-main_bg font-sans selection:bg-accent selection:text-white">
          <div className="text-center space-y-4">
            <VscLoading className="text-accent text-4xl animate-spin mx-auto" />
            <p className="text-second_text text-sm">Loading...</p>
          </div>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}

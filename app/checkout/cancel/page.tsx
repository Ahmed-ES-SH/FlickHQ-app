/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import { FaTimesCircle } from "react-icons/fa";
import { CheckoutShell } from "@/app/_components/_checkout/CheckoutShell";
import { getSharedMetadata } from "@/app/_helpers/shared/SharedMetadata";

export function generateMetadata() {
  const title = "FlickHQ – Movies & TV Shows - Checkout Canceled";
  const description = "Your checkout was canceled. No charges have been made.";

  return getSharedMetadata(title, description);
}

/**
 * Cancel page — shown after the user cancels the Stripe Checkout flow.
 *
 * This is a Server Component (no interactivity needed).
 */
export default function CheckoutCancelPage() {
  return (
    <CheckoutShell maxWidth="max-w-sm">
      <div className="text-center space-y-6">
        {/* Icon */}
        <div className="mx-auto w-20 h-20 rounded-full flex items-center justify-center border-2 bg-red-500/10 border-red-500/30">
          <FaTimesCircle className="text-red-400 text-3xl" />
        </div>

        {/* Heading */}
        <h1 className="text-white text-3xl sm:text-4xl font-black italic uppercase tracking-tighter">
          Checkout Canceled
        </h1>

        {/* Message */}
        <p className="text-second_text text-sm sm:text-base font-light">
          Your checkout was canceled. No charges have been made.
        </p>
        <p className="text-light_text text-xs font-light">
          If you change your mind, you can pick up right where you left off.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/pricing"
            className="bg-accent text-white px-7 py-3.5 rounded text-sm font-medium hover:bg-[#b80710] transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-main_bg"
          >
            View Plans
          </Link>
          <Link
            href="/"
            className="bg-[#1a1a1a] text-white px-7 py-3.5 rounded text-sm font-medium border border-white/5 hover:bg-[#222] hover:border-white/10 transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-main_bg"
          >
            Go Home
          </Link>
        </div>
      </div>
    </CheckoutShell>
  );
}

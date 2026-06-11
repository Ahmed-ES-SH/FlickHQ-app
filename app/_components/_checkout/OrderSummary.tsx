////////////////////////////////////////////////////////////////////////////////
///////// OrderSummary — displays plan details, pricing, and features //////////
////////////////////////////////////////////////////////////////////////////////

"use client";

import { IoCheckmarkCircle } from "react-icons/io5";
import type { PlanResponseDto, PriceResponseDto } from "@/app/types/subscriptions";
import { formatPrice, formatInterval } from "@/app/_helpers/checkout/checkout";
import { SummarySkeleton } from "@/app/_components/_checkout/Skeleton";

interface OrderSummaryProps {
  plan: { plan: PlanResponseDto; price: PriceResponseDto } | null;
  loading: boolean;
}

export function OrderSummary({ plan, loading }: OrderSummaryProps) {
  if (loading || !plan) return <SummarySkeleton />;

  const { plan: planData, price } = plan;
  const isRecurring = price.interval != null;

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <span className="w-1 h-5 bg-accent rounded-full" aria-hidden="true" />
        <h2 className="text-lg font-bold text-white">Order Summary</h2>
      </div>

      {/* Plan line */}
      <div className="flex justify-between items-center pb-4 border-b border-white/10">
        <div className="flex flex-col">
          <span className="text-white font-semibold">{planData.name}</span>
          <span className="text-sm text-second_text font-light">
            {isRecurring
              ? `${formatInterval(price.interval!)} subscription`
              : "One-time purchase"}
          </span>
        </div>
        <span className="text-lg font-semibold text-white">
          {formatPrice(price.unitAmount)}
        </span>
      </div>

      {/* Price breakdown */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-second_text font-light">Subtotal</span>
          <span className="text-white">{formatPrice(price.unitAmount)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-second_text font-light">Processing Fee</span>
          <span className="text-white">$0.00</span>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center pt-4 border-t border-white/20">
          <span className="text-xl font-bold text-white">Total</span>
          <span className="text-xl font-bold text-white">
            {formatPrice(price.unitAmount)}
            {isRecurring && `/${formatInterval(price.interval!).charAt(0)}`}
          </span>
        </div>
      </div>

      {/* Features */}
      {planData.features.length > 0 && (
        <div className="bg-[#0b0b0b] p-4 rounded-lg border border-white/5">
          <h3 className="text-sm font-medium text-accent mb-3 uppercase tracking-widest">
            What&apos;s Included
          </h3>
          <ul className="space-y-2.5">
            {planData.features.slice(0, 6).map((feature) => (
              <li className="flex items-start gap-2 text-sm" key={feature}>
                <IoCheckmarkCircle className="size-[18px] text-accent shrink-0 mt-0.5" />
                <span className="text-gray-300 font-light">{feature}</span>
              </li>
            ))}
            {planData.features.length > 6 && (
              <li className="text-xs text-light_text pt-1 font-light">
                +{planData.features.length - 6} more features
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Trial notice */}
      {price.trialPeriodDays && price.trialPeriodDays > 0 && (
        <div className="bg-[#0b0b0b] rounded-lg p-3 border border-white/10">
          <p className="text-sm text-second_text font-light">
            <span className="text-green-400 font-medium">Free trial:</span>{" "}
            You&apos;ll be charged after {price.trialPeriodDays} day
            {price.trialPeriodDays !== 1 ? "s" : ""}. Cancel anytime before then
            at no cost.
          </p>
        </div>
      )}

      {/* Security note */}
      <p className="text-xs text-light_text text-center font-light">
        Secured by Stripe. Your payment details are encrypted and never stored
        on our servers.
      </p>
    </div>
  );
}

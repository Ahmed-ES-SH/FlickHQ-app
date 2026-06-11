////////////////////////////////////////////////////////////////////////////////
///////// Helper functions for the Pricing page ///////////////////////////////
////////////////////////////////////////////////////////////////////////////////

import type {
  PlanResponseDto,
  PriceResponseDto,
} from "@/app/types/subscriptions";
import {
  BillingRecurringInterval,
  BillingPriceType,
} from "@/app/types/subscriptions";

/**
 * Pick the first active recurring price matching the given interval.
 */
export function pickPrice(
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

/**
 * Resolve the active price for a plan based on the billing cycle.
 * Falls back to monthly price if annual is requested but not available.
 */
export function resolvePrice(
  prices: PriceResponseDto[],
  isAnnual: boolean,
): PriceResponseDto | undefined {
  const preferred = isAnnual
    ? pickPrice(prices, BillingRecurringInterval.YEAR)
    : pickPrice(prices, BillingRecurringInterval.MONTH);
  return (
    preferred ??
    (isAnnual ? pickPrice(prices, BillingRecurringInterval.MONTH) : undefined)
  );
}

/**
 * Calculate annual savings percentage from the first plan that has both prices.
 * Returns null if no plan has both monthly and annual prices, or if savings is 0.
 */
export function calculateSavings(plans: PlanResponseDto[]): number | null {
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

////////////////////////////////////////////////////////////////////////////////
///////// Helper functions for checkout page //////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

import type { PlanResponseDto, PriceResponseDto } from "@/app/types/subscriptions";
import { BillingRecurringInterval } from "@/app/types/subscriptions";

/**
 * Finds the plan and price that match the given priceId.
 * Returns null if no match is found.
 */
export function findPlanAndPrice(
  plans: PlanResponseDto[],
  priceId: string,
): { plan: PlanResponseDto; price: PriceResponseDto } | null {
  for (const plan of plans) {
    const price = plan.prices.find((p) => p.id === priceId && p.active);
    if (price) return { plan, price };
  }
  return null;
}

/**
 * Formats a monetary amount in cents (minor units) to a display string.
 * Example: 1999 → "$19.99"
 */
export function formatPrice(unitAmount: number): string {
  return `$${(unitAmount / 100).toFixed(2)}`;
}

/**
 * Formats a BillingRecurringInterval enum value to a human-readable string.
 */
export function formatInterval(interval: BillingRecurringInterval): string {
  switch (interval) {
    case BillingRecurringInterval.DAY:
      return "day";
    case BillingRecurringInterval.WEEK:
      return "week";
    case BillingRecurringInterval.MONTH:
      return "month";
    case BillingRecurringInterval.YEAR:
      return "year";
    default:
      return interval;
  }
}

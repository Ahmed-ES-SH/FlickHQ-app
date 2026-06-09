"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchCurrentSubscriptionAction } from "@/app/_actions/plans";
import type { UserSubscriptionHistoryItemDto } from "@/app/types/subscriptions";
import { BillingSubscriptionStatus } from "@/app/types/subscriptions";

// ─── Status color map ──────────────────────────────

const STATUS_COLORS: Record<
  BillingSubscriptionStatus,
  { bg: string; text: string; label: string }
> = {
  [BillingSubscriptionStatus.INCOMPLETE]: {
    bg: "bg-orange-900/40",
    text: "text-orange-400",
    label: "Incomplete",
  },
  [BillingSubscriptionStatus.TRIALING]: {
    bg: "bg-blue-900/40",
    text: "text-blue-400",
    label: "Trial",
  },
  [BillingSubscriptionStatus.ACTIVE]: {
    bg: "bg-green-900/40",
    text: "text-green-400",
    label: "Active",
  },
  [BillingSubscriptionStatus.PAST_DUE]: {
    bg: "bg-yellow-900/40",
    text: "text-yellow-400",
    label: "Past Due",
  },
  [BillingSubscriptionStatus.CANCELED]: {
    bg: "bg-gray-800/40",
    text: "text-gray-400",
    label: "Canceled",
  },
  [BillingSubscriptionStatus.UNPAID]: {
    bg: "bg-red-900/40",
    text: "text-red-400",
    label: "Unpaid",
  },
  [BillingSubscriptionStatus.PAUSED]: {
    bg: "bg-gray-800/40",
    text: "text-gray-400",
    label: "Paused",
  },
  [BillingSubscriptionStatus.INCOMPLETE_EXPIRED]: {
    bg: "bg-gray-800/40",
    text: "text-gray-500",
    label: "Expired",
  },
};

// ─── Helpers ────────────────────────────────────────

function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── Component ─────────────────────────────────────

interface SubscriptionBadgeProps {
  /** If provided, skips fetching and uses this data directly. */
  subscription?: UserSubscriptionHistoryItemDto | null;
  /** Show a more compact version (icon + dot only). Default false. */
  compact?: boolean;
  /** Optional class name override. */
  className?: string;
}

export default function SubscriptionBadge({
  subscription: propSubscription,
  compact = false,
  className = "",
}: SubscriptionBadgeProps) {
  const [subscription, setSubscription] =
    useState<UserSubscriptionHistoryItemDto | null>(
      propSubscription ?? null,
    );
  const [loading, setLoading] = useState(!propSubscription);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If subscription was passed as prop, skip fetching
    if (propSubscription !== undefined) {
      setSubscription(propSubscription ?? null);
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);

    fetchCurrentSubscriptionAction()
      .then((res) => {
        if (!mounted) return;
        if (res.success) {
          setSubscription(res.data ?? null);
          setError(null);
        } else {
          setError(res.message);
        }
      })
      .catch(() => {
        if (mounted) setError("Failed to load subscription");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [propSubscription]);

  // ── Loading state ──
  if (loading) {
    return (
      <div
        className={`flex items-center gap-2 ${className}`}
      >
        <div className="w-2 h-2 rounded-full bg-gray-600 animate-pulse" />
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    );
  }

  // ── Error state ──
  if (error) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-sm text-red-400">Subscription unavailable</span>
      </div>
    );
  }

  // ── No subscription ──
  if (!subscription) {
    if (compact) {
      return (
        <Link
          href="/pricing"
          className={`inline-flex items-center gap-1.5 text-sm text-accent hover:underline ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-accent" />
          Subscribe
        </Link>
      );
    }

    return (
      <div
        className={`flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 ${className}`}
      >
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-gray-600" />
          <span className="text-sm text-gray-400">No active subscription</span>
        </div>
        <Link
          href="/pricing"
          className="text-sm text-accent hover:underline font-medium"
        >
          View Plans →
        </Link>
      </div>
    );
  }

  // ── Active subscription ──
  const colors = STATUS_COLORS[subscription.status] ?? STATUS_COLORS.canceled;

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 text-sm ${className}`}>
        <span
          className={`w-2 h-2 rounded-full ${colors.bg.replace("/40", "/80")}`}
          style={{ backgroundColor: colors.text.replace("text-", "bg-") }}
        />
        <span className="text-gray-300">{subscription.planName}</span>
        <span className={`text-xs px-1.5 py-0.5 rounded ${colors.bg} ${colors.text}`}>
          {colors.label}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border border-glass_border bg-fourth_color p-4 ${className}`}
    >
      <div className="flex items-start justify-between flex-wrap gap-3">
        {/* Plan info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-white font-semibold text-lg truncate">
              {subscription.planName}
            </h4>
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}
            >
              {colors.label}
            </span>
          </div>

          {/* Price & period */}
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-300 flex-wrap">
            <span>
              {formatAmount(
                subscription.priceUnitAmount ?? 0,
                subscription.priceCurrency ?? "USD",
              )}
              {subscription.priceInterval
                ? ` / ${subscription.priceInterval}`
                : ""}
            </span>
            {subscription.currentPeriodStart && subscription.currentPeriodEnd && (
              <span>
                {formatDate(subscription.currentPeriodStart)} –{" "}
                {formatDate(subscription.currentPeriodEnd)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Warnings */}
      {subscription.status === BillingSubscriptionStatus.TRIALING &&
        subscription.trialEnd && (
          <p className="text-xs text-blue-400 mt-2">
            Trial ends {formatDate(subscription.trialEnd)}
          </p>
        )}

      {subscription.cancelAtPeriodEnd && (
        <p className="text-xs text-yellow-400 mt-2">
          Canceled — access until {formatDate(subscription.currentPeriodEnd)}
        </p>
      )}
    </div>
  );
}

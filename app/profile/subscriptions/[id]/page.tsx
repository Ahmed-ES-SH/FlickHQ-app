"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  fetchSubscriptionTimelineAction,
  fetchCurrentSubscriptionAction,
} from "@/app/_actions/plans";
import { useAuthStore } from "@/app/_stores/authStore";
import type {
  SubscriptionHistoryResponseDto,
  UserSubscriptionHistoryItemDto,
} from "@/app/types/subscriptions";
import { BillingSubscriptionStatus } from "@/app/types/subscriptions";
import ManageSubscriptionButton from "@/app/_components/_profile/ManageSubscriptionButton";

// ─── Status color map ──────────────────────────────

const STATUS_COLORS: Record<
  BillingSubscriptionStatus,
  { dot: string; bg: string; text: string; label: string }
> = {
  [BillingSubscriptionStatus.INCOMPLETE]: {
    dot: "bg-orange-500",
    bg: "bg-orange-900/20",
    text: "text-orange-400",
    label: "Incomplete",
  },
  [BillingSubscriptionStatus.TRIALING]: {
    dot: "bg-blue-500",
    bg: "bg-blue-900/20",
    text: "text-blue-400",
    label: "Trial",
  },
  [BillingSubscriptionStatus.ACTIVE]: {
    dot: "bg-green-500",
    bg: "bg-green-900/20",
    text: "text-green-400",
    label: "Active",
  },
  [BillingSubscriptionStatus.PAST_DUE]: {
    dot: "bg-yellow-500",
    bg: "bg-yellow-900/20",
    text: "text-yellow-400",
    label: "Past Due",
  },
  [BillingSubscriptionStatus.CANCELED]: {
    dot: "bg-gray-500",
    bg: "bg-gray-800/20",
    text: "text-gray-400",
    label: "Canceled",
  },
  [BillingSubscriptionStatus.UNPAID]: {
    dot: "bg-red-500",
    bg: "bg-red-900/20",
    text: "text-red-400",
    label: "Unpaid",
  },
  [BillingSubscriptionStatus.PAUSED]: {
    dot: "bg-gray-500",
    bg: "bg-gray-800/20",
    text: "text-gray-400",
    label: "Paused",
  },
  [BillingSubscriptionStatus.INCOMPLETE_EXPIRED]: {
    dot: "bg-gray-500",
    bg: "bg-gray-800/20",
    text: "text-gray-500",
    label: "Expired",
  },
};

// ─── Helpers ────────────────────────────────────────

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Skeleton ───────────────────────────────────────

function TimelineSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="w-3 h-3 mt-1.5 rounded-full bg-gray-700 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-fourth_color rounded w-3/4" />
            <div className="h-3 bg-fourth_color rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Props ──────────────────────────────────────────

type Props = {
  params: Promise<{ id: string }>;
};

// ─── Page ───────────────────────────────────────────

export default function SubscriptionTimelinePage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);

  const [timeline, setTimeline] = useState<SubscriptionHistoryResponseDto[]>(
    [],
  );
  const [subscription, setSubscription] =
    useState<UserSubscriptionHistoryItemDto | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/signin");
      return;
    }

    if (!user) return;

    let mounted = true;

    async function load() {
      setPageLoading(true);
      setError(null);

      try {
        const [timelineRes, currentRes] = await Promise.all([
          fetchSubscriptionTimelineAction(id),
          fetchCurrentSubscriptionAction(),
        ]);

        if (!mounted) return;

        if (timelineRes.success && timelineRes.data) {
          setTimeline(timelineRes.data);
        } else {
          setError(
            timelineRes.message || "Failed to load subscription timeline.",
          );
        }

        // Try to find the matching subscription in current to show details
        if (currentRes.success && currentRes.data && currentRes.data.id === id) {
          setSubscription(currentRes.data);
        } else {
          // Try to get it from history — we can't directly, so we set a minimal object
          // from the timeline if available
        }
      } catch {
        if (mounted) setError("An unexpected error occurred.");
      } finally {
        if (mounted) setPageLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [id, user, loading, router]);

  // ── Auth guard loading ──
  if (loading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  if (!user) return null;

  // ── Main content ──
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full h-full p-4 lg:p-8"
    >
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/profile/subscriptions"
          className="text-sm text-accent hover:underline inline-flex items-center gap-1 mb-2"
        >
          <svg
            className="size-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          Back to Subscriptions
        </Link>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">
          Subscription Timeline
        </h1>
        <p className="text-gray-400 mt-1 text-sm">
          Status changes and history for this subscription.
        </p>
      </div>

      {/* Error state */}
      {error && !pageLoading && (
        <div className="rounded-xl border border-glass_border bg-fourth_color p-8 text-center">
          <p className="text-red-400 mb-3">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-accent text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading state */}
      {pageLoading && (
        <div className="rounded-xl border border-glass_border bg-fourth_color p-6">
          <TimelineSkeleton />
        </div>
      )}

      {/* Timeline */}
      {!pageLoading && !error && timeline.length === 0 && (
        <div className="rounded-xl border border-glass_border bg-fourth_color p-8 text-center">
          <p className="text-gray-400">No timeline entries found.</p>
        </div>
      )}

      {!pageLoading && !error && timeline.length > 0 && (
        <div className="rounded-xl border border-glass_border bg-fourth_color p-6">
          {/* Subscription info summary */}
          {subscription && (
            <div className="mb-6 pb-4 border-b border-glass_border">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white font-semibold text-lg">
                  {subscription.planName}
                </span>
                <StatusBadge status={subscription.status} />
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-400 mt-2">
                <span>
                  Period: {formatDate(subscription.currentPeriodStart)} –{" "}
                  {formatDate(subscription.currentPeriodEnd)}
                </span>
                {subscription.trialEnd && (
                  <span>Trial ends: {formatDate(subscription.trialEnd)}</span>
                )}
                {subscription.cancelAtPeriodEnd && (
                  <span className="text-yellow-400">
                    Canceled — access until{" "}
                    {formatDate(subscription.currentPeriodEnd)}
                  </span>
                )}
              </div>
              <div className="mt-3">
                <ManageSubscriptionButton variant="outline" />
              </div>
            </div>
          )}

          {/* Timeline entries */}
          <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">
            Status Changes
          </h3>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[5px] top-2 bottom-2 w-0.5 bg-glass_border" />

            <div className="space-y-6">
              {timeline.map((entry, index) => {
                const prevColors =
                  STATUS_COLORS[entry.previousStatus as BillingSubscriptionStatus] ??
                  STATUS_COLORS[BillingSubscriptionStatus.INCOMPLETE];
                const newColors =
                  STATUS_COLORS[entry.newStatus as BillingSubscriptionStatus] ??
                  STATUS_COLORS[BillingSubscriptionStatus.ACTIVE];
                const isFirst = index === 0;

                return (
                  <div
                    key={entry.id || index}
                    className="relative flex gap-4 pl-6"
                  >
                    {/* Dot */}
                    <div
                      className={`absolute left-0 top-1.5 w-[11px] h-[11px] rounded-full ring-2 ring-fourth_color ${
                        isFirst ? newColors.dot : "bg-gray-600"
                      }`}
                    />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-white">
                          {entry.previousStatus} → {entry.newStatus}
                        </span>
                        {isFirst && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/20 text-accent font-medium">
                            Latest
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${prevColors.bg} ${prevColors.text}`}
                        >
                          {prevColors.label}
                        </span>
                        <svg
                          className="size-4 text-gray-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                          />
                        </svg>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${newColors.bg} ${newColors.text}`}
                        >
                          {newColors.label}
                        </span>
                      </div>
                      {entry.reason && (
                        <p className="text-xs text-gray-500 mt-1">
                          Reason: {entry.reason}
                        </p>
                      )}
                      <p className="text-xs text-gray-600 mt-0.5">
                        {formatDateTime(entry.occurredAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ─── StatusBadge sub-component ─────────────────────

function StatusBadge({
  status,
}: {
  status: BillingSubscriptionStatus;
}) {
  const colors = STATUS_COLORS[status] ?? STATUS_COLORS[BillingSubscriptionStatus.INCOMPLETE];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {colors.label}
    </span>
  );
}

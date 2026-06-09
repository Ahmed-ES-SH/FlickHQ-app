"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  fetchSubscriptionHistoryAction,
  fetchCurrentSubscriptionAction,
} from "@/app/_actions/plans";
import { useAuthStore } from "@/app/_stores/authStore";
import type { UserSubscriptionHistoryItemDto } from "@/app/types/subscriptions";
import { BillingSubscriptionStatus } from "@/app/types/subscriptions";
import Pagination from "@/app/_components/_globalComponents/Pagination";
import SubscriptionBadge from "@/app/_components/_globalComponents/SubscriptionBadge";
import ManageSubscriptionButton from "@/app/_components/_profile/ManageSubscriptionButton";

// ─── Status badge config ───────────────────────────

const STATUS_BADGE: Record<
  BillingSubscriptionStatus,
  { bg: string; text: string; label: string }
> = {
  [BillingSubscriptionStatus.INCOMPLETE]: {
    bg: "bg-orange-900/50",
    text: "text-orange-400",
    label: "Incomplete",
  },
  [BillingSubscriptionStatus.TRIALING]: {
    bg: "bg-blue-900/50",
    text: "text-blue-400",
    label: "Trial",
  },
  [BillingSubscriptionStatus.ACTIVE]: {
    bg: "bg-green-900/50",
    text: "text-green-400",
    label: "Active",
  },
  [BillingSubscriptionStatus.PAST_DUE]: {
    bg: "bg-yellow-900/50",
    text: "text-yellow-400",
    label: "Past Due",
  },
  [BillingSubscriptionStatus.CANCELED]: {
    bg: "bg-gray-800/50",
    text: "text-gray-400",
    label: "Canceled",
  },
  [BillingSubscriptionStatus.UNPAID]: {
    bg: "bg-red-900/50",
    text: "text-red-400",
    label: "Unpaid",
  },
  [BillingSubscriptionStatus.PAUSED]: {
    bg: "bg-gray-800/50",
    text: "text-gray-400",
    label: "Paused",
  },
  [BillingSubscriptionStatus.INCOMPLETE_EXPIRED]: {
    bg: "bg-gray-800/50",
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

// ─── Skeleton ───────────────────────────────────────

function TableSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-14 bg-fourth_color rounded-lg border border-glass_border"
        />
      ))}
    </div>
  );
}

// ─── Page ───────────────────────────────────────────

export default function SubscriptionHistoryPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);

  const [subscriptions, setSubscriptions] = useState<
    UserSubscriptionHistoryItemDto[]
  >([]);
  const [currentSubscription, setCurrentSubscription] =
    useState<UserSubscriptionHistoryItemDto | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  const fetchData = useCallback(async () => {
    setPageLoading(true);
    setError(null);

    try {
      const [historyRes, currentRes] = await Promise.all([
        fetchSubscriptionHistoryAction(page, limit),
        fetchCurrentSubscriptionAction(),
      ]);

      if (historyRes.success && historyRes.data) {
        setSubscriptions(historyRes.data);
        if (historyRes.meta) {
          setTotalPages(historyRes.meta.lastPage ?? 1);
        }
      } else {
        setError(historyRes.message || "Failed to load subscription history.");
      }

      if (currentRes.success) {
        setCurrentSubscription(currentRes.data ?? null);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setPageLoading(false);
    }
  }, [page]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/signin");
      return;
    }
    if (user) fetchData();
  }, [user, loading, fetchData, router]);

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
        <h1 className="text-2xl lg:text-3xl font-bold text-white">
          Subscriptions
        </h1>
        <p className="text-gray-400 mt-1 text-sm">
          View your subscription history and manage your plan.
        </p>
      </div>

      {/* Current subscription card */}
      {currentSubscription && (
        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-2">
            Current Subscription
          </h2>
          <SubscriptionBadge
            subscription={currentSubscription}
            className="mb-3"
          />
          <ManageSubscriptionButton variant="outline" />
        </div>
      )}

      {/* History section */}
      <div className="rounded-xl border border-glass_border bg-fourth_color overflow-hidden">
        <div className="px-4 py-3 border-b border-glass_border">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
            Subscription History
          </h2>
        </div>

        {/* Error state */}
        {error && !pageLoading && (
          <div className="p-8 text-center">
            <p className="text-red-400 mb-3">{error}</p>
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-accent text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading state */}
        {pageLoading && <div className="p-4"><TableSkeleton /></div>}

        {/* Empty state */}
        {!pageLoading && !error && subscriptions.length === 0 && (
          <div className="p-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <svg
                className="size-12 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"
                />
              </svg>
              <p className="text-gray-400">No subscription history found.</p>
              <Link
                href="/pricing"
                className="text-accent hover:underline text-sm font-medium"
              >
                View Plans →
              </Link>
            </div>
          </div>
        )}

        {/* Table */}
        {!pageLoading && !error && subscriptions.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-glass_border text-gray-400 text-left">
                  <th className="px-4 py-3 font-medium">Plan</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">
                    Period
                  </th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub) => {
                  const badge =
                    STATUS_BADGE[sub.status] ?? STATUS_BADGE.canceled;
                  return (
                    <tr
                      key={sub.id}
                      className="border-b border-glass_border/50 hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() =>
                        router.push(`/profile/subscriptions/${sub.id}`)
                      }
                    >
                      <td className="px-4 py-3 text-white font-medium">
                        {sub.planName}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-300 hidden sm:table-cell">
                        {formatDate(sub.currentPeriodStart)} –{" "}
                        {formatDate(sub.currentPeriodEnd)}
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {formatAmount(
                          sub.priceUnitAmount ?? 0,
                          sub.priceCurrency ?? "USD",
                        )}
                        {sub.priceInterval
                          ? `/${sub.priceInterval}`
                          : ""}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/profile/subscriptions/${sub.id}`}
                          className="text-accent hover:underline text-xs"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Timeline →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!pageLoading && !error && totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          setCurrentPage={setPage}
        />
      )}
    </motion.div>
  );
}

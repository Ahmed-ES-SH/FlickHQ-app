"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fetchPaymentHistoryAction } from "@/app/_actions/plans";
import { useAuthStore } from "@/app/_stores/authStore";
import type { UserPaymentHistoryItemDto } from "@/app/types/subscriptions";
import {
  BillingPaymentStatus,
  TransactionType,
} from "@/app/types/subscriptions";
import Pagination from "@/app/_components/_globalComponents/Pagination";

// ─── Status badge config ───────────────────────────

const PAYMENT_STATUS_BADGE: Record<
  BillingPaymentStatus,
  { bg: string; text: string; label: string }
> = {
  [BillingPaymentStatus.CHECKOUT_CREATED]: {
    bg: "bg-blue-900/50",
    text: "text-blue-400",
    label: "Checkout Created",
  },
  [BillingPaymentStatus.PENDING]: {
    bg: "bg-yellow-900/50",
    text: "text-yellow-400",
    label: "Pending",
  },
  [BillingPaymentStatus.SUCCEEDED]: {
    bg: "bg-green-900/50",
    text: "text-green-400",
    label: "Succeeded",
  },
  [BillingPaymentStatus.FAILED]: {
    bg: "bg-red-900/50",
    text: "text-red-400",
    label: "Failed",
  },
  [BillingPaymentStatus.CANCELED]: {
    bg: "bg-gray-800/50",
    text: "text-gray-400",
    label: "Canceled",
  },
  [BillingPaymentStatus.REFUNDED]: {
    bg: "bg-gray-800/50",
    text: "text-gray-400",
    label: "Refunded",
  },
  [BillingPaymentStatus.PARTIALLY_REFUNDED]: {
    bg: "bg-orange-900/50",
    text: "text-orange-400",
    label: "Partially Refunded",
  },
};

// ─── Helpers ────────────────────────────────────────

function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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

export default function PaymentHistoryPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);

  const [payments, setPayments] = useState<UserPaymentHistoryItemDto[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  const fetchData = useCallback(async () => {
    setPageLoading(true);
    setError(null);

    try {
      const res = await fetchPaymentHistoryAction(page, limit);

      if (res.success && res.data) {
        setPayments(res.data);
        if (res.meta) {
          setTotalPages(res.meta.lastPage ?? 1);
        }
      } else {
        setError(res.message || "Failed to load payment history.");
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
          Payment History
        </h1>
        <p className="text-gray-400 mt-1 text-sm">
          View all your payments, refunds, and invoices.
        </p>
      </div>

      {/* Content card */}
      <div className="rounded-xl border border-glass_border bg-fourth_color overflow-hidden">
        <div className="px-4 py-3 border-b border-glass_border">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
            Payments
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
        {!pageLoading && !error && payments.length === 0 && (
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
                  d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                />
              </svg>
              <p className="text-gray-400">No payment history found.</p>
            </div>
          </div>
        )}

        {/* Table */}
        {!pageLoading && !error && payments.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-glass_border text-gray-400 text-left">
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium hidden sm:table-cell">
                    Status
                  </th>
                  <th className="px-4 py-3 font-medium hidden md:table-cell">
                    Invoice
                  </th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => {
                  const badge =
                    PAYMENT_STATUS_BADGE[payment.status] ??
                    PAYMENT_STATUS_BADGE.pending;

                  // Determine display amount with refund indicator
                  const isRefund = payment.transactionType === TransactionType.REFUND;
                  const isPartiallyRefunded =
                    payment.status === BillingPaymentStatus.PARTIALLY_REFUNDED &&
                    payment.amountRefunded > 0;

                  return (
                    <tr
                      key={payment.id}
                      className="border-b border-glass_border/50 hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() =>
                        router.push(`/profile/payments/${payment.id}`)
                      }
                    >
                      <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                        {formatDate(payment.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-white max-w-[200px] truncate">
                        {payment.description || "Payment"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={
                            isRefund
                              ? "text-red-400"
                              : "text-gray-200"
                          }
                        >
                          {isRefund ? "-" : ""}
                          {formatAmount(payment.amount, payment.currency)}
                        </span>
                        {isPartiallyRefunded && (
                          <span className="text-xs text-orange-400 ml-1">
                            (refunded {formatAmount(payment.amountRefunded, payment.currency)})
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">
                        {payment.invoiceNumber || "—"}
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

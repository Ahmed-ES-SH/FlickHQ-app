"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { fetchPaymentDetailAction } from "@/app/_actions/plans";
import { useAuthStore } from "@/app/_stores/authStore";
import type { UserPaymentHistoryItemDto } from "@/app/types/subscriptions";
import {
  BillingPaymentStatus,
  TransactionType,
} from "@/app/types/subscriptions";

// ─── Status display config ─────────────────────────

const PAYMENT_STATUS_STYLES: Record<
  BillingPaymentStatus,
  { bg: string; text: string; label: string; icon: string }
> = {
  [BillingPaymentStatus.CHECKOUT_CREATED]: {
    bg: "bg-blue-900/30",
    text: "text-blue-400",
    label: "Checkout Created",
    icon: "◷",
  },
  [BillingPaymentStatus.PENDING]: {
    bg: "bg-yellow-900/30",
    text: "text-yellow-400",
    label: "Pending",
    icon: "◷",
  },
  [BillingPaymentStatus.SUCCEEDED]: {
    bg: "bg-green-900/30",
    text: "text-green-400",
    label: "Succeeded",
    icon: "✓",
  },
  [BillingPaymentStatus.FAILED]: {
    bg: "bg-red-900/30",
    text: "text-red-400",
    label: "Failed",
    icon: "✕",
  },
  [BillingPaymentStatus.CANCELED]: {
    bg: "bg-gray-800/30",
    text: "text-gray-400",
    label: "Canceled",
    icon: "✕",
  },
  [BillingPaymentStatus.REFUNDED]: {
    bg: "bg-gray-800/30",
    text: "text-gray-400",
    label: "Refunded",
    icon: "↩",
  },
  [BillingPaymentStatus.PARTIALLY_REFUNDED]: {
    bg: "bg-orange-900/30",
    text: "text-orange-400",
    label: "Partially Refunded",
    icon: "↩",
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

function DetailSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-fourth_color rounded w-1/3" />
      <div className="h-4 bg-fourth_color rounded w-1/2" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 bg-fourth_color rounded-lg" />
        ))}
      </div>
    </div>
  );
}

// ─── Props ──────────────────────────────────────────

type Props = {
  params: Promise<{ id: string }>;
};

// ─── Page ───────────────────────────────────────────

export default function PaymentDetailPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);

  const [payment, setPayment] = useState<UserPaymentHistoryItemDto | null>(
    null,
  );
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
        const res = await fetchPaymentDetailAction(id);

        if (!mounted) return;

        if (res.success && res.data) {
          setPayment(res.data);
        } else {
          setError(res.message || "Failed to load payment details.");
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

  // ── Error state ──
  if (error && !pageLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full h-full p-4 lg:p-8"
      >
        <Link
          href="/profile/payments"
          className="text-sm text-accent hover:underline inline-flex items-center gap-1 mb-4"
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
          Back to Payments
        </Link>
        <div className="rounded-xl border border-glass_border bg-fourth_color p-8 text-center">
          <p className="text-red-400 mb-3">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-accent text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full h-full p-4 lg:p-8"
    >
      {/* Back link */}
      <Link
        href="/profile/payments"
        className="text-sm text-accent hover:underline inline-flex items-center gap-1 mb-4"
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
        Back to Payments
      </Link>

      {/* Loading */}
      {pageLoading && (
        <div className="rounded-xl border border-glass_border bg-fourth_color p-6">
          <DetailSkeleton />
        </div>
      )}

      {/* Content */}
      {!pageLoading && payment && (
        <>
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl lg:text-3xl font-bold text-white">
                Payment Details
              </h1>
              <StatusBadge status={payment.status} />
            </div>
            <p className="text-gray-400 mt-1 text-sm">
              {payment.description || "Payment receipt"}
            </p>
          </div>

          {/* Detail card */}
          <div className="rounded-xl border border-glass_border bg-fourth_color overflow-hidden">
            {/* Receipt header */}
            <div className="p-6 border-b border-glass_border bg-gradient-to-r from-accent/5 to-transparent">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-sm text-gray-400">Total Amount</p>
                  <p className="text-3xl font-bold text-white mt-1">
                    {formatAmount(payment.amount, payment.currency)}
                  </p>
                </div>
                {payment.invoiceNumber && (
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Invoice</p>
                    <p className="text-sm text-gray-300 font-mono mt-1">
                      #{payment.invoiceNumber}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Detail rows */}
            <div className="p-6">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">
                Transaction Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                <DetailRow
                  label="Status"
                  value={<StatusBadge status={payment.status} />}
                />
                <DetailRow
                  label="Transaction Type"
                  value={
                    <span className="capitalize text-gray-200">
                      {payment.transactionType === TransactionType.REFUND
                        ? "Refund"
                        : "Charge"}
                    </span>
                  }
                />
                <DetailRow
                  label="Amount"
                  value={
                    <span className="text-gray-200 font-mono">
                      {formatAmount(payment.amount, payment.currency)}
                    </span>
                  }
                />
                <DetailRow
                  label="Currency"
                  value={
                    <span className="text-gray-200 uppercase font-mono">
                      {payment.currency}
                    </span>
                  }
                />
                <DetailRow
                  label="Date"
                  value={
                    <span className="text-gray-200">
                      {formatDateTime(payment.createdAt)}
                    </span>
                  }
                />
                {payment.invoiceNumber && (
                  <DetailRow
                    label="Invoice Number"
                    value={
                      <span className="text-gray-200 font-mono">
                        #{payment.invoiceNumber}
                      </span>
                    }
                  />
                )}
                <DetailRow
                  label="Description"
                  value={
                    <span className="text-gray-200">
                      {payment.description || "—"}
                    </span>
                  }
                />
                {payment.subscriptionId && (
                  <DetailRow
                    label="Linked Subscription"
                    value={
                      <Link
                        href={`/profile/subscriptions/${payment.subscriptionId}`}
                        className="text-accent hover:underline text-sm"
                      >
                        View Subscription →
                      </Link>
                    }
                  />
                )}
              </div>

              {/* Refund section */}
              {payment.amountRefunded > 0 && (
                <div className="mt-6 pt-4 border-t border-glass_border">
                  <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-3">
                    Refund Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                    <DetailRow
                      label="Amount Refunded"
                      value={
                        <span className="text-red-400 font-mono">
                          -{formatAmount(payment.amountRefunded, payment.currency)}
                        </span>
                      }
                    />
                    {payment.status ===
                      BillingPaymentStatus.PARTIALLY_REFUNDED && (
                      <DetailRow
                        label="Remaining Charge"
                        value={
                          <span className="text-gray-200 font-mono">
                            {formatAmount(
                              payment.amount - payment.amountRefunded,
                              payment.currency,
                            )}
                          </span>
                        }
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
}

// ─── Sub-components ─────────────────────────────────

function StatusBadge({ status }: { status: BillingPaymentStatus }) {
  const style = PAYMENT_STATUS_STYLES[status] ?? PAYMENT_STATUS_STYLES.pending;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${style.bg} ${style.text}`}
    >
      <span>{style.icon}</span>
      {style.label}
    </span>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs text-gray-500 uppercase tracking-wide">
        {label}
      </span>
      <div className="text-sm">{value}</div>
    </div>
  );
}

"use client";

import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  LuTv,
  LuSmartphone,
  LuLaptop,
  LuCreditCard,
  LuExternalLink,
  LuUser,
  LuZap,
  LuCrown,
  LuArrowRight,
  LuLoader,
  LuTriangleAlert,
  LuCalendar,
  LuReceipt,
} from "react-icons/lu";
import { IoCheckmarkCircle } from "react-icons/io5";
import { useAuthStore } from "@/app/_stores/authStore";
import { useSubscriptionStore, isFreeSubscription } from "@/app/_stores/subscriptionStore";
import SubscriptionSuggestions from "@/app/_components/_website/_userpanal/SubscriptionSuggestions";
import Pagination from "@/app/_components/_globalComponents/Pagination";
import type { UserPaymentHistoryItemDto } from "@/app/types/subscriptions";
import { BillingPaymentStatus, TransactionType } from "@/app/types/subscriptions";
import { comingSoonToast } from "@/app/_helpers/helpers";

// ─── Helpers ───────────────────────────────────────

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

// ─── Status badge config ───────────────────────────

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

// ─── Animation wrapper ─────────────────────────────

function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── Stat Card ─────────────────────────────────────

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center p-4 bg-fourth_color rounded-lg border border-white/5 min-w-[120px]">
      <span className="text-xl font-bold text-accent">{value}</span>
      <span className="text-[11px] text-second_text uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

// ─── Benefit Item ──────────────────────────────────

function BenefitItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 text-[13px] text-gray-200">
      <IoCheckmarkCircle className="size-4 text-accent shrink-0" />
      {text}
    </div>
  );
}

// ─── Device Item ───────────────────────────────────

function DeviceItem({
  icon,
  name,
  detail,
}: {
  icon: React.ReactNode;
  name: string;
  detail: string;
}) {
  return (
    <div className="py-4 flex justify-between items-center border-b border-white/5 last:border-0">
      <div className="flex items-center gap-4">
        <span className="text-accent p-2 bg-fourth_color rounded">{icon}</span>
        <div>
          <p className="text-sm text-white font-medium">{name}</p>
          <p className="text-[11px] text-second_text">{detail}</p>
        </div>
      </div>
      <button className="text-xs text-accent font-medium hover:underline">
        Logout
      </button>
    </div>
  );
}

// ─── Payment Status Badge ──────────────────────────

function PaymentStatusBadge({ status }: { status: BillingPaymentStatus }) {
  const style = PAYMENT_STATUS_STYLES[status] ?? PAYMENT_STATUS_STYLES[BillingPaymentStatus.PENDING];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${style.bg} ${style.text}`}
    >
      <span className="text-xs">{style.icon}</span>
      {style.label}
    </span>
  );
}

// ─── Payment Table Skeleton ────────────────────────

function PaymentTableSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-12 bg-fourth_color rounded-lg border border-white/5"
        />
      ))}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────

export default function SubscriptionPage() {
  const user = useAuthStore((s) => s.user);
  const subscription = useSubscriptionStore((s) => s.subscription);
  const subLoading = useSubscriptionStore((s) => s.loading);

  const [portalLoading] = useState(false);
  const [cancelLoading] = useState(false);

  // ── Payment history state ──────────────────────────
  /** Static fallback payment data — placeholder until the real API is wired up. */
  const PAYMENTS_LIMIT = 20;

  const staticPayments: UserPaymentHistoryItemDto[] = useMemo(
    () => [
      {
        id: "pi_static_001",
        amount: 1499,
        amountRefunded: 0,
        currency: "usd",
        status: BillingPaymentStatus.SUCCEEDED,
        transactionType: TransactionType.CHARGE,
        invoiceNumber: "INV-001",
        description: "Premium Monthly — Jun 2026",
        subscriptionId: "sub_static_001",
        createdAt: "2026-06-01T10:30:00Z",
      },
      {
        id: "pi_static_002",
        amount: 1499,
        amountRefunded: 0,
        currency: "usd",
        status: BillingPaymentStatus.SUCCEEDED,
        transactionType: TransactionType.CHARGE,
        invoiceNumber: "INV-002",
        description: "Premium Monthly — May 2026",
        subscriptionId: "sub_static_001",
        createdAt: "2026-05-01T09:15:00Z",
      },
      {
        id: "pi_static_003",
        amount: 1499,
        amountRefunded: 1499,
        currency: "usd",
        status: BillingPaymentStatus.REFUNDED,
        transactionType: TransactionType.REFUND,
        invoiceNumber: "INV-003",
        description: "Premium Monthly — Apr 2026 (Refund)",
        subscriptionId: "sub_static_001",
        createdAt: "2026-04-01T08:00:00Z",
      },
      {
        id: "pi_static_004",
        amount: 1499,
        amountRefunded: 0,
        currency: "usd",
        status: BillingPaymentStatus.PENDING,
        transactionType: TransactionType.CHARGE,
        invoiceNumber: "INV-004",
        description: "Premium Monthly — Mar 2026",
        subscriptionId: "sub_static_001",
        createdAt: "2026-03-01T12:45:00Z",
      },
      {
        id: "pi_static_005",
        amount: 1499,
        amountRefunded: 0,
        currency: "usd",
        status: BillingPaymentStatus.SUCCEEDED,
        transactionType: TransactionType.CHARGE,
        invoiceNumber: "INV-005",
        description: "Premium Monthly — Feb 2026",
        subscriptionId: "sub_static_001",
        createdAt: "2026-02-01T15:20:00Z",
      },
    ],
    [],
  );

  /** Currently displayed payments (starts as static data). */
  const [payments, setPayments] = useState<UserPaymentHistoryItemDto[]>(staticPayments);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsError, setPaymentsError] = useState<string | null>(null);
  const [paymentPage, setPaymentPage] = useState(1);
  const [paymentTotalPages, setPaymentTotalPages] = useState(1);
  /** Separate store for the 2 most recent payments (used in sidebar mini-list).
   *  Fetched once on initial load so the mini-list always shows the latest
   *  payments regardless of which table page the user is on. */
  const [recentPayments, setRecentPayments] = useState<UserPaymentHistoryItemDto[]>([]);

  const isFree = useMemo(() => isFreeSubscription(subscription), [subscription]);
  const planCode = subscription?.plan?.code ?? "free";
  const planName = subscription?.plan?.name ?? "Free";
  const planIcon = subscription?.plan?.icon;
  const planFeatures = subscription?.plan?.features ?? [];
  const subStatus = subscription?.status ?? "free";
  const isActive = subStatus === "active";
  const isTrialing = subStatus === "trialing";
  const isCancelScheduled = subscription?.cancelAtPeriodEnd ?? false;

  // ── Derived user values ──────────────────────────

  const displayName = useMemo(
    () => user?.name ?? user?.email?.split("@")[0] ?? "User",
    [user],
  );

  const memberSince = useMemo(
    () =>
      user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })
        : "—",
    [user?.createdAt],
  );

  const avatarLetter = useMemo(
    () => (displayName?.[0] ?? "U").toUpperCase(),
    [displayName],
  );

  // ── Use static payment data ───────────────────────
  // Real API integration coming soon — using static data for now
  useEffect(() => {
    if (!isFree) {
      setPayments(staticPayments);
      setRecentPayments(staticPayments.slice(0, 2));
      setPaymentsLoading(false);
    } else {
      setPaymentsLoading(false);
    }
  }, [isFree, staticPayments]);

  // ── Handlers ─────────────────────────────────────

  const handleManagePayment = () => {
    comingSoonToast("Payment management");
  };

  const handleCancelSubscription = () => {
    comingSoonToast("Subscription cancellation");
  };

  // ── Loading state ────────────────────────────────

  if (!user || subLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LuLoader className="size-8 text-accent animate-spin" />
      </div>
    );
  }

  // ── Render ───────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* ── Profile Overview ───────────────────────── */}
      <FadeIn delay={0}>
        <div className="bg-panel_bg border border-white/5 p-5 rounded-xl flex flex-col md:flex-row justify-between items-center gap-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-accent bg-fourth_color flex items-center justify-center">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={displayName}
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-3xl text-gray-600 font-bold">
                    {avatarLetter}
                  </span>
                )}
              </div>
              {/* Plan badge */}
              {!isFree ? (
                <span className="absolute -bottom-2 -right-2 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                  PRO
                </span>
              ) : null}
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white">
                {displayName}
              </h1>
              <p className="text-sm text-second_text">
                Member since {memberSince}
              </p>
            </div>
          </div>

          <div className="flex gap-4 w-full md:w-auto overflow-x-auto">
            <StatCard value="42" label="Movies Watched" />
            <StatCard value="18" label="Series Binged" />
            <StatCard value="187h" label="Total Time" />
          </div>
        </div>
      </FadeIn>

      {/* ── Main Grid ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ── Left (2/3) ─────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Current Plan */}
          <FadeIn delay={0.1}>
            <div className="bg-panel_bg border border-white/5 p-5 rounded-xl space-y-5 relative overflow-hidden">
              {/* Plan Header */}
              <div className="flex justify-between items-start flex-wrap gap-3">
                <div>
                  <span className="text-[11px] text-accent font-bold tracking-[0.2em] uppercase">
                    Current Plan
                  </span>
                  <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
                    {planIcon ? (
                      <span className="mr-2">{planIcon}</span>
                    ) : null}
                    {planName}
                  </h2>
                  {isCancelScheduled && (
                    <p className="text-xs text-secondery flex items-center gap-1 mt-1">
                      <LuTriangleAlert className="size-3.5" />
                      Cancels at period end —{" "}
                      {subscription?.periodEnd
                        ? new Date(subscription.periodEnd).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "soon"}
                    </p>
                  )}
                  {isTrialing && subscription?.trialEnd && (
                    <p className="text-xs text-blue-400 flex items-center gap-1 mt-1">
                      <LuCalendar className="size-3.5" />
                      Trial ends{" "}
                      {new Date(subscription.trialEnd).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
                {isActive ? (
                  <span className="bg-accent text-white px-3 py-1 rounded-full text-xs font-bold uppercase shrink-0">
                    Active
                  </span>
                ) : isFree ? (
                  <span className="bg-fourth_color text-second_text px-3 py-1 rounded-full text-xs font-bold uppercase border border-white/10 shrink-0">
                    Free
                  </span>
                ) : (
                  <span className="bg-secondery/20 text-secondery px-3 py-1 rounded-full text-xs font-bold uppercase shrink-0">
                    {subStatus}
                  </span>
                )}
              </div>

              {/* ── Plan Features (Standalone Section) ── */}
              <div className="space-y-3">
                <span className="text-xs text-second_text uppercase tracking-wider font-medium">
                  Plan Features
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {planFeatures.length > 0 ? (
                    planFeatures.map((feat) => (
                      <BenefitItem key={feat} text={feat} />
                    ))
                  ) : (
                    <p className="text-[13px] text-second_text col-span-full">
                      No features listed
                    </p>
                  )}
                </div>
              </div>

              {/* Free plan upgrade prompt */}
              {isFree && (
                <div className="bg-gradient-to-r from-accent/10 to-purble/10 p-4 rounded-lg border border-accent/20">
                  <div className="flex items-start gap-3">
                    <LuZap className="size-5 text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Unlock the full experience
                      </p>
                      <p className="text-xs text-second_text mt-1">
                        Upgrade to a paid plan and get ad-free 4K
                        streaming, offline downloads, multi-device support,
                        and more.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Usage Insights (separate card) ──── */}
              <div className="bg-main_bg/40 p-4 rounded-lg border border-white/5">
                <span className="text-xs text-second_text uppercase block mb-3">
                  Usage Insights
                </span>
                <div className="space-y-3">
                  {/* Mini bar chart */}
                  <div className="flex items-end gap-2 h-20">
                    {[40, 60, 90, 75, 45].map((h, i) => (
                      <div
                        key={i}
                        className="w-full rounded-t transition-all duration-500"
                        style={{
                          height: `${h}%`,
                          backgroundColor:
                            h >= 75
                              ? "var(--accent)"
                              : h >= 50
                                ? "rgba(229,9,20,0.6)"
                                : "rgba(229,9,20,0.25)",
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-second_text">
                    <span>
                      Most Watched:{" "}
                      <strong className="text-white">—</strong>
                    </span>
                    <span>
                      Data: <strong className="text-white">—</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          {/* Active Devices (placeholder — no backend data yet) */}
          <FadeIn delay={0.15}>
            <div className="bg-panel_bg border border-white/5 p-5 rounded-xl space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">
                  Active Devices
                </h3>
                {isFree ? (
                  <span className="text-xs text-second_text">
                    Available on paid plans
                  </span>
                ) : (
                  <span className="text-xs text-second_text">
                    0 of — concurrent streams active
                  </span>
                )}
              </div>
              {isFree ? (
                <div className="py-6 text-center text-sm text-second_text">
                  <p>Upgrade to a paid plan to manage your devices.</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  <DeviceItem
                    icon={<LuTv className="size-5" />}
                    name="Living Room TV"
                    detail="Sony Bravia 4K • Active Now"
                  />
                  <DeviceItem
                    icon={<LuSmartphone className="size-5" />}
                    name="iPhone"
                    detail="iPhone • Last used 2h ago"
                  />
                  <DeviceItem
                    icon={<LuLaptop className="size-5" />}
                    name="Laptop"
                    detail='MacBook Pro • Last used 1d ago'
                  />
                </div>
              )}
            </div>
          </FadeIn>
        </div>

        {/* ── Right (1/3) — Billing Sidebar ──────── */}
        {isFree ? (
          /* ── Free user: show upgrade prompt instead of billing ── */
          <aside className="space-y-5">
            <FadeIn delay={0.2}>
              <div className="bg-panel_bg border border-white/5 p-5 rounded-xl space-y-4 text-center">
                <div className="text-4xl mb-2">🎬</div>
                <h3 className="text-lg font-semibold text-white">
                  Free Plan
                </h3>
                <p className="text-sm text-second_text">
                  You&apos;re currently on the Free plan. Upgrade to unlock
                  premium features, ad-free streaming, and multi-device support.
                </p>
                <button
                  onClick={() => {
                    document
                      .getElementById("upgrade-plans-section")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full bg-accent hover:bg-red-700 text-white py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2"
                >
                  <LuCrown className="size-4" />
                  View Plans
                  <LuArrowRight className="size-4" />
                </button>
              </div>
            </FadeIn>
          </aside>
        ) : (
          /* ── Paid user: show billing sidebar ─────── */
          <aside className="space-y-5">
            <FadeIn delay={0.2}>
              {/* Next Payment */}
              <div className="bg-panel_bg border border-white/5 p-5 rounded-xl space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  {isCancelScheduled ? "Subscription Ends" : "Next Payment"}
                </h3>
                {subscription?.periodEnd ? (
                  <>
                    <div className="flex justify-between items-baseline">
                      <span className="text-3xl font-bold text-white">
                        —
                      </span>
                      <span className="text-sm text-second_text">
                        {isCancelScheduled ? "Ends" : "Due"}{" "}
                        {new Date(subscription.periodEnd).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric", year: "numeric" },
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 bg-fourth_color rounded-lg border border-white/5">
                      <LuCreditCard className="size-5 text-accent" />
                      <span className="text-sm text-white">
                        {user?.stripeCustomerId ? "Stripe ••••" : "No card on file"}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-second_text">
                    No upcoming payments scheduled.
                  </p>
                )}

                {/* Manage Payment button */}
                <button
                  onClick={handleManagePayment}
                  disabled={portalLoading}
                  className="w-full bg-accent hover:bg-red-700 text-white py-2.5 rounded-lg text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {portalLoading ? (
                    <>
                      <LuLoader className="size-4 animate-spin" />
                      Opening…
                    </>
                  ) : (
                    "Manage Payment"
                  )}
                </button>

                {/* Cancel Subscription button */}
                {!isCancelScheduled && (
                  <button
                    onClick={handleCancelSubscription}
                    disabled={cancelLoading}
                    className="w-full bg-fourth_color hover:bg-red-900/30 transition-colors text-red-400 hover:text-red-300 py-2.5 rounded-lg text-sm font-medium border border-red-900/20 hover:border-red-700/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {cancelLoading ? (
                      <>
                        <LuLoader className="size-4 animate-spin" />
                        Opening…
                      </>
                    ) : (
                      <>
                        <LuTriangleAlert className="size-4" />
                        Cancel Subscription
                      </>
                    )}
                  </button>
                )}

                {/* Reactivate button (when cancel is scheduled) */}
                {isCancelScheduled && (
                  <button
                    onClick={handleManagePayment}
                    disabled={portalLoading}
                    className="w-full bg-secondery/20 hover:bg-secondery/30 transition-colors text-secondery py-2.5 rounded-lg text-sm font-bold border border-secondery/20 flex items-center justify-center gap-2"
                  >
                    <LuZap className="size-4" />
                    Reactivate Subscription
                  </button>
                )}
              </div>
            </FadeIn>

            {/* Quick payment history mini-list (last 2 payments) */}
            {recentPayments.length > 0 && (
              <FadeIn delay={0.25}>
                <div className="bg-panel_bg border border-white/5 p-5 rounded-xl space-y-3">
                  <h3 className="text-xs uppercase tracking-widest text-second_text font-medium">
                    Recent Payments
                  </h3>
                  {recentPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex justify-between items-center p-2.5 hover:bg-white/5 rounded-lg transition-colors"
                    >
                      <div>
                        <p className="text-sm text-white font-medium">
                          {formatDate(payment.createdAt)}
                        </p>
                        <PaymentStatusBadge status={payment.status} />
                      </div>
                      <span className="text-sm font-semibold text-white">
                        {formatAmount(payment.amount, payment.currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </FadeIn>
            )}
          </aside>
        )}
      </div>

      {/* ── Payment History Table (Full Width) ───────── */}
      {!isFree && (
        <FadeIn delay={0.25}>
          <div className="bg-panel_bg border border-white/5 p-5 rounded-xl space-y-4">
            {/* Section header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LuReceipt className="size-5 text-accent" />
                <h2 className="text-lg font-semibold text-white">
                  Payment History
                </h2>
              </div>
              {!paymentsLoading && payments.length > 0 && (
                <span className="text-xs text-second_text">
                  Page {paymentPage} of {paymentTotalPages}
                </span>
              )}
            </div>

            {/* Loading state */}
            {paymentsLoading && <PaymentTableSkeleton />}

            {/* Error state */}
            {paymentsError && !paymentsLoading && (
              <div className="py-8 text-center space-y-3">
                <LuTriangleAlert className="size-8 text-red-400 mx-auto" />
                <p className="text-sm text-red-400">{paymentsError}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-accent text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty state */}
            {!paymentsLoading && !paymentsError && payments.length === 0 && (
              <div className="py-8 text-center">
                <div className="flex flex-col items-center gap-3">
                  <LuReceipt className="size-10 text-gray-600" />
                  <p className="text-sm text-second_text">
                    No payment history yet.
                  </p>
                </div>
              </div>
            )}

            {/* Table */}
            {!paymentsLoading && !paymentsError && payments.length > 0 && (
              <div className="overflow-x-auto -mx-5 px-5">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left py-3 px-2 text-[11px] text-second_text uppercase tracking-wider font-medium">
                        Date
                      </th>
                      <th className="text-left py-3 px-2 text-[11px] text-second_text uppercase tracking-wider font-medium">
                        Description
                      </th>
                      <th className="text-right py-3 px-2 text-[11px] text-second_text uppercase tracking-wider font-medium">
                        Amount
                      </th>
                      <th className="text-center py-3 px-2 text-[11px] text-second_text uppercase tracking-wider font-medium">
                        Status
                      </th>
                      <th className="text-right py-3 px-2 text-[11px] text-second_text uppercase tracking-wider font-medium hidden sm:table-cell">
                        Invoice #
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {payments.map((payment) => {
                      const isRefund =
                        payment.transactionType === TransactionType.REFUND;
                      const displayAmount = isRefund
                        ? -payment.amount
                        : payment.amount;

                      return (
                        <tr
                          key={payment.id}
                          className="hover:bg-white/5 transition-colors"
                        >
                          <td className="py-3.5 px-2 text-white whitespace-nowrap">
                            <span className="hidden md:inline">
                              {formatDateTime(payment.createdAt)}
                            </span>
                            <span className="md:hidden">
                              {formatDate(payment.createdAt)}
                            </span>
                          </td>
                          <td className="py-3.5 px-2 text-second_text max-w-[200px] truncate">
                            {payment.description || "—"}
                          </td>
                          <td className="py-3.5 px-2 text-right font-mono whitespace-nowrap">
                            <span
                              className={
                                isRefund
                                  ? "text-red-400"
                                  : "text-white"
                              }
                            >
                              {isRefund ? "-" : ""}
                              {formatAmount(
                                Math.abs(displayAmount),
                                payment.currency,
                              )}
                            </span>
                          </td>
                          <td className="py-3.5 px-2 text-center whitespace-nowrap">
                            <PaymentStatusBadge status={payment.status} />
                          </td>
                          <td className="py-3.5 px-2 text-right text-second_text font-mono text-xs hidden sm:table-cell whitespace-nowrap">
                            {payment.invoiceNumber
                              ? `#${payment.invoiceNumber}`
                              : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {!paymentsLoading && !paymentsError && paymentTotalPages > 1 && (
              <Pagination
                currentPage={paymentPage}
                totalPages={paymentTotalPages}
                setCurrentPage={setPaymentPage}
              />
            )}
          </div>
        </FadeIn>
      )}

      {/* ── Upgrade Options ────────────────────────── */}
      <FadeIn delay={0.3}>
        <div className="space-y-6 pt-4" id="upgrade-plans-section">
          <div className="text-center space-y-2">
            <h2 className="text-xl md:text-2xl font-bold text-white">
              {isFree ? "Find Your Perfect Plan" : "Expand Your Universe"}
            </h2>
            <p className="text-sm text-second_text max-w-2xl mx-auto">
              {isFree
                ? "Choose a plan that fits your needs. Upgrade anytime to unlock premium features."
                : "Upgrade or downgrade your plan anytime. No long-term commitments."}
            </p>
          </div>
          <SubscriptionSuggestions
            currentPlanCode={planCode}
            isFree={isFree}
          />
        </div>
      </FadeIn>

      {/* ── Billing FAQ ────────────────────────────── */}
      <FadeIn delay={0.35}>
        <div className="bg-panel_bg border border-white/5 p-5 rounded-xl space-y-5">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white">
                Billing FAQ
              </h2>
              <p className="text-sm text-second_text">
                Quick answers to common questions about your account.
              </p>
            </div>
            <button className="text-accent text-sm font-medium flex items-center gap-2 hover:underline">
              Visit Help Center
              <LuExternalLink className="size-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-white">
                Can I change my plan mid-month?
              </h4>
              <p className="text-[13px] text-second_text">
                Yes. Upgrades take effect immediately and are pro-rated.
                Downgrades take effect at the start of your next billing cycle.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-white">
                How do I update my payment method?
              </h4>
              <p className="text-[13px] text-second_text">
                Use the &quot;Manage Payment&quot; button above to securely
                update your credit card information through our billing portal.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-white">
                What devices support 4K UHD?
              </h4>
              <p className="text-[13px] text-second_text">
                4K UHD requires a 4K-capable display, a stable 25Mbps+
                connection, and a supported device like Apple TV 4K or Sony
                Bravia.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-white">
                Are there any hidden fees?
              </h4>
              <p className="text-[13px] text-second_text">
                No. The monthly subscription fee includes all taxes and fees.
                Any additional costs are clearly stated before purchase.
              </p>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}

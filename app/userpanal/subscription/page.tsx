"use client";

// //////////////////////////////////////////////////////////////////////////////
// ///////// Subscription Page — Entry point for /userpanal/subscription ///////
// //////////////////////////////////////////////////////////////////////////////

import { useMemo, useState, useEffect } from "react";
import { LuLoader } from "react-icons/lu";
import { useAuthStore } from "@/app/_stores/authStore";
import { useSubscriptionStore, isFreeSubscription } from "@/app/_stores/subscriptionStore";
import { comingSoonToast } from "@/app/_helpers/helpers";
import { DEFAULT_PAYMENTS } from "@/app/data/userpanal/subscription";
import type { UserPaymentHistoryItemDto } from "@/app/types/subscriptions";
import { FadeIn } from "@/app/_components/_globalComponents/FadeIn";
import SubscriptionSuggestions from "@/app/_components/_website/_userpanal/SubscriptionSuggestions";
import SubscriptionProfileOverview from "@/app/_components/_website/_userpanal/SubscriptionProfileOverview";
import SubscriptionCurrentPlan from "@/app/_components/_website/_userpanal/SubscriptionCurrentPlan";
import SubscriptionActiveDevices from "@/app/_components/_website/_userpanal/SubscriptionActiveDevices";
import SubscriptionBillingSidebar from "@/app/_components/_website/_userpanal/SubscriptionBillingSidebar";
import SubscriptionPaymentHistory from "@/app/_components/_website/_userpanal/SubscriptionPaymentHistory";
import SubscriptionBillingFAQ from "@/app/_components/_website/_userpanal/SubscriptionBillingFAQ";

export default function SubscriptionPage() {
  const user = useAuthStore((s) => s.user);
  const subscription = useSubscriptionStore((s) => s.subscription);
  const subLoading = useSubscriptionStore((s) => s.loading);

  // ── Payment history state ──────────────────────────
  const [payments, setPayments] = useState<UserPaymentHistoryItemDto[]>(DEFAULT_PAYMENTS);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [paymentsError, setPaymentsError] = useState<string | null>(null);
  const [paymentPage, setPaymentPage] = useState(1);
  const [paymentTotalPages, setPaymentTotalPages] = useState(1);
  const [recentPayments, setRecentPayments] = useState<UserPaymentHistoryItemDto[]>([]);

  // ── Derived values ────────────────────────────────
  const isFree = useMemo(() => isFreeSubscription(subscription), [subscription]);
  const planCode = subscription?.plan?.code ?? "free";
  const planName = subscription?.plan?.name ?? "Free";
  const planIcon = subscription?.plan?.icon ?? null;
  const planFeatures = subscription?.plan?.features ?? [];
  const subStatus = subscription?.status ?? "free";
  const isActive = subStatus === "active";
  const isTrialing = subStatus === "trialing";
  const isCancelScheduled = subscription?.cancelAtPeriodEnd ?? false;

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

  // ── Static payment data (placeholder for future API) ──
  useEffect(() => {
    if (!isFree) {
      setPayments(DEFAULT_PAYMENTS);
      setRecentPayments(DEFAULT_PAYMENTS.slice(0, 2));
    }
    setPaymentsLoading(false);
  }, [isFree]);

  // ── Handlers ─────────────────────────────────────
  const handleManagePayment = () => comingSoonToast("Payment management");
  const handleCancelSubscription = () => comingSoonToast("Subscription cancellation");

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
      {/* Profile Overview */}
      <FadeIn delay={0}>
        <SubscriptionProfileOverview
          user={user}
          displayName={displayName}
          memberSince={memberSince}
          avatarLetter={avatarLetter}
          isFree={isFree}
        />
      </FadeIn>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left (2/3) */}
        <div className="lg:col-span-2 space-y-5">
          <FadeIn delay={0.1}>
            <SubscriptionCurrentPlan
              subscription={subscription}
              planName={planName}
              planIcon={planIcon}
              planFeatures={planFeatures}
              isFree={isFree}
              isActive={isActive}
              isTrialing={isTrialing}
              isCancelScheduled={isCancelScheduled}
              subStatus={subStatus}
            />
          </FadeIn>

          <FadeIn delay={0.15}>
            <SubscriptionActiveDevices isFree={isFree} />
          </FadeIn>
        </div>

        {/* Right (1/3) */}
        <SubscriptionBillingSidebar
          user={user}
          subscription={subscription}
          recentPayments={recentPayments}
          isFree={isFree}
          isCancelScheduled={isCancelScheduled}
          onManagePayment={handleManagePayment}
          onCancelSubscription={handleCancelSubscription}
        />
      </div>

      {/* Payment History Table */}
      {!isFree && (
        <FadeIn delay={0.25}>
          <SubscriptionPaymentHistory
            payments={payments}
            paymentsLoading={paymentsLoading}
            paymentsError={paymentsError}
            paymentPage={paymentPage}
            paymentTotalPages={paymentTotalPages}
            setPaymentPage={setPaymentPage}
          />
        </FadeIn>
      )}

      {/* Upgrade Options */}
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

      {/* Billing FAQ */}
      <FadeIn delay={0.35}>
        <SubscriptionBillingFAQ />
      </FadeIn>
    </div>
  );
}

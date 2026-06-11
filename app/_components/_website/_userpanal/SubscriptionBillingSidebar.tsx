"use client";

// //////////////////////////////////////////////////////////////////////////////
// ///////// SubscriptionBillingSidebar — billing info, payment mgmt, cancel ///
// //////////////////////////////////////////////////////////////////////////////

import { useState } from "react";
import {
  LuCreditCard,
  LuLoader,
  LuTriangleAlert,
  LuZap,
  LuCrown,
  LuArrowRight,
} from "react-icons/lu";
import { comingSoonToast } from "@/app/_helpers/helpers";
import { formatAmount, formatDate } from "@/app/_helpers/userpanal/subscription";
import PaymentStatusBadge from "./SubscriptionPaymentStatusBadge";
import type { User } from "@/app/types/auth";
import type {
  CurrentUserSubscriptionDto,
  UserPaymentHistoryItemDto,
} from "@/app/types/subscriptions";

interface BillingSidebarProps {
  user: Partial<User>;
  subscription: CurrentUserSubscriptionDto | null;
  recentPayments: UserPaymentHistoryItemDto[];
  isFree: boolean;
  isCancelScheduled: boolean;
  onManagePayment: () => void;
  onCancelSubscription: () => void;
}

export default function SubscriptionBillingSidebar({
  user,
  subscription,
  recentPayments,
  isFree,
  isCancelScheduled,
  onManagePayment,
  onCancelSubscription,
}: BillingSidebarProps) {
  const [portalLoading] = useState(false);
  const [cancelLoading] = useState(false);

  /* ── Free user: show upgrade prompt instead of billing ── */
  if (isFree) {
    return (
      <aside className="space-y-5">
        <div className="bg-panel_bg border border-white/5 p-5 rounded-xl space-y-4 text-center">
          <div className="text-4xl mb-2">🎬</div>
          <h3 className="text-lg font-semibold text-white">Free Plan</h3>
          <p className="text-sm text-second_text">
            You&apos;re currently on the Free plan. Upgrade to unlock premium
            features, ad-free streaming, and multi-device support.
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
      </aside>
    );
  }

  /* ── Paid user: show billing sidebar ── */
  return (
    <aside className="space-y-5">
      {/* Next Payment */}
      <div className="bg-panel_bg border border-white/5 p-5 rounded-xl space-y-4">
        <h3 className="text-lg font-semibold text-white">
          {isCancelScheduled ? "Subscription Ends" : "Next Payment"}
        </h3>
        {subscription?.periodEnd ? (
          <>
            <div className="flex justify-between items-baseline">
              <span className="text-3xl font-bold text-white">—</span>
              <span className="text-sm text-second_text">
                {isCancelScheduled ? "Ends" : "Due"}{" "}
                {new Date(subscription.periodEnd).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 p-2.5 bg-fourth_color rounded-lg border border-white/5">
              <LuCreditCard className="size-5 text-accent" />
              <span className="text-sm text-white">
                {user?.stripeCustomerId
                  ? "Stripe ••••"
                  : "No card on file"}
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
          onClick={onManagePayment}
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
            onClick={onCancelSubscription}
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
            onClick={onManagePayment}
            disabled={portalLoading}
            className="w-full bg-secondery/20 hover:bg-secondery/30 transition-colors text-secondery py-2.5 rounded-lg text-sm font-bold border border-secondery/20 flex items-center justify-center gap-2"
          >
            <LuZap className="size-4" />
            Reactivate Subscription
          </button>
        )}
      </div>

      {/* Quick payment history mini-list (last 2 payments) */}
      {recentPayments.length > 0 && (
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
      )}
    </aside>
  );
}

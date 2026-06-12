/**
 * SuccessStates — cinematic confirmation/pending/error states for the
 * checkout success page.
 *
 * Each state uses CheckoutShell + CinematicIcon + animated heading,
 * with appropriate CTA buttons.
 *
 * States:
 *   polling   → Loading spinner, "Confirming"
 *   confirmed → Green checkmark, welcome message + subscription details
 *   pending   → Loading spinner, "Almost There"
 *   error     → Red X, error message
 */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { VscLoading } from "react-icons/vsc";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { CheckoutShell } from "./CheckoutShell";
import { CinematicIcon } from "./CinematicIcon";
import type { UserSubscriptionHistoryItemDto } from "@/app/types/subscriptions";
import { BillingRecurringInterval } from "@/app/types/subscriptions";

// ─── Helpers (mirror from success page) ─────────────

function formatAmount(unitAmount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(unitAmount / 100);
}

function formatPeriodLabel(start: string, end: string): string {
  const fmt: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  const s = new Date(start).toLocaleDateString("en-US", fmt);
  const e = new Date(end).toLocaleDateString("en-US", fmt);
  return `${s} – ${e}`;
}

function formatInterval(interval: BillingRecurringInterval): string {
  switch (interval) {
    case BillingRecurringInterval.MONTH:
      return "month";
    case BillingRecurringInterval.YEAR:
      return "year";
    case BillingRecurringInterval.WEEK:
      return "week";
    case BillingRecurringInterval.DAY:
      return "day";
    default:
      return interval;
  }
}

// ─── Staggered children animation ───────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

// ─── State: Polling ─────────────────────────────────

export function PollingState({ message }: { message: string }) {
  return (
    <CheckoutShell maxWidth="max-w-sm">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center space-y-6"
      >
        <motion.div variants={childVariants}>
          <CinematicIcon variant="loading">
            <VscLoading className="text-accent text-3xl animate-spin" />
          </CinematicIcon>
        </motion.div>

        <motion.h1
          variants={childVariants}
          className="text-white text-3xl sm:text-4xl font-black italic uppercase tracking-tighter"
        >
          Confirming
        </motion.h1>

        <motion.p
          variants={childVariants}
          className="text-second_text text-sm sm:text-base font-light"
        >
          {message}
        </motion.p>

        <motion.p
          variants={childVariants}
          className="text-light_text text-xs font-light"
        >
          Please wait while we verify your payment...
        </motion.p>
      </motion.div>
    </CheckoutShell>
  );
}

// ─── State: Confirmed ───────────────────────────────

interface ConfirmedStateProps {
  subscription: UserSubscriptionHistoryItemDto;
}

export function ConfirmedState({ subscription }: ConfirmedStateProps) {
  return (
    <CheckoutShell maxWidth="max-w-sm">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center space-y-6"
      >
        <motion.div variants={childVariants}>
          <CinematicIcon variant="success">
            <FaCheckCircle className="text-green-400 text-3xl" />
          </CinematicIcon>
        </motion.div>

        <motion.h1
          variants={childVariants}
          className="text-white text-3xl sm:text-4xl font-black italic uppercase tracking-tighter"
        >
          Welcome to{" "}
          <span className="text-accent">{subscription.planName}</span>
        </motion.h1>

        <motion.p
          variants={childVariants}
          className="text-second_text text-sm sm:text-base font-light"
        >
          Your subscription is now active. Start streaming instantly!
        </motion.p>

        {/* Subscription details card */}
        <motion.div
          variants={childVariants}
          className="bg-[#0b0b0b] rounded-lg border border-white/5 p-5 text-left space-y-3 w-full"
        >
          <div className="flex justify-between">
            <span className="text-light_text text-sm font-medium">Plan</span>
            <span className="text-white text-sm">{subscription.planName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-light_text text-sm font-medium">Amount</span>
            <span className="text-white text-sm">
              {formatAmount(
                subscription.priceUnitAmount ?? 0,
                subscription.priceCurrency ?? "USD",
              )}
              {subscription.priceInterval
                ? `/${formatInterval(subscription.priceInterval as BillingRecurringInterval)}`
                : ""}
            </span>
          </div>
          {subscription.currentPeriodStart && subscription.currentPeriodEnd && (
            <div className="flex justify-between">
              <span className="text-light_text text-sm font-medium">
                Period
              </span>
              <span className="text-white text-sm">
                {formatPeriodLabel(
                  subscription.currentPeriodStart,
                  subscription.currentPeriodEnd,
                )}
              </span>
            </div>
          )}
          {subscription.trialEnd && (
            <div className="flex justify-between">
              <span className="text-light_text text-sm font-medium">
                Trial ends
              </span>
              <span className="text-white text-sm">
                {new Date(subscription.trialEnd).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          )}
        </motion.div>

        {/* CTAs */}
        <motion.div
          variants={childVariants}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link
            href="/"
            className="bg-accent text-white px-7 py-3.5 rounded text-sm font-medium hover:bg-[#b80710] transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-main_bg"
          >
            Start Watching
          </Link>
          <Link
            href="/userpanal/subscriptions"
            className="bg-[#1a1a1a] text-white px-7 py-3.5 rounded text-sm font-medium border border-white/5 hover:bg-[#222] hover:border-white/10 transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-main_bg"
          >
            Manage Subscription
          </Link>
        </motion.div>
      </motion.div>
    </CheckoutShell>
  );
}

// ─── State: Pending ─────────────────────────────────

export function PendingState({ message }: { message: string }) {
  return (
    <CheckoutShell maxWidth="max-w-sm">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center space-y-6"
      >
        <motion.div variants={childVariants}>
          <CinematicIcon variant="pending">
            <VscLoading className="text-accent text-3xl animate-spin" />
          </CinematicIcon>
        </motion.div>

        <motion.h1
          variants={childVariants}
          className="text-white text-3xl sm:text-4xl font-black italic uppercase tracking-tighter"
        >
          Almost There
        </motion.h1>

        <motion.p
          variants={childVariants}
          className="text-second_text text-sm sm:text-base font-light"
        >
          {message}
        </motion.p>

        <motion.p
          variants={childVariants}
          className="text-light_text text-xs font-light max-w-sm mx-auto"
        >
          Your payment was successful but we&apos;re still activating your
          subscription. If this persists, please contact support.
        </motion.p>

        <motion.div
          variants={childVariants}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link
            href="/"
            className="bg-accent text-white px-7 py-3.5 rounded text-sm font-medium hover:bg-[#b80710] transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-main_bg"
          >
            Go Home
          </Link>
          <Link
            href="/contactus"
            className="bg-[#1a1a1a] text-white px-7 py-3.5 rounded text-sm font-medium border border-white/5 hover:bg-[#222] hover:border-white/10 transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-main_bg"
          >
            Contact Support
          </Link>
        </motion.div>
      </motion.div>
    </CheckoutShell>
  );
}

// ─── State: Error ───────────────────────────────────

export function SuccessErrorState({ message }: { message: string }) {
  return (
    <CheckoutShell maxWidth="max-w-sm">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="text-center space-y-6"
      >
        <motion.div variants={childVariants}>
          <CinematicIcon variant="error">
            <FaTimesCircle className="text-red-400 text-3xl" />
          </CinematicIcon>
        </motion.div>

        <motion.h1
          variants={childVariants}
          className="text-white text-3xl sm:text-4xl font-black italic uppercase tracking-tighter"
        >
          Something Went Wrong
        </motion.h1>

        <motion.p
          variants={childVariants}
          className="text-second_text text-sm sm:text-base font-light"
        >
          {message}
        </motion.p>

        <motion.div
          variants={childVariants}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link
            href="/pricing"
            className="bg-accent text-white px-7 py-3.5 rounded text-sm font-medium hover:bg-[#b80710] transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-main_bg"
          >
            Back to Pricing
          </Link>
          <Link
            href="/contactus"
            className="bg-[#1a1a1a] text-white px-7 py-3.5 rounded text-sm font-medium border border-white/5 hover:bg-[#222] hover:border-white/10 transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-main_bg"
          >
            Contact Support
          </Link>
        </motion.div>
      </motion.div>
    </CheckoutShell>
  );
}

// ─── Composite: SuccessStates ───────────────────────

export interface SuccessStatesProps {
  status: "creating" | "polling" | "confirmed" | "pending" | "error";
  subscription: UserSubscriptionHistoryItemDto | null;
  message: string;
}

/**
 * Renders the appropriate success page state based on the status prop.
 */
export function SuccessStates({
  status,
  subscription,
  message,
}: SuccessStatesProps) {
  switch (status) {
    case "creating":
      return <PollingState message={message} />;
    case "polling":
      return <PollingState message={message} />;
    case "confirmed":
      return subscription ? (
        <ConfirmedState subscription={subscription} />
      ) : (
        <PollingState message="Loading subscription details..." />
      );
    case "pending":
      return <PendingState message={message} />;
    case "error":
      return <SuccessErrorState message={message} />;
    default:
      return <SuccessErrorState message="An unexpected state was reached." />;
  }
}

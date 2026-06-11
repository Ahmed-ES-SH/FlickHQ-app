// //////////////////////////////////////////////////////////////////////////////
// ///////// Subscription page static data //////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////

import { BillingPaymentStatus, TransactionType } from "@/app/types/subscriptions";
import type { UserPaymentHistoryItemDto } from "@/app/types/subscriptions";

// ─── Payment status badge configurations ─────────────────────────────────

export const PAYMENT_STATUS_STYLES: Record<
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

// ─── Static fallback payment data — placeholder until real API is wired up ─

export const DEFAULT_PAYMENTS: UserPaymentHistoryItemDto[] = [
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
];

// ─── Billing FAQ items ─────────────────────────────────────────────────────

export interface BillingFAQItem {
  question: string;
  answer: string;
}

export const BILLING_FAQ_ITEMS: BillingFAQItem[] = [
  {
    question: "Can I change my plan mid-month?",
    answer:
      "Yes. Upgrades take effect immediately and are pro-rated. Downgrades take effect at the start of your next billing cycle.",
  },
  {
    question: "How do I update my payment method?",
    answer:
      "Use the \"Manage Payment\" button above to securely update your credit card information through our billing portal.",
  },
  {
    question: "What devices support 4K UHD?",
    answer:
      "4K UHD requires a 4K-capable display, a stable 25Mbps+ connection, and a supported device like Apple TV 4K or Sony Bravia.",
  },
  {
    question: "Are there any hidden fees?",
    answer:
      "No. The monthly subscription fee includes all taxes and fees. Any additional costs are clearly stated before purchase.",
  },
];

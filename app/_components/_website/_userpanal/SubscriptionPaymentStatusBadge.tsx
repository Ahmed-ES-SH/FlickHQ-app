// //////////////////////////////////////////////////////////////////////////////
// ///////// PaymentStatusBadge — colored badge for payment status /////////////
// //////////////////////////////////////////////////////////////////////////////

import { BillingPaymentStatus } from "@/app/types/subscriptions";
import { PAYMENT_STATUS_STYLES } from "@/app/data/userpanal/subscription";

interface PaymentStatusBadgeProps {
  status: BillingPaymentStatus;
}

export default function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const style =
    PAYMENT_STATUS_STYLES[status] ?? PAYMENT_STATUS_STYLES[BillingPaymentStatus.PENDING];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${style.bg} ${style.text}`}
    >
      <span className="text-xs">{style.icon}</span>
      {style.label}
    </span>
  );
}

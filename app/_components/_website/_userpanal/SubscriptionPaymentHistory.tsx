"use client";

// //////////////////////////////////////////////////////////////////////////////
// ///////// SubscriptionPaymentHistory — full payment history table ///////////
// //////////////////////////////////////////////////////////////////////////////

import type { Dispatch, SetStateAction } from "react";
import { LuReceipt, LuTriangleAlert } from "react-icons/lu";
import { formatAmount, formatDate, formatDateTime } from "@/app/_helpers/userpanal/subscription";
import { TransactionType } from "@/app/types/subscriptions";
import type { UserPaymentHistoryItemDto } from "@/app/types/subscriptions";
import PaymentStatusBadge from "./SubscriptionPaymentStatusBadge";
import PaymentTableSkeleton from "./SubscriptionPaymentTableSkeleton";
import Pagination from "@/app/_components/_globalComponents/Pagination";

interface PaymentHistoryProps {
  payments: UserPaymentHistoryItemDto[];
  paymentsLoading: boolean;
  paymentsError: string | null;
  paymentPage: number;
  paymentTotalPages: number;
  setPaymentPage: Dispatch<SetStateAction<number>>;
}

export default function SubscriptionPaymentHistory({
  payments,
  paymentsLoading,
  paymentsError,
  paymentPage,
  paymentTotalPages,
  setPaymentPage,
}: PaymentHistoryProps) {
  return (
    <div className="bg-panel_bg border border-white/5 p-5 rounded-xl space-y-4">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LuReceipt className="size-5 text-accent" />
          <h2 className="text-lg font-semibold text-white">Payment History</h2>
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
            <p className="text-sm text-second_text">No payment history yet.</p>
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
                      <span className={isRefund ? "text-red-400" : "text-white"}>
                        {isRefund ? "-" : ""}
                        {formatAmount(Math.abs(displayAmount), payment.currency)}
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
  );
}

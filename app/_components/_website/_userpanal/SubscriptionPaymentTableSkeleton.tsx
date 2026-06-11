// //////////////////////////////////////////////////////////////////////////////
// ///////// PaymentTableSkeleton — loading skeleton for payment history table //
// //////////////////////////////////////////////////////////////////////////////

export default function PaymentTableSkeleton() {
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

// //////////////////////////////////////////////////////////////////////////////
// ///////// StatCard — displays a single value + label metric //////////////////
// //////////////////////////////////////////////////////////////////////////////

interface StatCardProps {
  value: string;
  label: string;
}

export default function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="flex flex-col items-center p-4 bg-fourth_color rounded-lg border border-white/5 min-w-[120px]">
      <span className="text-xl font-bold text-accent">{value}</span>
      <span className="text-[11px] text-second_text uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

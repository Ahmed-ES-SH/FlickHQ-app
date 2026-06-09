export default function PlanCardSkeleton({ popular = false }: { popular?: boolean }) {
  return (
    <div
      className={`w-full flex flex-col p-6 md:p-8 rounded-lg border animate-pulse ${
        popular
          ? "bg-[#141414] border-accent/30"
          : "bg-[#0f0f0f] border-white/5"
      }`}
    >
      {/* Popular badge skeleton */}
      {popular && (
        <div className="self-start h-5 w-24 rounded-full bg-white/10 mb-4" />
      )}

      {/* Title skeleton */}
      <div className="h-7 w-28 rounded-md bg-white/10 mb-6" />

      {/* Feature items skeleton */}
      <div className="flex flex-col gap-4 mb-8 pb-6 border-b border-white/10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="size-5 rounded-sm bg-white/10 shrink-0 mt-0.5" />
            <div className="h-4 flex-1 rounded bg-white/10" />
          </div>
        ))}
      </div>

      {/* Price skeleton */}
      <div className="flex items-baseline gap-1 mb-6">
        <div className="h-9 w-20 rounded-md bg-white/10" />
        <div className="h-4 w-10 rounded bg-white/10" />
      </div>

      {/* Button skeleton */}
      <div className="w-full h-11 rounded-md bg-white/10" />
    </div>
  );
}

export default function PlanCardSkeleton({ popular = false }: { popular?: boolean }) {
  return (
    <div className="relative rounded-xl overflow-hidden animate-pulse">
      {/* Glass background */}
      <div className="absolute inset-0 rounded-xl bg-panel_bg border border-white/5" />

      {/* Gradient accent strip */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/10 z-[2]" />

      {/* Popular badge skeleton */}
      {popular && (
        <div className="absolute top-3 right-3 z-10">
          <div className="h-6 w-28 rounded-full bg-white/10" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-[1] flex flex-col p-6 md:p-7">
        {/* Title + description */}
        <div className="mb-5">
          <div className="h-5 w-24 rounded-md bg-white/10 mb-2" />
          <div className="h-3 w-40 rounded bg-white/10" />
        </div>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <div className="h-9 w-20 rounded-md bg-white/10" />
            <div className="h-4 w-8 rounded bg-white/10" />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 mb-5" />

        {/* Feature items */}
        <div className="flex flex-col gap-3 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="size-5 rounded-full bg-white/10 shrink-0 mt-0.5" />
              <div className="h-3.5 flex-1 rounded bg-white/10" />
            </div>
          ))}
        </div>

        {/* Button skeleton */}
        <div className="w-full h-11 rounded-lg bg-white/10" />

        {/* Cancel text skeleton */}
        <div className="w-32 h-3 mx-auto mt-3 rounded bg-white/5" />
      </div>
    </div>
  );
}

import PlanCardSkeleton from "./PlanCardSkeleton";

interface PlansSkeletonProps {
  /** Number of skeleton cards to render. Defaults to 3. */
  count?: number;
}

export default function PlansSkeleton({ count = 3 }: PlansSkeletonProps) {
  return (
    <>
      {/* Mobile: single skeleton */}
      <div className="sm:hidden">
        <PlanCardSkeleton popular={false} />
      </div>

      {/* Tablet: 2-column grid */}
      <div className="hidden sm:grid lg:hidden grid-cols-2 gap-5">
        {Array.from({ length: count }).map((_, i) => (
          <PlanCardSkeleton key={i} popular={i === 1} />
        ))}
      </div>

      {/* Desktop: single row */}
      <div className="hidden lg:flex lg:flex-row gap-5">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex-1 min-w-0">
            <PlanCardSkeleton popular={i === 1} />
          </div>
        ))}
      </div>
    </>
  );
}

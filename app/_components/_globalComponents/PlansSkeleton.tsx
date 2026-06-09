import PlanCardSkeleton from "./PlanCardSkeleton";

interface PlansSkeletonProps {
  /** Number of skeleton cards to render. Defaults to 3. */
  count?: number;
}

export default function PlansSkeleton({ count = 3 }: PlansSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      {Array.from({ length: count }).map((_, i) => (
        <PlanCardSkeleton key={i} popular={i === 1} />
      ))}
    </div>
  );
}

/**
 * Skeleton — reusable skeleton primitives for loading states.
 *
 * Provides four variants: text, circular, rectangular, and card.
 * Uses a custom dark-pulse animation from #0b0b0b → #141414.
 * Respects prefers-reduced-motion.
 *
 * Usage:
 *   <Skeleton variant="text" width="w-40" />
 *   <Skeleton variant="card" className="h-48" />
 *   <Skeleton variant="circular" className="w-20 h-20" />
 */

"use client";

import { useEffect, useState } from "react";

interface SkeletonProps {
  variant?: "text" | "circular" | "rectangular" | "card";
  /** Tailwind width class (e.g. "w-40", "w-full") */
  width?: string;
  /** Tailwind height class (e.g. "h-6", "h-12") */
  height?: string;
  /** Additional CSS classes */
  className?: string;
}

const variantDefaults: Record<
  NonNullable<SkeletonProps["variant"]>,
  { width: string; height: string; className: string }
> = {
  text: { width: "w-full", height: "h-4", className: "rounded" },
  circular: { width: "w-10", height: "h-10", className: "rounded-full" },
  rectangular: { width: "w-full", height: "h-12", className: "rounded-lg" },
  card: { width: "w-full", height: "h-40", className: "rounded-lg" },
};

export function Skeleton({
  variant = "text",
  width,
  height,
  className = "",
}: SkeletonProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const defaults = variantDefaults[variant];
  const w = width ?? defaults.width;
  const h = height ?? defaults.height;
  const base = defaults.className;

  return (
    <div
      className={`bg-[#0b0b0b] ${w} ${h} ${base} ${className} ${
        reducedMotion ? "opacity-40" : "animate-pulse"
      }`}
      role="status"
      aria-label="Loading"
      style={
        reducedMotion
          ? undefined
          : {
              animation: "skeleton-pulse 1.5s ease-in-out infinite",
            }
      }
    />
  );
}

/**
 * SkeletonBlock — a composite skeleton block for form-like layouts.
 * Renders a heading skeleton + multiple line skeletons.
 */
export function SkeletonBlock({
  lines = 3,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-4 ${className}`} role="status" aria-label="Loading content">
      <Skeleton variant="text" width="w-1/3" height="h-5" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? "w-3/4" : "w-full"}
          height="h-4"
        />
      ))}
    </div>
  );
}

/**
 * CheckoutFormSkeleton — mimics the Stripe Embedded Checkout form shape.
 */
export function CheckoutFormSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`space-y-6 ${className}`} role="status" aria-label="Loading checkout form">
      {/* Card-like block */}
      <div className="bg-[#0b0b0b] rounded-lg p-5 space-y-4">
        <Skeleton variant="text" width="w-2/3" height="h-5" />
        <Skeleton variant="rectangular" height="h-12" />
        <Skeleton variant="rectangular" height="h-12" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton variant="rectangular" height="h-12" />
          <Skeleton variant="rectangular" height="h-12" />
        </div>
      </div>
      {/* Submit button */}
      <Skeleton variant="rectangular" height="h-14" />
    </div>
  );
}

/**
 * SummarySkeleton — mimics the OrderSummary panel shape.
 */
export function SummarySkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`space-y-5 ${className}`} role="status" aria-label="Loading order summary">
      <Skeleton variant="text" width="w-1/2" height="h-6" />
      <div className="flex justify-between">
        <Skeleton variant="text" width="w-32" height="h-5" />
        <Skeleton variant="text" width="w-16" height="h-5" />
      </div>
      <div className="flex justify-between">
        <Skeleton variant="text" width="w-24" height="h-5" />
        <Skeleton variant="text" width="w-16" height="h-5" />
      </div>
      <div className="border-t border-white/10 pt-4 flex justify-between">
        <Skeleton variant="text" width="w-16" height="h-7" />
        <Skeleton variant="text" width="w-20" height="h-7" />
      </div>
      {/* Features panel */}
      <div className="bg-[#0b0b0b] rounded-lg p-4 space-y-3">
        <Skeleton variant="text" width="w-1/3" height="h-4" />
        <Skeleton variant="text" width="w-full" height="h-3" />
        <Skeleton variant="text" width="w-3/4" height="h-3" />
        <Skeleton variant="text" width="w-5/6" height="h-3" />
      </div>
    </div>
  );
}

"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

// ─── Types ──────────────────────────────────────────

interface SubscribeButtonProps {
  /** The Stripe price ID to subscribe to. */
  priceId: string;
  /** Whether this is a recurring subscription (vs one-time). */
  isRecurring: boolean;
  /** Display name of the plan (used to derive a default CTA label). */
  planName: string;
  /** Override the default CTA label. Defaults to "Go Premium" / "Get Started" based on plan name. */
  ctaLabel?: string;
  /** Visual variant. `primary` is used for highlighted/popular plans. */
  variant?: "primary" | "secondary";
  /** Optional additional CSS classes. */
  className?: string;
}

// ─── Helpers ─────────────────────────────────────────

/** Derive a persuasive default CTA label from the plan name. */
function defaultCtaLabel(planName: string): string {
  const lower = planName.toLowerCase();
  if (lower.includes("premium") || lower.includes("pro")) {
    return `Go ${planName}`;
  }
  return "Get Started";
}

// ─── Component ──────────────────────────────────────

/**
 * Reusable CTA button that redirects to the in-app checkout page.
 *
 * DESIGN SYSTEM SPECS:
 * - Padding: 14px 28px (py-3.5 px-7)
 * - Border radius: 4px (rounded)
 * - Primary: bg-accent text-white, hover: #b80710
 * - Secondary: bg-[#1a1a1a] text-white, hover: bg-[#222] + white/10 border
 * - Transition: 200ms cubic-bezier(0.16, 1, 0.3, 1)
 * - Active: scale-98
 * - Focus-visible: ring-2 ring-accent ring-offset-2 ring-offset-main_bg
 * - Minimum touch target: 44px
 *
 * The `/checkout` page handles:
 * - Authentication gate (enforced by proxy.ts + server-side check)
 * - Billing customer creation
 * - Stripe Embedded Checkout session creation
 * - Payment form rendering
 */
export default function SubscribeButton({
  priceId,
  isRecurring,
  planName,
  ctaLabel,
  variant = "secondary",
  className = "",
}: SubscribeButtonProps) {
  const router = useRouter();

  const handleClick = useCallback(() => {
    const params = new URLSearchParams({
      priceId,
      isRecurring: String(isRecurring),
    });
    router.push(`/checkout?${params.toString()}`);
  }, [priceId, isRecurring, router]);

  return (
    <button
      onClick={handleClick}
      className={`
        w-full py-3.5 px-7 rounded text-sm font-medium
        min-h-[44px] touch-target flex items-center justify-center gap-2
        transition-all duration-200
        active:scale-[0.98]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-main_bg
        ${variant === "primary"
          ? "bg-accent text-white hover:bg-[#b80710]"
          : "bg-[#1a1a1a] text-white hover:bg-[#222] border border-white/5 hover:border-white/10"
        }
        ${className}
      `}
      style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
      aria-label={ctaLabel ?? defaultCtaLabel(planName)}
    >
      {ctaLabel ?? defaultCtaLabel(planName)}
    </button>
  );
}

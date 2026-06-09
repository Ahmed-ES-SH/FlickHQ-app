"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createPortalSessionAction } from "@/app/_actions/plans";
import { useAuthStore } from "@/app/_stores/authStore";

interface ManageSubscriptionButtonProps {
  /** Visual variant. Defaults to "primary". */
  variant?: "primary" | "secondary" | "outline";
  /** Optional class name override. */
  className?: string;
  /** Optional label override. Defaults to "Manage Subscription". */
  label?: string;
}

/**
 * Button that opens the Stripe Customer Portal for subscription management.
 * Requires the user to be authenticated.
 */
export default function ManageSubscriptionButton({
  variant = "primary",
  className = "",
  label = "Manage Subscription",
}: ManageSubscriptionButtonProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [loading, setLoading] = useState(false);

  const handleManage = async () => {
    if (!isAuthenticated) {
      router.push("/signin?next=/profile");
      return;
    }

    setLoading(true);

    try {
      const idempotencyKey = crypto.randomUUID();
      const result = await createPortalSessionAction({ idempotencyKey });

      if (!result.success || !result.data?.url) {
        if (result.statusCode === 401) {
          router.push("/signin?next=/profile");
          return;
        }
        toast.error(result.message || "Failed to open billing portal.");
        return;
      }

      // Redirect to Stripe Customer Portal
      window.location.href = result.data.url;
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "An unexpected error occurred.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Style variants ──────────────────────────────────

  const baseClasses =
    "inline-flex items-center justify-center gap-2 font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent/50 rounded-lg touch-target";

  const variants: Record<string, string> = {
    primary:
      "bg-accent text-white hover:bg-red-700 disabled:bg-accent/50 disabled:cursor-not-allowed",
    secondary:
      "bg-fourth_color text-gray-200 hover:bg-gray-800 border border-glass_border disabled:opacity-50 disabled:cursor-not-allowed",
    outline:
      "bg-transparent text-accent border border-accent/40 hover:bg-accent/10 disabled:opacity-50 disabled:cursor-not-allowed",
  };

  return (
    <button
      onClick={handleManage}
      disabled={loading}
      className={`${baseClasses} ${variants[variant]} px-4 py-2.5 ${className}`}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin size-4"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          Opening...
        </>
      ) : (
        <>
          <svg
            className="size-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
            />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}

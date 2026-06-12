/**
 * CustomCheckoutForm — Stripe Elements-based payment form.
 *
 * Replaces the old EmbeddedCheckout (iframe) with a fully custom form
 * using <Elements> + <PaymentElement> + stripe.confirmPayment().
 *
 * States:
 *   loading    → Stripe.js is still loading
 *   ready      → Form is interactive
 *   submitting → Payment is being processed
 *   error      → Payment or validation error
 */

"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import { VscLoading } from "react-icons/vsc";
import { LuLock, LuShield } from "react-icons/lu";

// ─── Props ──────────────────────────────────────────

interface CustomCheckoutFormProps {
  paymentIntentId?: string | null;
}

// ─── Component ──────────────────────────────────────

export function CustomCheckoutForm({ paymentIntentId }: CustomCheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Handle form submission ──────────────────────

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!stripe || !elements) return;

      setIsSubmitting(true);
      setError(null);

      // Persist paymentIntentId to sessionStorage so the success page can read it
      if (paymentIntentId) {
        try {
          sessionStorage.setItem("checkout_payment_intent_id", paymentIntentId);
        } catch { /* sessionStorage unavailable */ }
      }

      const returnUrl = `${window.location.origin}/checkout/success`;

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl,
        },
      });

      if (confirmError) {
        setError(confirmError.message ?? "Payment failed. Please try again.");
        setIsSubmitting(false);
      }
      // On success, Stripe redirects to return_url
      // No need to handle success state here
    },
    [stripe, elements, paymentIntentId],
  );

  // ── Determine button state ──────────────────────

  const isDisabled = !stripe || !elements || isSubmitting;
  const buttonLabel =
    !stripe || !elements
      ? "Loading payment form..."
      : isSubmitting
        ? "Processing payment…"
        : "Pay Now";

  // ── Render ─────────────────────────────────────

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Element */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
      >
        <PaymentElement
          options={{
            layout: {
              type: "tabs",
              defaultCollapsed: false,
            },
          }}
        />
      </motion.div>

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-red-500/10 border border-red-500/20 rounded px-4 py-3"
        >
          <p className="text-red-400 text-sm font-light">{error}</p>
        </motion.div>
      )}

      {/* Submit button */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <button
          type="submit"
          disabled={isDisabled}
          className={`
            w-full py-3.5 px-7 rounded text-sm font-medium
            min-h-[52px] flex items-center justify-center gap-2
            transition-all duration-200
            active:scale-[0.98]
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
            focus-visible:ring-offset-2 focus-visible:ring-offset-main_bg
            ${
              isDisabled && !isSubmitting
                ? "bg-[#1a1a1a] text-light_text border border-white/5 cursor-not-allowed"
                : isSubmitting
                  ? "bg-accent/80 text-white cursor-wait"
                  : "bg-accent text-white hover:bg-[#b80710] cursor-pointer"
            }
          `}
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
          aria-label={buttonLabel}
        >
          {isSubmitting && <VscLoading className="size-4 animate-spin" />}
          {buttonLabel}
        </button>
      </motion.div>

      {/* Security badge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="flex items-center justify-center gap-3 text-xs text-light_text font-light"
      >
        <div className="flex items-center gap-1.5">
          <LuLock className="size-3" />
          <span>Encrypted</span>
        </div>
        <span className="text-white/10" aria-hidden="true">
          |
        </span>
        <div className="flex items-center gap-1.5">
          <LuShield className="size-3" />
          <span>Secured by Stripe</span>
        </div>
      </motion.div>
    </form>
  );
}

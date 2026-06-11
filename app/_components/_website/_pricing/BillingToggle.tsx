"use client";

////////////////////////////////////////////////////////////////////////////////
///////// Pricing page — billing toggle with animated savings badge ///////////
////////////////////////////////////////////////////////////////////////////////

import { motion, AnimatePresence } from "framer-motion";

interface BillingToggleProps {
  isAnnual: boolean;
  setIsAnnual: (value: boolean) => void;
  annualSavings: number | null;
}

export default function BillingToggle({
  isAnnual,
  setIsAnnual,
  annualSavings,
}: BillingToggleProps) {
  return (
    <div className="flex items-center justify-center gap-4 mb-12">
      <span
        className={`text-sm font-medium transition-colors duration-200 ${
          !isAnnual ? "text-white" : "text-light_text"
        }`}
      >
        Monthly
      </span>
      <button
        onClick={() => setIsAnnual(!isAnnual)}
        className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${
          isAnnual ? "bg-accent" : "bg-[#2a2a2a]"
        }`}
        aria-label={
          isAnnual ? "Switch to monthly billing" : "Switch to annual billing"
        }
      >
        <span
          className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform duration-200 ${
            isAnnual ? "translate-x-7" : "translate-x-0"
          }`}
          style={{
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </button>
      <span
        className={`text-sm font-medium transition-colors duration-200 ${
          isAnnual ? "text-white" : "text-light_text"
        }`}
      >
        Annual
      </span>
      <AnimatePresence mode="wait">
        {isAnnual && annualSavings && (
          <motion.span
            key="savings-badge"
            initial={{ opacity: 0, scale: 0.8, x: -8 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-full"
          >
            Save {annualSavings}%
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

////////////////////////////////////////////////////////////////////////////////
///////// ErrorState — checkout error display with retry/navigation actions ////
////////////////////////////////////////////////////////////////////////////////

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { LuTriangleAlert } from "react-icons/lu";
import { CinematicIcon } from "@/app/_components/_checkout/CinematicIcon";

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const isConflict = error.toLowerCase().includes("active subscription");

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center text-center py-8 px-4"
    >
      <CinematicIcon variant="error">
        <LuTriangleAlert className="text-red-400 text-2xl" />
      </CinematicIcon>

      <h3 className="text-white text-lg font-semibold mt-5 mb-2">
        {isConflict ? "Already Subscribed" : "Checkout Unavailable"}
      </h3>
      <p className="text-second_text text-sm font-light max-w-sm mb-6">
        {error}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
        {isConflict ? (
          <Link
            href="/userpanal/subscription"
            className="flex-1 bg-accent text-white px-7 py-3.5 rounded text-sm font-medium hover:bg-[#b80710] transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-main_bg text-center"
          >
            Manage Subscription
          </Link>
        ) : (
          <button
            onClick={onRetry}
            className="flex-1 bg-accent text-white px-7 py-3.5 rounded text-sm font-medium hover:bg-[#b80710] transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-main_bg"
          >
            Try Again
          </button>
        )}
        <Link
          href="/pricing"
          className="flex-1 bg-[#1a1a1a] text-white px-7 py-3.5 rounded text-sm font-medium border border-white/5 hover:bg-[#222] hover:border-white/10 transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-main_bg text-center"
        >
          Back to Plans
        </Link>
      </div>
    </motion.div>
  );
}

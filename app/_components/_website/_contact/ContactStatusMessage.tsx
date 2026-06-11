"use client";

// //////////////////////////////////////////////////////////////////////////////
// /////// Contact form status messages (success / error / rate-limited) ///////
// //////////////////////////////////////////////////////////////////////////////

import { motion, AnimatePresence } from "framer-motion";
import { LuTriangleAlert, LuClock } from "react-icons/lu";
import { IoCheckmarkCircle } from "react-icons/io5";
import type { SubmitContactResponse } from "@/app/types/contact";

// //////////////////////////////////////////////////////////////////////////////
// /////// Status state type — mirrors form submission lifecycle ///////////////
// //////////////////////////////////////////////////////////////////////////////

export type SubmitStatus =
  | { type: "idle" }
  | { type: "sending" }
  | { type: "success"; data: SubmitContactResponse }
  | { type: "error"; message: string }
  | { type: "rate_limited"; retryAfter: number };

type Props = {
  status: SubmitStatus;
  formattedCooldown: string | null;
};

export default function ContactStatusMessage({
  status,
  formattedCooldown,
}: Props) {
  return (
    <AnimatePresence mode="wait">
      {status.type === "success" && (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-4 p-4 bg-green-900/30 border border-green-500/30 rounded-xl flex items-start gap-3"
        >
          <IoCheckmarkCircle className="size-5 text-green-400 shrink-0 mt-0.5" />
          <p className="text-green-300 text-sm">
            {status.data.message ||
              "Your message has been sent successfully!"}
          </p>
        </motion.div>
      )}

      {status.type === "error" && (
        <motion.div
          key="error"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-4 p-4 bg-red-900/30 border border-red-500/30 rounded-xl flex items-start gap-3"
        >
          <LuTriangleAlert className="size-5 text-red-400 shrink-0 mt-0.5" />
          <p className="text-red-300 text-sm">{status.message}</p>
        </motion.div>
      )}

      {status.type === "rate_limited" && (
        <motion.div
          key="rate-limit"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-4 p-4 bg-yellow-900/30 border border-yellow-500/30 rounded-xl flex items-start gap-3"
        >
          <LuClock className="size-5 text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-300 text-sm font-medium">
              You&apos;ve reached the hourly limit
            </p>
            <p className="text-yellow-400/70 text-xs mt-1">
              Please try again in{" "}
              {formattedCooldown ?? "..."}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

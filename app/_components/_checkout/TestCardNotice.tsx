/**
 * TestCardNotice — a floating, dismissible notice that shows Stripe test card
 * details when the app is running in test / development mode.
 *
 * Displays:
 * - Card number: 4242 4242 4242 4242
 * - Expiry: any future date
 * - CVC: any 3 digits
 * - Note about test mode
 */

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuCreditCard, LuX } from "react-icons/lu";

export function TestCardNotice() {
  const [isVisible, setIsVisible] = useState(true);
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    // Only show in development/test mode
    setIsDev(
      process.env.NODE_ENV === "development" ||
        window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1",
    );
  }, []);

  if (!isDev) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 right-6 z-50 max-w-xs w-full"
        >
          <div className="relative bg-[#0b0b0b] border border-accent/30 rounded-lg shadow-2xl overflow-hidden">
            {/* Top accent strip */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-accent" />

            {/* Dismiss button */}
            <button
              onClick={() => setIsVisible(false)}
              className="absolute top-2 right-2 text-light_text hover:text-white transition-colors p-1"
              aria-label="Dismiss test card notice"
            >
              <LuX className="size-3.5" />
            </button>

            <div className="p-4 pt-4">
              {/* Header */}
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center">
                  <LuCreditCard className="size-3.5 text-accent" />
                </div>
                <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                  Test Mode
                </span>
              </div>

              {/* Card details */}
              <div className="space-y-2">
                <div className="bg-[#141414] rounded p-2.5 border border-white/5">
                  <div className="text-[11px] text-light_text font-medium mb-0.5 uppercase tracking-wider">
                    Card Number
                  </div>
                  <div className="text-sm text-white font-mono font-semibold tracking-wider">
                    4242 4242 4242 4242
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#141414] rounded p-2.5 border border-white/5">
                    <div className="text-[11px] text-light_text font-medium mb-0.5 uppercase tracking-wider">
                      Expiry
                    </div>
                    <div className="text-sm text-white font-mono font-semibold">
                      Any future date
                    </div>
                  </div>
                  <div className="bg-[#141414] rounded p-2.5 border border-white/5">
                    <div className="text-[11px] text-light_text font-medium mb-0.5 uppercase tracking-wider">
                      CVC
                    </div>
                    <div className="text-sm text-white font-mono font-semibold">
                      Any 3 digits
                    </div>
                  </div>
                </div>

                {/* Decline card hint */}
                <div className="text-[10px] text-light_text font-light leading-relaxed">
                  Use <span className="text-red-400 font-mono">4000 0000 0000 0002</span> to test
                  card decline
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

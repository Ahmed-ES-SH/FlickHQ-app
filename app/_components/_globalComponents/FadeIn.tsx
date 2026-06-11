"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

// ─── Props ────────────────────────────────────────────

interface FadeInProps {
  children: ReactNode;
  delay?: number;
}

// ─── Component ────────────────────────────────────────
// Provides a consistent fade-in + upward motion entrance animation
// used across multiple list pages (watchlist, watched, favourites).

export function FadeIn({ children, delay = 0 }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

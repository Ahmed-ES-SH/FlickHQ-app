/**
 * CinematicIcon — an animated circular icon container with variant styling.
 *
 * Wraps an icon in an 80×80px circle with variant-specific background,
 * border, and a spring entrance animation (scale 0.6 → 1, opacity 0 → 1).
 *
 * Variants:
 *   loading / pending → accent-tinted
 *   success           → green-tinted
 *   error             → red-tinted
 */

"use client";

import { motion } from "framer-motion";

type IconVariant = "loading" | "success" | "error" | "pending";

interface CinematicIconProps {
  variant: IconVariant;
  children: React.ReactNode;
}

const variantStyles: Record<IconVariant, string> = {
  loading: "bg-accent/10 border-accent/30",
  success: "bg-green-500/10 border-green-500/30",
  error: "bg-red-500/10 border-red-500/30",
  pending: "bg-accent/10 border-accent/30",
};

export function CinematicIcon({ variant, children }: CinematicIconProps) {
  return (
    <motion.div
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 18,
        duration: 0.5,
      }}
      className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center border-2 ${variantStyles[variant]}`}
      role="img"
      aria-hidden="true"
    >
      {children}
    </motion.div>
  );
}

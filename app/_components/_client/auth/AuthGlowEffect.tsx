"use client";
import { motion } from "framer-motion";

interface AuthGlowEffectProps {
  className?: string;
  xAnimation?: number[];
  yAnimation?: number[];
  duration?: number;
}

export default function AuthGlowEffect({
  className = "absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-accent/10 rounded-full blur-[140px] pointer-events-none",
  xAnimation = [0, 15, 0],
  yAnimation = [0, -15, 0],
  duration = 10,
}: AuthGlowEffectProps) {
  return (
    <motion.div
      animate={{
        x: xAnimation,
        y: yAnimation,
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    />
  );
}

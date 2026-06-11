"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AuthFormCardProps {
  children: ReactNode;
}

export default function AuthFormCard({ children }: AuthFormCardProps) {
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.8 }}
      className="bg-white/3 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 md:p-7 lg:p-8 border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden group"
    >
      {/* Subtle glow inside the card */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/10 rounded-full blur-[60px] group-hover:bg-accent/20 transition-colors duration-700" />
      {children}
    </motion.div>
  );
}

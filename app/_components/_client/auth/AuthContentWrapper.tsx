"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AuthContentWrapperProps {
  children: ReactNode;
}

export default function AuthContentWrapper({
  children,
}: AuthContentWrapperProps) {
  return (
    <motion.div
      className="relative z-10 w-full max-w-[92%] sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto px-3 py-6 sm:px-4 sm:py-8 md:p-6 lg:p-8"
      initial={{ x: -40, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

"use client";
import React from "react";
import { motion, Variants } from "framer-motion";

interface props {
  children: React.ReactNode;
  className: string;
  variants?: Variants | undefined;
}

export default function MotionDiv({ children, variants, className }: props) {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
}

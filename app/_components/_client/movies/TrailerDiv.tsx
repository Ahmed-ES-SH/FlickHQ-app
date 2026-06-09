"use client";
import { useVariables } from "@/app/context/VariablesContext";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface props {
  children: React.ReactNode;
}

export default function TrailerDiv({ children }: props) {
  const { trailerState } = useVariables();
  return (
    <AnimatePresence>
      {trailerState && (
        <motion.div
          initial={{ opacity: 0, y: -200 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -200 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-center fixed top-0 left-0 bg-black/50 backdrop-blur-md w-full h-screen z-[99]"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

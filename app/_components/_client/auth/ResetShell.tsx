"use client";

// //////////////////////////////////////////////////////////////////////////////
// /////// ResetShell — Status display for reset-password flow //////////////////
// /////// Shows loading, success, or error state with animated icon ////////////
// //////////////////////////////////////////////////////////////////////////////

import { motion } from "framer-motion";
import { VscLoading } from "react-icons/vsc";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface ResetShellProps {
  icon: "loading" | "success" | "error";
  title: string;
  message: string;
  footer?: React.ReactNode;
}

export default function ResetShell({
  icon,
  title,
  message,
  footer,
}: ResetShellProps) {
  return (
    <div className="relative z-10 w-full max-w-md mx-auto px-4 py-8 text-center space-y-6">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
        className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center border-2 ${
          icon === "success"
            ? "bg-green-500/10 border-green-500/40"
            : icon === "error"
              ? "bg-red-500/10 border-red-500/40"
              : "bg-accent/10 border-accent/40"
        }`}
      >
        {icon === "loading" && (
          <VscLoading className="text-accent text-3xl animate-spin" />
        )}
        {icon === "success" && (
          <FaCheckCircle className="text-green-400 text-3xl" />
        )}
        {icon === "error" && (
          <FaTimesCircle className="text-red-400 text-3xl" />
        )}
      </motion.div>
      <h1 className="text-white text-3xl sm:text-4xl font-black uppercase tracking-tighter italic">
        {title}
      </h1>
      <p className="text-gray-400 text-sm sm:text-base">{message}</p>
      {footer && <div className="flex justify-center">{footer}</div>}
    </div>
  );
}

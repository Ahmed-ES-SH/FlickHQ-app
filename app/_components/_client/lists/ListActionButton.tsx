"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { LuLoader, LuCheck, LuX } from "react-icons/lu";
import { motion } from "framer-motion";

export type ButtonState = "idle" | "loading" | "success" | "error";

interface Props {
  state: ButtonState;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  active?: boolean;
  activeClassName?: string;
  disabled?: boolean;
  ariaLabel?: string;
  icon?: React.ReactNode;
  activeIcon?: React.ReactNode;
  loadingIcon?: React.ReactNode;
}

/**
 * ListActionButton — Reusable button with loading/success/error visual states.
 *
 * - **idle**: Normal button (shows `icon` or `children` if not active, `activeIcon` if active)
 * - **loading**: Spinning loader replaces icon
 * - **success**: Brief checkmark animation (auto-clears after 1.5s)
 * - **error**: Shake animation (auto-clears after 2s)
 *
 * The parent controls `state`. After a mutation completes, set state to
 * "success" or "error" briefly, then reset to "idle".
 */
export default function ListActionButton({
  state,
  onClick,
  children,
  className = "",
  active = false,
  activeClassName = "",
  disabled = false,
  ariaLabel,
  icon,
  activeIcon,
  loadingIcon,
}: Props) {
  const [showFeedback, setShowFeedback] = useState<"success" | "error" | null>(null);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync external state to internal feedback display
  useEffect(() => {
    if (state === "success") {
      setShowFeedback("success");
      feedbackTimer.current = setTimeout(() => setShowFeedback(null), 1500);
    } else if (state === "error") {
      setShowFeedback("error");
      feedbackTimer.current = setTimeout(() => setShowFeedback(null), 2000);
    } else {
      setShowFeedback(null);
    }

    return () => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    };
  }, [state]);

  const isLoading = state === "loading";

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-label={ariaLabel}
      aria-disabled={disabled || isLoading}
      animate={
        showFeedback === "error" ? { x: [0, -4, 4, -4, 4, 0] } : { x: 0 }
      }
      transition={
        showFeedback === "error"
          ? { duration: 0.4, ease: "easeInOut" }
          : { duration: 0.2 }
      }
      className={`relative flex items-center justify-center transition-all duration-200 outline-none ${
        active ? activeClassName || className : className
      } ${isLoading ? "pointer-events-none" : ""} ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      {/* Loading spinner */}
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          {loadingIcon || <LuLoader className="size-5 animate-spin" />}
        </span>
      )}

      {/* Success checkmark */}
      {showFeedback === "success" && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 flex items-center justify-center text-green-400"
        >
          <LuCheck className="size-5" />
        </motion.span>
      )}

      {/* Error X */}
      {showFeedback === "error" && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 flex items-center justify-center text-red-400"
        >
          <LuX className="size-5" />
        </motion.span>
      )}

      {/* Content (icon/children) — hidden during feedback states */}
      <span
        className={`flex items-center gap-2 ${
          isLoading || showFeedback ? "invisible" : "visible"
        }`}
      >
        {active && activeIcon ? activeIcon : icon}
        {children}
      </span>
    </motion.button>
  );
}

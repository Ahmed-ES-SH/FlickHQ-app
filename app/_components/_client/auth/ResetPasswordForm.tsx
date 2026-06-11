"use client";

// //////////////////////////////////////////////////////////////////////////////
// /////// ResetPasswordForm — Password reset form with validation //////////////
// /////// Manages local input state, show/hide toggle, client validation ///////
// //////////////////////////////////////////////////////////////////////////////

import { useState } from "react";
import { motion } from "framer-motion";
import { VscLoading } from "react-icons/vsc";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";

interface ResetPasswordFormProps {
  message: string;
  onSubmit: (password: string) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
  submitError: string | null;
}

export default function ResetPasswordForm({
  message,
  onSubmit,
  isSubmitting,
  error,
  submitError,
}: ResetPasswordFormProps) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // ── Validation ──────────────────────────────────────────────────────────
  const validatePassword = (): string | null => {
    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirm) return "Passwords do not match.";
    return null;
  };

  // ── Submit handler ──────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validatePassword();
    if (validationError) {
      setLocalError(validationError);
      return;
    }
    setLocalError(null);
    await onSubmit(password);
  };

  const displayError = localError || error || submitError;

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="relative z-10 w-full max-w-md mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-white text-3xl sm:text-4xl font-black uppercase tracking-tighter italic">
          New <span className="text-accent">Password</span>
        </h1>
        <p className="text-gray-400 text-sm">{message}</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white/[0.03] backdrop-blur-2xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-5"
      >
        <div className="w-full relative group">
          <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent duration-300" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-10 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent duration-300 placeholder:text-gray-500"
          />
          {showPassword ? (
            <FaEyeSlash
              onClick={() => setShowPassword(false)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
            />
          ) : (
            <FaEye
              onClick={() => setShowPassword(true)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
            />
          )}
        </div>

        <div className="w-full relative group">
          <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent duration-300" />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent duration-300 placeholder:text-gray-500"
          />
        </div>

        {displayError && <p className="text-red-500 text-sm">{displayError}</p>}

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative bg-accent hover:bg-[#ff0a16] text-white px-6 py-3.5 w-full rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 duration-300 shadow-lg shadow-accent/20 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <VscLoading className="size-5 animate-spin" />
          ) : (
            "Reset Password"
          )}
        </motion.button>
      </form>
    </div>
  );
}

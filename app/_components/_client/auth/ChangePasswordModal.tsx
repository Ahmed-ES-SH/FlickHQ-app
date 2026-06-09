"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuX,
  LuEye,
  LuEyeOff,
  LuCheck,
  LuLoader,
  LuLock,
} from "react-icons/lu";
import { updatePasswordAction } from "@/app/_actions/profile";
import { logoutAction } from "@/app/_actions/auth";
import { useAuthStore } from "@/app/_stores/authStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// ── Password validation ────────────────────────────────────────
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const PASSWORD_HINT =
  "Minimum 8 characters with at least one uppercase, one lowercase, and one number";

// ── Props ──────────────────────────────────────────────────────
interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
}

// ── Component ──────────────────────────────────────────────────
export default function ChangePasswordModal({
  isOpen,
  onClose,
  userId,
}: ChangePasswordModalProps) {
  const router = useRouter();
  const clearAuth = useAuthStore((s) => s.clear);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirm?: string;
    general?: string;
  }>({});

  // ── Validation ────────────────────────────────────────────────
  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!password) {
      newErrors.password = "Password is required";
    } else if (!PASSWORD_REGEX.test(password)) {
      newErrors.password = PASSWORD_HINT;
    }

    if (!confirmPassword) {
      newErrors.confirm = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirm = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ── Submit ────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // Only send `password` — never send the confirmation to the backend
      const result = await updatePasswordAction(userId, password);

      if (result.success) {
        toast.success(result.message);
        handleClose();

        // Backend likely invalidates the existing token on password change.
        // Force re-login by clearing session and redirecting to sign-in.
        await logoutAction();
        clearAuth();
        router.push("/signin");
      } else {
        setErrors({ general: result.message });
        toast.error(result.message);
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Close (reset state) ──────────────────────────────────────
  const handleClose = () => {
    if (isSubmitting) return;
    setPassword("");
    setConfirmPassword("");
    setErrors({});
    onClose();
  };

  // ── Render ────────────────────────────────────────────────────
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="bg-panel_bg border border-glass_border rounded-xl p-6 w-full max-w-md shadow-2xl"
          >
            {/* ── Header ─────────────────────────────────────── */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <LuLock className="text-accent size-5" />
                <h2 className="text-lg font-semibold text-white">
                  Change Password
                </h2>
              </div>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="text-second_text hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
                aria-label="Close modal"
              >
                <LuX className="size-5" />
              </button>
            </div>

            {/* ── Form ───────────────────────────────────────── */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-second_text uppercase tracking-wider">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
                    }}
                    placeholder="Enter new password"
                    className="w-full bg-fourth_color border border-glass_border rounded-lg px-4 py-2.5 pr-10 text-sm text-white placeholder-gray-500 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-second_text hover:text-white transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <LuEyeOff className="size-4" />
                    ) : (
                      <LuEye className="size-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-400">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-second_text uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirm) setErrors((p) => ({ ...p, confirm: undefined }));
                    }}
                    placeholder="Confirm new password"
                    className="w-full bg-fourth_color border border-glass_border rounded-lg px-4 py-2.5 pr-10 text-sm text-white placeholder-gray-500 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-colors"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-second_text hover:text-white transition-colors"
                    tabIndex={-1}
                    aria-label={showConfirm ? "Hide password" : "Show password"}
                  >
                    {showConfirm ? (
                      <LuEyeOff className="size-4" />
                    ) : (
                      <LuEye className="size-4" />
                    )}
                  </button>
                </div>
                {errors.confirm && (
                  <p className="text-xs text-red-400">{errors.confirm}</p>
                )}
              </div>

              {/* Requirements hint */}
              <p className="text-[11px] text-second_text leading-relaxed">
                Password must be at least 8 characters with at least one
                uppercase letter, one lowercase letter, and one number.
              </p>

              {/* General error */}
              {errors.general && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
                  <p className="text-xs text-red-400 text-center">
                    {errors.general}
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-accent text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-red-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isSubmitting ? (
                  <>
                    <LuLoader className="size-4 animate-spin" />
                    Updating…
                  </>
                ) : (
                  <>
                    <LuCheck className="size-4" />
                    Update Password
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

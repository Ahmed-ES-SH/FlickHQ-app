"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { VscLoading } from "react-icons/vsc";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { toast } from "sonner";
import Link from "next/link";
import {
  resetPasswordAction,
  verifyResetTokenAction,
} from "@/app/_actions/auth";

function ResetPasswordContent() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const email = params.get("e") ?? "";

  const [status, setStatus] = useState<
    "verifying" | "ready" | "invalid" | "submitting" | "success" | "error"
  >(token ? "verifying" : "invalid");
  const [message, setMessage] = useState("Validating reset link...");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !email) {
      setStatus("invalid");
      setMessage("Invalid or incomplete reset link.");
      return;
    }
    let cancelled = false;
    (async () => {
      const res = await verifyResetTokenAction({ token, email });
      if (cancelled) return;
      if (res.success) {
        setStatus("ready");
        setMessage("Token is valid. Choose a new password.");
      } else {
        setStatus("invalid");
        setMessage(res.message || "Reset link is invalid or has expired.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, email]);

  const validatePassword = (): string | null => {
    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirm) return "Passwords do not match.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validatePassword();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setStatus("submitting");
    const res = await resetPasswordAction({ email, token, password });
    if (res.success) {
      setStatus("success");
      setMessage("Password changed successfully. Redirecting to sign in...");
      toast.success("Password changed successfully");
      setTimeout(() => router.replace("/signin"), 1500);
    } else {
      setStatus("error");
      setMessage(res.message || "Could not reset password.");
      toast.error(res.message || "Password reset failed");
    }
  };

  if (status === "verifying") {
    return <ResetShell icon="loading" title="Verifying" message={message} />;
  }

  if (status === "invalid") {
    return (
      <ResetShell
        icon="error"
        title="Link expired"
        message={message}
        footer={
          <Link
            href="/forget-password"
            className="bg-accent hover:bg-[#ff0a16] text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm"
          >
            Request a new link
          </Link>
        }
      />
    );
  }

  if (status === "success") {
    return (
      <ResetShell icon="success" title="Password updated" message={message} />
    );
  }

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

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {status === "error" && (
          <p className="text-red-500 text-sm">{message}</p>
        )}

        <motion.button
          type="submit"
          disabled={status === "submitting"}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="relative bg-accent hover:bg-[#ff0a16] text-white px-6 py-3.5 w-full rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 duration-300 shadow-lg shadow-accent/20 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {status === "submitting" ? (
            <VscLoading className="size-5 animate-spin" />
          ) : (
            "Reset Password"
          )}
        </motion.button>
      </form>
    </div>
  );
}

function ResetShell({
  icon,
  title,
  message,
  footer,
}: {
  icon: "loading" | "success" | "error";
  title: string;
  message: string;
  footer?: React.ReactNode;
}) {
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

export default function ResetPasswordPage() {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-black font-sans selection:bg-accent selection:text-white">
      <Suspense
        fallback={
          <ResetShell
            icon="loading"
            title="Loading"
            message="Preparing reset form..."
          />
        }
      >
        <ResetPasswordContent />
      </Suspense>
    </div>
  );
}

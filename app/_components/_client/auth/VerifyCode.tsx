"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { VscLoading } from "react-icons/vsc";
import { FaCheckCircle, FaEnvelope } from "react-icons/fa";
import { toast } from "sonner";

interface VerifyCodeProps {
  email?: string;
}

export default function VerifyCode({ email }: VerifyCodeProps) {
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    if (!email) {
      toast.info("Please sign in again to resend the verification email.");
      return;
    }
    setLoading(true);
    try {
      const { resendVerificationAction } = await import("@/app/_actions/auth");
      const res = await resendVerificationAction(email);
      if (!res.success) {
        toast.error(res.message);
        return;
      }
      setResent(true);
      toast.success("Verification email resent. Check your inbox.");
    } catch (error) {
      console.error(error);
      toast.error("Could not resend verification email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="h-fit flex flex-col items-center justify-center bg-transparent space-y-8 w-full"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="w-20 h-20 rounded-full bg-accent/10 border-2 border-accent/40 flex items-center justify-center"
      >
        <FaEnvelope className="text-accent text-3xl" />
      </motion.div>

      <div className="text-center space-y-2">
        <h3 className="text-white text-xl font-bold uppercase tracking-wider">
          Confirm your email
        </h3>
        <p className="text-gray-400 text-sm">
          {`We've sent a verification link${email ? ` to ${email}` : ""}.`}
          <br />
          Click the link in the email to activate your account.
        </p>
      </div>

      {resent && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-green-400 text-sm"
        >
          <FaCheckCircle />
          <span>A fresh verification email is on its way.</span>
        </motion.div>
      )}

      <button
        type="button"
        onClick={handleResend}
        disabled={loading}
        className="text-gray-500 hover:text-white text-sm font-medium transition-colors duration-300 underline underline-offset-4 disabled:opacity-50"
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <VscLoading className="size-4 animate-spin" />
            Resending...
          </span>
        ) : (
          "Resend verification email"
        )}
      </button>
    </form>
  );
}

"use client";

// //////////////////////////////////////////////////////////////////////////////
// /////// ResetPasswordContent — Orchestrates token verification and form //////
// /////// Handles state machine: verifying → ready/invalid → submitting → succ//
// //////////////////////////////////////////////////////////////////////////////

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import {
  resetPasswordAction,
  verifyResetTokenAction,
} from "@/app/_actions/auth";
import ResetShell from "./ResetShell";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPasswordContent() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const email = params.get("e") ?? "";

  const [status, setStatus] = useState<
    "verifying" | "ready" | "invalid" | "submitting" | "success" | "error"
  >(token ? "verifying" : "invalid");
  const [message, setMessage] = useState("Validating reset link...");
  const [error, setError] = useState<string | null>(null);

  // ── Verify token on mount ──────────────────────────────────────────────
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

  // ── Handle form submission ──────────────────────────────────────────────
  const handleSubmit = async (password: string) => {
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

  // ── Status-based rendering ──────────────────────────────────────────────
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
    <ResetPasswordForm
      message={message}
      onSubmit={handleSubmit}
      isSubmitting={status === "submitting"}
      error={error}
      submitError={status === "error" ? message : null}
    />
  );
}

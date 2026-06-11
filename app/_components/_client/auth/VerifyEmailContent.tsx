"use client";

// //////////////////////////////////////////////////////////////////////////////
// /////// VerifyEmailContent — Handles email verification flow /////////////////
// /////// Reads token from URL params, verifies via server action, displays ////
// /////// status using ResetShell (loading/success/error) ///////////////////////
// //////////////////////////////////////////////////////////////////////////////

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { verifyEmailAction } from "@/app/_actions/auth";
import ResetShell from "./ResetShell";

export default function VerifyEmailContent() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("Verifying your email...");
  const ranRef = useRef(false);

  // ── Verify token on mount (guard against double-call in Strict Mode) ─────
  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Missing verification token.");
      return;
    }
    if (ranRef.current) return;
    ranRef.current = true;

    (async () => {
      const res = await verifyEmailAction(token);
      if (res.success) {
        setStatus("success");
        setMessage("Email verified successfully. You can now sign in.");
        toast.success("Email verified!");
        setTimeout(() => router.replace("/signin"), 1500);
      } else {
        setStatus("error");
        setMessage(res.message || "Verification failed.");
        toast.error(res.message || "Verification failed");
      }
    })();
  }, [token, router]);

  // ── Dynamic props for ResetShell ─────────────────────────────────────────
  const title = status === "success" ? "All Set" : "Verification";

  const footer =
    status === "error" ? (
      <Link
        href="/signup"
        className="bg-accent hover:bg-[#ff0a16] text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm"
      >
        Back to Sign Up
      </Link>
    ) : undefined;

  return (
    <ResetShell icon={status} title={title} message={message} footer={footer} />
  );
}

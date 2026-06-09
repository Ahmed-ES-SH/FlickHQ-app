"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { VscLoading } from "react-icons/vsc";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Link from "next/link";
import { toast } from "sonner";
import { verifyEmailAction } from "@/app/_actions/auth";

export default function VerifyEmailPage() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");

  const [status, setStatus] = useState<"pending" | "success" | "error">(
    "pending",
  );
  const [message, setMessage] = useState("Verifying your email...");
  const ranRef = useRef(false);

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

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-black font-sans selection:bg-accent selection:text-white">
      <div className="relative z-10 w-full max-w-md mx-auto px-4 py-8 text-center space-y-6">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center border-2 ${
            status === "success"
              ? "bg-green-500/10 border-green-500/40"
              : status === "error"
                ? "bg-red-500/10 border-red-500/40"
                : "bg-accent/10 border-accent/40"
          }`}
        >
          {status === "pending" && (
            <VscLoading className="text-accent text-3xl animate-spin" />
          )}
          {status === "success" && (
            <FaCheckCircle className="text-green-400 text-3xl" />
          )}
          {status === "error" && (
            <FaTimesCircle className="text-red-400 text-3xl" />
          )}
        </motion.div>

        <h1 className="text-white text-3xl sm:text-4xl font-black uppercase tracking-tighter italic">
          {status === "success" ? "All Set" : "Verification"}
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">{message}</p>

        {status === "error" && (
          <div className="flex flex-col gap-3 items-center">
            <Link
              href="/signup"
              className="bg-accent hover:bg-[#ff0a16] text-white px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-sm"
            >
              Back to Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

// //////////////////////////////////////////////////////////////////////////////
// /////// Contact form — Client Component /////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////

import React, { useState, useRef, useCallback } from "react";
import { LuSend, LuLoader, LuClock } from "react-icons/lu";
import { submitContactAction } from "@/app/_actions/contact";
import { validateFields } from "@/app/_helpers/contact/validation";
import type { FieldErrors } from "@/app/_helpers/contact/validation";
import ContactStatusMessage, {
  type SubmitStatus,
} from "@/app/_components/_website/_contact/ContactStatusMessage";

// //////////////////////////////////////////////////////////////////////////////
// /////// Tailwind class strings for form inputs //////////////////////////////
// //////////////////////////////////////////////////////////////////////////////

const inputStyle =
  "w-full p-2 rounded-xl bg-fourth_color text-gray-200 border-none outline-none placeholder:text-white placeholder:font-light placeholder:px-2 focus:ring-2 focus:ring-sky-300 duration-300";
const inputErrorStyle =
  "max-lg:w-full p-2 rounded-xl bg-fourth_color text-gray-200 border border-red-500/60 outline-none placeholder:text-white placeholder:font-light placeholder:px-2 focus:ring-2 focus:ring-red-400 duration-300";

export default function ContactForm() {
  // ── Form state ───────────────────────────────────────────────────────────

  const [fields, setFields] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<SubmitStatus>({ type: "idle" });
  const [rateLimitTimer, setRateLimitTimer] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isSending = status.type === "sending";
  const isDisabled = isSending || status.type === "rate_limited";

  // ── Format cooldown time ─────────────────────────────────────────────────

  const formatCooldown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  // ── Handle field changes ─────────────────────────────────────────────────

  const handleChange = useCallback(
    (field: keyof typeof fields) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFields((prev) => ({ ...prev, [field]: e.target.value }));
        // Clear field error on change
        if (errors[field as keyof FieldErrors]) {
          setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
        // Reset success/error when user starts typing again
        if (status.type === "success" || status.type === "error") {
          setStatus({ type: "idle" });
        }
      },
    [errors, status.type],
  );

  // ── Submit handler ───────────────────────────────────────────────────────

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate
      const validationErrors = validateFields(fields);
      setErrors(validationErrors);

      if (Object.keys(validationErrors).length > 0) return;

      setStatus({ type: "sending" });

      try {
        const result = await submitContactAction({
          fullName: fields.fullName.trim(),
          email: fields.email.trim(),
          subject: fields.subject.trim(),
          message: fields.message.trim(),
        });

        if (result.success && result.data) {
          setStatus({ type: "success", data: result.data });
          setFields({ fullName: "", email: "", subject: "", message: "" });
        } else if (result.statusCode === 429) {
          // Rate limited — set a 1-hour cooldown timer
          setStatus({ type: "rate_limited", retryAfter: 3600 });
          startRateLimitTimer(3600);
        } else {
          setStatus({
            type: "error",
            message:
              result.message || "Something went wrong. Please try again.",
          });
        }
      } catch {
        setStatus({
          type: "error",
          message: "Network error. Please check your connection and try again.",
        });
      }
    },
    [fields],
  );

  // ── Rate-limit countdown timer ───────────────────────────────────────────

  const startRateLimitTimer = useCallback((seconds: number) => {
    setRateLimitTimer(seconds);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setRateLimitTimer((prev) => {
        if (prev === null || prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
          setStatus({ type: "idle" });
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // Cleanup timer on unmount
  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ── Render ───────────────────────────────────────────────────────────────

  //////////////////////////////////////////////////////////////////////////////
  ///////// Compute formatted cooldown string for status display ///////////////
  //////////////////////////////////////////////////////////////////////////////
  const formattedCooldown =
    rateLimitTimer !== null ? formatCooldown(rateLimitTimer) : null;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex-2/3 max-lg:w-full p-3 lg:p-6 border border-gray-800 rounded-xl"
    >
      {/* Name & Email row */}
      <div className="max-lg:flex-col flex items-center justify-between gap-4 w-full">
        <div className="flex-1 w-full">
          <input
            type="text"
            name="fullName"
            placeholder="Name ..."
            value={fields.fullName}
            onChange={handleChange("fullName")}
            className={
              errors.fullName
                ? `${inputErrorStyle} flex-1`
                : `${inputStyle} flex-1`
            }
            disabled={isDisabled}
            maxLength={100}
          />
          {errors.fullName && (
            <p className="text-red-400 text-xs mt-1 px-1">{errors.fullName}</p>
          )}
        </div>
        <div className="flex-1 w-full">
          <input
            type="email"
            name="email"
            placeholder="Email ..."
            value={fields.email}
            onChange={handleChange("email")}
            className={
              errors.email
                ? `${inputErrorStyle} flex-1`
                : `${inputStyle} flex-1`
            }
            disabled={isDisabled}
            maxLength={255}
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1 px-1">{errors.email}</p>
          )}
        </div>
      </div>

      {/* Subject */}
      <div className="mt-4">
        <input
          type="text"
          placeholder="Subject ..."
          value={fields.subject}
          onChange={handleChange("subject")}
          className={
            errors.subject
              ? `${inputErrorStyle} w-full`
              : `${inputStyle} w-full`
          }
          disabled={isDisabled}
          maxLength={200}
        />
        {errors.subject && (
          <p className="text-red-400 text-xs mt-1 px-1">{errors.subject}</p>
        )}
      </div>

      {/* Message */}
      <div className="mt-4">
        <textarea
          placeholder="Type your message ..."
          value={fields.message}
          onChange={handleChange("message")}
          className={
            errors.message
              ? `${inputErrorStyle} w-full h-[18vh] resize-none`
              : `${inputStyle} w-full h-[18vh] resize-none`
          }
          disabled={isDisabled}
          maxLength={5000}
        />
        {errors.message && (
          <p className="text-red-400 text-xs mt-1 px-1">{errors.message}</p>
        )}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isDisabled}
        className="py-4 px-6 lg:px-20 mt-4 cursor-pointer hover:bg-white hover:text-black hover:border-sky-400 border border-transparent hover:scale-110 duration-200 bg-primary_blue text-white text-center rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-primary_blue disabled:hover:text-white inline-flex items-center gap-2"
      >
        {isSending ? (
          <>
            <LuLoader className="size-5 animate-spin" />
            Sending...
          </>
        ) : status.type === "rate_limited" ? (
          <>
            <LuClock className="size-5" />
            Try again in {formattedCooldown ?? "..."}
          </>
        ) : (
          <>
            <LuSend className="size-5" />
            Submit
          </>
        )}
      </button>

      {/* Status messages */}
      <ContactStatusMessage
        status={status}
        formattedCooldown={formattedCooldown}
      />
    </form>
  );
}

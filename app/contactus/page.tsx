"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BiLogoFacebook } from "react-icons/bi";
import { FaPhone, FaTiktok } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaXTwitter } from "react-icons/fa6";
import { CiInstagram } from "react-icons/ci";
import { LuSend, LuTriangleAlert, LuLoader, LuClock } from "react-icons/lu";
import SwiperBartners from "@/app/_components/_website/_pricing/SwiperBartners";
import { submitContactAction } from "@/app/_actions/contact";
import type { SubmitContactResponse } from "@/app/types/contact";
import { IoCheckmarkCircle } from "react-icons/io5";

// ─── Field errors type ─────────────────────────────

type FieldErrors = {
  fullName?: string;
  email?: string;
  subject?: string;
  message?: string;
};

// ─── Client-side validation (mirrors backend rules) ─

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateFields(fields: {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}): FieldErrors {
  const errors: FieldErrors = {};
  const trimmed = {
    fullName: fields.fullName.trim(),
    email: fields.email.trim(),
    subject: fields.subject.trim(),
    message: fields.message.trim(),
  };

  if (!trimmed.fullName) errors.fullName = "Name is required";
  else if (trimmed.fullName.length > 100)
    errors.fullName = "Name must be 100 characters or less";

  if (!trimmed.email) errors.email = "Email is required";
  else if (!EMAIL_REGEX.test(trimmed.email))
    errors.email = "Please enter a valid email address";
  else if (trimmed.email.length > 255)
    errors.email = "Email must be 255 characters or less";

  if (!trimmed.subject) errors.subject = "Subject is required";
  else if (trimmed.subject.length > 200)
    errors.subject = "Subject must be 200 characters or less";

  if (!trimmed.message) errors.message = "Message is required";
  else if (trimmed.message.length < 10)
    errors.message = "Message must be at least 10 characters";
  else if (trimmed.message.length > 5000)
    errors.message = "Message must be 5000 characters or less";

  return errors;
}

// ─── Social icons ──────────────────────────────────

const socialIcons = [
  { icon: <BiLogoFacebook className="size-6" />, bg_color: "bg-[#1877f2]" },
  { icon: <FaXTwitter className="size-6" />, bg_color: "bg-[#000000]" },
  { icon: <CiInstagram className="size-6" />, bg_color: "bg-[#f56040]" },
  { icon: <FaTiktok className="size-6" />, bg_color: "bg-[#000000]" },
];

// ─── Status states ─────────────────────────────────

type SubmitStatus =
  | { type: "idle" }
  | { type: "sending" }
  | { type: "success"; data: SubmitContactResponse }
  | { type: "error"; message: string }
  | { type: "rate_limited"; retryAfter: number };

// ─── Page ──────────────────────────────────────────

export default function Contactus() {
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

  const inputStyle =
    "max-lg:w-full p-2 rounded-xl bg-fourth_color text-gray-200 border-none outline-none placeholder:text-white placeholder:font-light placeholder:px-2 focus:ring-2 focus:ring-sky-300 duration-300";
  const inputErrorStyle =
    "max-lg:w-full p-2 rounded-xl bg-fourth_color text-gray-200 border border-red-500/60 outline-none placeholder:text-white placeholder:font-light placeholder:px-2 focus:ring-2 focus:ring-red-400 duration-300";

  // ── Handle field changes ─────────────────────────

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

  // ── Submit handler ───────────────────────────────

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

  // ── Rate-limit countdown timer ───────────────────

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

  // ── Format rate-limit time ───────────────────────

  const formatCooldown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  // ── Render ───────────────────────────────────────

  const isSending = status.type === "sending";
  const isDisabled = isSending || status.type === "rate_limited";

  return (
    <>
      <div className="lg:mt-32 mt-20 custom-container min-h-screen">
        <h1 className="text-gray-200 text-2xl xl:text-5xl mb-12">Contact Us</h1>
        <div className="max-lg:flex-col flex items-start justify-between w-full gap-6 mt-12">
          {/* Form */}
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
                  <p className="text-red-400 text-xs mt-1 px-1">
                    {errors.fullName}
                  </p>
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
                  <p className="text-red-400 text-xs mt-1 px-1">
                    {errors.email}
                  </p>
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
                <p className="text-red-400 text-xs mt-1 px-1">
                  {errors.subject}
                </p>
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
                <p className="text-red-400 text-xs mt-1 px-1">
                  {errors.message}
                </p>
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
                  Try again in{" "}
                  {rateLimitTimer !== null
                    ? formatCooldown(rateLimitTimer)
                    : "..."}
                </>
              ) : (
                <>
                  <LuSend className="size-5" />
                  Submit
                </>
              )}
            </button>

            {/* Status messages */}
            <AnimatePresence mode="wait">
              {status.type === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 p-4 bg-green-900/30 border border-green-500/30 rounded-xl flex items-start gap-3"
                >
                  <IoCheckmarkCircle className="size-5 text-green-400 shrink-0 mt-0.5" />
                  <p className="text-green-300 text-sm">
                    {status.data.message ||
                      "Your message has been sent successfully!"}
                  </p>
                </motion.div>
              )}

              {status.type === "error" && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 p-4 bg-red-900/30 border border-red-500/30 rounded-xl flex items-start gap-3"
                >
                  <LuTriangleAlert className="size-5 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-red-300 text-sm">{status.message}</p>
                </motion.div>
              )}

              {status.type === "rate_limited" && (
                <motion.div
                  key="rate-limit"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 p-4 bg-yellow-900/30 border border-yellow-500/30 rounded-xl flex items-start gap-3"
                >
                  <LuClock className="size-5 text-yellow-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-yellow-300 text-sm font-medium">
                      You&apos;ve reached the hourly limit
                    </p>
                    <p className="text-yellow-400/70 text-xs mt-1">
                      Please try again in{" "}
                      {rateLimitTimer !== null
                        ? formatCooldown(rateLimitTimer)
                        : "..."}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* Info */}
          <div className="lg:flex-[40%] w-full flex-1 flex flex-col gap-4 max-lg:pt-5 max-lg:border-t max-lg:border-gray-600">
            <h1 className="text-white text-xl lg:text-4xl">Info</h1>
            <p className="text-lg text-white leading-8">
              It is a long fact that a reader will be distracted by the readable
              content of a page when looking at its layout
            </p>
            {/* Phone Number */}
            <div className="flex items-baseline gap-2 md:mt-6">
              <FaPhone className="text-primary_blue size-6 lg:size-8 rotate-[150deg]" />
              <p className="cursor-pointer hover:text-primary_blue duration-300 lg:text-xl text-lg text-white">
                +1 809 234-56-78
              </p>
            </div>
            {/* Email */}
            <div className="flex items-center gap-2 mt-2">
              <MdEmail className="text-primary_blue size-6 lg:size-8" />
              <p className="cursor-pointer hover:text-primary_blue duration-300 lg:text-xl text-lg text-white">
                support@FlickHQ.template
              </p>
            </div>
            {/* Social Icons */}
            <div className="flex items-center gap-6 mt-6">
              {socialIcons.map((item, index) => (
                <div
                  key={index}
                  className={`w-10 h-10 hover:-translate-y-2 duration-200 cursor-pointer rounded-full ${item.bg_color} flex items-center justify-center`}
                >
                  {item.icon}
                </div>
              ))}
            </div>
          </div>
        </div>
        <SwiperBartners />
      </div>
    </>
  );
}

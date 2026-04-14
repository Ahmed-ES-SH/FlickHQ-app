"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa6";
import Img from "@/app/_components/_globalComponents/Img";
import Link from "next/link";

export default function ForgetPassword() {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center lg:justify-start overflow-hidden bg-black font-sans selection:bg-accent selection:text-white">
      {/* Cinematic Background with Ken Burns Effect */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1.15, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.6 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="w-full h-full"
        >
          <Img
            src="/website/main-bg.jpg"
            className="w-full h-full object-cover"
          />
        </motion.div>
        {/* Robust Gradient Mask for readability */}
        <div className="absolute inset-0 bg-linear-to-r from-black via-black/95 via-40% to-transparent max-lg:bg-black/75" />
      </div>

      {/* Film Grain Texture for Cinematic Feel */}
      <div className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* Form Content - Staggered Orchestration */}
      <motion.div
        className="relative z-10 w-full max-w-md lg:ml-[10%] xl:ml-[15%] p-8 lg:p-12"
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex flex-col gap-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="w-fit"
            >
              <Img
                src="/logo.webp"
                className="w-32 mb-8 drop-shadow-[0_0_15px_rgba(229,9,20,0.3)]"
              />
            </motion.div>

            <h1 className="text-white text-5xl lg:text-7xl font-black tracking-tighter mb-4 leading-[0.9] uppercase italic">
              Lost your <br />
              <span className="text-accent drop-shadow-[0_0_20px_rgba(229,9,20,0.4)]">
                Access?
              </span>
            </h1>
            <p className="text-lg text-gray-400 font-medium max-w-xs leading-snug">
              {`No worries. Enter your email and we'll`} <br />
              <span className="text-gray-500 italic">
                get you back into the action.
              </span>
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="bg-white/[0.03] backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden group space-y-6"
          >
            {/* Subtle glow inside the card */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/10 rounded-full blur-[60px] group-hover:bg-accent/20 transition-colors duration-700" />

            <div className="w-full relative group/input">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within/input:text-accent duration-300" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent duration-300 placeholder:text-gray-500"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-accent hover:bg-[#ff0a16] text-white px-6 py-3.5 w-full rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 duration-300 shadow-lg shadow-accent/20"
            >
              Send Instructions
            </motion.button>

            <Link
              href="/signin"
              className="flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 text-sm font-medium group/link"
            >
              <FaArrowLeft className="size-3 group-hover/link:-translate-x-1 duration-300" />
              Back to Sign In
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Interactive Aesthetic Detail: Subtle Parallax Glow */}
      <motion.div
        animate={{
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none"
      />
    </div>
  );
}

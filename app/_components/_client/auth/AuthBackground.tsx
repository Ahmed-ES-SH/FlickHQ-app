"use client";
import { motion } from "framer-motion";
import Img from "@/app/_components/_globalComponents/Img";

export default function AuthBackground() {
  return (
    <>
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
    </>
  );
}

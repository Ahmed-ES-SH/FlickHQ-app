"use client";
import { motion } from "framer-motion";

interface AuthHeadingProps {
  title: string;
  highlight: string;
  subtitle: string;
  subtitleItalic: string;
}

export default function AuthHeading({
  title,
  highlight,
  subtitle,
  subtitleItalic,
}: AuthHeadingProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.8 }}
    >
      <h1 className="text-white text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-3 sm:mb-4 leading-[0.9] uppercase italic">
        {title} <br />
        <span className="text-accent drop-shadow-[0_0_20px_rgba(229,9,20,0.4)]">
          {highlight}
        </span>
      </h1>
      <p className="text-center text-base sm:text-lg text-gray-400 font-medium leading-snug">
        {subtitle} <br />
        <span className="text-gray-500 italic">{subtitleItalic}</span>
      </p>
    </motion.div>
  );
}

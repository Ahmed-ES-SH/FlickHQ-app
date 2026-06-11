"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FaPlay } from "react-icons/fa";
import type { ShowType } from "@/app/types/websiteTypes";
import type { ReactNode } from "react";

// //////////////////////////////////////////////////////////////////////////////
// ///////// Animated content overlay for each hero slide (title, desc, CTA) ////
// //////////////////////////////////////////////////////////////////////////////

export default function HeroSlideContent({
  movie,
  onPlay,
  isActive,
}: {
  movie: ShowType;
  onPlay: () => void;
  isActive: boolean;
}) {
  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 z-20 flex flex-col justify-end px-4 pb-24 sm:pb-28 md:pb-36 md:px-8 custom-container"
        >
          <div className="max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.25, 1],
              }}
              className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold text-white mb-3 line-clamp-2 leading-tight"
            >
              {movie.title || movie.name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{
                duration: 0.5,
                delay: 0.15,
                ease: [0.22, 1, 0.25, 1],
              }}
              className="text-second_text text-sm sm:text-base md:text-lg line-clamp-2 sm:line-clamp-3 mb-6 max-w-xl leading-relaxed"
            >
              {movie.overview}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{
                duration: 0.5,
                delay: 0.3,
                ease: [0.22, 1, 0.25, 1],
              }}
              className="flex flex-wrap items-center gap-3"
            ></motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

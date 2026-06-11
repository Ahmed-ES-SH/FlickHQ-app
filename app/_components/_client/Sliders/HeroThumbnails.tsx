"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs } from "swiper/modules";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { ShowType } from "@/app/types/websiteTypes";
import type { Swiper as SwiperType } from "swiper";

// //////////////////////////////////////////////////////////////////////////////
// ///////// Thumbnail navigation + Movies/Shows toggle for HeroSlider //////////
// //////////////////////////////////////////////////////////////////////////////

export default function HeroThumbnails({
  data,
  activeIndex,
  trendingState,
  onTrendingToggle,
  onThumbsSwiper,
}: {
  data: ShowType[];
  activeIndex: number;
  trendingState: "movies" | "shows";
  onTrendingToggle: (state: "movies" | "shows") => void;
  onThumbsSwiper: (swiper: SwiperType) => void;
}) {
  return (
    <div className="relative -mt-8 sm:-mt-10 md:-mt-12 z-30 px-4 md:px-8 custom-container">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-white text-xs sm:text-sm font-medium tracking-wide uppercase opacity-70">
          Now Trending
        </h4>

        {/* Movies/Shows Toggle — flashy sliding pill */}
        <div className="relative flex items-center bg-panel_bg/90 p-0.5 rounded-full shadow-[0_0_12px_rgba(229,9,20,0.15)] border border-white/5">
          {/* Sliding active pill */}
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 500, damping: 35 }}
            className={`absolute top-0.5 bottom-0.5 rounded-full bg-accent ${
              trendingState === "movies"
                ? "left-0.5 right-[calc(50%+2px)]"
                : "left-[calc(50%+2px)] right-0.5"
            }`}
          />
          {/* Pulse glow ring */}
          <motion.div
            layout
            transition={{
              layout: { type: "spring", stiffness: 500, damping: 35 },
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`absolute inset-0 rounded-full ${
              trendingState === "movies"
                ? "left-0.5 right-[calc(50%+2px)]"
                : "left-[calc(50%+2px)] right-0.5"
            }`}
            animate={{
              boxShadow: [
                "0 0 8px rgba(229,9,20,0.2)",
                "0 0 20px rgba(229,9,20,0.5)",
                "0 0 8px rgba(229,9,20,0.2)",
              ],
            }}
          />
          <button
            onClick={() => onTrendingToggle("movies")}
            className={`relative z-10 px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-colors min-h-[36px] ${
              trendingState === "movies"
                ? "text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Movies
          </button>
          <button
            onClick={() => onTrendingToggle("shows")}
            className={`relative z-10 px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-colors min-h-[36px] ${
              trendingState === "shows"
                ? "text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Shows
          </button>
        </div>
      </div>

      <Swiper
        onSwiper={onThumbsSwiper}
        spaceBetween={10}
        slidesPerView={3}
        loop={true}
        breakpoints={{
          480: { slidesPerView: 4, spaceBetween: 12 },
          768: { slidesPerView: 5, spaceBetween: 12 },
          1024: { slidesPerView: 7, spaceBetween: 14 },
        }}
        modules={[Thumbs]}
        watchSlidesProgress
        className="w-full"
      >
        {data.map((movie, index) => (
          <SwiperSlide key={`thumb-${movie.id}`} className="cursor-pointer">
            <div
              className={`relative aspect-video rounded-md overflow-hidden border-2 transition-all duration-300 ${
                activeIndex === index
                  ? "border-accent"
                  : "border-transparent opacity-40 hover:opacity-80"
              }`}
            >
              <Image
                src={`https://image.tmdb.org/t/p/w300${movie.backdrop_path}`}
                alt={`Thumb ${movie.title || movie.name}`}
                fill
                className="object-cover"
              />

              {/* Active Indicator */}
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center"
                  >
                    <span className="text-white text-[10px] sm:text-xs font-semibold uppercase tracking-wider px-2 py-0.5 bg-accent/90 rounded">
                      Playing
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

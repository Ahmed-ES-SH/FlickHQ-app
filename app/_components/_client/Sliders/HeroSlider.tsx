"use client";

import React, { useState, useCallback, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Thumbs, Keyboard } from "swiper/modules";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlay, FaPlus } from "react-icons/fa";
import { ShowType } from "@/app/types/websiteTypes";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/thumbs";
import { useVariables } from "@/app/context/VariablesContext";

export default function HeroSlider({
  movies,
  shows,
}: {
  movies: ShowType[];
  shows: ShowType[];
}) {
  const { trendingState, setTrendingState } = useVariables();

  const data = trendingState === "movies" ? movies : shows;

  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
    if (progressRef.current) {
      progressRef.current.style.width = "0%";
    }
  }, []);

  if (!data || data.length === 0) {
    return (
      <div className="relative min-h-[60vh] flex items-center justify-center bg-main_bg">
        <div className="text-center px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            No Trending Content
          </h2>
          <p className="text-second_text mb-6 max-w-md">
            We couldn&apos;t find any trending movies or shows right now. Check
            back later or browse our catalog.
          </p>
          <button
            onClick={() =>
              setTrendingState(trendingState === "movies" ? "shows" : "movies")
            }
            className="px-6 py-3 bg-accent text-white font-semibold hover:bg-red-700 transition-colors"
          >
            Switch to {trendingState === "movies" ? "Shows" : "Movies"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* --- Main Backdrop Slider --- */}
      <div className="relative w-full h-[65vh] sm:h-[75vh] md:h-[85vh] lg:h-[90vh]">
        <Swiper
          modules={[Autoplay, EffectFade, Thumbs, Keyboard]}
          effect="fade"
          loop={true}
          thumbs={{
            swiper:
              thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
          }}
          keyboard={{ enabled: true }}
          onSlideChange={handleSlideChange}
          onAutoplayTimeLeft={(_, __, percentage) => {
            if (progressRef.current) {
              progressRef.current.style.width = `${(1 - percentage) * 100}%`;
            }
          }}
          className="absolute inset-0 w-full h-full z-0"
        >
          {data.map((movie, index) => (
            <SwiperSlide key={movie.id} className="relative w-full h-full">
              <Image
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                alt={movie.title || movie.name || "Movie"}
                fill
                className={`object-cover transition-transform duration-8000 ease-out ${
                  prefersReducedMotion
                    ? "scale-100"
                    : activeIndex === index
                      ? "scale-105"
                      : "scale-100"
                }`}
                priority={index === 0}
              />
              {/* Cinematic Gradients */}
              <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-main_bg via-main_bg/80 to-transparent z-10" />
              <div className="absolute inset-y-0 left-0 w-full md:w-2/3 bg-gradient-to-r from-main_bg via-main_bg/70 to-transparent z-10" />

              {/* Content Overlay */}
              <AnimatePresence mode="wait">
                {activeIndex === index && (
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
                      >
                        <button
                          className="group flex items-center gap-2.5 px-6 py-3 sm:px-8 sm:py-3.5 bg-accent text-white font-medium text-base sm:text-lg hover:bg-red-700 transition-colors min-h-[44px] rounded-md"
                          aria-label={`Play ${movie.title || movie.name}`}
                        >
                          <FaPlay className="w-4 h-4 sm:w-5 sm:h-5" />
                          Play
                        </button>

                        <button
                          className="group flex items-center gap-2 px-5 py-3 sm:px-6 sm:py-3.5 text-white font-medium hover:text-accent transition-colors min-h-[44px] rounded-md"
                          aria-label={`Add ${movie.title || movie.name} to watchlist`}
                        >
                          <FaPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="hidden sm:inline">Watchlist</span>
                          <span className="sm:hidden">List</span>
                        </button>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* --- Autoplay Progress Bar --- */}
        <div className="absolute bottom-20 sm:bottom-24 md:bottom-28 left-4 md:left-16 right-4 md:right-16 z-30">
          <div className="h-0.5 bg-white/20 overflow-hidden">
            <div
              ref={progressRef}
              className="h-full bg-accent transition-none"
              style={{ width: "0%" }}
            />
          </div>
        </div>
      </div>

      {/* --- Thumbnails Section --- */}
      <div className="relative -mt-8 sm:-mt-10 md:-mt-12 z-30 px-4 md:px-8 custom-container">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-white text-xs sm:text-sm font-medium tracking-wide uppercase opacity-70">
            Now Trending
          </h4>

          {/* Movies/Shows Toggle */}
          <div className="flex items-center gap-0.5 bg-panel_bg/90 p-1 rounded-md">
            <button
              onClick={() => setTrendingState("movies")}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded transition-colors min-h-[36px] ${
                trendingState === "movies"
                  ? "bg-accent text-white"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              Movies
            </button>
            <button
              onClick={() => setTrendingState("shows")}
              className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded transition-colors min-h-[36px] ${
                trendingState === "shows"
                  ? "bg-accent text-white"
                  : "text-gray-500 hover:text-white"
              }`}
            >
              Shows
            </button>
          </div>
        </div>

        <Swiper
          onSwiper={setThumbsSwiper}
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

      {/* Spacer for thumbnails overlap */}
      <div className="h-16 sm:h-20 md:h-24" />
    </div>
  );
}

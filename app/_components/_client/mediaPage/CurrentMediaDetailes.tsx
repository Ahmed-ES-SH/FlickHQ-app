"use client";
import React from "react";
import { motion } from "framer-motion";
import { IoStar } from "react-icons/io5";
import Img from "../../_globalComponents/Img";
import { ShowType } from "@/app/types/websiteTypes";
import TopMoviesSidebar from "../movies/TopMoviesSidebar";

interface Props {
  media: ShowType;
  topMovies?: ShowType[];
}

export default function CurrentMediaDetailes({ media, topMovies }: Props) {
  const fullYear =
    new Date(media.release_date || media.first_air_date || "").getFullYear() ||
    "N/A";

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex flex-col gap-6 lg:gap-8 lg:sticky lg:top-24"
    >
      {/* 1. Poster */}
      <div className="relative overflow-hidden">
        <Img
          src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
          className="xl:w-full w-1/2 mx-auto max-md:w-3/4 max-sm:w-full object-cover border border-white/10 shadow-2xl rounded-2xl shadow-accent/80"
        />
      </div>

      {/* 2. Metadata Stack */}
      <div className="flex flex-col gap-4 text-center lg:text-left">
        <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter uppercase italic leading-tight">
          {media.title || media.name}
        </h1>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-accent">
            <IoStar className="size-4" />
            <span className="text-white font-black text-sm">
              {Number(media.vote_average).toFixed(1)}
            </span>
          </div>
          <div className="text-gray-500 font-bold text-xs">•</div>
          <div className="text-gray-400 font-bold text-sm">{fullYear}</div>
          <div className="text-gray-500 font-bold text-xs">•</div>
          <div className="text-gray-400 font-bold text-sm">
            {media.runtime
              ? `${media.runtime} min`
              : `${media.number_of_episodes} Eps`}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {media.genres?.slice(0, 3).map((genre) => (
            <span
              key={genre.id}
              className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-gray-400 text-[10px] font-black uppercase tracking-widest"
            >
              {genre.name}
            </span>
          ))}
        </div>

        <p className="text-gray-400 text-sm leading-relaxed font-medium">
          {media.overview}
        </p>
      </div>

      {/* 3. Top Movies Sidebar */}
      {topMovies && <TopMoviesSidebar data={topMovies} />}
    </motion.div>
  );
}

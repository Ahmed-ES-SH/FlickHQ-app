//////////////////////////////////////////////////////////////////////////////
///////// Featured show hero section with backdrop and CTA buttons ///////////
//////////////////////////////////////////////////////////////////////////////

"use client";

import React from "react";
import { motion } from "framer-motion";
import { FaPlay, FaStar } from "react-icons/fa";
import Link from "next/link";
import { formatTitle } from "@/app/_helpers/helpers";
import Img from "../../_globalComponents/Img";
import { itemVariants } from "@/app/data/shows/showsVariants";
import type { ShowType } from "@/app/types/websiteTypes";

interface Props {
  featuredShow: ShowType;
  onBrowseAll: () => void;
}

export default function ShowsHeroSection({ featuredShow, onBrowseAll }: Props) {
  return (
    <motion.section
      variants={itemVariants}
      className="relative w-full h-[70vh] min-h-125 overflow-hidden"
    >
      <div className="absolute inset-0">
        <Img
          src={`https://image.tmdb.org/t/p/original${featuredShow.backdrop_path}`}
          className="w-full h-full object-cover"
          priority={true}
          loading="eager"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      <div className="relative z-10 w-[95%] max-w-7xl mx-auto h-full flex flex-col justify-end pb-16 max-md:pb-10">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="max-w-2xl"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-accent text-white text-xs font-bold uppercase tracking-wider rounded-full">
              Trending Now
            </span>
            <div className="flex items-center gap-1 text-yellow-400">
              <FaStar className="size-4" />
              <span className="text-sm font-semibold">
                {Number(featuredShow.vote_average).toFixed(1)}
              </span>
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-4 leading-tight tracking-tight">
            {featuredShow.name}
          </h1>

          <p className="text-lg text-gray-300 mb-6 line-clamp-3 max-w-xl leading-relaxed">
            {featuredShow.overview}
          </p>

          <div className="flex items-center gap-4">
            <Link
              href={`/shows/${formatTitle(featuredShow.name)}?currentId=${featuredShow.id}`}
              className="group flex items-center gap-3 px-8 py-4 bg-accent hover:bg-accent/90 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:scale-105"
            >
              <FaPlay className="size-4 group-hover:scale-110 transition-transform" />
              Watch Now
            </Link>
            <button
              onClick={onBrowseAll}
              className="px-6 py-4 glass_bg border border-white/20 text-white font-semibold rounded-xl hover:border-accent/50 hover:bg-white/10 transition-all duration-300"
            >
              Browse All
            </button>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

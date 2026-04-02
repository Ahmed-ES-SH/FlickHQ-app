"use client";
import Img from "../../_globalComponents/Img";
import { ShowType } from "@/app/types/websiteTypes";
import { gener } from "@/app/types/ContextType";
import { MdOutlineStarBorder } from "react-icons/md";
import Link from "next/link";
import { formatTitle } from "@/app/_helpers/helpers";
import { motion } from "framer-motion";
import HeartIcon from "./HeartIcon";
import { useState, useCallback } from "react";

interface props {
  media: ShowType;
  genres: gener[];
  height?: string;
  index: number;
}

export default function MediaCard({
  media,
  genres,
  height = "aspect-[2/3] w-full",
  index,
}: props) {
  const [isTouched, setIsTouched] = useState(false);

  const releaseDate = media.release_date || media.first_air_date;
  const mediaYear = releaseDate ? new Date(releaseDate).getFullYear() : "N/A";
  const mediaTitle = media.title || media.name || "Untitled";

  const handleInteraction = useCallback((state: boolean) => {
    setIsTouched(state);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: Math.min(index * 0.08, 0.4),
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`relative cursor-pointer group rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 bg-panel_bg ${height}`}
      role="article"
      aria-label={`${mediaTitle} (${mediaYear})`}
      onMouseEnter={() => handleInteraction(true)}
      onMouseLeave={() => handleInteraction(false)}
      onTouchStart={() => handleInteraction(true)}
    >
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <Img
          src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
          className="w-full h-full object-cover transition-transform duration-[2500ms] group-hover:scale-110 ease-out"
          loading="lazy"
          alt={mediaTitle}
        />
        {/* Cinematic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent opacity-40" />
      </div>

      {/* Content Layer (Glassmorphism & Info) */}
      <div
        className={`absolute inset-0 z-10 flex flex-col p-4 md:p-6 transition-all duration-700 ${
          isTouched
            ? "backdrop-blur-[6px] bg-black/40"
            : "backdrop-blur-0 bg-transparent"
        }`}
      >
        {/* Top Header: Rating & Favorite */}
        <div className="flex items-center justify-between transition-all duration-500 transform origin-top">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl text-white shadow-lg shadow-black/40 translate-y-0 group-hover:translate-y-0 transition-transform">
            <MdOutlineStarBorder className="size-4 md:size-5 text-yellow-400" />
            <p className="text-sm md:text-base font-bold tracking-tight">
              {Number(media.vote_average || 0).toFixed(1)}
            </p>
          </div>
          <div
            className={`transition-all duration-500 transform ${isTouched ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"}`}
          >
            <HeartIcon media={media} />
          </div>
        </div>

        {/* Sidebar: Genres (Desktop Only/Hidden on small mobile if too many) */}
        <div className="flex-1 flex items-center">
          <div
            className={`flex flex-col items-start absolute duration-700 gap-3 ${
              isTouched
                ? "left-0 top-1/2 -translate-y-1/2"
                : "group-hover:left-0 group-hover:top-1/2 top-0 -left-[80%] -translate-y-1/2"
            }`}
          >
            {genres?.slice(0, 4).map((genre, index) => (
              <div
                key={index}
                className="py-1 px-2 bg-accent text-gray-200 rounded-r-md hover:bg-white hover:text-black duration-200 cursor-pointer"
              >
                {genre?.name}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Content: Title, Year & Action */}
        <div
          className={`flex flex-col items-center text-center transition-all duration-700 transform ${
            isTouched
              ? "translate-y-0 opacity-100"
              : "translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
          }`}
        >
          <Link
            href={`/${media.name ? "shows" : "movies"}/${formatTitle(mediaTitle)}?currentId=${media.id}`}
            className="text-lg md:text-xl xl:text-2xl font-black text-white mb-1 hover:text-accent transition-colors duration-300 line-clamp-2 leading-[1.1] tracking-tight text-balance"
            onClick={(e) => e.stopPropagation()}
          >
            {mediaTitle}
          </Link>
          <span className="text-[10px] md:text-xs font-bold text-gray-400 tracking-[0.3em] uppercase mb-4 opacity-80">
            {mediaYear}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

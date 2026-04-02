"use client";
import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { gener } from "@/app/types/ContextType";
import { motion } from "framer-motion";

interface Props {
  genres: gener[];
}

export default function GenreSidebar({ genres }: Props) {
  const searchParams = useSearchParams();
  const currentGenre = searchParams.get("genre");
  const currentCategory = searchParams.get("category") || "popular";

  // We want to add an "All Genres" option
  const allGenresOption: gener = { id: null, name: "All Genres" };
  const displayGenres = [allGenresOption, ...genres];

  return (
    <div className="w-full h-[75vh] overflow-y-auto sticky top-24 left-0 flex bg-secondery_dash p-2 rounded-xl flex-col">
      <div className="lg:mb-6 mb-2 flex items-center justify-between">
        <h3 className="text-sm md:text-base lg:text-lg font-black text-white tracking-[0.2em] uppercase origin-left">
          Genres
        </h3>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent ml-4 hidden lg:block"></div>
      </div>

      <div className="flex lg:flex-col items-center lg:items-stretch gap-2 lg:gap-1.5 overflow-x-auto lg:overflow-y-auto hide-scrollbar pb-4 lg:pb-0 snap-x lg:pr-2 lg:-mr-2 flex-nowrap">
        {displayGenres.map((genre) => {
          const genreIdStr = genre.id ? String(genre.id) : null;
          const isActive =
            currentGenre === genreIdStr || (genre.id === null && !currentGenre);

          let href = `/movies?category=${currentCategory}`;
          if (genre.id !== null) {
            href += `&genre=${genre.id}`;
          }

          return (
            <Link
              key={genre.id || "all"}
              id={genre.id ? undefined : "genre-all"}
              href={href}
              className={`relative shrink-0 snap-start px-5 lg:px-4 py-2.5 lg:py-3 rounded-full lg:rounded-xl duration-300 border lg:border-none transition-colors overflow-hidden group ${
                isActive
                  ? "text-white bg-accent border-transparent"
                  : "text-gray-400 glass_bg lg:bg-transparent border-glass_border lg:border-transparent hover:text-white hover:border-white/20 lg:hover:bg-white/5"
              }`}
            >
              <motion.div
                layoutId="activeGenrePill"
                animate={{ opacity: isActive ? 1 : 0 }}
                initial={false}
                className="absolute inset-0 bg-accent rounded-full lg:rounded-xl -z-10 shadow-lg shadow-accent/20"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
              <span
                className={`text-[10px] md:text-xs font-bold tracking-wide uppercase relative z-10 transition-transform duration-300 inline-block ${isActive ? "text-white lg:translate-x-1" : "group-hover:translate-x-1"}`}
              >
                {genre.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

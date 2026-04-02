"use client";
import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { gener } from "@/app/types/ContextType";
import { motion } from "framer-motion";

interface Props {
  genres: gener[];
}

export default function GenreFilterBar({ genres }: Props) {
  const searchParams = useSearchParams();
  const currentGenre = searchParams.get("genre");
  const currentCategory = searchParams.get("category") || "popular";

  // We want to add an "All Genres" option
  const allGenresOption: gener = { id: null, name: "All Genres" };
  const displayGenres = [allGenresOption, ...genres];

  return (
    <div className="custom-container mt-6">
      <div 
        className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-4 snap-x"
      >
        {displayGenres.map((genre) => {
          const genreIdStr = genre.id ? String(genre.id) : null;
          const isActive = currentGenre === genreIdStr || (genre.id === null && !currentGenre);
          
          let href = `/movies?category=${currentCategory}`;
          if (genre.id !== null) {
            href += `&genre=${genre.id}`;
          }

          return (
            <Link
              key={genre.id || 'all'}
              id={genre.id ? undefined : "genre-all"}
              href={href}
              className={`relative shrink-0 snap-start px-5 py-2 rounded-full duration-300 border transition-colors ${
                isActive 
                  ? "text-white border-transparent" 
                  : "text-gray-300 glass_bg border-glass_border hover:text-white hover:border-white/20"
              }`}
            >
              <motion.div
                layoutId="activeGenrePill"
                animate={{ opacity: isActive ? 1 : 0 }}
                initial={false}
                className="absolute inset-0 bg-accent rounded-full -z-10 shadow-lg shadow-accent/20"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
              <span className="text-[10px] md:text-xs font-semibold tracking-wide uppercase">
                {genre.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

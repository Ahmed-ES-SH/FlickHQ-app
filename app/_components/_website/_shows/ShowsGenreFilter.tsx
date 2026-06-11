//////////////////////////////////////////////////////////////////////////////
///////// Genre filter chip buttons for shows listing ////////////////////////
//////////////////////////////////////////////////////////////////////////////

"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiFilter } from "react-icons/fi";
import { itemVariants } from "@/app/data/shows/showsVariants";
import type { gener } from "@/app/types/ContextType";

interface Props {
  genres: gener[];
  selectedGenre: number | null;
  onGenreChange: (genreId: number | null) => void;
}

export default function ShowsGenreFilter({
  genres,
  selectedGenre,
  onGenreChange,
}: Props) {
  return (
    <motion.section variants={itemVariants} className="mt-10 mb-8">
      <div className="flex items-center gap-3 mb-5">
        <FiFilter className="size-5 text-accent" />
        <h2 className="text-xl font-bold text-white">Filter by Genre</h2>
      </div>

      <div className="flex flex-wrap gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onGenreChange(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
            selectedGenre === null
              ? "bg-accent border-accent text-white shadow-md shadow-accent/20"
              : "bg-panel_bg border-white/10 text-gray-400 hover:border-accent/30 hover:text-white"
          }`}
        >
          All
        </motion.button>

        {genres.map((genre) => (
          <motion.button
            key={genre.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onGenreChange(genre.id as number)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
              selectedGenre === genre.id
                ? "bg-accent border-accent text-white shadow-md shadow-accent/20"
                : "bg-panel_bg border-white/10 text-gray-400 hover:border-accent/30 hover:text-white"
            }`}
          >
            {genre.name}
          </motion.button>
        ))}
      </div>
    </motion.section>
  );
}

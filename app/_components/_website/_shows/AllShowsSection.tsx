//////////////////////////////////////////////////////////////////////////////
///////// Shows grid with loading, error, empty, and pagination states ///////
//////////////////////////////////////////////////////////////////////////////

"use client";

import React from "react";
import { motion } from "framer-motion";
import { FiFilter } from "react-icons/fi";
import MediaCard from "../_movies/MediaCard";
import ServerPagination from "../../_globalComponents/ServerPagination";
import { itemVariants } from "@/app/data/shows/showsVariants";
import type { ShowType } from "@/app/types/websiteTypes";
import type { gener } from "@/app/types/ContextType";

interface Props {
  shows: ShowType[];
  showGenres: gener[];
  selectedGenre: number | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  onRetry: () => void;
  onGenreChange: (genreId: number | null) => void;
}

export default function AllShowsSection({
  shows,
  showGenres,
  selectedGenre,
  loading,
  error,
  currentPage,
  totalPages,
  onRetry,
  onGenreChange,
}: Props) {
  return (
    <motion.section variants={itemVariants} className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          {selectedGenre
            ? showGenres.find((g) => g.id === selectedGenre)?.name || "Shows"
            : "All"}{" "}
          <span className="text-accent">Shows</span>
        </h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 gap-4 xl:gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="w-full h-[500px] bg-panel_bg rounded-md animate-pulse"
            />
          ))}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 mb-4 rounded-full bg-accent/10 flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-400 mb-6 max-w-md">{error}</p>
          <button
            onClick={onRetry}
            className="px-6 py-3 bg-accent hover:bg-accent/90 text-white font-semibold rounded-xl transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      ) : shows.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 mb-4 rounded-full bg-panel_bg border border-white/10 flex items-center justify-center">
            <FiFilter className="size-8 text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            No shows found
          </h3>
          <p className="text-gray-400 mb-6 max-w-md">
            Try selecting a different genre or clear your filters.
          </p>
          <button
            onClick={() => onGenreChange(null)}
            className="px-6 py-3 bg-accent hover:bg-accent/90 text-white font-semibold rounded-xl transition-all duration-300"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5 gap-4 xl:gap-5">
            {shows.map((show: ShowType, index: number) => (
              <MediaCard
                index={index}
                key={show.id}
                media={show}
                genres={
                  showGenres?.filter((g: gener) =>
                    show.genre_ids?.includes(g.id as number),
                  ) || []
                }
              />
            ))}
          </div>

          <div className="mt-12">
            <ServerPagination
              usedURL="/shows"
              currentPage={currentPage}
              totalPages={totalPages}
              searchParams={
                selectedGenre ? { genre: String(selectedGenre) } : undefined
              }
            />
          </div>
        </>
      )}
    </motion.section>
  );
}

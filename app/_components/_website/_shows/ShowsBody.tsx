/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { gener } from "@/app/types/ContextType";
import { ShowType } from "@/app/types/websiteTypes";
import React, { useState, useEffect, useCallback } from "react";
import MediaCard from "../_movies/MediaCard";
import FetchData from "@/app/hooks/FetchData";
import { popularTvShow } from "@/app/constants/apis";
import ServerPagination from "../../_globalComponents/ServerPagination";
import { motion } from "framer-motion";
import { FaPlay, FaStar } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import Link from "next/link";
import { formatTitle } from "@/app/_helpers/helpers";
import Img from "../../_globalComponents/Img";
import { useFetchData } from "@/app/hooks/FetchClientData";
import { instance } from "../../_globalComponents/AxiosTool";

interface Props {
  showGenres: gener[];
  currentPage: number;
  trendingShows: ShowType[];
  topRatedShows: ShowType[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function ShowsBody({
  showGenres,
  currentPage,
  trendingShows,
  topRatedShows,
}: Props) {
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [shows, setShows] = useState<ShowType[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [featuredShow, setFeaturedShow] = useState<ShowType | null>(null);

  const loadShows = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const genreParam = selectedGenre ? `with_genres=${selectedGenre}&` : "";
      const result = await instance.get(
        `${popularTvShow}${genreParam}page=${currentPage}`,
      );

      setShows(result?.data?.results || []);
      setTotalPages(Math.min(result?.total_pages || 1, 500));
    } catch (error: any) {
      setError(error.message);
      setShows([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [selectedGenre, currentPage]);

  useEffect(() => {
    loadShows();
  }, [loadShows]);

  useEffect(() => {
    if (trendingShows.length > 0) {
      setFeaturedShow(trendingShows[0]);
    }
  }, [trendingShows]);

  const handleGenreChange = (genreId: number | null) => {
    setSelectedGenre(genreId);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      {/* Hero Section */}
      {featuredShow && (
        <motion.section
          variants={itemVariants}
          className="relative w-full h-[70vh] min-h-[500px] overflow-hidden"
        >
          <div className="absolute inset-0">
            <Img
              src={`https://image.tmdb.org/t/p/original${featuredShow.backdrop_path}`}
              className="w-full h-full object-cover"
              priority={true}
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
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
                  onClick={() => handleGenreChange(null)}
                  className="px-6 py-4 glass_bg border border-white/20 text-white font-semibold rounded-xl hover:border-accent/50 hover:bg-white/10 transition-all duration-300"
                >
                  Browse All
                </button>
              </div>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* Page Content Container */}
      <div className="w-[95%] max-md:w-full max-md:p-2 mb-3 mx-auto">
        {/* Genre Filters */}
        <motion.section variants={itemVariants} className="mt-10 mb-8">
          <div className="flex items-center gap-3 mb-5">
            <FiFilter className="size-5 text-accent" />
            <h2 className="text-xl font-bold text-white">Filter by Genre</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleGenreChange(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${
                selectedGenre === null
                  ? "bg-accent border-accent text-white shadow-md shadow-accent/20"
                  : "bg-panel_bg border-white/10 text-gray-400 hover:border-accent/30 hover:text-white"
              }`}
            >
              All
            </motion.button>

            {showGenres.map((genre) => (
              <motion.button
                key={genre.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleGenreChange(genre.id as number)}
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

        {/* Trending Section */}
        {trendingShows.length > 0 && !selectedGenre && (
          <motion.section variants={itemVariants} className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Trending <span className="text-accent">This Week</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-3 md:gap-4">
              {trendingShows.map((show: ShowType, index: number) => (
                <MediaCard
                  index={index}
                  key={show.id}
                  media={show}
                  genres={
                    showGenres?.filter((g: gener) =>
                      show.genre_ids?.includes(g.id as number),
                    ) || []
                  }
                  height="h-[350px]"
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* Top Rated Section */}
        {topRatedShows.length > 0 && !selectedGenre && (
          <motion.section variants={itemVariants} className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Top <span className="text-accent">Rated</span>
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-3 md:gap-4">
              {topRatedShows.map((show: ShowType, index: number) => (
                <MediaCard
                  index={index}
                  key={show.id}
                  media={show}
                  genres={
                    showGenres?.filter((g: gener) =>
                      show.genre_ids?.includes(g.id as number),
                    ) || []
                  }
                  height="h-[350px]"
                />
              ))}
            </div>
          </motion.section>
        )}

        {/* All Shows Section */}
        <motion.section variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              {selectedGenre
                ? showGenres.find((g) => g.id === selectedGenre)?.name ||
                  "Shows"
                : "All"}{" "}
              <span className="text-accent">Shows</span>
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 xl:gap-5">
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
                onClick={loadShows}
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
                onClick={() => handleGenreChange(null)}
                className="px-6 py-3 bg-accent hover:bg-accent/90 text-white font-semibold rounded-xl transition-all duration-300"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-4 xl:gap-5">
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
      </div>
    </motion.div>
  );
}

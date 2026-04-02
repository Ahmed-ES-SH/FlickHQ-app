/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaPlay, FaHeart, FaShare, FaStar } from "react-icons/fa";
import { FiBookmark, FiMessageCircle } from "react-icons/fi";
import Img from "@/app/_components/_globalComponents/Img";
import MediaCard from "@/app/_components/_website/_movies/MediaCard";
import { gener } from "@/app/types/ContextType";
import { ShowType } from "@/app/types/websiteTypes";

interface Props {
  show: any;
  similarShows: ShowType[];
  reviews: any[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
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

export default function ShowDetails({ show, similarShows, reviews }: Props) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWatchlisted, setIsWatchlisted] = useState(false);

  const showYear = new Date(show?.first_air_date).getFullYear();
  const seasonCount = show?.number_of_seasons || 0;
  const episodeCount = show?.number_of_episodes || 0;
  const status = show?.status || "Unknown";
  const runtime = show?.episode_run_time?.[0] || 24;
  const networks = show?.networks || [];
  const productionCompanies = show?.production_companies || [];
  const cast = show?.credits?.cast?.slice(0, 20) || [];
  const seasons = show?.seasons || [];
  const genres: gener[] = show?.genres || [];
  const lastEpisode = show?.last_episode_to_air;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "cast", label: "Cast" },
    { id: "seasons", label: "Seasons" },
    { id: "similar", label: "Similar" },
    { id: "reviews", label: "Reviews" },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full relative"
    >
      {/* Hero Backdrop */}
      <div className="relative w-full h-[60vh] min-h-[400px] overflow-hidden">
        <Img
          src={`https://image.tmdb.org/t/p/original${show?.backdrop_path}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-[95%] max-w-7xl mx-auto -mt-40 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10">
          {/* Sidebar */}
          <motion.aside variants={itemVariants} className="flex flex-col gap-6">
            {/* Poster */}
            <div className="relative rounded-xl overflow-hidden shadow-2xl shadow-black/50">
              <Img
                src={`https://image.tmdb.org/t/p/w500${show?.poster_path}`}
                className="w-full object-cover"
              />
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="text-center">
                <p className="text-4xl font-black text-white">
                  {Number(show?.vote_average).toFixed(1)}
                </p>
                <div className="flex items-center gap-1 text-yellow-400 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`size-4 ${
                        i < Math.round(show?.vote_average / 2)
                          ? "text-yellow-400"
                          : "text-gray-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Metadata Badges */}
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-accent/10 border border-accent/30 text-accent text-xs font-bold rounded-full">
                {status}
              </span>
              <span className="px-3 py-1.5 bg-panel_bg border border-white/10 text-gray-300 text-xs font-medium rounded-full">
                {showYear}
              </span>
              <span className="px-3 py-1.5 bg-panel_bg border border-white/10 text-gray-300 text-xs font-medium rounded-full">
                {seasonCount} {seasonCount === 1 ? "Season" : "Seasons"}
              </span>
              <span className="px-3 py-1.5 bg-panel_bg border border-white/10 text-gray-300 text-xs font-medium rounded-full">
                {episodeCount} Episodes
              </span>
              <span className="px-3 py-1.5 bg-panel_bg border border-white/10 text-gray-300 text-xs font-medium rounded-full">
                {runtime}m
              </span>
            </div>

            {/* Genre Tags */}
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 text-gray-200 text-xs font-medium rounded-full"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Networks & Studios */}
            {(networks.length > 0 || productionCompanies.length > 0) && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                  Studios & Networks
                </h3>
                <div className="flex flex-wrap gap-3">
                  {networks.slice(0, 4).map((network: any) => (
                    <div
                      key={network.id}
                      className="px-3 py-2 bg-panel_bg border border-white/10 rounded-lg"
                    >
                      {network.logo_path ? (
                        <Img
                          src={`https://image.tmdb.org/t/p/w92${network.logo_path}`}
                          className="h-6 object-contain"
                        />
                      ) : (
                        <p className="text-xs text-gray-300 font-medium">
                          {network.name}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Overview */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                Overview
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {show?.overview}
              </p>
            </div>

            {/* Last Episode */}
            {lastEpisode && (
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                  Latest Episode
                </h3>
                <div className="p-4 bg-panel_bg border border-white/10 rounded-xl">
                  <p className="text-sm font-semibold text-white mb-1">
                    S{lastEpisode.season_number} E{lastEpisode.episode_number}
                  </p>
                  <p className="text-xs text-gray-400 mb-2">
                    {lastEpisode.name}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {lastEpisode.overview}
                  </p>
                </div>
              </div>
            )}
          </motion.aside>

          {/* Main Content Area */}
          <motion.main variants={itemVariants} className="flex flex-col gap-8">
            {/* Title & Actions */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-white mb-2">
                  {show?.name}
                </h1>
                {show?.tagline && (
                  <p className="text-lg text-gray-400 italic">{show.tagline}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/90 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:scale-105">
                  <FaPlay className="size-4" />
                  Play Now
                </button>
                <button
                  onClick={() => setIsWatchlisted(!isWatchlisted)}
                  className={`flex items-center gap-2 px-5 py-3 border rounded-xl transition-all duration-300 font-medium ${
                    isWatchlisted
                      ? "bg-accent/10 border-accent/50 text-accent"
                      : "bg-panel_bg border-white/10 text-gray-300 hover:border-accent/30 hover:text-white"
                  }`}
                >
                  <FiBookmark className="size-4" />
                  {isWatchlisted ? "Watchlisted" : "Watchlist"}
                </button>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={`flex items-center gap-2 px-5 py-3 border rounded-xl transition-all duration-300 font-medium ${
                    isFavorite
                      ? "bg-accent/10 border-accent/50 text-accent"
                      : "bg-panel_bg border-white/10 text-gray-300 hover:border-accent/30 hover:text-white"
                  }`}
                >
                  <FaHeart className="size-4" />
                  {isFavorite ? "Favorited" : "Favorite"}
                </button>
                <button className="flex items-center gap-2 px-5 py-3 bg-panel_bg border border-white/10 text-gray-300 rounded-xl hover:border-accent/30 hover:text-white transition-all duration-300 font-medium">
                  <FiMessageCircle className="size-4" />
                  Reviews
                </button>
                <button className="flex items-center gap-2 px-5 py-3 bg-panel_bg border border-white/10 text-gray-300 rounded-xl hover:border-accent/30 hover:text-white transition-all duration-300 font-medium">
                  <FaShare className="size-4" />
                  Share
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-white/10">
              <div className="flex items-center gap-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative pb-4 text-sm font-semibold transition-all duration-300 ${
                      activeTab === tab.id
                        ? "text-accent"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTab === "overview" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  {/* Detailed Overview */}
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">
                      About the Show
                    </h2>
                    <p className="text-gray-300 leading-relaxed text-base max-w-3xl">
                      {show?.overview}
                    </p>
                  </div>

                  {/* Key Details Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-panel_bg border border-white/10 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">
                        Original Language
                      </p>
                      <p className="text-sm font-semibold text-white uppercase">
                        {show?.original_language}
                      </p>
                    </div>
                    <div className="p-4 bg-panel_bg border border-white/10 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">First Aired</p>
                      <p className="text-sm font-semibold text-white">
                        {show?.first_air_date}
                      </p>
                    </div>
                    <div className="p-4 bg-panel_bg border border-white/10 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">Status</p>
                      <p className="text-sm font-semibold text-accent">
                        {status}
                      </p>
                    </div>
                    <div className="p-4 bg-panel_bg border border-white/10 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">Total Votes</p>
                      <p className="text-sm font-semibold text-white">
                        {show?.vote_count?.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-4 bg-panel_bg border border-white/10 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">Popularity</p>
                      <p className="text-sm font-semibold text-white">
                        {show?.popularity?.toFixed(0)}
                      </p>
                    </div>
                    <div className="p-4 bg-panel_bg border border-white/10 rounded-xl">
                      <p className="text-xs text-gray-500 mb-1">Episodes</p>
                      <p className="text-sm font-semibold text-white">
                        {episodeCount}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "cast" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white">
                    Full Cast & Crew
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {cast.map((actor: any) => (
                      <div
                        key={actor.id}
                        className="flex flex-col items-center text-center p-4 bg-panel_bg border border-white/10 rounded-xl hover:border-accent/30 transition-all duration-300"
                      >
                        <div className="w-20 h-20 rounded-full overflow-hidden mb-3 bg-gray-800">
                          {actor.profile_path ? (
                            <Img
                              src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-600">
                              <span className="text-2xl">👤</span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-white">
                          {actor.name}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {actor.character}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "seasons" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white">All Seasons</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {seasons
                      .filter((s: any) => s.season_number > 0)
                      .map((season: any) => (
                        <div
                          key={season.id}
                          className="flex gap-4 p-4 bg-panel_bg border border-white/10 rounded-xl hover:border-accent/30 transition-all duration-300"
                        >
                          <div className="w-24 h-36 rounded-lg overflow-hidden flex-shrink-0 bg-gray-800">
                            {season.poster_path ? (
                              <Img
                                src={`https://image.tmdb.org/t/p/w185${season.poster_path}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-600">
                                <span className="text-xs">No Image</span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col justify-center">
                            <h3 className="text-lg font-bold text-white mb-1">
                              {season.name}
                            </h3>
                            <p className="text-xs text-gray-400 mb-2">
                              {season.episode_count} Episodes •{" "}
                              {new Date(season.air_date).getFullYear()}
                            </p>
                            <p className="text-xs text-gray-500 line-clamp-2">
                              {season.overview || "No overview available."}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "similar" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white">
                    Similar Shows
                  </h2>
                  {similarShows.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                      {similarShows.map((show: ShowType, index: number) => (
                        <MediaCard
                          key={show.id}
                          index={index}
                          media={show}
                          genres={[]}
                          height="h-[400px]"
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-12">
                      No similar shows found.
                    </p>
                  )}
                </motion.div>
              )}

              {activeTab === "reviews" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white">
                    User Reviews
                  </h2>
                  {reviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {reviews.map((review: any) => (
                        <div
                          key={review.id}
                          className="p-6 bg-panel_bg border border-white/10 rounded-xl hover:border-accent/30 transition-all duration-300"
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">
                              {review.author_details?.name?.[0] ||
                                review.author[0]}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white">
                                {review.author}
                              </p>
                              {review.author_details?.rating && (
                                <div className="flex items-center gap-1 text-yellow-400 text-xs">
                                  <FaStar className="size-3" />
                                  <span>{review.author_details.rating}/10</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-300 line-clamp-4 leading-relaxed">
                            {review.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-12">
                      No reviews yet. Be the first to review!
                    </p>
                  )}
                </motion.div>
              )}
            </div>
          </motion.main>
        </div>
      </div>
    </motion.div>
  );
}

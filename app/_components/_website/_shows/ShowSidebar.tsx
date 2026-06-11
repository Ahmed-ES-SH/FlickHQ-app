// //////////////////////////////////////////////////////////////////////////////
// Show sidebar — poster, rating, metadata badges, genres, networks, overview //
// //////////////////////////////////////////////////////////////////////////////

"use client";

import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import Img from "@/app/_components/_globalComponents/Img";
import { itemVariants } from "@/app/data/shows/showDetailsVariants";
import type { ShowDetailsData } from "@/app/types/shows";

interface Props {
  show: ShowDetailsData;
}

export default function ShowSidebar({ show }: Props) {
  const showYear = new Date(show?.first_air_date).getFullYear();
  const seasonCount = show?.number_of_seasons || 0;
  const episodeCount = show?.number_of_episodes || 0;
  const status = show?.status || "Unknown";
  const runtime = show?.episode_run_time?.[0] || 24;
  const networks = show?.networks || [];
  const productionCompanies = show?.production_companies || [];
  const genres = show?.genres || [];
  const lastEpisode = show?.last_episode_to_air;

  return (
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
            {networks.slice(0, 4).map((network) => (
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
            <p className="text-xs text-gray-400 mb-2">{lastEpisode.name}</p>
            <p className="text-xs text-gray-500 line-clamp-2">
              {lastEpisode.overview}
            </p>
          </div>
        </div>
      )}
    </motion.aside>
  );
}

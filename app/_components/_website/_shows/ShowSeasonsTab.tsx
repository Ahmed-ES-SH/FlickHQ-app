// //////////////////////////////////////////////////////////////////////////////
// Show seasons tab — grid of TV show seasons with posters and details /////////
// //////////////////////////////////////////////////////////////////////////////

"use client";

import { motion } from "framer-motion";
import Img from "@/app/_components/_globalComponents/Img";
import type { ShowSeason } from "@/app/types/shows";

interface Props {
  seasons: ShowSeason[];
}

export default function ShowSeasonsTab({ seasons }: Props) {
  const visibleSeasons = seasons.filter((s) => s.season_number > 0);

  if (!visibleSeasons.length) {
    return (
      <p className="text-gray-400 text-center py-12">No season information available.</p>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-white">All Seasons</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleSeasons.map((season) => (
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
  );
}

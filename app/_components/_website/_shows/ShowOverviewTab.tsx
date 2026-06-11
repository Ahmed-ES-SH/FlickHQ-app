// //////////////////////////////////////////////////////////////////////////////
// Show overview tab — detailed show description and key details grid //////////
// //////////////////////////////////////////////////////////////////////////////

"use client";

import { motion } from "framer-motion";
import type { ShowDetailsData } from "@/app/types/shows";

interface Props {
  show: ShowDetailsData;
}

export default function ShowOverviewTab({ show }: Props) {
  const status = show?.status || "Unknown";
  const episodeCount = show?.number_of_episodes || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Detailed Overview */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">About the Show</h2>
        <p className="text-gray-300 leading-relaxed text-base max-w-3xl">
          {show?.overview}
        </p>
      </div>

      {/* Key Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-4 bg-panel_bg border border-white/10 rounded-xl">
          <p className="text-xs text-gray-500 mb-1">Original Language</p>
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
          <p className="text-sm font-semibold text-accent">{status}</p>
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
          <p className="text-sm font-semibold text-white">{episodeCount}</p>
        </div>
      </div>
    </motion.div>
  );
}

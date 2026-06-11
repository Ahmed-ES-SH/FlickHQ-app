// //////////////////////////////////////////////////////////////////////////////
// Show cast tab — grid of cast members with photos and character names ////////
// //////////////////////////////////////////////////////////////////////////////

"use client";

import { motion } from "framer-motion";
import Img from "@/app/_components/_globalComponents/Img";
import type { ShowCastMember } from "@/app/types/shows";

interface Props {
  cast: ShowCastMember[];
}

export default function ShowCastTab({ cast }: Props) {
  if (!cast.length) {
    return (
      <p className="text-gray-400 text-center py-12">No cast information available.</p>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-white">Full Cast & Crew</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {cast.map((actor) => (
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
            <p className="text-sm font-semibold text-white">{actor.name}</p>
            <p className="text-xs text-gray-400 mt-1">{actor.character}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

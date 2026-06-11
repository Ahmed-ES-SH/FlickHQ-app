// //////////////////////////////////////////////////////////////////////////////
// Show similar tab — grid of similar show recommendations /////////////////////
// //////////////////////////////////////////////////////////////////////////////

"use client";

import { motion } from "framer-motion";
import MediaCard from "@/app/_components/_website/_movies/MediaCard";
import type { ShowType } from "@/app/types/websiteTypes";

interface Props {
  similarShows: ShowType[];
}

export default function ShowSimilarTab({ similarShows }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-white">Similar Shows</h2>
      {similarShows.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {similarShows.map((show, index) => (
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
  );
}

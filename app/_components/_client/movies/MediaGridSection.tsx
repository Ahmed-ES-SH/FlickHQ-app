"use client";

import { motion } from "framer-motion";
import { ShowType } from "@/app/types/websiteTypes";
import { gener } from "@/app/types/ContextType";
import MediaCard from "../../_website/_movies/MediaCard";

interface Props {
  /** Upcoming movies data (used for recommended tab) */
  data: ShowType[];
  /** Similar/related movies for the current media */
  similarMovies?: ShowType[];
  /** Active tab to determine which data set to display */
  activeTab: "recommended" | "related";
  /** Available genres for matching with movie genre_ids */
  genres: gener[] | undefined;
}

export default function MediaGridSection({
  data,
  similarMovies,
  activeTab,
  genres,
}: Props) {
  // Determine which data set to display based on active tab
  const displayData =
    activeTab === "recommended"
      ? data
      : similarMovies && similarMovies.length > 0
        ? similarMovies
        : data;

  return (
    <motion.div
      key={activeTab}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
    >
      {displayData?.slice(0, 8).map((movie, index) => {
        // Match genre IDs to actual genre objects for display
        const matchedGenres = genres?.filter((g) =>
          g.id !== null && movie.genre_ids?.includes(g.id),
        );

        return (
          <MediaCard
            key={movie.id}
            media={movie}
            genres={matchedGenres || []}
            index={index}
          />
        );
      })}
    </motion.div>
  );
}

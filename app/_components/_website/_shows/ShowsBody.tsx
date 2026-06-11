//////////////////////////////////////////////////////////////////////////////
///////// Shows body — orchestrates hero, genre filter, and show sections ////
//////////////////////////////////////////////////////////////////////////////

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { containerVariants } from "@/app/data/shows/showsVariants";
import { useLoadShows } from "@/app/hooks/shows/useLoadShows";
import ShowsHeroSection from "./ShowsHeroSection";
import ShowsGenreFilter from "./ShowsGenreFilter";
import ShowsCardsSection from "./ShowsCardsSection";
import AllShowsSection from "./AllShowsSection";
import type { gener } from "@/app/types/ContextType";
import type { ShowType } from "@/app/types/websiteTypes";

interface Props {
  showGenres: gener[];
  currentPage: number;
  trendingShows: ShowType[];
  topRatedShows: ShowType[];
}

export default function ShowsBody({
  showGenres,
  currentPage,
  trendingShows,
  topRatedShows,
}: Props) {
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [featuredShow, setFeaturedShow] = useState<ShowType | null>(null);
  const { shows, totalPages, loading, error, loadShows } = useLoadShows(
    selectedGenre,
    currentPage,
  );

  useEffect(() => {
    if (trendingShows.length > 0) {
      setFeaturedShow(trendingShows[0]);
    }
  }, [trendingShows]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      {featuredShow && (
        <ShowsHeroSection
          featuredShow={featuredShow}
          onBrowseAll={() => setSelectedGenre(null)}
        />
      )}

      <div className="w-[95%] max-md:w-full max-md:p-2 mb-3 mx-auto">
        <ShowsGenreFilter
          genres={showGenres}
          selectedGenre={selectedGenre}
          onGenreChange={setSelectedGenre}
        />

        {trendingShows.length > 0 && !selectedGenre && (
          <ShowsCardsSection
            title="Trending"
            accentText="This Week"
            shows={trendingShows}
            genres={showGenres}
          />
        )}

        {topRatedShows.length > 0 && !selectedGenre && (
          <ShowsCardsSection
            title="Top"
            accentText="Rated"
            shows={topRatedShows}
            genres={showGenres}
          />
        )}

        <AllShowsSection
          shows={shows}
          showGenres={showGenres}
          selectedGenre={selectedGenre}
          loading={loading}
          error={error}
          currentPage={currentPage}
          totalPages={totalPages}
          onRetry={loadShows}
          onGenreChange={setSelectedGenre}
        />
      </div>
    </motion.div>
  );
}

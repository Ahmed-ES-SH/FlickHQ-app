// //////////////////////////////////////////////////////////////////////////////
// Show details — orchestrates hero, sidebar, action bar, tabs, and panels /////
// //////////////////////////////////////////////////////////////////////////////

"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  containerVariants,
  itemVariants,
} from "@/app/data/shows/showDetailsVariants";
import ShowHero from "./ShowHero";
import ShowSidebar from "./ShowSidebar";
import ShowActionBar from "./ShowActionBar";
import ShowTabs from "./ShowTabs";
import ShowOverviewTab from "./ShowOverviewTab";
import ShowCastTab from "./ShowCastTab";
import ShowSeasonsTab from "./ShowSeasonsTab";
import ShowSimilarTab from "./ShowSimilarTab";
import ShowReviewsTab from "./ShowReviewsTab";
import type {
  ShowDetailsData,
  TMDBReview,
  ShowCastMember,
  ShowSeason,
} from "@/app/types/shows";
import type { ShowType } from "@/app/types/websiteTypes";
import type { MediaType } from "@/app/types/lists";

interface Props {
  show: ShowDetailsData;
  similarShows: ShowType[];
  reviews: TMDBReview[];
}

export default function ShowDetails({ show, similarShows, reviews }: Props) {
  const [activeTab, setActiveTab] = useState("overview");
  const mediaType: MediaType = "tv";

  // Derived data from the show object
  const backdropPath = show?.backdrop_path;
  const cast: ShowCastMember[] = show?.credits?.cast?.slice(0, 20) || [];
  const seasons: ShowSeason[] = show?.seasons || [];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full relative"
    >
      {/* Hero Backdrop */}
      {backdropPath && <ShowHero backdropPath={backdropPath} />}

      {/* Main Content */}
      <div className="relative z-10 w-[95%] max-w-7xl mx-auto -mt-40 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10">
          {/* Sidebar */}
          <ShowSidebar show={show} />

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
              <ShowActionBar showId={show?.id} mediaType={mediaType} />
            </div>

            {/* Tabs */}
            <ShowTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Tab Content */}
            <div className="min-h-100">
              {activeTab === "overview" && <ShowOverviewTab show={show} />}
              {activeTab === "cast" && <ShowCastTab cast={cast} />}
              {activeTab === "seasons" && <ShowSeasonsTab seasons={seasons} />}
              {activeTab === "similar" && (
                <ShowSimilarTab similarShows={similarShows} />
              )}
              {activeTab === "reviews" && <ShowReviewsTab reviews={reviews} />}
            </div>
          </motion.main>
        </div>
      </div>
    </motion.div>
  );
}

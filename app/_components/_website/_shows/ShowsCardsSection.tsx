//////////////////////////////////////////////////////////////////////////////
///////// Reusable card grid section for Trending / Top Rated shows //////////
//////////////////////////////////////////////////////////////////////////////

"use client";

import React from "react";
import { motion } from "framer-motion";
import MediaCard from "../_movies/MediaCard";
import { itemVariants } from "@/app/data/shows/showsVariants";
import type { ShowType } from "@/app/types/websiteTypes";
import type { gener } from "@/app/types/ContextType";

interface Props {
  title: string;
  accentText: string;
  shows: ShowType[];
  genres: gener[];
}

export default function ShowsCardsSection({
  title,
  accentText,
  shows,
  genres,
}: Props) {
  return (
    <motion.section variants={itemVariants} className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          {title} <span className="text-accent">{accentText}</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-3 md:gap-4">
        {shows.map((show: ShowType, index: number) => (
          <MediaCard
            index={index}
            key={show.id}
            media={show}
            genres={
              genres?.filter((g: gener) =>
                show.genre_ids?.includes(g.id as number),
              ) || []
            }
            height="h-[350px]"
          />
        ))}
      </div>
    </motion.section>
  );
}

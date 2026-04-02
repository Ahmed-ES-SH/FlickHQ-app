"use client";
import React from "react";
import { motion } from "framer-motion";
import { ShowType } from "@/app/types/websiteTypes";
import { gener } from "@/app/types/ContextType";
import MediaCard from "./MediaCard";

interface Props {
  movies: ShowType[];
  genres: gener[];
}

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  show: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 24 
    } 
  },
};

export default function MoviesGrid({ movies, genres }: Props) {
  if (!movies || movies.length === 0) return null;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 min-[1700px]:grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4 xl:gap-5"
    >
      {movies.map((show: ShowType, index: number) => {
        const matchedGenres =
          genres && genres.filter((genre: gener) => show.genre_ids?.includes(genre.id as number));

        return (
          <motion.div key={show.id || index} variants={itemVariants}>
            <MediaCard index={index} media={show} genres={matchedGenres || []} />
          </motion.div>
        );
      })}
    </motion.div>
  );
}

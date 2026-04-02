"use client";
import React, { Dispatch, SetStateAction, useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Pagination from "../../_globalComponents/Pagination";
import { ShowType } from "@/app/types/websiteTypes";
import {
  nowPlaying,
  PopularMovies,
  upcomingMovies,
} from "@/app/constants/apis";
import { useData } from "@/app/context/DataContext";
import { gener } from "@/app/types/ContextType";
import { useVariables } from "@/app/context/VariablesContext";
import MediaCard from "../_movies/MediaCard";
import { useFetchData } from "@/app/hooks/FetchClientData";

interface DataType {
  results: ShowType[];
  total_pages: number;
}

export default function ShowMovies() {
  const { genres } = useData();
  const { currentCategory } = useVariables();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentApi, setCurrentApi] = useState<string>(
    `${PopularMovies}page=1`
  );
  const sectionRef = useRef<HTMLDivElement>(null);

  // Fetch The Data
  const { data, isLoading, error } = useFetchData<DataType>(currentApi);

  const totalPages = data && data.total_pages;

  useEffect(() => {
    // Set API and reset page when category changes
    switch (currentCategory) {
      case "Popular":
        setCurrentApi(`${PopularMovies}page=1`);
        break;
      case "now_playing":
        setCurrentApi(`${nowPlaying}page=1`);
        break;
      case "Upcoming":
        setCurrentApi(`${upcomingMovies}page=1`);
        break;
      default:
        setCurrentApi(`${PopularMovies}page=1`);
    }
    setCurrentPage(1);
  }, [currentCategory]);

  // Whenever the page changes, update the API with the new page
  useEffect(() => {
    if (currentPage !== 1 && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    const apiWithPage = `${currentApi.split("page=")[0]}page=${currentPage}`;
    setCurrentApi(apiWithPage);
  }, [currentApi, currentPage]);

  if (error)
    return (
      <div className="custom-container flex flex-col items-center justify-center min-h-[50vh] gap-4 p-6">
        <p className="text-xl max-sm:text-lg font-semibold text-gray-400 text-center">Couldn't load movies</p>
        <p className="text-sm max-sm:text-base text-gray-600 text-center">Something went wrong. Please try again.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 max-sm:w-full bg-accent text-white rounded-md font-medium hover:bg-accent/90 transition-colors min-h-[44px]"
        >
          Retry
        </button>
      </div>
    );

  if (isLoading)
    return (
      <div className="custom-container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 min-[2000px]:grid-cols-6 gap-6 min-h-[50vh]">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="w-full aspect-[2/3.5] rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden animate-pulse"
          >
            <div className="w-full aspect-[2/3] bg-white/[0.03]" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-white/[0.03] rounded-lg w-3/4" />
              <div className="h-3 bg-white/[0.03] rounded-lg w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );

  return (
    <motion.div 
      ref={sectionRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="pb-20"
    >
      <div className="custom-container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 min-[2000px]:grid-cols-6 gap-6">
        {data &&
          data.results.map((media: ShowType, index: number) => {
            const matchedGenres =
              genres &&
              media &&
              genres.filter(
                (genre: gener) =>
                  genre.id !== null && media.genre_ids.includes(genre.id)
              );
            return (
              <MediaCard
                index={index}
                key={index}
                media={media}
                genres={matchedGenres}
              />
            );
          })}
      </div>
      <div className="custom-container">
        <Pagination
          totalPages={totalPages && totalPages > 500 ? 500 : totalPages || 500}
          currentPage={currentPage || 1}
          setCurrentPage={setCurrentPage as Dispatch<SetStateAction<number>>}
        />
      </div>
    </motion.div>
  );
}

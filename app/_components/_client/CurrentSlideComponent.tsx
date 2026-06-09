"use client";
import { useState, useCallback } from "react";
import { ShowType } from "@/app/types/websiteTypes";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import Img from "../_globalComponents/Img";
import { FaLanguage, FaStar } from "react-icons/fa";
import { CiCalendarDate } from "react-icons/ci";
import { TbChartBarPopular } from "react-icons/tb";
import { gener } from "@/app/types/ContextType";
import { useVariables } from "@/app/context/VariablesContext";
import { useLocalListFallback } from "@/app/_helpers/localListFallback";
import { useListStore } from "@/app/_stores/listStore";
import { useAuthStore } from "@/app/_stores/authStore";
import { useRouter } from "next/navigation";
import { formatTitle } from "@/app/_helpers/helpers";
import { toast } from "sonner";
import type { MediaType } from "@/app/types/lists";

interface props {
  currentSlide: ShowType;
  currentGenres: gener[] | undefined;
}

type btntype = {
  bg_color: string;
  text: string;
  handle: () => void;
  loading: boolean;
};

export default function CurrentSlideComponent({
  currentSlide,
  currentGenres,
}: props) {
  const { trendingState } = useVariables();

  // Store hooks (authenticated)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInWatchlist = useListStore((s) => s.isInWatchlist(currentSlide.id));
  const isWatched = useListStore((s) => s.isWatched(currentSlide.id));
  const addItem = useListStore((s) => s.addItem);
  const removeItem = useListStore((s) => s.removeItem);
  const watchlistId = useListStore((s) => s.getSystemList("watchlist")?.id);
  const watchedId = useListStore((s) => s.getSystemList("watched")?.id);

  // Fallback to localStorage for unauthenticated users
  const { addToWatchlist, markAsWatched } = useLocalListFallback();

  const router = useRouter();

  const mediaType = (currentSlide.media_type !== "movie" ? "tv" : "movie") as MediaType;

  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [watchedLoading, setWatchedLoading] = useState(false);

  const handleGOToMedia = () => {
    router.push(
      `/${
        currentSlide.media_type != "movie" ? "shows" : "movies"
      }/${formatTitle(currentSlide.title || currentSlide.name)}?currentId=${
        currentSlide.id
      }`,
    );
  };

  const handleWatchList = useCallback(async () => {
    if (!isAuthenticated) {
      addToWatchlist(currentSlide);
      toast.info("Sign in to sync your watchlist");
      return;
    }
    if (!watchlistId) {
      toast.error("Watchlist not available");
      return;
    }

    setWatchlistLoading(true);
    if (isInWatchlist) {
      const success = await removeItem(watchlistId, mediaType, currentSlide.id);
      if (success) toast.success("Removed from watchlist");
      else toast.error("Failed to remove");
    } else {
      const success = await addItem(watchlistId, {
        mediaType,
        tmdbId: currentSlide.id,
      });
      if (success) toast.success("Added to watchlist");
      else toast.error("Failed to add");
    }
    setWatchlistLoading(false);
  }, [
    isAuthenticated,
    watchlistId,
    isInWatchlist,
    currentSlide,
    mediaType,
    addItem,
    removeItem,
    addToWatchlist,
  ]);

  const handleWatched = useCallback(async () => {
    if (!isAuthenticated) {
      markAsWatched(currentSlide);
      toast.info("Sign in to sync your watched list");
      return;
    }
    if (!watchedId) {
      toast.error("Watched list not available");
      return;
    }

    setWatchedLoading(true);
    if (isWatched) {
      const success = await removeItem(watchedId, mediaType, currentSlide.id);
      if (success) toast.success("Removed from watched");
      else toast.error("Failed to remove");
    } else {
      const success = await addItem(watchedId, {
        mediaType,
        tmdbId: currentSlide.id,
      });
      if (success) toast.success("Marked as watched");
      else toast.error("Failed to mark as watched");
    }
    setWatchedLoading(false);
  }, [
    isAuthenticated,
    watchedId,
    isWatched,
    currentSlide,
    mediaType,
    addItem,
    removeItem,
    markAsWatched,
  ]);

  const btns: btntype[] = [
    {
      bg_color: isInWatchlist ? "bg-accent" : "bg-yellow-400",
      text: watchlistLoading
        ? "..."
        : isInWatchlist
          ? "In Watchlist"
          : "Watch List",
      handle: handleWatchList,
      loading: watchlistLoading,
    },
    {
      bg_color: isWatched ? "bg-accent" : "bg-red-500",
      text: watchedLoading ? "..." : isWatched ? "Watched ✓" : "Watched",
      handle: handleWatched,
      loading: watchedLoading,
    },
    {
      bg_color: "bg-blue-600",
      text: `Go to ${trendingState == "movies" ? "Movie" : "Show"}`,
      handle: () => handleGOToMedia(),
      loading: false,
    },
  ];

  const mediaDetails = [
    {
      icon: <CiCalendarDate className="text-primary_blue xl:size-6 size-5" />,
      value: new Date(
        currentSlide?.release_date ||
          currentSlide?.first_air_date ||
          "2000-01-01",
      ).getFullYear(),
    },
    {
      icon: (
        <TbChartBarPopular className="text-primary_blue xl:size-6 size-5" />
      ),
      value: Number(currentSlide?.popularity).toFixed(2),
    },
    {
      icon: <FaLanguage className="text-primary_blue xl:size-6 size-5" />,
      value: currentSlide?.original_language,
    },
  ];

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide?.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.6 }}
          className="movie flex flex-col items-start gap-10 w-full xl:w-3/4 xl:h-full h-1/2 lg:px-6 px-2 py-2 relative z-10 pb-4"
        >
          <motion.div
            key={currentSlide?.backdrop_path}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="top-0 left-0 bg-center bg-cover opacity-50 -z-10  w-full h-full absolute"
          >
            <Img
              src={`https://image.tmdb.org/t/p/w500${currentSlide?.backdrop_path}`}
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-black/50 "></div>
          </motion.div>
          {/* العنوان والتقييم */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between mt-4 w-full"
          >
            <h1 className="italic font-bold text-secondery-green text-2xl md:text-4xl xl:text-6xl font-mono">
              {currentSlide?.title || currentSlide?.name}
            </h1>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="lg:p-2 p-1 rounded-md flex items-center gap-2 bg-secondery-green"
            >
              <FaStar className=" text-yellow-400" />
              <span className="text-white max-lg:text-[14px]">
                {Number(currentSlide?.vote_average).toFixed(2)}
              </span>
            </motion.div>
          </motion.div>

          {/* الوصف */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="xl:text-xl md:text-xl text-lg text-gray-300"
          >
            {currentSlide?.overview}
          </motion.p>

          {/* التفاصيل */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-12 flex-wrap"
          >
            {mediaDetails.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 * (index + 1) }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center  gap-2"
              >
                {item.icon}
                <span className="text-white xl:text-xl text-[17px]">
                  {item.value}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* التصنيفات */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-4 flex-wrap"
          >
            {currentGenres &&
              currentGenres?.map((genre, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.85 + index * 0.05 }}
                  className="p-2 bg-primary_blue text-white rounded-r-md hover:bg-white hover:text-black cursor-pointer duration-300"
                >
                  {genre?.name}
                </motion.div>
              ))}
          </motion.div>

          {/* الأزرار */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="w-fit ml-auto flex items-center flex-wrap gap-4 mt-auto"
          >
            {btns.map((btn, index) => (
              <motion.div
                key={index}
                onClick={btn.handle}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + index * 0.1 }}
                className={`xl:py-3 xl:px-6 p-2 rounded-md whitespace-nowrap text-center ${btn.bg_color} text-white xl:first-letter:text-4xl first-letter:text-2xl xl:text-xl md:text-xl text-[15px] first-letter:text-black hover:bg-white hover:text-black hover:first-letter:text-secondery-green duration-300 cursor-pointer ${
                  btn.loading ? "opacity-60 pointer-events-none" : ""
                }`}
              >
                {btn.text}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoPlay,
  IoAdd,
  IoHeart,
  IoShareSocial,
  IoChatbubble,
  IoList,
} from "react-icons/io5";
import { commentType, ReviewType, ShowType } from "@/app/types/websiteTypes";
import Comment from "./Comment";
import Review from "./Review";
import Pagination from "../../_globalComponents/Pagination";
import AddReview from "../mediaPage/AddReviewOrComment";
import MediaCard from "../../_website/_movies/MediaCard";
import { useData } from "@/app/context/DataContext";
import { Itemcomments, Reviews } from "@/app/constants/website";

interface Props {
  data: ShowType[]; // Upcoming
  media: ShowType; // Current
  similarMovies?: ShowType[];
}

export default function MediaCommentsAndReviews({
  data,
  media,
  similarMovies,
}: Props) {
  const { genres } = useData();
  const [activeTab, setActiveTab] = useState<
    "recommended" | "related" | "reviews" | "comments"
  >("recommended");
  const [comments, setComments] = useState<commentType[]>(Itemcomments);
  const [reviews, setReviews] = useState<ReviewType[]>(Reviews);
  const [currentPage, setCurrentPage] = useState(1);
  const [content, setContent] = useState("");
  const [reviewRating, setReviewRating] = useState<number | string>("");
  const [reviewTitle, setReviewTitle] = useState<string>("");

  const ITEMS_PER_PAGE = 8;
  const currentSocialData = activeTab === "comments" ? comments : reviews;
  const totalPages = Math.ceil(currentSocialData.length / ITEMS_PER_PAGE);
  const currentSocialItems = currentSocialData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleAdd = () => {
    const now = Date.now();
    if (activeTab === "comments") {
      const newComment = {
        content,
        author: "Guest User",
        date: now,
        time: now,
        likes: 0,
        dislikes: 0,
      };
      if (content.trim()) setComments((prev) => [...prev, newComment]);
    } else {
      const newReview = {
        content,
        title: reviewTitle || "Guest",
        date: now,
        time: now,
        rating: reviewRating,
      };
      if (content.trim()) setReviews((prev) => [...prev, newReview]);
    }
    setContent("");
  };

  const tabs = [
    { id: "recommended", label: "Recommended" },
    { id: "related", label: "Related" },
    { id: "cast", label: "Cast" },
    { id: "extras", label: "Extras" },
    { id: "reviews", label: `Reviews (${reviews.length})` },
    { id: "comments", label: `Discussion (${comments.length})` },
  ] as const;

  const displayGridData =
    activeTab === "recommended"
      ? data
      : similarMovies && similarMovies.length > 0
        ? similarMovies
        : data;

  return (
    <div className="flex flex-col gap-10 lg:gap-12">
      {/* 1. Action Bar - Play, Watchlist, etc. */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-6 p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-xl">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-accent text-white font-black uppercase tracking-wider shadow-lg shadow-accent/30 group"
        >
          <IoPlay className="size-5 group-hover:scale-110 duration-300" />
          <span>Play Now</span>
        </motion.button>

        <div className="flex items-center justify-between md:justify-start gap-4 lg:gap-8 px-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {[
            { icon: IoAdd, label: "Watchlist" },
            { icon: IoHeart, label: "Favorites" },
            { icon: IoList, label: "Playlist" },
            {
              icon: IoChatbubble,
              label: "Comments",
              onClick: () => setActiveTab("comments"),
            },
            { icon: IoShareSocial, label: "Share" },
          ].map((action, i) => (
            <button
              key={i}
              onClick={action.onClick}
              className="flex flex-col items-center gap-2 text-gray-500 hover:text-white duration-300 transition-colors group shrink-0 min-w-[60px]"
            >
              <action.icon className="size-6 group-hover:scale-110 duration-300" />
              <span className="text-[9px] font-black uppercase tracking-widest">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Content Tabs Filter */}
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-6 lg:gap-8 border-b border-white/5 pb-4 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setCurrentPage(1);
              }}
              className={`relative text-xs lg:text-sm font-black uppercase tracking-[0.15em] transition-colors duration-300 shrink-0 pb-1 ${
                activeTab === tab.id
                  ? "text-accent"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="tabUnderline"
                  className="absolute -bottom-4 left-0 right-0 h-0.5 bg-accent shadow-[0_0_10px_rgba(229,9,20,0.5)]"
                />
              )}
            </button>
          ))}
        </div>

        {/* 3. Dynamic Content Rendering */}
        <div className="min-h-[600px]">
          <AnimatePresence mode="wait">
            {/* Recommended & Related Grid */}
            {(activeTab === "recommended" || activeTab === "related") && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
              >
                {displayGridData?.slice(0, 8).map((movie, index) => {
                  const matchedGenres = genres?.filter((g) =>
                    movie.genre_ids?.includes(g.id),
                  );
                  return (
                    <MediaCard
                      key={movie.id}
                      media={movie}
                      genres={matchedGenres}
                      index={index}
                    />
                  );
                })}
              </motion.div>
            )}

            {/* Cast & Extras Placeholder */}
            {(activeTab === "cast" || activeTab === "extras") && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center py-20 text-gray-500"
              >
                <div className="text-xl font-black uppercase tracking-widest italic">
                  Coming Soon
                </div>
                <p className="text-sm">
                  We're working on bringing you more details.
                </p>
              </motion.div>
            )}

            {/* Reviews & Comments Section */}
            {(activeTab === "reviews" || activeTab === "comments") && (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8 max-w-3xl"
              >
                <div className="space-y-6">
                  {currentSocialItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      {activeTab === "comments" ? (
                        <Comment comment={item as commentType} />
                      ) : (
                        <Review review={item as ReviewType} />
                      )}
                    </motion.div>
                  ))}
                </div>

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setCurrentPage={setCurrentPage}
                />

                <div className="pt-12">
                  <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-6 bg-accent rounded-full" />
                      <h4 className="text-white text-xl font-black uppercase italic tracking-tighter">
                        Add to the{" "}
                        <span className="text-accent">Conversation</span>
                      </h4>
                    </div>
                    <AddReview
                      showState={
                        activeTab === "comments" ? "comments" : "reviews"
                      }
                      content={content}
                      setContent={setContent}
                      reviewRating={reviewRating}
                      reviewTitle={reviewTitle}
                      setReviewRating={setReviewRating}
                      setReviewTitle={setReviewTitle}
                      handleAdd={handleAdd}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

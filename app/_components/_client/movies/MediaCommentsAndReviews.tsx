"use client";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { commentType, ReviewType, ShowType } from "@/app/types/websiteTypes";
import { useData } from "@/app/context/DataContext";
import { Itemcomments, Reviews } from "@/app/constants/website";

// Import extracted child components
import MediaActionBar from "./MediaActionBar";
import MediaContentTabs from "./MediaContentTabs";
import MediaGridSection from "./MediaGridSection";
import MediaPlaceholderSection from "./MediaPlaceholderSection";
import MediaSocialSection from "./MediaSocialSection";

interface Props {
  /** Upcoming movies data for the recommended tab */
  data: ShowType[];
  /** Similar movies for the related tab */
  similarMovies?: ShowType[];
}

/**
 * MediaCommentsAndReviews - Orchestrator component
 *
 * Manages high-level state (active tab, comments, reviews, pagination)
 * and composes extracted child components for the media detail page.
 */
export default function MediaCommentsAndReviews({
  data,
  similarMovies,
}: Props) {
  const { genres } = useData();

  // Active tab for content filtering
  const [activeTab, setActiveTab] = useState<
    "recommended" | "related" | "cast" | "extras" | "reviews" | "comments"
  >("recommended");

  // Comments and reviews state
  const [comments, setComments] = useState<commentType[]>(Itemcomments);
  const [reviews, setReviews] = useState<ReviewType[]>(Reviews);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Form state for adding new content
  const [content, setContent] = useState("");
  const [reviewRating, setReviewRating] = useState<number | string>("");
  const [reviewTitle, setReviewTitle] = useState<string>("");

  // Items displayed per page in social sections
  const ITEMS_PER_PAGE = 8;

  /**
   * Handle adding a new comment or review based on active tab.
   * Validates content is not empty before adding.
   */
  const handleAdd = () => {
    if (!content.trim()) return;

    const now = Date.now();

    if (activeTab === "comments") {
      const newComment: commentType = {
        content,
        author: "Guest User",
        date: now,
        time: now,
        likes: 0,
        dislikes: 0,
      };
      setComments((prev) => [...prev, newComment]);
    } else {
      const newReview: ReviewType = {
        content,
        title: reviewTitle || "Guest",
        date: now,
        time: now,
        rating: reviewRating,
      };
      setReviews((prev) => [...prev, newReview]);
    }

    // Reset form after submission
    setContent("");
  };

  /**
   * Handle tab change and reset pagination to first page.
   */
  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  // Determine current social data for pagination calculations
  const currentSocialData =
    activeTab === "comments" ? comments : reviews;
  const totalPages = Math.ceil(currentSocialData.length / ITEMS_PER_PAGE);

  // Slice current page items for display
  const currentSocialItems = currentSocialData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="flex flex-col gap-10 lg:gap-12">
      {/* Action Bar - Play, Watchlist, Favorites, Share, Comments */}
      <MediaActionBar
        onOpenComments={() => handleTabChange("comments")}
      />

      {/* Content Tabs - Recommended, Related, Cast, Extras, Reviews, Comments */}
      <div className="flex flex-col gap-8">
        <MediaContentTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          reviewsCount={reviews.length}
          commentsCount={comments.length}
        />

        {/* Dynamic Content Based on Active Tab */}
        <div className="min-h-[600px]">
          <AnimatePresence mode="wait">
            {/* Recommended & Related - Movie Grid */}
            {(activeTab === "recommended" || activeTab === "related") && (
              <MediaGridSection
                key="grid"
                data={data}
                similarMovies={similarMovies}
                activeTab={activeTab}
                genres={genres}
              />
            )}

            {/* Cast & Extras - Coming Soon Placeholder */}
            {(activeTab === "cast" || activeTab === "extras") && (
              <MediaPlaceholderSection
                key="placeholder"
                title={activeTab === "cast" ? "Cast" : "Extras"}
              />
            )}

            {/* Reviews & Comments - Social Section */}
            {(activeTab === "reviews" || activeTab === "comments") && (
              <MediaSocialSection
                key="social"
                type={activeTab === "comments" ? "comments" : "reviews"}
                items={currentSocialItems}
                onAdd={handleAdd}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                formState={{
                  content,
                  setContent,
                  reviewRating,
                  setReviewRating,
                  reviewTitle,
                  setReviewTitle,
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

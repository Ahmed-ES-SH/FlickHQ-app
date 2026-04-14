"use client";

import { motion } from "framer-motion";
import { commentType, ReviewType } from "@/app/types/websiteTypes";
import Comment from "./Comment";
import Review from "./Review";
import Pagination from "../../_globalComponents/Pagination";
import AddReview from "../mediaPage/AddReviewOrComment";

type SocialTab = "comments" | "reviews";

interface Props {
  /** Which type of content to display: comments or reviews */
  type: SocialTab;
  /** Array of items to render (comments or reviews) */
  items: commentType[] | ReviewType[];
  /** Callback to add a new comment or review */
  onAdd: () => void;
  /** Current page number for pagination */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback when page changes */
  onPageChange: React.Dispatch<React.SetStateAction<number>>;
  /** Form state and setters passed through to AddReview */
  formState: {
    content: string;
    setContent: React.Dispatch<React.SetStateAction<string>>;
    reviewRating: number | string;
    setReviewRating: React.Dispatch<React.SetStateAction<number | string>>;
    reviewTitle: string;
    setReviewTitle: React.Dispatch<React.SetStateAction<string>>;
  };
}

export default function MediaSocialSection({
  type,
  items,
  onAdd,
  currentPage,
  totalPages,
  onPageChange,
  formState,
}: Props) {
  const {
    content,
    setContent,
    reviewRating,
    setReviewRating,
    reviewTitle,
    setReviewTitle,
  } = formState;

  return (
    <motion.div
      key={type}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 max-w-3xl"
    >
      {/* Render list of comments or reviews */}
      <div className="space-y-6">
        {items.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {type === "comments" ? (
              <Comment comment={item as commentType} />
            ) : (
              <Review review={item as ReviewType} />
            )}
          </motion.div>
        ))}
      </div>

      {/* Pagination controls */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={onPageChange}
      />

      {/* Add new comment or review form */}
      <div className="pt-12 border-t border-gray-700/50">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-accent rounded-full" />
            <h4 className="text-white text-xl font-bold tracking-tight">
              Add to the{" "}
              <span className="text-accent">
                {type === "comments" ? "Conversation" : "Reviews"}
              </span>
            </h4>
          </div>
          <AddReview
            showState={type}
            content={content}
            setContent={setContent}
            reviewRating={reviewRating}
            reviewTitle={reviewTitle}
            setReviewRating={setReviewRating}
            setReviewTitle={setReviewTitle}
            handleAdd={onAdd}
          />
        </div>
      </div>
    </motion.div>
  );
}

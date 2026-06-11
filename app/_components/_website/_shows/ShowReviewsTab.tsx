// //////////////////////////////////////////////////////////////////////////////
// Show reviews tab — user reviews grid with author avatars and ratings ////////
// //////////////////////////////////////////////////////////////////////////////

"use client";

import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import type { TMDBReview } from "@/app/types/shows";

interface Props {
  reviews: TMDBReview[];
}

export default function ShowReviewsTab({ reviews }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <h2 className="text-2xl font-bold text-white">User Reviews</h2>
      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-6 bg-panel_bg border border-white/10 rounded-xl hover:border-accent/30 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">
                  {review.author_details?.name?.[0] || review.author[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {review.author}
                  </p>
                  {review.author_details?.rating && (
                    <div className="flex items-center gap-1 text-yellow-400 text-xs">
                      <FaStar className="size-3" />
                      <span>{review.author_details.rating}/10</span>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-300 line-clamp-4 leading-relaxed">
                {review.content}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center py-12">
          No reviews yet. Be the first to review!
        </p>
      )}
    </motion.div>
  );
}

import { formatDateTime } from "@/app/_helpers/helpers";
import { ReviewType } from "@/app/types/websiteTypes";
import React from "react";
import { CiUser } from "react-icons/ci";
import { IoStarOutline } from "react-icons/io5";

interface props {
  review: ReviewType;
}

export default function Review({ review }: props) {
  return (
    <>
      <div className="w-full p-3 rounded-xl bg-fourth_color my-3 text-white relative transition-all duration-200 hover:bg-fourth_color/80 hover:shadow-lg hover:shadow-accent/5">
        <div className="flex flex-col">
          {/* Review Detailes */}
          <div className="w-full flex items-center max-md:items-start justify-between max-md:flex-col gap-2 pb-4 border-b border-gray-700/50">
            <div className="flex items-start max-md:flex-col gap-3">
              <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded-md shrink-0">
                <CiUser className="text-accent size-6 md:size-8" />
              </div>
              <div className="flex flex-col gap-2 min-w-0">
                <h4 className="text-lg font-semibold max-md:text-base truncate">{review.title}</h4>
                <span className="text-xs text-gray-400">
                  {formatDateTime(review.date, review.time)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 max-md:absolute max-md:top-2 max-md:right-2">
              <IoStarOutline className="text-accent" />
              <span className="text-sm text-accent font-semibold">
                {Number(review.rating).toFixed(1)}
              </span>
            </div>
          </div>
          {/* Review Content */}
          <p className="block my-4 text-lg text-gray-200 leading-6 max-md:text-base">
            {review.content}
          </p>
        </div>
      </div>
    </>
  );
}

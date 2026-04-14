"use client";
import { formatDateTime } from "@/app/_helpers/helpers";
import { commentType } from "@/app/types/websiteTypes";
import React, { useState } from "react";
import { CiUser } from "react-icons/ci";
import { GoPlus } from "react-icons/go";
import { HiOutlineMinus } from "react-icons/hi2";
import { MdOutlineTurnRight } from "react-icons/md";
import { RxLoop } from "react-icons/rx";

interface props {
  comment: commentType;
}

export default function Comment({ comment }: props) {
  const [likes, setLikes] = useState(comment.likes);
  const [dislikes, setDislikes] = useState(comment.dislikes);

  return (
    <>
      <div className="w-full p-3 rounded-xl bg-fourth_color my-3 text-white transition-all duration-200 hover:bg-fourth_color/80 hover:shadow-lg hover:shadow-accent/5">
        <div className="flex flex-col">
          {/* Comment Detailes */}
          <div className="w-full flex items-start gap-3 pb-4 border-b border-gray-700/50">
            <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded-md shrink-0">
              <CiUser className="text-accent size-6 md:size-8" />
            </div>
            <div className="flex flex-col gap-2 min-w-0">
              <h4 className="text-base font-semibold truncate">{comment.author}</h4>
              <span className="text-xs text-gray-400">
                {formatDateTime(comment.date, comment.time)}
              </span>
            </div>
          </div>
          {/* Comment Content */}
          <p className="block my-4 text-lg text-gray-200 leading-6 pb-4 border-b border-gray-700/50 max-sm:text-base">
            {comment.content}
          </p>
          {/* Comment Actions */}
          <div className=" flex items-center justify-between max-sm:flex-col max-sm:gap-4 w-full transition-all duration-200 hover:bg-white/5 -mx-3 px-3 py-2 rounded-lg">
            <div className="flex items-center gap-5">
              <button
                onClick={() => setLikes((prev) => prev + 1)}
                className="flex items-center gap-2 group"
              >
                <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-transparent border cursor-pointer border-green-400/50 text-green-400 group-hover:text-green-400 group-hover:border-green-400 transition-all duration-200">
                  <GoPlus className="size-4" />
                </div>
                <span className="text-sm select-none text-gray-300 group-hover:text-white transition-colors">
                  {likes}
                </span>
              </button>
              <button
                onClick={() => setDislikes((prev) => (prev > 0 ? prev - 1 : 0))}
                className="flex items-center gap-2 group"
              >
                <span className="text-sm select-none text-gray-300 group-hover:text-white transition-colors">
                  {dislikes}
                </span>
                <div className="w-6 h-6 rounded-lg flex items-center justify-center bg-transparent border cursor-pointer border-red-400/50 text-red-400 group-hover:text-red-400 group-hover:border-red-400 transition-all duration-200">
                  <HiOutlineMinus className="size-4" />
                </div>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-accent transition-colors duration-200 select-none">
                <MdOutlineTurnRight className="text-accent" />
                <p>Reply</p>
              </button>
              <button className="flex items-center gap-2 cursor-pointer text-gray-400 hover:text-accent transition-colors duration-200 select-none">
                <RxLoop className="text-accent" />
                <p>Quote</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

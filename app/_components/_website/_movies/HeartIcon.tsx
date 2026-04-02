"use client";
import { useList } from "@/app/context/ListContext";
import { ShowType } from "@/app/types/websiteTypes";
import React from "react";
import { FaHeart } from "react-icons/fa";

interface props {
  media: ShowType;
}

export default function HeartIcon({ media }: props) {
  const { setFavoritesList, handleAddMedia } = useList();
  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleAddMedia(setFavoritesList, media);
        }}
        className="flex items-center justify-center w-11 h-11 bg-black/40 backdrop-blur-md border border-white/10 hover:border-accent/50 hover:bg-accent/20 rounded-xl cursor-pointer group/heart transition-all duration-300 shadow-xl"
        aria-label="Add to favorites"
      >
        <FaHeart className="size-5 text-gray-300 group-hover/heart:text-accent transition-transform duration-300 group-active/heart:scale-90" />
      </button>
    </>
  );
}

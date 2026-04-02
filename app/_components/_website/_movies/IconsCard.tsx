"use client";
import { useList } from "@/app/context/ListContext";
import { ShowType } from "@/app/types/websiteTypes";
import React from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

interface props {
  media: ShowType;
}

export default function IconsCard({ media }: props) {
  const { handleAddMedia, handleAddMediaToWatchedlist, setWatchList } =
    useList();
  return (
    <>
      <div className="flex items-center justify-between w-full absolute -bottom-40 group-hover:bottom-2 z-10 left-1/2 -translate-x-1/2 duration-700 p-3">
        <div
          onClick={() => handleAddMediaToWatchedlist(media)}
          className="flex items-center justify-center bg-sky-400 w-10 h-10 gap-1 p-[6px] glass_bg border border-white/10 hover:border-accent hover:bg-accent/20 rounded-md cursor-pointer group/heart transition-all duration-300 shadow-xl"
        >
          <FaRegEye className="size-5 text-gray-300 group-hover/heart:text-white duration-300" />
        </div>
        <div
          onClick={() => handleAddMedia(setWatchList, media)}
          className="flex items-center justify-center w-10 h-10 gap-1 p-[6px] glass_bg border border-white/10 hover:border-accent hover:bg-accent/20 rounded-md cursor-pointer group/heart transition-all duration-300 shadow-xl"
        >
          <FaRegEyeSlash className="size-5 text-gray-300 group-hover/heart:text-white duration-300" />
        </div>
      </div>
    </>
  );
}

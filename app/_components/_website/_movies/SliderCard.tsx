"use client";

import React, { useState } from "react";
import Img from "../../_globalComponents/Img";
import { ShowType } from "@/app/types/websiteTypes";
import { gener } from "@/app/types/ContextType";
import { MdOutlineStarBorderPurple500 } from "react-icons/md";
import { FaHeart } from "react-icons/fa";

interface props {
  movie: ShowType;
  genres: gener[];
  height?: string;
}

export default function SliderCard({
  movie,
  genres,
  height = "h-[450px]", // slightly shorter for the cinematic 16:9 feel
}: props) {
  const [isTouched, setIsTouched] = useState(false);

  const MovieYear = new Date(
    movie?.release_date || movie?.first_air_date || "2000-01-01"
  ).getFullYear();

  return (
    <div
      onTouchStart={() => setIsTouched(true)}
      onMouseLeave={() => setIsTouched(false)}
      className={`w-full relative cursor-pointer group overflow-hidden ${height} rounded-xl border border-glass_border transition-transform active:scale-95 shadow-lg`}
    >
      <Img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {/* Fade-in Cinematic Gradient Overlay */}
      <div
        className={`h-full w-full duration-500 absolute top-0 left-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity ${
          isTouched ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      ></div>

      {/* Top Details (Rating & Heart) */}
      <div
        className={`flex items-center justify-between w-full absolute left-0 px-4 duration-500 transition-all ${
          isTouched ? "top-4 opacity-100" : "-top-10 opacity-0 group-hover:top-4 group-hover:opacity-100"
        }`}
      >
        <div className="flex items-center gap-1 p-[6px] px-2 bg-glass_bg backdrop-blur-md rounded-md border border-glass_border">
          <MdOutlineStarBorderPurple500 className="size-4 text-accent" />
          <p className="text-[14px] font-semibold text-white">
            {Number(movie.vote_average).toFixed(1)}
          </p>
        </div>
        <div className="flex items-center justify-center size-8 p-[6px] bg-glass_bg backdrop-blur-md rounded-md border border-glass_border cursor-pointer group/heart">
          <FaHeart className="text-white group-hover/heart:text-accent duration-300 size-4" />
        </div>
      </div>

      {/* Genres (Glassmorphism tags) */}
      <div
        className={`flex flex-col items-start absolute duration-700 gap-2 transition-all ${
          isTouched
            ? "left-0 top-1/2 -translate-y-1/2 opacity-100"
            : "-left-10 opacity-0 top-1/2 -translate-y-1/2 group-hover:left-0 group-hover:opacity-100"
        }`}
      >
        {genres &&
          genres.slice(0, 3).map((genre, index) => (
            <div
              key={index}
              className="py-1 px-3 text-[13px] bg-glass_bg backdrop-blur-md border border-y-glass_border border-r-glass_border border-l-transparent text-gray-200 rounded-r-md hover:bg-white hover:text-black duration-200 cursor-pointer shadow-sm"
            >
              {genre?.name}
            </div>
          ))}
      </div>

      {/* Bottom Details (Title & Year) */}
      <div
        className={`flex flex-col gap-1 items-start w-full absolute px-4 duration-500 transition-all ${
          isTouched ? "bottom-6 opacity-100" : "-bottom-10 opacity-0 group-hover:bottom-6 group-hover:opacity-100"
        }`}
      >
        <h2 className="text-[18px] md:text-xl font-bold text-white line-clamp-1 drop-shadow-md">
          {movie.title || movie.name}
        </h2>
        <p className="text-[14px] text-gray-300 font-medium">{MovieYear}</p>
      </div>
    </div>
  );
}

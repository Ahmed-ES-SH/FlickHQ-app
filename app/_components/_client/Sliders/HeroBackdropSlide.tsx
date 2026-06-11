"use client";

import Image from "next/image";
import type { ShowType } from "@/app/types/websiteTypes";

// //////////////////////////////////////////////////////////////////////////////
// ///////// Backdrop image with cinematic gradients for each hero slide ////////
// //////////////////////////////////////////////////////////////////////////////

export default function HeroBackdropSlide({
  movie,
  isActive,
  prefersReducedMotion,
  priority,
}: {
  movie: ShowType;
  isActive: boolean;
  prefersReducedMotion: boolean;
  priority: boolean;
}) {
  return (
    <>
      <Image
        src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
        alt={movie.title || movie.name || "Movie"}
        fill
        className={`object-cover -z-1 pointer-events-none transition-transform duration-8000 ease-out ${
          prefersReducedMotion
            ? "scale-100"
            : isActive
              ? "scale-105"
              : "scale-100"
        }`}
        priority={priority}
      />
      {/* Cinematic Gradients */}
      <div className="absolute inset-x-0 bottom-0 h-3/4 bg-linear-to-t from-main_bg via-main_bg/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 left-0 w-full md:w-2/3 bg-linear-to-r from-main_bg via-main_bg/70 to-transparent z-10 pointer-events-none" />
    </>
  );
}

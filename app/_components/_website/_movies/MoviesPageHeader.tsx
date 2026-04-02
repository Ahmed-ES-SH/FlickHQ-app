import React from "react";
import Img from "../../_globalComponents/Img";

interface Props {
  backdropPath: string | null;
}

export default function MoviesPageHeader({ backdropPath }: Props) {
  return (
    <div className="relative w-full h-[40vh] md:h-[50vh] overflow-hidden -mt-[72px]">
      {/* Background with cinematic radial fallback if no image */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,_#991b1b20_0%,_#0b0b0b_70%,_#000000_100%)]"></div>

      {backdropPath && (
        <div className="absolute inset-0 transition-opacity duration-1000 ease-out">
          <Img
            src={`https://image.tmdb.org/t/p/original${backdropPath}`}
            className="w-full h-full object-cover scale-105"
          />
        </div>
      )}
      
      {/* Cinematic Gradient Overlays */}
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/60 to-transparent"></div>

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 custom-container pb-12 flex flex-col items-start z-10 w-[95%] max-md:w-full mx-auto">
        <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-black text-white tracking-widest uppercase drop-shadow-2xl">
          Movies
        </h1>
        <p className="text-gray-400 mt-3 text-xs md:text-sm tracking-[0.3em] uppercase font-semibold">
          Discover 500+ pages of cinema
        </p>
      </div>
    </div>
  );
}

"use client";
import React from "react";
import Img from "../../_globalComponents/Img";
import { ShowType } from "@/app/types/websiteTypes";
import Link from "next/link";

interface Props {
  data: ShowType[];
  title?: string;
}

export default function TopMoviesSidebar({
  data,
  title = "Top Movies This Week",
}: Props) {
  return (
    <div className="xl:flex hidden flex-col gap-8 mt-16 pt-10 border-t border-white/5">
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 bg-accent rounded-full" />
        <h3 className="text-white text-xl font-black italic uppercase tracking-tighter">
          {title}
        </h3>
      </div>

      <div className="flex flex-col gap-6">
        {data?.slice(0, 10).map((movie, index) => (
          <Link
            key={movie.id}
            href={`/movies/${(movie.title || movie.name)?.replace(/\s+/g, "-").toLowerCase()}?currentId=${movie.id}`}
            className="flex items-center gap-4 group cursor-pointer"
          >
            <div className="relative shrink-0 flex items-center justify-center w-8">
              <span className="text-3xl font-black text-white/5 italic group-hover:text-accent/20 transition-colors duration-500 absolute -left-1">
                {index + 1}
              </span>
              <span className="relative z-10 text-lg font-black text-gray-500 italic group-hover:text-accent transition-colors duration-300">
                {index + 1}
              </span>
            </div>

            <div className="relative shrink-0 overflow-hidden rounded-xl w-16 aspect-[2/3] border border-white/10 bg-white/5 shadow-lg group-hover:border-accent/30 transition-colors duration-500">
              <Img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-accent/0 group-hover:bg-accent/10 transition-colors duration-500" />
            </div>

            <div className="flex flex-col gap-1 min-w-0">
              <p className="text-white text-sm font-bold truncate group-hover:text-accent transition-colors duration-300 tracking-tight">
                {movie.title || movie.name}
              </p>
              <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-[0.1em]">
                <span className="group-hover:text-gray-400 transition-colors">
                  {new Date(
                    movie.release_date || movie.first_air_date || "",
                  ).getFullYear()}
                </span>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <span className="truncate group-hover:text-gray-400 transition-colors">
                  {movie.genre_ids?.[0] ? "Action" : "Movie"}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Link
        href="/movies"
        className="mt-4 py-3 rounded-xl border border-white/5 bg-white/[0.02] text-center text-xs font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white hover:bg-accent hover:border-accent transition-all duration-300"
      >
        View All Ranking
      </Link>
    </div>
  );
}

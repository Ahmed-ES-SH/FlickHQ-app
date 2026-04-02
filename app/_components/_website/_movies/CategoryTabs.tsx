"use client";
import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function CategoryTabs() {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "popular";
  const currentGenre = searchParams.get("genre");

  const categories = [
    { title: "Popular", value: "popular" },
    { title: "Top Rated", value: "top_rated" },
    { title: "Now Playing", value: "now_playing" },
    { title: "Upcoming", value: "upcoming" },
  ];

  return (
    <div className="custom-container mt-10">
      <div className="flex items-center gap-2 w-fit p-2 rounded-full glass_bg border border-glass_border relative shadow-lg overflow-x-auto max-w-full hide-scrollbar">
        {categories.map((cat) => {
          const isActive = currentCategory === cat.value;
          const href = `/movies?category=${cat.value}${
            currentGenre ? `&genre=${currentGenre}` : ""
          }`;

          return (
            <Link
              key={cat.value}
              href={href}
              className={`relative z-10 cursor-pointer duration-300 px-5 md:px-8 py-2.5 rounded-full whitespace-nowrap ${
                isActive ? "text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              <motion.div
                layoutId="activeMovieCategory"
                animate={{ opacity: isActive ? 1 : 0 }}
                initial={false}
                className="absolute inset-0 bg-accent rounded-full -z-10 shadow-[0_0_15px_rgba(229,9,20,0.4)]"
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              />
              <span className="text-xs md:text-sm font-bold tracking-[0.1em] uppercase">
                {cat.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

"use client";
import React from "react";
import { useVariables } from "@/app/context/VariablesContext";
import { motion } from "framer-motion";

interface categoryType {
  text: "Popular" | "Upcoming" | "now_playing";
}

export default function FilterMoviesSection() {
  const { setCurrentCategory, currentCategory } = useVariables();

  const Categories: categoryType[] = [
    { text: "Popular" },
    { text: "Upcoming" },
    { text: "now_playing" },
  ];

  const handleSelectCategory = (cat: "Popular" | "Upcoming" | "now_playing") => {
    setCurrentCategory(cat);
  };

  return (
    <div className="custom-container flex flex-col md:flex-row items-center justify-between mt-12 mb-8 gap-6">
      {/* Dynamic Section Header */}
      <div className="flex items-center gap-3 self-start md:self-center">
        <div className="w-1 h-6 bg-accent rounded-full shadow-[0_0_10px_rgba(229,9,20,0.5)]" />
        <h2 className="text-white text-2xl font-black italic uppercase tracking-tighter">
          Discover <span className="text-accent">Movies</span>
        </h2>
      </div>

      {/* Pill Filter - Optimized for Touch & Desktop */}
      <div className="w-full md:w-auto overflow-x-auto scrollbar-hide pb-2 md:pb-0">
        <div className="flex items-center gap-1 p-1.5 rounded-full bg-white/[0.02] border border-white/5 backdrop-blur-md min-w-max">
          {Categories.map((cat) => (
            <button
              key={cat.text}
              onClick={() => handleSelectCategory(cat.text)}
              className={`relative z-10 cursor-pointer px-5 py-2.5 rounded-full transition-all duration-300 min-h-[44px] flex items-center justify-center ${
                currentCategory === cat.text
                  ? "text-white"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {currentCategory === cat.text && (
                <motion.div
                  layoutId="activeFilter"
                  className="absolute inset-0 bg-accent rounded-full -z-10 shadow-[0_0_20px_rgba(229,9,20,0.3)]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="text-xs font-black uppercase tracking-[0.15em] whitespace-nowrap">
                {cat.text === "now_playing" ? "Now Playing" : cat.text}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

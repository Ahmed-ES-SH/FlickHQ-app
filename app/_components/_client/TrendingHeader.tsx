"use client";
import { useVariables } from "@/app/context/VariablesContext";
import React from "react";

export default function TrendingHeader() {
  const { trendingState, setTrendingState } = useVariables();

  const btns = [
    {
      status: "shows",
      text: "Trending TV Shows",
      handle: () => setTrendingState("shows"),
    },
    {
      status: "movies",
      text: "Trending Movies",
      handle: () => setTrendingState("movies"),
    },
  ];

  return (
    <>
      <div className="xl:w-[90%] w-[95%] mx-auto mt-24 mb-4">
        <div className="flex items-center flex-wrap gap-4 w-fit  mr-auto">
          {btns.map((btn, index) => (
            <button
              onClick={btn.handle}
              key={index}
              className={`md:py-3 md:px-8 flex-1 p-2 whitespace-nowrap font-bold uppercase tracking-wider rounded-full text-center flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-lg ${
                trendingState == btn.status
                  ? "bg-accent border-2 border-accent text-white shadow-accent/50"
                  : "bg-glass_bg border-2 border-glass_border text-gray-300 hover:text-white hover:border-accent backdrop-blur-md"
              }`}
            >
              {btn.text}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

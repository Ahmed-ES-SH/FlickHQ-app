"use client";
import { ShowType } from "@/app/types/websiteTypes";
import React from "react";
import { useVariables } from "@/app/context/VariablesContext";
import { motion } from "framer-motion";
import SliderTrending from "../../_client/Sliders/SliderTrending";

interface props {
  data: ShowType[];
}

export default function TrendingMovies({ data }: props) {
  const { trendingState } = useVariables();

  return (
    <>
      {trendingState === "movies" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full relative mb-12"
        >
          {/* Edge-to-edge Slider Of Movies */}
          <SliderTrending data={data} />
        </motion.div>
      )}
    </>
  );
}

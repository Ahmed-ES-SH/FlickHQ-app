"use client";
import { useVariables } from "@/app/context/VariablesContext";
import { ShowType } from "@/app/types/websiteTypes";
import { motion } from "framer-motion";
import React from "react";
import SliderTrending from "../../_client/Sliders/SliderTrending";

interface props {
  data: ShowType[];
}

export default function TrendingShows({ data }: props) {
  const { trendingState } = useVariables();

  return (
    <>
      {trendingState == "shows" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full relative mb-12"
        >
          {/* Edge-to-edge Slider Of Shows */}
          <SliderTrending data={data} />
        </motion.div>
      )}
    </>
  );
}

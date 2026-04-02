"use client";
import React, { useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import { useVariables } from "@/app/context/VariablesContext";
import { CiSearch } from "react-icons/ci";
import InputSearchData from "./InputSearchData";

export default function ResponsiveSearchBar() {
  const { SearchbarState, setSearchbarState, width, setShowMobail } =
    useVariables();

  const toggleSearchBar = () => {
    setSearchbarState((prev) => !prev);
    setShowMobail(false);
  };

  useEffect(() => {
    if (width > 1024) setSearchbarState(false);
  }, [setSearchbarState, width]);

  return (
    <AnimatePresence mode="wait">
      {SearchbarState ? (
        <motion.div
          key="searchbar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed top-0 left-0 z-[1000] w-full bg-black/95 backdrop-blur-md h-[70px]"
        >
          <div className="flex items-center justify-between w-[80%] max-md:w-[95%] h-full mx-auto gap-3">
            <div className="w-full">
              <InputSearchData />
            </div>
            <button
              onClick={toggleSearchBar}
              className="w-10 h-10 flex items-center justify-center rounded-md bg-[#141414] border border-white/10 cursor-pointer hover:bg-[#1a1a1a] transition-colors shrink-0"
              aria-label="Close search"
            >
              <IoMdClose className="size-5 text-white" />
            </button>
          </div>
        </motion.div>
      ) : (
        <button
          onClick={toggleSearchBar}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-accent/10 text-accent hover:bg-accent/20 transition-colors lg:hidden"
          aria-label="Open search"
        >
          <CiSearch className="size-5" />
        </button>
      )}
    </AnimatePresence>
  );
}

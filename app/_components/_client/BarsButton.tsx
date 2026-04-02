"use client";
import { useVariables } from "@/app/context/VariablesContext";
import React from "react";
import { HiBars3BottomRight } from "react-icons/hi2";
import { IoCloseOutline } from "react-icons/io5";

export default function BarsButton() {
  const { setShowMobail, showMobail } = useVariables();
  const handleToggle = () => {
    setShowMobail((prev) => !prev);
  };
  return (
    <button
      onClick={handleToggle}
      className="w-10 h-10 flex items-center justify-center xl:hidden cursor-pointer text-white hover:text-accent transition-colors duration-200"
      aria-label={showMobail ? "Close menu" : "Open menu"}
    >
      {!showMobail ? (
        <HiBars3BottomRight className="size-6" />
      ) : (
        <IoCloseOutline className="size-7 text-accent" />
      )}
    </button>
  );
}

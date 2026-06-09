"use client";
import { useVariables } from "@/app/context/VariablesContext";
import React from "react";
import { FaTimes } from "react-icons/fa";

export default function CloseTrailer() {
  const { setTrailerState } = useVariables();
  return (
    <>
      <div
        onClick={() => setTrailerState(false)}
        className="w-6 h-6 flex items-center justify-center rounded-sm border bg-transparent cursor-pointer absolute top-4 right-4 border-primary_blue hover:bg-primary_blue hover:scale-110 duration-300"
      >
        <FaTimes className="size-4" />
      </div>
    </>
  );
}

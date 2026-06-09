"use client";
import { useVariables } from "@/app/context/VariablesContext";
import React from "react";
import { MdOutlineSlowMotionVideo } from "react-icons/md";

export default function OpenTrailer() {
  const { setTrailerState } = useVariables();
  return (
    <>
      <div
        onClick={() => setTrailerState(true)}
        className="flex animate-wiggle hover:animate-none items-center gap-2 text-white hover:text-primary_blue cursor-pointer duration-300 w-fit"
      >
        <MdOutlineSlowMotionVideo className="size-16 max-lg:size-12" />
        <p className="lg:text-2xl text-xl max-md:text-lg">Trailer</p>
      </div>
    </>
  );
}

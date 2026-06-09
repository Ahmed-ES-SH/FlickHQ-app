"use client";
import { useVariables } from "@/app/context/VariablesContext";
import React from "react";
import { FaFilm, FaSadTear } from "react-icons/fa";

export default function NotFoundTrailer() {
  const { setTrailerState } = useVariables();
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[300px] bg-thired_dash  rounded-lg p-6 text-center">
        <div className="relative mb-4">
          <FaFilm className="text-5xl text-gray-400 " />
          <FaSadTear className="absolute -bottom-2 -right-2 text-2xl text-yellow-500" />
        </div>

        <h3 className="text-xl font-bold text-white  mb-2">No trailer found</h3>

        <p className="text-gray-300  max-w-md">
          Sorry, there is currently no trailer available for this content. You
          can try searching for other content or try again later.
        </p>

        <button
          onClick={() => setTrailerState(false)}
          className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </>
  );
}

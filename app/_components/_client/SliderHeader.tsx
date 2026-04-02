"use client";
import React from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

interface props {
  BigTitle?: string;
  coloredTitle?: string;
  showbtns?: boolean;
  goNext: () => void;
  goPrev: () => void;
}

export default function SliderHeader({
  BigTitle = "Upcoming Movies",
  coloredTitle = "ONLINE STREAMING",
  showbtns = false,
  goNext,
  goPrev,
}: props) {
  return (
    <>
      <div className="w-full my-6 max-sm:my-4">
        <div className="lg:w-[90%] xl:w-[80%] w-[95%] mx-auto flex items-center justify-between flex-wrap max-sm:flex-col max-sm:items-center max-sm:gap-4 pt-4 border-t border-primary_blue">
          <div className="flex flex-col items-start gap-2">
            <h6 className="text-primary_blue text-[12px] whitespace-nowrap py-2 text-left">
              {coloredTitle}
            </h6>
            <h2 className="xl:text-4xl lg:text-2xl text-xl max-sm:text-lg text-gray-100">
              {BigTitle}
            </h2>
          </div>
          <div className="flex items-center max-sm:w-full max-sm:justify-center gap-4">
            {showbtns &&
              ["TV Shows", "Movies"].map((text, index) => (
                <button
                  key={index}
                  className="py-2 px-6 max-sm:py-2.5 max-sm:px-5 hover:border-primary_blue duration-300 text-white rounded-full text-center flex items-center justify-center bg-thired_dash border border-gray-500 cursor-pointer min-h-[44px]"
                >
                  {text}
                </button>
              ))}
            {
              <div className="h-[44px] min-w-[120px] max-sm:h-[44px] hover:border-primary_blue duration-300 text-white rounded-full text-center flex items-center justify-between bg-thired_dash border border-gray-500 cursor-pointer" role="group" aria-label="Slider navigation">
                <button
                  onClick={goPrev}
                  className="flex-1 h-full flex items-center justify-center rounded-l-full hover:bg-primary_blue duration-200 min-w-[44px] min-h-[44px]"
                  aria-label="Previous slide"
                >
                  <MdChevronLeft className="text-white size-6" />
                </button>
                <button
                  onClick={goNext}
                  className="flex-1 h-full flex items-center justify-center rounded-r-full hover:bg-primary_blue duration-200 min-w-[44px] min-h-[44px]"
                  aria-label="Next slide"
                >
                  <MdChevronRight className="text-white size-6" />
                </button>
              </div>
            }
          </div>
        </div>
      </div>
    </>
  );
}

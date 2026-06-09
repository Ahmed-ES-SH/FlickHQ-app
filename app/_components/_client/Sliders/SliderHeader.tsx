import React from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

export default function SliderHeader() {
  return (
    <>
      <div className="flex items-center gap-4 w-fit ml-auto ">
        {["TV Shows", "Movies"].map((text, index) => (
          <button
            key={index}
            className="py-2 px-6 hover:border-primary_blue duration-300 text-white rounded-full text-center flex items-center justify-center bg-thired_dash border border-gray-500 cursor-pointer"
          >
            {text}
          </button>
        ))}
        <div className="h-[40px] w-[100px]  hover:border-primary_blue duration-300 text-white rounded-full text-center flex items-center justify-between  bg-thired_dash border border-gray-500 cursor-pointer">
          <div className="flex-1 h-full flex items-center justify-center rounded-l-full hover:bg-primary_blue duration-200">
            <MdChevronLeft className="text-white size-6 " />
          </div>
          <div className="flex-1 h-full flex items-center justify-center rounded-r-full hover:bg-primary_blue duration-200">
            <MdChevronRight className="text-white size-6" />
          </div>
        </div>
      </div>
    </>
  );
}

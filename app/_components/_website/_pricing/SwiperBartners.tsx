"use client";
import React from "react";
import { SwiperSlide, Swiper } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { partners } from "@/app/constants/website";
import Img from "../../_globalComponents/Img";
import "swiper/css";

export default function SwiperBartners() {
  return (
    <div className="w-full mt-16 mb-10 py-8">
      <Swiper
        className=""
        modules={[Autoplay]}
        autoplay={{
          delay: 1500,
          pauseOnMouseEnter: true,
        }}
        breakpoints={{
          200: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          500: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 4,
            spaceBetween: 30,
          },
          1024: {
            slidesPerView: 6,
            spaceBetween: 50,
          },
        }}
        slidesPerView={6}
        spaceBetween={50}
      >
        {partners.map((img, index) => (
          <SwiperSlide key={index}>
            <Img
              src={img}
              className="w-[220px] grayscale-100 hover:scale-115 hover:grayscale-0 duration-700 cursor-pointer"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

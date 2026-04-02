"use client";
import React, { useRef } from "react";
import { Swiper as SwiperType } from "swiper";
import { ShowType } from "@/app/types/websiteTypes";
import { Virtual, Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useData } from "@/app/context/DataContext";
import SliderCard from "../../_website/_movies/SliderCard";
import "swiper/css";

interface props {
  data: ShowType[];
}

export default function SliderTrending({ data }: props) {
  const swiperRef = useRef<SwiperType | null>(null);
  const { genres } = useData();

  const handleCurrentSlide = () => {
    // Optional: implement navigate to detail page or open modal
  };

  return (
    <div className="w-full xl:pl-16 lg:pl-12 pl-6 custom-container-overflow-hidden">
      <Swiper
        className="w-full h-full overflow-visible"
        modules={[Virtual, Autoplay]}
        autoplay={{
          delay: 4500,
          pauseOnMouseEnter: true,
        }}
        slidesPerView={4.2}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        breakpoints={{
          0: {
            slidesPerView: 1.2,
            spaceBetween: 16,
          },
          300: {
            slidesPerView: 2.2,
            spaceBetween: 16,
          },
          620: {
            slidesPerView: 3.2,
            spaceBetween: 20,
          },
          960: {
            slidesPerView: 4.2,
            spaceBetween: 24,
          },
          1280: {
            slidesPerView: 5.5,
            spaceBetween: 24,
          },
        }}
      >
        {data.map((movie: ShowType | ShowType, index) => {
          const matchedGenres =
            genres &&
            movie &&
            genres.filter(
              (genre) => genre.id !== null && movie.genre_ids.includes(genre.id)
            );
          return (
            <SwiperSlide
              className="rounded-md w-full  my-auto"
              key={movie.id}
              virtualIndex={index}
              onClick={() => handleCurrentSlide()}
            >
              <SliderCard
                height="h-full"
                movie={movie}
                genres={matchedGenres}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}

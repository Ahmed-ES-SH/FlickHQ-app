"use client";
import { ShowType } from "@/app/types/websiteTypes";
import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper/types";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import SliderHeader from "../../_client/SliderHeader";
import { useData } from "@/app/context/DataContext";
import MediaCard from "../_movies/MediaCard";

interface props {
  data: ShowType[];
  dataType: "movies" | "shows";
  bigTitle: string;
}

export default function SliderTopRated({ data, dataType, bigTitle }: props) {
  const { genres, genres_Shows } = useData();
  const swiperRef = useRef<SwiperType | null>(null);
  return (
    <section className="py-12 md:py-20 overflow-hidden">
      <SliderHeader
        BigTitle={bigTitle}
        goNext={() => swiperRef.current?.slideNext()}
        goPrev={() => swiperRef.current?.slidePrev()}
      />
      <div className="custom-container !px-0 md:!px-4">
        <Swiper
          modules={[Autoplay, FreeMode]}
          autoplay={{
            delay: 5000,
            pauseOnMouseEnter: true,
            disableOnInteraction: false
          }}
          grabCursor={true}
          freeMode={true}
          breakpoints={{
            0: {
              slidesPerView: 1.2,
              spaceBetween: 16,
            },
            480: {
              slidesPerView: 2.2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3.2,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 4.2,
              spaceBetween: 28,
            },
            1440: {
              slidesPerView: 5.2,
              spaceBetween: 32,
            },
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          className="!overflow-visible"
        >
          {data &&
            data.map((item, index) => {
              const matchedGenres =
                genres &&
                genres_Shows &&
                item &&
                (dataType == "shows" ? genres_Shows : genres).filter(
                  (genre) =>
                    genre.id !== null && item.genre_ids.includes(genre.id)
                );
              return (
                <SwiperSlide key={index} className="transition-transform duration-500 hover:z-50">
                  <MediaCard media={item} index={index} genres={matchedGenres} />
                </SwiperSlide>
              );
            })}
        </Swiper>
      </div>
    </section>
  );
}

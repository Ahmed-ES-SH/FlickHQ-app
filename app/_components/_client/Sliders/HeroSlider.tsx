"use client";

import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Thumbs, Keyboard } from "swiper/modules";
import { ShowType } from "@/app/types/websiteTypes";
import type { Swiper as SwiperType } from "swiper";
import { formatTitle } from "@/app/_helpers/helpers";
import { useVariables } from "@/app/context/VariablesContext";
import { useRouter } from "next/navigation";
import { useHeroWatchlist } from "@/app/hooks/useHeroWatchlist";

import HeroEmptyState from "./HeroEmptyState";
import HeroBackdropSlide from "./HeroBackdropSlide";
import HeroSlideContent from "./HeroSlideContent";
import HeroWatchlistButton from "./HeroWatchlistButton";
import HeroProgressBar from "./HeroProgressBar";
import HeroThumbnails from "./HeroThumbnails";

// //////////////////////////////////////////////////////////////////////////////
// ///////// HeroSlider — main orchestrator /////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////
// Responsibilities:
//   - Manage active slide index, thumbs swiper, progress bar ref
//   - Choose data source (movies vs shows) from trendingState
//   - Render empty state fallback or full slider with sub-components

export default function HeroSlider({
  movies,
  shows,
}: {
  movies: ShowType[];
  shows: ShowType[];
}) {
  const { trendingState, setTrendingState } = useVariables();
  const router = useRouter();
  const { handleWatchlistToggle, watchlistLoading, isInWatchlist } =
    useHeroWatchlist();

  const data = trendingState === "movies" ? movies : shows;

  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.realIndex);
    if (progressRef.current) {
      progressRef.current.style.width = "0%";
    }
  };

  // ////////////////////////////////////////////////////////////////////////////
  // ///////// Empty state — no trending data ///////////////////////////////////
  // ////////////////////////////////////////////////////////////////////////////
  if (!data || data.length === 0) {
    return (
      <HeroEmptyState
        trendingState={trendingState}
        onToggle={() =>
          setTrendingState(trendingState === "movies" ? "shows" : "movies")
        }
      />
    );
  }

  return (
    <div className="relative w-full">
      {/* ─── Main Backdrop Slider ─── */}
      <div className="relative w-full h-[65vh] sm:h-[75vh] md:h-[85vh] lg:h-[90vh]">
        <Swiper
          modules={[Autoplay, EffectFade, Thumbs, Keyboard]}
          effect="fade"
          loop={true}
          thumbs={{
            swiper:
              thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
          }}
          keyboard={{ enabled: true }}
          onSlideChange={handleSlideChange}
          onAutoplayTimeLeft={(_, __, percentage) => {
            if (progressRef.current) {
              progressRef.current.style.width = `${(1 - percentage) * 100}%`;
            }
          }}
          className="absolute inset-0 w-full h-full z-0"
        >
          {data.map((movie, index) => (
            <SwiperSlide
              key={movie.id}
              className="relative hidden w-full h-full"
            >
              {/* Backdrop image + gradients */}
              <HeroBackdropSlide
                movie={movie}
                isActive={activeIndex === index}
                prefersReducedMotion={prefersReducedMotion}
                priority={index === 0}
              />

              {/* Animated content overlay */}
              <HeroSlideContent
                movie={movie}
                isActive={activeIndex === index}
                onPlay={() => {
                  const isMovie = !!movie.title;
                  const path = isMovie ? "movies" : "shows";
                  const title = formatTitle(movie.title || movie.name || "");
                  router.push(`/${path}/${title}?currentId=${movie.id}`);
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Autoplay progress bar */}
        <HeroProgressBar progressRef={progressRef} />
      </div>

      {/* Thumbnail navigation + Movies/Shows toggle */}
      <HeroThumbnails
        data={data}
        activeIndex={activeIndex}
        trendingState={trendingState}
        onTrendingToggle={setTrendingState}
        onThumbsSwiper={setThumbsSwiper}
      />

      {/* Spacer for thumbnails overlap */}
      <div className="h-16 sm:h-20 md:h-24" />
    </div>
  );
}

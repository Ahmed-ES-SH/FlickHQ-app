/* eslint-disable @typescript-eslint/no-explicit-any */
import CurrentMediaDetailes from "@/app/_components/_client/mediaPage/CurrentMediaDetailes";
import MediaCommentsAndReviews from "@/app/_components/_client/movies/MediaCommentsAndReviews";
import Img from "@/app/_components/_globalComponents/Img";
import MediaTrailer from "@/app/_components/_website/_movies/MediaTrailer";
import { upcomingMovies } from "@/app/constants/apis";
import FetchData from "@/app/hooks/FetchData";
import { ShowType } from "@/app/types/websiteTypes";
import React from "react";

export default async function page({ searchParams }: any) {
  //movieId
  const params = await searchParams;
  const movieId = params?.currentId;

  // CurrentMovie
  const movie: ShowType = await FetchData(
    `/movie/${movieId}?language=en-US`,
    false,
  );

  //similarMovies
  const { results: similarMovies } = await FetchData(
    `/movie/${movieId}/similar`,
    false,
  );

  // upComingMovies
  const { results: upComingMovies } = await FetchData(
    `${upcomingMovies}page=1`,
    false,
  );

  // Top Rated for Sidebar
  const { results: topRatedForSidebar } = await FetchData(
    `/movie/top_rated?language=en-US&page=1`,
    false,
  );

  // Movie Trailer
  const { results } = await FetchData(`/movie/${movieId}/videos`, false);
  const trailer =
    results.find(
      (item: ShowType) =>
        item.name.toLowerCase().includes("official") &&
        item.name.toLowerCase().includes("trailer"),
    ) ||
    results.find((item: ShowType) =>
      ["official", "trailer"].some((keyword) =>
        item.name.toLowerCase().includes(keyword),
      ),
    );

  return (
    <div className="relative bg-black min-h-screen">
      {/* 1. Backdrop Hero - Full width background */}
      <div className="absolute top-0 left-0 w-full h-[45vh] lg:h-[60vh] z-0">
        <Img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-black/40 lg:bg-black/30" />
      </div>

      <div className="relative z-10 pt-[15vh] lg:pt-[25vh]">
        <div className="custom-container flex flex-col xl:flex-row gap-8 xl:gap-12">
          {/* 2. Left Sidebar - Poster, Title, Meta, Top 10 */}
          <div className="w-full xl:w-[320px] shrink-0">
            <CurrentMediaDetailes
              media={movie}
              topMovies={topRatedForSidebar}
            />
          </div>

          {/* 3. Main Content - Actions, Tabs, Grids, Social */}
          <div className="flex-1 flex flex-col gap-8 xl:gap-12 pb-20">
            <MediaCommentsAndReviews
              data={upComingMovies}
              similarMovies={similarMovies}
            />

            <div className="order-first xl:order-none">
              <MediaTrailer trailer={trailer} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

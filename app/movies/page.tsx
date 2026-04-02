/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Suspense } from "react";
import { genersMovies } from "../constants/apis";
import MoviesGrid from "../_components/_website/_movies/MoviesGrid";
import ServerPagination from "../_components/_globalComponents/ServerPagination";
import FetchData from "../hooks/FetchData";
import MoviesPageHeader from "../_components/_website/_movies/MoviesPageHeader";
import CategoryTabs from "../_components/_website/_movies/CategoryTabs";
import GenreSidebar from "../_components/_website/_movies/GenreSidebar";

export default async function page({ searchParams }: any) {
  const { genres } = await FetchData(genersMovies, false);
  const params = await searchParams; // Next.js 15 requires awaiting searchParams
  const currentPage = Number(params?.page || 1);
  const currentCategory = params?.category || "popular";
  const currentGenre = params?.genre;

  // Determine endpoint based on category and genre
  let endpoint = `/movie/${currentCategory}?language=en-US&page=${currentPage}`;

  if (currentGenre) {
    let sortBy = "popularity.desc";
    if (currentCategory === "top_rated") sortBy = "vote_average.desc";
    if (currentCategory === "upcoming") sortBy = "primary_release_date.desc";
    if (currentCategory === "now_playing") sortBy = "release_date.desc";

    endpoint = `/discover/movie?language=en-US&sort_by=${sortBy}&with_genres=${currentGenre}&page=${currentPage}`;
  }

  const { data, total_pages } = await FetchData(endpoint, true);
  const firstMovieBackdrop = data?.results?.[0]?.backdrop_path || null;

  return (
    <>
      <MoviesPageHeader backdropPath={firstMovieBackdrop} />

      <Suspense fallback={<div className="h-10"></div>}>
        <CategoryTabs />
      </Suspense>

      <div className="p-2 2xl:w-[94%] mx-auto mb-12 mt-6 flex flex-col lg:flex-row gap-8 lg:gap-10">
        {/* Sidebar for Genres */}
        <div className="w-full lg:w-64 shrink-0">
          <Suspense fallback={<div className="h-10"></div>}>
            <GenreSidebar genres={genres || []} />
          </Suspense>
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full overflow-hidden">
          <MoviesGrid movies={data?.results || []} genres={genres || []} />

          {total_pages > 1 && (
            <ServerPagination
              usedURL="/movies"
              searchParams={params}
              currentPage={currentPage}
              totalPages={total_pages >= 500 ? 500 : total_pages}
            />
          )}
        </div>
      </div>
    </>
  );
}

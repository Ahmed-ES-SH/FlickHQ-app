/* eslint-disable @typescript-eslint/no-explicit-any */
import ShowsBody from "@/app/_components/_website/_shows/ShowsBody";
import {
  genresShows,
  trendingShows as trendingShowsApi,
  TopratedShows,
} from "@/app/constants/apis";
import FetchData from "@/app/hooks/FetchData";
import React from "react";

export default async function ShowsPage({ searchParams }: any) {
  const [genresRes, trendingRes, topRatedRes] = await Promise.all([
    FetchData(genresShows, false),
    FetchData(trendingShowsApi, true),
    FetchData(TopratedShows, true),
  ]);

  const showGenres = genresRes?.genres || [];
  const trendingData = trendingRes?.data?.results?.slice(0, 8) || [];
  const topRatedData = topRatedRes?.data?.results?.slice(0, 8) || [];
  const currentPage = Number(searchParams?.page || 1);

  return (
    <div className="w-full">
      <ShowsBody
        currentPage={currentPage}
        showGenres={showGenres}
        trendingShows={trendingData}
        topRatedShows={topRatedData}
      />
    </div>
  );
}

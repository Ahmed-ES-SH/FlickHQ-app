import { TopratedMovies } from "@/app/constants/apis";
import FetchData from "@/app/hooks/FetchData";
import React from "react";
import SliderTopRated from "./SliderTopRated";

export default async function TopRatedMovies() {
  const { results } = await FetchData(TopratedMovies, false);
  return (
    <>
      <SliderTopRated
        bigTitle="Top Rated Movies"
        dataType="movies"
        data={results}
      />
    </>
  );
}

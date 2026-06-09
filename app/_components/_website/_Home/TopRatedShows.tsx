import React from "react";
import SliderTopRated from "./SliderTopRated";
import FetchData from "@/app/hooks/FetchData";
import { TopratedShows } from "@/app/constants/apis";

export default async function TopRatedShows() {
  const { results } = await FetchData(TopratedShows, false);
  return (
    <>
      <SliderTopRated
        bigTitle="Top Rated Shows"
        dataType="shows"
        data={results}
      />
    </>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import ShowDetails from "@/app/_components/_website/_shows/ShowDetails";
import FetchData from "@/app/hooks/FetchData";
import React from "react";

export default async function SingleShowPage({ searchParams }: any) {
  const showId = searchParams?.currentId;

  if (!showId) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-white mt-20">
        <p className="text-xl text-gray-400">Show not found.</p>
      </div>
    );
  }

  const [showRes, similarRes, reviewsRes] = await Promise.all([
    FetchData(
      `/tv/${showId}?language=en-US&append_to_response=videos,credits,external_ids`,
      false
    ),
    FetchData(`/tv/${showId}/similar?language=en-US&page=1`, true),
    FetchData(`/tv/${showId}/reviews?language=en-US&page=1`, true),
  ]);

  const showData = showRes;
  const similarShows = similarRes?.data?.results?.slice(0, 12) || [];
  const reviews = reviewsRes?.data?.results?.slice(0, 6) || [];

  return (
    <div className="w-full mt-20">
      <ShowDetails
        show={showData}
        similarShows={similarShows}
        reviews={reviews}
      />
    </div>
  );
}

// //////////////////////////////////////////////////////////////////////////////
// Single Show Page — fetches show details, similar shows, and reviews ////////
// //////////////////////////////////////////////////////////////////////////////

import ShowDetails from "@/app/_components/_website/_shows/ShowDetails";
import FetchData from "@/app/hooks/FetchData";
import { getSharedMetadata } from "@/app/_helpers/shared/SharedMetadata";
import type { ShowDetailsData, TMDBReview } from "@/app/types/shows";
import type { ShowType } from "@/app/types/websiteTypes";

export function generateMetadata() {
  const title = "FlickHQ – Movies & TV Shows - TV Show Details";
  const description =
    "Explore detailed information about your favorite TV shows — cast, seasons, ratings, reviews, and similar recommendations on FlickHQ.";
  return getSharedMetadata(title, description);
}

export default async function SingleShowPage({
  searchParams,
}: {
  searchParams: Promise<{ currentId?: string }>;
}) {
  const { currentId } = await searchParams;

  if (!currentId) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center text-white mt-20">
        <p className="text-xl text-gray-400">Show not found.</p>
      </div>
    );
  }

  const [showRes, similarRes, reviewsRes] = await Promise.all([
    FetchData(
      `/tv/${currentId}?language=en-US&append_to_response=videos,credits,external_ids`,
      false,
    ),
    FetchData(`/tv/${currentId}/similar?language=en-US&page=1`, true),
    FetchData(`/tv/${currentId}/reviews?language=en-US&page=1`, true),
  ]);

  const showData = showRes as unknown as ShowDetailsData;
  const similarShows: ShowType[] = similarRes?.data?.results?.slice(0, 12) || [];
  const reviews: TMDBReview[] = reviewsRes?.data?.results?.slice(0, 6) || [];

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

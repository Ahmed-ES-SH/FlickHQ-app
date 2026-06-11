import { Suspense } from "react";
import { genersMovies } from "../constants/apis";
import MoviesGrid from "../_components/_website/_movies/MoviesGrid";
import ServerPagination from "../_components/_globalComponents/ServerPagination";
import FetchData from "../hooks/FetchData";
import MoviesPageHeader from "../_components/_website/_movies/MoviesPageHeader";
import CategoryTabs from "../_components/_website/_movies/CategoryTabs";
import GenreSidebar from "../_components/_website/_movies/GenreSidebar";
import { buildMoviesEndpoint } from "../_helpers/movies/moviesHelpers";
import { getSharedMetadata } from "../_helpers/shared/SharedMetadata";
import type { MoviesSearchParams, MoviesPageData } from "../types/movies";
import type { gener } from "../types/ContextType";

// //////////////////////////////////////////////////////////////////////////////
// ///////// Metadata for the Movies page ///////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////

export function generateMetadata() {
  const title = "FlickHQ – Movies & TV Shows - Movies Page";
  const description =
    "Browse 500+ pages of movies — filter by popular, top rated, now playing, and upcoming. Discover your next favorite film on FlickHQ.";

  return getSharedMetadata(title, description);
}

// //////////////////////////////////////////////////////////////////////////////
// ///////// Movies listing page — entry point only /////////////////////////////
// //////////////////////////////////////////////////////////////////////////////

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<MoviesSearchParams>;
}) {
  const { genres } = (await FetchData(genersMovies, false)) as {
    genres: gener[];
  };

  const params = await searchParams;
  const currentPage = Number(params?.page || 1);
  const currentCategory = params?.category || "popular";
  const currentGenre = params?.genre;

  const endpoint = buildMoviesEndpoint(currentCategory, currentPage, currentGenre);

  const { data, total_pages } = (await FetchData(endpoint, true)) as {
    data: MoviesPageData;
    total_pages: number;
  };

  const firstMovieBackdrop = data?.results?.[0]?.backdrop_path || null;

  return (
    <>
      <MoviesPageHeader backdropPath={firstMovieBackdrop} />

      <Suspense fallback={<div className="h-10" />}>
        <CategoryTabs />
      </Suspense>

      <div className="p-2 2xl:w-[94%] mx-auto mb-12 mt-6 flex flex-col lg:flex-row gap-8 lg:gap-10">
        {/* Sidebar for Genres */}
        <div className="w-full lg:w-64 shrink-0">
          <Suspense fallback={<div className="h-10" />}>
            <GenreSidebar genres={genres || []} />
          </Suspense>
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full overflow-hidden">
          <MoviesGrid movies={data?.results || []} genres={genres || []} />

          {total_pages > 1 && (
            <ServerPagination
              usedURL="/movies"
              searchParams={params as Record<string, string>}
              currentPage={currentPage}
              totalPages={total_pages >= 500 ? 500 : total_pages}
            />
          )}
        </div>
      </div>
    </>
  );
}

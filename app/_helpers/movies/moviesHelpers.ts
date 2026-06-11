// //////////////////////////////////////////////////////////////////////////////
// ///////// Movie endpoint builder helpers ////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////

const MOVIE_SORT_BY: Record<string, string> = {
  top_rated: "vote_average.desc",
  upcoming: "primary_release_date.desc",
  now_playing: "release_date.desc",
};

/**
 * Returns the TMDB sort_by parameter for a given movie category.
 * Falls back to "popularity.desc" for unknown categories (e.g. "popular").
 */
export function getMovieSortBy(category: string): string {
  return MOVIE_SORT_BY[category] || "popularity.desc";
}

/**
 * Builds a TMDB API endpoint path for the movies page.
 *
 * When a genre filter is active, uses the `/discover/movie` endpoint
 * with the appropriate sort order for the selected category.
 * Otherwise, uses the simple `/movie/{category}` endpoint.
 */
export function buildMoviesEndpoint(
  category: string,
  page: number,
  genre?: string | null,
): string {
  if (genre) {
    const sortBy = getMovieSortBy(category);
    return `/discover/movie?language=en-US&sort_by=${sortBy}&with_genres=${genre}&page=${page}`;
  }

  return `/movie/${category}?language=en-US&page=${page}`;
}

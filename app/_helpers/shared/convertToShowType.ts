import type { ListItemResponseDto } from "@/app/types/lists";
import type { ShowType } from "@/app/types/websiteTypes";
import type { gener } from "@/app/types/ContextType";

/**
 * Converts a ListItemResponseDto from the lists API into a ShowType
 * that can be passed to MediaCard and other media display components.
 */
export function convertToShowType(item: ListItemResponseDto): ShowType {
  return {
    id: item.tmdbId,
    title: item.title,
    name: item.mediaType === "tv" ? item.title : "",
    poster_path: item.posterPath
      ? `https://image.tmdb.org/t/p/w500${item.posterPath}`
      : "",
    release_date: item.releaseDate || "",
    first_air_date: item.mediaType === "tv" ? item.releaseDate || "" : "",
    vote_average: item.voteAverage ?? 0,
    vote_count: 0,
    media_type: item.mediaType,
    overview: "",
    genre_ids: [],
    popularity: 0,
    original_language: "",
    backdrop_path: "",
    genres: [] as gener[],
    runtime: 0,
    number_of_episodes: 0,
    origin_country: [],
  };
}

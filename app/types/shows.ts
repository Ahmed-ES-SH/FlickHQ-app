// //////////////////////////////////////////////////////////////////////////////
// Show details — TMDB API response shapes for the show detail page ///////////
// //////////////////////////////////////////////////////////////////////////////

export interface ShowNetwork {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface ShowProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface ShowGenre {
  id: number;
  name: string;
}

export interface ShowCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface ShowSeason {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  air_date: string;
  poster_path: string | null;
  overview: string;
}

export interface ShowLastEpisode {
  id: number;
  name: string;
  season_number: number;
  episode_number: number;
  overview: string;
  air_date: string;
}

export interface ShowDetailsData {
  id: number;
  name: string;
  tagline: string;
  overview: string;
  backdrop_path: string;
  poster_path: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  status: string;
  first_air_date: string;
  last_air_date: string;
  number_of_seasons: number;
  number_of_episodes: number;
  episode_run_time: number[];
  original_language: string;
  genres: ShowGenre[];
  networks: ShowNetwork[];
  production_companies: ShowProductionCompany[];
  credits: {
    cast: ShowCastMember[];
  };
  seasons: ShowSeason[];
  last_episode_to_air: ShowLastEpisode | null;
  in_production: boolean;
  type: string;
}

export interface TMDBReviewAuthorDetails {
  name: string;
  username: string;
  avatar_path: string | null;
  rating: number | null;
}

export interface TMDBReview {
  id: string;
  author: string;
  author_details: TMDBReviewAuthorDetails;
  content: string;
  created_at: string;
  updated_at: string;
  url: string;
}

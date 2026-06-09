import { gener } from "./ContextType";

export interface movieType {
  id: number;
  vote_average: number;
  poster_path: string;
  release_date: string;
  overview: string;
  title: string;
  genre_ids: number[];
  vote_count: number;
  popularity: number;
  original_language: string;
  backdrop_path: string;
}

export interface ShowType {
  id: number;
  first_air_date: string;
  genre_ids: number[];
  origin_country: string[];
  original_language: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
  backdrop_path: string;
  media_type: string;
  name: string;
  title: string;
  release_date: string;
  genres: gener[];
  runtime: number;
  number_of_episodes: number;
}

export interface fullMovie {
  id: number;
  first_air_date: string;
  genre_ids: number[];
  origin_country: string[];
  original_language: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
  backdrop_path: string;
  media_type: string;
  name: string;
  title: string;
  release_date: string;
  genres: gener[];
  runtime: number;
}

export interface commentType {
  content: string;
  author: string;
  date: string | number;
  time: string | number;
  likes: number;
  dislikes: number;
}

export interface ReviewType {
  content: string;
  title: string;
  date: string | number;
  time: string | number;
  rating: number | string;
}

export interface MovieApiResponse {
  results: ShowType[];
  // ممكن إضافة total_pages، page، total_results... إلخ
}

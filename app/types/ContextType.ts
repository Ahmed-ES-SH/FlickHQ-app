import { Dispatch, SetStateAction } from "react";
import { ShowType } from "./websiteTypes";

export interface gener {
  id: number | null;
  name: string;
}

export interface DataContextType {
  genres: gener[];
  genres_Shows: gener[];
}

export interface VariablesTypes {
  show: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  showMobail: boolean;
  setShowMobail: Dispatch<SetStateAction<boolean>>;
  scrollY: number;
  setScrollY: Dispatch<SetStateAction<number>>;
  trendingState: "movies" | "shows";
  setTrendingState: Dispatch<SetStateAction<"movies" | "shows">>;
  SearchbarState: boolean;
  setSearchbarState: Dispatch<SetStateAction<boolean>>;
  width: number;
  currentCategory: "Popular" | "Upcoming" | "now_playing";
  setCurrentCategory: Dispatch<
    SetStateAction<"Popular" | "Upcoming" | "now_playing">
  >;
  trailerState: boolean;
  setTrailerState: Dispatch<SetStateAction<boolean>>;
  showSidebar: boolean;
  setShowSidebar: Dispatch<SetStateAction<boolean>>;
}

export interface ListContextType {
  favoritesList: ShowType[];
  setFavoritesList: Dispatch<SetStateAction<ShowType[]>>;
  watchedList: ShowType[];
  setWatchedList: Dispatch<SetStateAction<ShowType[]>>;
  watchList: ShowType[];
  setWatchList: Dispatch<SetStateAction<ShowType[]>>;
  handleAddMedia: (
    setList: Dispatch<SetStateAction<ShowType[]>>,
    media: ShowType
  ) => void;
  handleDeleteMedia: (
    setList: Dispatch<SetStateAction<ShowType[]>>,
    media: ShowType
  ) => void;
  handleAddMediaToWatchedlist: (media: ShowType) => void;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

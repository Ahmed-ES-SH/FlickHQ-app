"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { DataContextType, gener } from "../types/ContextType";
import { genersMovies, genresShows } from "../constants/apis";
import { useFetchData } from "../hooks/FetchClientData";

type Props = {
  children: ReactNode;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

const DataProvider = ({ children }: Props) => {
  const [genres, setGenres] = useState<gener[]>([]);
  const [genres_Shows, setGenres_Shows] = useState<gener[]>([]);

  const { data: moviesGenres } = useFetchData<{ genres: gener[] }>(
    genersMovies,
    false,
  );
  const { data: showsGenres } = useFetchData<{ genres: gener[] }>(
    genresShows,
    false,
  );

  useEffect(() => {
    if (moviesGenres) {
      setGenres(moviesGenres.genres);
    }

    if (showsGenres) {
      setGenres_Shows(showsGenres?.genres);
    }
  }, [moviesGenres, showsGenres]);

  return (
    <DataContext.Provider value={{ genres, genres_Shows }}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

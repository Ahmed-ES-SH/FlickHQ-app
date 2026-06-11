//////////////////////////////////////////////////////////////////////////////
///////// Hook for fetching paginated/filtered shows from TMDB ///////////////
//////////////////////////////////////////////////////////////////////////////

"use client";

import { useState, useEffect, useCallback } from "react";
import { instance } from "@/app/_components/_globalComponents/AxiosTool";
import { popularTvShow } from "@/app/constants/apis";
import type { ShowType } from "@/app/types/websiteTypes";

interface UseLoadShowsReturn {
  shows: ShowType[];
  totalPages: number;
  loading: boolean;
  error: string | null;
  loadShows: () => Promise<void>;
}

export function useLoadShows(
  selectedGenre: number | null,
  currentPage: number,
): UseLoadShowsReturn {
  const [shows, setShows] = useState<ShowType[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadShows = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const genreParam = selectedGenre ? `with_genres=${selectedGenre}&` : "";
      const result = await instance.get(
        `${popularTvShow}${genreParam}page=${currentPage}`,
      );

      setShows(result?.data?.results || []);
      //@ts-ignore
      setTotalPages(Math.min(result?.total_pages || 1, 500));
    } catch (error: any) {
      setError(error.message);
      setShows([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [selectedGenre, currentPage]);

  useEffect(() => {
    loadShows();
  }, [loadShows]);

  return { shows, totalPages, loading, error, loadShows };
}

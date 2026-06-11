"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useAuthStore } from "@/app/_stores/authStore";
import { useListStore } from "@/app/_stores/listStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { MediaType } from "@/app/types/lists";
import type { ShowType } from "@/app/types/websiteTypes";

// //////////////////////////////////////////////////////////////////////////////
// ///////// Custom hook for HeroSlider watchlist logic /////////////////////////
// //////////////////////////////////////////////////////////////////////////////
// Encapsulates watchlist toggle, loading state, initial fetch, and
// authentication gating. Returns helpers the slider UI needs.
export function useHeroWatchlist() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInWatchlist = useListStore((s) => s.isInWatchlist);
  const addItem = useListStore((s) => s.addItem);
  const removeItem = useListStore((s) => s.removeItem);
  const watchlistId = useListStore((s) => s.getSystemList("watchlist")?.id);
  const watchlistItems = useListStore(
    (s) => s.getSystemList("watchlist")?.items,
  );
  const fetchListItems = useListStore((s) => s.fetchListItems);
  const isInitialized = useListStore((s) => s.isInitialized);

  const [watchlistLoading, setWatchlistLoading] = useState(false);

  // ////////////////////////////////////////////////////////////////////////////
  // ///////// Ensure watchlist items are loaded on mount ///////////////////////
  // ////////////////////////////////////////////////////////////////////////////
  const watchlistLoadedRef = useRef(false);
  useEffect(() => {
    if (
      isAuthenticated &&
      isInitialized &&
      watchlistId &&
      !watchlistItems &&
      !watchlistLoadedRef.current
    ) {
      watchlistLoadedRef.current = true;
      fetchListItems(watchlistId, { perPage: 100 });
    }
  }, [
    isAuthenticated,
    isInitialized,
    watchlistId,
    watchlistItems,
    fetchListItems,
  ]);

  // ////////////////////////////////////////////////////////////////////////////
  // ///////// Handle watchlist toggle (add / remove) ///////////////////////////
  // ////////////////////////////////////////////////////////////////////////////
  const handleWatchlistToggle = useCallback(
    async (movie: ShowType) => {
      if (!isAuthenticated) {
        toast.info("Sign in to use watchlist");
        router.push("/signin");
        return;
      }
      if (!watchlistId) {
        toast.error("Watchlist not available");
        return;
      }

      const mediaType = (movie.media_type ||
        (movie.title ? "movie" : "tv")) as MediaType;

      setWatchlistLoading(true);
      const inList = isInWatchlist(movie.id);
      if (inList) {
        const success = await removeItem(watchlistId, mediaType, movie.id);
        if (success) toast.success("Removed from watchlist");
        else toast.error("Failed to remove from watchlist");
      } else {
        const success = await addItem(watchlistId, {
          mediaType,
          tmdbId: movie.id,
        });
        if (success) toast.success("Added to watchlist");
        else toast.error("Failed to add to watchlist");
      }
      setWatchlistLoading(false);
    },
    [isAuthenticated, watchlistId, isInWatchlist, addItem, removeItem, router],
  );

  return { handleWatchlistToggle, watchlistLoading, isInWatchlist };
}

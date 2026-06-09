"use client";

import { useState, useEffect, useCallback } from "react";
import { ShowType } from "@/app/types/websiteTypes";
import { toast } from "sonner";

// ─── LocalStorage Keys ───────────────────────────────

const STORAGE_KEYS = {
  favorites: "favouritList",
  watchlist: "watchList",
  watched: "watchedList",
} as const;

// ─── Helpers ─────────────────────────────────────────

function loadList(key: string): ShowType[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveList(key: string, list: ShowType[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    // Storage full or unavailable — silently fail
  }
}

// ─── Check if localStorage has any list data ────────

export function hasLocalListData(): boolean {
  if (typeof window === "undefined") return false;
  return (
    !!localStorage.getItem(STORAGE_KEYS.favorites) ||
    !!localStorage.getItem(STORAGE_KEYS.watchlist) ||
    !!localStorage.getItem(STORAGE_KEYS.watched)
  );
}

/**
 * Read all localStorage list data for migration purposes.
 * Returns an object with keys matching the STORAGE_KEYS.
 */
export function readLocalListData(): Record<string, ShowType[]> {
  return {
    [STORAGE_KEYS.favorites]: loadList(STORAGE_KEYS.favorites),
    [STORAGE_KEYS.watchlist]: loadList(STORAGE_KEYS.watchlist),
    [STORAGE_KEYS.watched]: loadList(STORAGE_KEYS.watched),
  };
}

/**
 * Clear all localStorage list data.
 */
export function clearLocalListData() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEYS.favorites);
    localStorage.removeItem(STORAGE_KEYS.watchlist);
    localStorage.removeItem(STORAGE_KEYS.watched);
  } catch {
    // Silently fail
  }
}

// ─── React Hook ──────────────────────────────────────

interface LocalListFallback {
  favorites: ShowType[];
  watchlist: ShowType[];
  watched: ShowType[];
  addToFavorites: (media: ShowType) => void;
  addToWatchlist: (media: ShowType) => void;
  markAsWatched: (media: ShowType) => void;
  removeFromFavorites: (media: ShowType) => void;
  removeFromWatchlist: (media: ShowType) => void;
  removeFromWatched: (media: ShowType) => void;
}

/**
 * useLocalListFallback — a lightweight localStorage-based fallback
 * for unauthenticated users.
 *
 * Replaces the now-removed `useList()` context from ListContext.
 * Reads/writes three lists: favorites, watchlist, watched.
 */
export function useLocalListFallback(): LocalListFallback {
  const [favorites, setFavorites] = useState<ShowType[]>(() =>
    loadList(STORAGE_KEYS.favorites),
  );
  const [watchlist, setWatchlist] = useState<ShowType[]>(() =>
    loadList(STORAGE_KEYS.watchlist),
  );
  const [watched, setWatched] = useState<ShowType[]>(() =>
    loadList(STORAGE_KEYS.watched),
  );

  // Persist to localStorage whenever state changes
  useEffect(() => {
    saveList(STORAGE_KEYS.favorites, favorites);
  }, [favorites]);

  useEffect(() => {
    saveList(STORAGE_KEYS.watchlist, watchlist);
  }, [watchlist]);

  useEffect(() => {
    saveList(STORAGE_KEYS.watched, watched);
  }, [watched]);

  const addToFavorites = useCallback((media: ShowType) => {
    setFavorites((prev) => {
      if (prev.some((m) => m.id === media.id)) {
        toast.info("Already in favorites");
        return prev;
      }
      toast.success("Added to favorites");
      return [...prev, media];
    });
  }, []);

  const addToWatchlist = useCallback((media: ShowType) => {
    setWatchlist((prev) => {
      if (prev.some((m) => m.id === media.id)) {
        toast.info("Already in watchlist");
        return prev;
      }
      toast.success("Added to watchlist");
      return [...prev, media];
    });
  }, []);

  const markAsWatched = useCallback(
    (media: ShowType) => {
      // Remove from watchlist if present
      setWatchlist((prev) => prev.filter((m) => m.id !== media.id));

      // Add to watched list
      setWatched((prev) => {
        if (prev.some((m) => m.id === media.id)) {
          toast.info("Already in watched");
          return prev;
        }
        toast.success("Marked as watched");
        return [...prev, media];
      });
    },
    [],
  );

  const removeFromFavorites = useCallback((media: ShowType) => {
    setFavorites((prev) => prev.filter((m) => m.id !== media.id));
    toast.success("Removed from favorites");
  }, []);

  const removeFromWatchlist = useCallback((media: ShowType) => {
    setWatchlist((prev) => prev.filter((m) => m.id !== media.id));
    toast.success("Removed from watchlist");
  }, []);

  const removeFromWatched = useCallback((media: ShowType) => {
    setWatched((prev) => prev.filter((m) => m.id !== media.id));
    toast.success("Removed from watched");
  }, []);

  return {
    favorites,
    watchlist,
    watched,
    addToFavorites,
    addToWatchlist,
    markAsWatched,
    removeFromFavorites,
    removeFromWatchlist,
    removeFromWatched,
  };
}

// //////////////////////////////////////////////////////////////////////////////
// Show action bar — watchlist, favorite, watched toggle buttons ///////////////
// //////////////////////////////////////////////////////////////////////////////

"use client";

import React, { useState, useCallback } from "react";
import { FaPlay, FaHeart, FaShare, FaRegHeart, FaRegEye } from "react-icons/fa";
import { FiBookmark, FiMessageCircle } from "react-icons/fi";
import { useAuthStore } from "@/app/_stores/authStore";
import { useListStore } from "@/app/_stores/listStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { MediaType } from "@/app/types/lists";

interface Props {
  showId: number;
  mediaType: MediaType;
}

export default function ShowActionBar({ showId, mediaType }: Props) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isFavorite = useListStore((s) => s.isFavorite(showId));
  const isWatchlisted = useListStore((s) => s.isInWatchlist(showId));
  const isWatched = useListStore((s) => s.isWatched(showId));
  const addItem = useListStore((s) => s.addItem);
  const removeItem = useListStore((s) => s.removeItem);
  const watchlistId = useListStore((s) => s.getSystemList("watchlist")?.id);
  const favoritesId = useListStore((s) => s.getSystemList("favorites")?.id);
  const watchedId = useListStore((s) => s.getSystemList("watched")?.id);

  const [favLoading, setFavLoading] = useState(false);
  const [wlLoading, setWlLoading] = useState(false);
  const [wLoading, setWLoading] = useState(false);

  const handleToggleWatchlist = useCallback(async () => {
    if (!isAuthenticated) {
      toast.info("Sign in to use watchlist");
      router.push("/signin");
      return;
    }
    if (!watchlistId) return;

    setWlLoading(true);
    if (isWatchlisted) {
      const ok = await removeItem(watchlistId, mediaType, showId);
      if (ok) toast.success("Removed from watchlist");
      else toast.error("Failed to remove");
    } else {
      const ok = await addItem(watchlistId, { mediaType, tmdbId: showId });
      if (ok) toast.success("Added to watchlist");
      else toast.error("Failed to add");
    }
    setWlLoading(false);
  }, [isAuthenticated, watchlistId, isWatchlisted, showId, mediaType, addItem, removeItem, router]);

  const handleToggleFavorite = useCallback(async () => {
    if (!isAuthenticated) {
      toast.info("Sign in to save favorites");
      router.push("/signin");
      return;
    }
    if (!favoritesId) return;

    setFavLoading(true);
    if (isFavorite) {
      const ok = await removeItem(favoritesId, mediaType, showId);
      if (ok) toast.success("Removed from favorites");
      else toast.error("Failed to remove");
    } else {
      const ok = await addItem(favoritesId, { mediaType, tmdbId: showId });
      if (ok) toast.success("Added to favorites");
      else toast.error("Failed to add");
    }
    setFavLoading(false);
  }, [isAuthenticated, favoritesId, isFavorite, showId, mediaType, addItem, removeItem, router]);

  const handleToggleWatched = useCallback(async () => {
    if (!isAuthenticated) {
      toast.info("Sign in to track watched");
      router.push("/signin");
      return;
    }
    if (!watchedId) return;

    setWLoading(true);
    if (isWatched) {
      const ok = await removeItem(watchedId, mediaType, showId);
      if (ok) toast.success("Removed from watched");
      else toast.error("Failed to remove");
    } else {
      const ok = await addItem(watchedId, { mediaType, tmdbId: showId });
      if (ok) toast.success("Marked as watched");
      else toast.error("Failed to mark as watched");
    }
    setWLoading(false);
  }, [isAuthenticated, watchedId, isWatched, showId, mediaType, addItem, removeItem, router]);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/90 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:scale-105">
        <FaPlay className="size-4" />
        Play Now
      </button>

      <button
        onClick={handleToggleWatchlist}
        disabled={wlLoading}
        className={`flex items-center gap-2 px-5 py-3 border rounded-xl transition-all duration-300 font-medium ${
          isWatchlisted
            ? "bg-accent/10 border-accent/50 text-accent"
            : "bg-panel_bg border-white/10 text-gray-300 hover:border-accent/30 hover:text-white"
        } disabled:opacity-60`}
      >
        {wlLoading ? (
          <div className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
        ) : (
          <FiBookmark className="size-4" />
        )}
        {wlLoading ? "..." : isWatchlisted ? "Watchlisted" : "Watchlist"}
      </button>

      <button
        onClick={handleToggleWatched}
        disabled={wLoading}
        className={`flex items-center gap-2 px-5 py-3 border rounded-xl transition-all duration-300 font-medium ${
          isWatched
            ? "bg-accent/10 border-accent/50 text-accent"
            : "bg-panel_bg border-white/10 text-gray-300 hover:border-accent/30 hover:text-white"
        } disabled:opacity-60`}
      >
        {wLoading ? (
          <div className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
        ) : (
          <FaRegEye className="size-4" />
        )}
        {wLoading ? "..." : isWatched ? "Watched ✓" : "Watched"}
      </button>

      <button
        onClick={handleToggleFavorite}
        disabled={favLoading}
        className={`flex items-center gap-2 px-5 py-3 border rounded-xl transition-all duration-300 font-medium ${
          isFavorite
            ? "bg-accent/10 border-accent/50 text-accent"
            : "bg-panel_bg border-white/10 text-gray-300 hover:border-accent/30 hover:text-white"
        } disabled:opacity-60`}
      >
        {favLoading ? (
          <div className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
        ) : isFavorite ? (
          <FaHeart className="size-4" />
        ) : (
          <FaRegHeart className="size-4" />
        )}
        {favLoading ? "..." : isFavorite ? "Favorited" : "Favorite"}
      </button>

      <button className="flex items-center gap-2 px-5 py-3 bg-panel_bg border border-white/10 text-gray-300 rounded-xl hover:border-accent/30 hover:text-white transition-all duration-300 font-medium">
        <FiMessageCircle className="size-4" />
        Reviews
      </button>

      <button className="flex items-center gap-2 px-5 py-3 bg-panel_bg border border-white/10 text-gray-300 rounded-xl hover:border-accent/30 hover:text-white transition-all duration-300 font-medium">
        <FaShare className="size-4" />
        Share
      </button>
    </div>
  );
}

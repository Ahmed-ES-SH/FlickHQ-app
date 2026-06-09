"use client";
import { useState, useCallback } from "react";
import { useListStore } from "@/app/_stores/listStore";
import { useAuthStore } from "@/app/_stores/authStore";
import { useLocalListFallback } from "@/app/_helpers/localListFallback";
import { ShowType } from "@/app/types/websiteTypes";
import type { MediaType } from "@/app/types/lists";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface props {
  media: ShowType;
}

export default function IconsCard({ media }: props) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInWatchlist = useListStore((s) => s.isInWatchlist(media.id));
  const isWatched = useListStore((s) => s.isWatched(media.id));
  const addItem = useListStore((s) => s.addItem);
  const removeItem = useListStore((s) => s.removeItem);
  const watchlistId = useListStore((s) => s.getSystemList("watchlist")?.id);
  const watchedId = useListStore((s) => s.getSystemList("watched")?.id);

  // Fallback to localStorage for unauthenticated users
  const { addToWatchlist, markAsWatched } = useLocalListFallback();

  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [watchedLoading, setWatchedLoading] = useState(false);

  const mediaType = (media.media_type ||
    (media.title ? "movie" : "tv")) as MediaType;

  const handleToggleWatchlist = useCallback(async () => {
    if (!isAuthenticated) {
      addToWatchlist(media);
      toast.info("Sign in to sync your watchlist");
      return;
    }
    if (!watchlistId) {
      toast.error("Watchlist not available");
      return;
    }

    setWatchlistLoading(true);
    if (isInWatchlist) {
      const success = await removeItem(watchlistId, mediaType, media.id);
      if (success) toast.success("Removed from watchlist");
      else toast.error("Failed to remove");
    } else {
      const success = await addItem(watchlistId, { mediaType, tmdbId: media.id });
      if (success) toast.success("Added to watchlist");
      else toast.error("Failed to add");
    }
    setWatchlistLoading(false);
  }, [isAuthenticated, watchlistId, isInWatchlist, media, mediaType, addItem, removeItem, addToWatchlist]);

  const handleToggleWatched = useCallback(async () => {
    if (!isAuthenticated) {
      markAsWatched(media);
      toast.info("Sign in to sync your watched list");
      return;
    }
    if (!watchedId) {
      toast.error("Watched list not available");
      return;
    }

    setWatchedLoading(true);
    if (isWatched) {
      const success = await removeItem(watchedId, mediaType, media.id);
      if (success) toast.success("Removed from watched");
      else toast.error("Failed to remove");
    } else {
      const success = await addItem(watchedId, { mediaType, tmdbId: media.id });
      if (success) toast.success("Marked as watched");
      else toast.error("Failed to mark as watched");
    }
    setWatchedLoading(false);
  }, [isAuthenticated, watchedId, isWatched, media, mediaType, addItem, removeItem, markAsWatched]);

  return (
    <div className="flex items-center justify-between w-full absolute -bottom-40 group-hover:bottom-2 z-10 left-1/2 -translate-x-1/2 duration-700 p-3">
      <button
        onClick={handleToggleWatched}
        disabled={watchedLoading}
        className={`flex items-center justify-center w-10 h-10 gap-1 p-[6px] glass_bg border rounded-md cursor-pointer transition-all duration-300 shadow-xl disabled:opacity-60 ${
          isWatched
            ? "border-accent bg-accent/20 text-accent"
            : "border-white/10 hover:border-accent hover:bg-accent/20 text-gray-300"
        }`}
        aria-label={isWatched ? "Remove from watched" : "Mark as watched"}
      >
        {watchedLoading ? (
          <div className="size-5 rounded-full border-2 border-current border-t-transparent animate-spin" />
        ) : (
          <FaRegEye
            className={`size-5 transition-colors duration-300 ${
              isWatched ? "text-accent" : "group-hover:text-white"
            }`}
          />
        )}
      </button>
      <button
        onClick={handleToggleWatchlist}
        disabled={watchlistLoading}
        className={`flex items-center justify-center w-10 h-10 gap-1 p-[6px] glass_bg border rounded-md cursor-pointer transition-all duration-300 shadow-xl disabled:opacity-60 ${
          isInWatchlist
            ? "border-accent bg-accent/20 text-accent"
            : "border-white/10 hover:border-accent hover:bg-accent/20 text-gray-300"
        }`}
        aria-label={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
      >
        {watchlistLoading ? (
          <div className="size-5 rounded-full border-2 border-current border-t-transparent animate-spin" />
        ) : (
          <FaRegEyeSlash
            className={`size-5 transition-colors duration-300 ${
              isInWatchlist ? "text-accent" : "group-hover:text-white"
            }`}
          />
        )}
      </button>
    </div>
  );
}

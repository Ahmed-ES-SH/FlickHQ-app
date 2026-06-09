"use client";
import { useState, useCallback } from "react";
import { useListStore } from "@/app/_stores/listStore";
import { useAuthStore } from "@/app/_stores/authStore";
import { useLocalListFallback } from "@/app/_helpers/localListFallback";
import { ShowType } from "@/app/types/websiteTypes";
import type { MediaType } from "@/app/types/lists";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface props {
  media: ShowType;
}

export default function MainBTNS({ media }: props) {
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

  const handleWatchList = useCallback(async () => {
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

  const handleWatched = useCallback(async () => {
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

  const btns = [
    {
      bg_color: isInWatchlist ? "bg-accent" : "bg-yellow-400",
      text: watchlistLoading ? "..." : isInWatchlist ? "In Watchlist" : "Watch List",
      handle: handleWatchList,
      loading: watchlistLoading,
    },
    {
      bg_color: isWatched ? "bg-accent" : "bg-red-500",
      text: watchedLoading ? "..." : isWatched ? "Watched ✓" : "Watched",
      handle: handleWatched,
      loading: watchedLoading,
    },
  ];

  return (
    <div className="flex items-center gap-4 mt-3">
      {btns.map((btn, index) => (
        <button
          key={index}
          onClick={btn.handle}
          disabled={btn.loading}
          className={`xl:py-3 xl:px-6 p-2 rounded-md whitespace-nowrap text-center ${btn.bg_color} text-white xl:first-letter:text-4xl first-letter:text-2xl xl:text-xl md:text-xl text-[15px] first-letter:text-black hover:bg-white hover:text-black hover:first-letter:text-secondery-green duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed`}
        >
          {btn.text}
        </button>
      ))}
    </div>
  );
}

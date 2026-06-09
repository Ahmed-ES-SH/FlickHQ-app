"use client";
import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import {
  IoPlay,
  IoAdd,
  IoHeart,
  IoShareSocial,
  IoChatbubble,
  IoList,
  IoCheckmark,
  IoHeartOutline,
  IoEye,
  IoEyeOff,
} from "react-icons/io5";
import { ShowType } from "@/app/types/websiteTypes";
import type { MediaType } from "@/app/types/lists";
import { useAuthStore } from "@/app/_stores/authStore";
import { useListStore } from "@/app/_stores/listStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import AddToListDropdown from "@/app/_components/_client/lists/AddToListDropdown";

interface Props {
  media?: ShowType;
  onOpenComments: () => void;
  disablePlaylist?: boolean;
}

export default function MediaActionBar({ media, onOpenComments, disablePlaylist }: Props) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isFavorite = useListStore((s) => (media ? s.isFavorite(media.id) : false));
  const isInWatchlist = useListStore((s) => (media ? s.isInWatchlist(media.id) : false));
  const isWatched = useListStore((s) => (media ? s.isWatched(media.id) : false));
  const addItem = useListStore((s) => s.addItem);
  const removeItem = useListStore((s) => s.removeItem);
  const watchlistId = useListStore((s) => s.getSystemList("watchlist")?.id);
  const favoritesId = useListStore((s) => s.getSystemList("favorites")?.id);
  const watchedId = useListStore((s) => s.getSystemList("watched")?.id);
  const watchlistItems = useListStore((s) => s.getSystemList("watchlist")?.items);
  const favoritesItems = useListStore((s) => s.getSystemList("favorites")?.items);
  const fetchListItems = useListStore((s) => s.fetchListItems);
  const isInitialized = useListStore((s) => s.isInitialized);

  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [watchedLoading, setWatchedLoading] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  // Ensure system list items are loaded
  useEffect(() => {
    if (!isAuthenticated || !isInitialized || !media) return;
    if (watchlistId && !watchlistItems) {
      fetchListItems(watchlistId, { perPage: 100 });
    }
    if (favoritesId && !favoritesItems) {
      fetchListItems(favoritesId, { perPage: 100 });
    }
  }, [isAuthenticated, isInitialized, media, watchlistId, favoritesId, watchlistItems, favoritesItems, fetchListItems]);

  const getMediaType = useCallback((): MediaType => {
    if (!media) return "movie";
    return (media.media_type || (media.title ? "movie" : "tv")) as MediaType;
  }, [media]);

  const handleToggleWatchlist = useCallback(async () => {
    if (!media) return;
    if (!isAuthenticated) {
      toast.info("Sign in to use watchlist");
      router.push("/signin");
      return;
    }
    if (!watchlistId) {
      toast.error("Watchlist not available");
      return;
    }

    setWatchlistLoading(true);
    const mediaType = getMediaType();

    if (isInWatchlist) {
      const success = await removeItem(watchlistId, mediaType, media.id);
      if (success) toast.success("Removed from watchlist");
      else toast.error("Failed to remove from watchlist");
    } else {
      const success = await addItem(watchlistId, { mediaType, tmdbId: media.id });
      if (success) toast.success("Added to watchlist");
      else toast.error("Failed to add to watchlist");
    }
    setWatchlistLoading(false);
  }, [media, isAuthenticated, watchlistId, isInWatchlist, addItem, removeItem, getMediaType, router]);

  const handleToggleFavorites = useCallback(async () => {
    if (!media) return;
    if (!isAuthenticated) {
      toast.info("Sign in to save favorites");
      router.push("/signin");
      return;
    }
    if (!favoritesId) {
      toast.error("Favorites list not available");
      return;
    }

    setFavoritesLoading(true);
    const mediaType = getMediaType();

    if (isFavorite) {
      const success = await removeItem(favoritesId, mediaType, media.id);
      if (success) toast.success("Removed from favorites");
      else toast.error("Failed to remove from favorites");
    } else {
      const success = await addItem(favoritesId, { mediaType, tmdbId: media.id });
      if (success) toast.success("Added to favorites");
      else toast.error("Failed to add to favorites");
    }
    setFavoritesLoading(false);
  }, [media, isAuthenticated, favoritesId, isFavorite, addItem, removeItem, getMediaType, router]);

  const handleToggleWatched = useCallback(async () => {
    if (!media) return;
    if (!isAuthenticated) {
      toast.info("Sign in to track watched");
      router.push("/signin");
      return;
    }
    if (!watchedId) {
      toast.error("Watched list not available");
      return;
    }

    setWatchedLoading(true);
    const mediaType = getMediaType();

    if (isWatched) {
      const success = await removeItem(watchedId, mediaType, media.id);
      if (success) toast.success("Removed from watched");
      else toast.error("Failed to remove from watched");
    } else {
      const success = await addItem(watchedId, { mediaType, tmdbId: media.id });
      if (success) toast.success("Marked as watched");
      else toast.error("Failed to mark as watched");
    }
    setWatchedLoading(false);
  }, [media, isAuthenticated, watchedId, isWatched, addItem, removeItem, getMediaType, router]);

  const handleShare = useCallback(async () => {
    if (!media) return;
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    } catch {
      // Fallback for older browsers
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      toast.success("Link copied to clipboard");
    }
  }, [media]);

  const ACTIONS = [
    {
      icon: isInWatchlist ? IoCheckmark : IoAdd,
      label: "Watchlist",
      onClick: handleToggleWatchlist,
      active: isInWatchlist,
      loading: watchlistLoading,
    },
    {
      icon: isFavorite ? IoHeart : IoHeartOutline,
      label: "Favorites",
      onClick: handleToggleFavorites,
      active: isFavorite,
      loading: favoritesLoading,
    },
    {
      icon: isWatched ? IoEye : IoEyeOff,
      label: "Watched",
      onClick: handleToggleWatched,
      active: isWatched,
      loading: watchedLoading,
    },
    {
      icon: IoShareSocial,
      label: "Share",
      onClick: handleShare,
      active: false,
      loading: false,
    },
  ];

  if (!media) {
    // Render decorative actions when no media is available (fallback)
    return (
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-6 p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-xl">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-accent text-white font-black uppercase tracking-wider shadow-lg shadow-accent/30 group"
        >
          <IoPlay className="size-5 group-hover:scale-110 duration-300" />
          <span>Play Now</span>
        </motion.button>
        <div className="flex items-center justify-between md:justify-start gap-4 lg:gap-8 px-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {ACTIONS.map((action, i) => (
            <button
              key={i}
              onClick={action.onClick}
              disabled={action.loading}
              className={`flex flex-col items-center gap-2 transition-colors group shrink-0 min-w-[60px] ${
                action.active
                  ? "text-accent"
                  : "text-gray-500 hover:text-white"
              } disabled:opacity-50`}
            >
              {action.loading ? (
                <div className="size-6 rounded-full border-2 border-current border-t-transparent animate-spin" />
              ) : (
                <action.icon className="size-6 group-hover:scale-110 duration-300" />
              )}
              <span className="text-[9px] font-black uppercase tracking-widest">
                {action.label}
              </span>
            </button>
          ))}

          {/* Playlist button (wrapped for dropdown positioning) */}
          <div className="relative flex flex-col items-center gap-2 shrink-0 min-w-[60px]">
            <button
              disabled={disablePlaylist}
              onClick={() => {
                if (!isAuthenticated) {
                  toast.info("Sign in to use lists");
                  router.push("/signin");
                  return;
                }
                if (disablePlaylist) return;
                setShowPlaylist((prev) => !prev);
              }}
              className={`flex flex-col items-center gap-2 transition-colors group ${
                showPlaylist ? "text-accent" : "text-gray-500 hover:text-white"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <IoList className="size-6 group-hover:scale-110 duration-300" />
              <span className="text-[9px] font-black uppercase tracking-widest">
                Playlist
              </span>
            </button>
            {media && showPlaylist && (
              <AddToListDropdown
                media={media}
                isOpen={showPlaylist}
                onClose={() => setShowPlaylist(false)}
              />
            )}
          </div>

          <button
            onClick={onOpenComments}
            className="flex flex-col items-center gap-2 text-gray-500 hover:text-white duration-300 transition-colors group shrink-0 min-w-[60px]"
          >
            <IoChatbubble className="size-6 group-hover:scale-110 duration-300" />
            <span className="text-[9px] font-black uppercase tracking-widest">
              Comments
            </span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-6 p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-xl">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-accent text-white font-black uppercase tracking-wider shadow-lg shadow-accent/30 group"
      >
        <IoPlay className="size-5 group-hover:scale-110 duration-300" />
        <span>Play Now</span>
      </motion.button>
      <div className="flex items-center justify-between md:justify-start gap-4 lg:gap-8 px-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
        {ACTIONS.map((action, i) => (
          <button
            key={i}
            onClick={action.onClick}
            disabled={action.loading}
            className={`flex flex-col items-center gap-2 transition-colors group shrink-0 min-w-[60px] ${
              action.active ? "text-accent" : "text-gray-500 hover:text-white"
            } disabled:opacity-50`}
          >
            {action.loading ? (
              <div className="size-6 rounded-full border-2 border-current border-t-transparent animate-spin" />
            ) : (
              <action.icon className="size-6 group-hover:scale-110 duration-300" />
            )}
            <span className="text-[9px] font-black uppercase tracking-widest">
              {action.label}
            </span>
          </button>
        ))}

        {/* Playlist button (wrapped for dropdown positioning) */}
        <div className="relative flex flex-col items-center gap-2 shrink-0 min-w-[60px]">
          <button
            disabled={disablePlaylist}
            onClick={() => {
              if (!isAuthenticated) {
                toast.info("Sign in to use lists");
                router.push("/signin");
                return;
              }
              if (disablePlaylist) return;
              setShowPlaylist((prev) => !prev);
            }}
            className={`flex flex-col items-center gap-2 transition-colors group ${
              showPlaylist ? "text-accent" : "text-gray-500 hover:text-white"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <IoList className="size-6 group-hover:scale-110 duration-300" />
            <span className="text-[9px] font-black uppercase tracking-widest">
              Playlist
            </span>
          </button>
          {media && showPlaylist && (
            <AddToListDropdown
              media={media}
              isOpen={showPlaylist}
              onClose={() => setShowPlaylist(false)}
            />
          )}
        </div>

        <button
          onClick={onOpenComments}
          className="flex flex-col items-center gap-2 text-gray-500 hover:text-white duration-300 transition-colors group shrink-0 min-w-[60px]"
        >
          <IoChatbubble className="size-6 group-hover:scale-110 duration-300" />
          <span className="text-[9px] font-black uppercase tracking-widest">
            Comments
          </span>
        </button>
      </div>
    </div>
  );
}

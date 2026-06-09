"use client";
import { useCallback, useEffect, useState } from "react";
import { useListStore } from "@/app/_stores/listStore";
import { useAuthStore } from "@/app/_stores/authStore";
import { useLocalListFallback } from "@/app/_helpers/localListFallback";
import { ShowType } from "@/app/types/websiteTypes";
import type { MediaType } from "@/app/types/lists";
import { FaHeart } from "react-icons/fa";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface props {
  media: ShowType;
  size?: string;
}

export default function HeartIcon({ media, size = "size-5" }: props) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isFavorite = useListStore((s) => s.isFavorite(media.id));
  const addItem = useListStore((s) => s.addItem);
  const removeItem = useListStore((s) => s.removeItem);
  const systemListId = useListStore((s) => s.getSystemList("favorites")?.id);
  const favoritesItems = useListStore((s) => s.getSystemList("favorites")?.items);
  const fetchListItems = useListStore((s) => s.fetchListItems);
  const listsInitialized = useListStore((s) => s.isInitialized);

  // Fallback to localStorage for unauthenticated users
  const { favorites: localFavorites, addToFavorites } = useLocalListFallback();

  // Internal loading state for optimistic feedback
  const [actionState, setActionState] = useState<"idle" | "loading">("idle");

  // Ensure favorites items are loaded when authenticated
  useEffect(() => {
    if (isAuthenticated && listsInitialized && systemListId && !favoritesItems) {
      fetchListItems(systemListId, { perPage: 100 });
    }
  }, [isAuthenticated, listsInitialized, systemListId, favoritesItems, fetchListItems]);

  const handleToggle = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();

      if (!isAuthenticated) {
        // Fallback to localStorage
        addToFavorites(media);
        toast.info("Sign in to sync your favorites across devices");
        return;
      }

      if (!systemListId) {
        toast.error("Favorites list not available");
        return;
      }

      const mediaType = (media.media_type ||
        (media.title ? "movie" : "tv")) as MediaType;

      setActionState("loading");

      if (isFavorite) {
        const success = await removeItem(systemListId, mediaType, media.id);
        if (success) {
          toast.success("Removed from favorites");
        } else {
          toast.error("Failed to remove from favorites");
        }
      } else {
        const success = await addItem(systemListId, {
          mediaType,
          tmdbId: media.id,
        });
        if (success) {
          toast.success("Added to favorites");
        } else {
          toast.error("Failed to add to favorites");
        }
      }

      setActionState("idle");
    },
      [isAuthenticated, isFavorite, systemListId, media, addItem, removeItem, addToFavorites],
  );

  const isFavorited = isAuthenticated ? isFavorite : localFavorites.some((m) => m.id === media.id);

  return (
    <button
      onClick={handleToggle}
      disabled={actionState === "loading"}
      className="flex items-center justify-center w-11 h-11 bg-black/40 backdrop-blur-md border border-white/10 hover:border-accent/50 hover:bg-accent/20 rounded-xl cursor-pointer group/heart transition-all duration-300 shadow-xl disabled:opacity-60"
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      {actionState === "loading" ? (
        <div className={`${size} animate-pulse text-gray-400`}>
          <FaHeart className="opacity-30" />
        </div>
      ) : (
        <FaHeart
          className={`${size} transition-all duration-300 ${
            isFavorited
              ? "text-accent scale-110"
              : "text-gray-300 group-hover/heart:text-accent"
          }`}
        />
      )}
    </button>
  );
}

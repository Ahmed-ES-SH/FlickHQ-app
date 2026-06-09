"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { LuBookmark, LuX } from "react-icons/lu";
import Link from "next/link";
import MediaCard from "@/app/_components/_website/_movies/MediaCard";
import { useListStore } from "@/app/_stores/listStore";
import { useAuthStore } from "@/app/_stores/authStore";
import { useData } from "@/app/context/DataContext";
import { ListSkeleton } from "@/app/_components/_globalComponents/ListSkeleton";
import { ListEmptyState } from "@/app/_components/_globalComponents/ListEmptyState";
import { toast } from "sonner";
import type {
  ListItemResponseDto,
  ListItemWithMeta,
} from "@/app/types/lists";
import type { ShowType } from "@/app/types/websiteTypes";
import type { gener } from "@/app/types/ContextType";

// ─── Convert API list item → ShowType for MediaCard ──

function convertToShowType(item: ListItemResponseDto): ShowType {
  return {
    id: item.tmdbId,
    title: item.title,
    name: item.mediaType === "tv" ? item.title : "",
    poster_path: item.posterPath
      ? `https://image.tmdb.org/t/p/w500${item.posterPath}`
      : "",
    release_date: item.releaseDate || "",
    first_air_date: item.mediaType === "tv" ? item.releaseDate || "" : "",
    vote_average: item.voteAverage ?? 0,
    vote_count: 0,
    media_type: item.mediaType,
    overview: "",
    genre_ids: [],
    popularity: 0,
    original_language: "",
    backdrop_path: "",
    genres: [] as gener[],
    runtime: 0,
    number_of_episodes: 0,
    origin_country: [],
  };
}

// ─── Fade-in animation wrapper ─────────────────────

function FadeIn({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

// ─── Sign-in prompt ────────────────────────────────

function SignInPrompt() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <LuBookmark className="size-12 text-second_text/40 mb-4" />
      <h2 className="text-xl font-bold text-white mb-2">Sign in required</h2>
      <p className="text-second_text text-sm max-w-md mb-6">
        Sign in to start building your watchlist and sync across devices.
      </p>
      <Link
        href="/signin"
        className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-lg text-sm font-bold hover:bg-red-700 active:scale-95 transition-all duration-200"
      >
        Sign In
      </Link>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────

export default function WatchlistPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const list = useListStore((s) => s.getSystemList("watchlist"));
  const isLoadingItems = useListStore((s) =>
    list?.id ? s.isLoadingItems[list.id] ?? false : false,
  );
  const fetchListItems = useListStore((s) => s.fetchListItems);
  const removeItem = useListStore((s) => s.removeItem);
  const isInitialized = useListStore((s) => s.isInitialized);
  const { genres, genres_Shows } = useData();
  const [removingIds, setRemovingIds] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (isAuthenticated && list?.id && !list.items && !list._loadingItems) {
      fetchListItems(list.id, { perPage: 50 });
    }
  }, [isAuthenticated, list?.id, list?.items, list?._loadingItems, fetchListItems]);

  const handleRemove = useCallback(
    async (item: ListItemWithMeta) => {
      if (!list?.id) return;
      const confirmed = window.confirm(
        `Remove "${item.title}" from your Watchlist?`,
      );
      if (!confirmed) return;

      setRemovingIds((prev) => ({ ...prev, [item.tmdbId]: true }));
      const success = await removeItem(list.id, item.mediaType, item.tmdbId);
      setRemovingIds((prev) => ({ ...prev, [item.tmdbId]: false }));

      if (success) {
        toast.success(`Removed "${item.title}" from watchlist`);
      } else {
        toast.error(`Failed to remove "${item.title}"`);
      }
    },
    [list?.id, removeItem],
  );

  // ── Not authenticated ──────────────────────────

  if (!isAuthenticated) {
    return <SignInPrompt />;
  }

  // ── Loading (initializing or no items yet) ──────

  if (!isInitialized || isLoadingItems || !list?.items) {
    return (
      <div className="space-y-6">
        <FadeIn delay={0}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-2">
                <LuBookmark className="text-accent" />
                My Watchlist
              </h1>
              <p className="text-second_text text-sm mt-1">Loading your watchlist…</p>
            </div>
          </div>
        </FadeIn>
        <ListSkeleton count={8} />
      </div>
    );
  }

  // ── Empty state ────────────────────────────────

  if (list.items.length === 0) {
    return (
      <div className="space-y-6">
        <FadeIn delay={0}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-2">
                <LuBookmark className="text-accent" />
                My Watchlist
              </h1>
            </div>
          </div>
        </FadeIn>
        <ListEmptyState
          type="watchlist"
          actionLabel="Browse Movies"
          actionHref="/movies"
        />
      </div>
    );
  }

  // ── Render items ───────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn delay={0}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-2">
              <LuBookmark className="text-accent" />
              My Watchlist
            </h1>
            <p className="text-second_text text-sm mt-1">
              {list.itemCount} {list.itemCount === 1 ? "item" : "items"} saved
            </p>
          </div>
        </div>
      </FadeIn>

      {/* Grid */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {list.items.map((item, index) => {
            const media = convertToShowType(item);
            return (
              <div key={item.tmdbId} className="relative group">
                <MediaCard media={media} genres={[]} index={index} />

                {/* Remove button */}
                <button
                  onClick={() => handleRemove(item)}
                  disabled={removingIds[item.tmdbId]}
                  className="absolute top-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/80 hover:bg-red-600 text-white p-2 rounded-lg disabled:opacity-50"
                  aria-label={`Remove ${item.title}`}
                >
                  {removingIds[item.tmdbId] ? (
                    <div className="size-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <LuX className="size-4" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </FadeIn>
    </div>
  );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import { LuBookmark, LuX } from "react-icons/lu";
import MediaCard from "@/app/_components/_website/_movies/MediaCard";
import { useListStore } from "@/app/_stores/listStore";
import { useAuthStore } from "@/app/_stores/authStore";
import { useData } from "@/app/context/DataContext";
import { ListSkeleton } from "@/app/_components/_globalComponents/ListSkeleton";
import { ListEmptyState } from "@/app/_components/_globalComponents/ListEmptyState";
import { FadeIn } from "@/app/_components/_globalComponents/FadeIn";
import { SignInPrompt } from "@/app/_components/_globalComponents/SignInPrompt";
import { convertToShowType } from "@/app/_helpers/shared/convertToShowType";
import { toast } from "sonner";
import type { ListItemWithMeta } from "@/app/types/lists";

// ─── Page ─────────────────────────────────────────────

export default function WatchlistPageClient() {
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
    return (
      <SignInPrompt
        icon={<LuBookmark className="size-12" />}
        description="Sign in to start building your watchlist and sync across devices."
      />
    );
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

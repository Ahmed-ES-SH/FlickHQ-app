"use client";

import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/app/_stores/authStore";
import { useListStore } from "@/app/_stores/listStore";
import {
  hasLocalListData,
  readLocalListData,
  clearLocalListData,
} from "@/app/_helpers/localListFallback";
import { toast } from "sonner";
import type { MediaType } from "@/app/types/lists";

/**
 * Batch size for migrating localStorage items to the backend.
 */
const MIGRATION_BATCH_SIZE = 10;

/**
 * localStorage key to track whether migration has been attempted.
 * Prevents re-running migration on every mount.
 */
const MIGRATION_DONE_KEY = "flick_list_migration_done";

/**
 * ListBootstrap — Hydrates the list store when the user is authenticated.
 *
 * Renders nothing (returns null). Must be placed inside the provider tree
 * after AuthBootstrap so that `useAuthStore.isAuthenticated` is accurate.
 *
 * Also handles:
 * - localStorage → backend data migration on first authenticated mount
 */
export default function ListBootstrap() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialized = useListStore((s) => s.isInitialized);
  const initialize = useListStore((s) => s.initialize);
  const addItem = useListStore((s) => s.addItem);
  const getSystemList = useListStore((s) => s.getSystemList);
  const fetchLists = useListStore((s) => s.fetchLists);

  // Prevent duplicate migration attempts
  const [migrationAttempted, setMigrationAttempted] = useState(false);
  const migrationRef = useRef(false);

  // Initialize the store when authenticated
  useEffect(() => {
    if (isAuthenticated && !isInitialized) {
      initialize();
    }
  }, [isAuthenticated, isInitialized, initialize]);

  // Run localStorage migration when the store is initialized and user is authenticated
  useEffect(() => {
    if (
      !isAuthenticated ||
      !isInitialized ||
      migrationAttempted ||
      migrationRef.current
    ) {
      return;
    }

    migrationRef.current = true;
    setMigrationAttempted(true);

    // Check if migration was already done
    if (typeof window !== "undefined" && localStorage.getItem(MIGRATION_DONE_KEY)) {
      return;
    }

    // Check if there's any local data to migrate
    if (!hasLocalListData()) {
      // Mark as done even if no data to avoid re-checking
      if (typeof window !== "undefined") {
        try { localStorage.setItem(MIGRATION_DONE_KEY, "true"); } catch { /* noop */ }
      }
      return;
    }

    performMigration();
  }, [isAuthenticated, isInitialized, migrationAttempted]);

  async function performMigration() {
    const localData = readLocalListData();
    const storageKeys = ["favouritList", "watchList", "watchedList"] as const;
    const systemKeys = ["favorites", "watchlist", "watched"] as const;

    const favoritList = localData["favouritList"] || [];
    const watchList = localData["watchList"] || [];
    const watchedList = localData["watchedList"] || [];

    const allItems = [
      { list: favoritList, key: "favorites" as const },
      { list: watchList, key: "watchlist" as const },
      { list: watchedList, key: "watched" as const },
    ];

    const totalItems = favoritList.length + watchList.length + watchedList.length;
    if (totalItems === 0) return;

    toast.loading("Syncing your local lists...", { id: "list-migration" });

    let migratedCount = 0;
    let errorCount = 0;

    for (const { list, key } of allItems) {
      if (list.length === 0) continue;

      const systemList = getSystemList(key);
      if (!systemList) {
        errorCount += list.length;
        continue;
      }

      // Batch items to avoid overwhelming the API
      for (let i = 0; i < list.length; i += MIGRATION_BATCH_SIZE) {
        const batch = list.slice(i, i + MIGRATION_BATCH_SIZE);

        const results = await Promise.allSettled(
          batch.map((media) => {
            const mediaType = (media.media_type ||
              (media.title ? "movie" : "tv")) as MediaType;
            return addItem(systemList.id, {
              mediaType,
              tmdbId: media.id,
            });
          }),
        );

        for (const result of results) {
          if (result.status === "fulfilled" && result.value) {
            migratedCount++;
          } else {
            errorCount++;
          }
        }
      }
    }

    // Show outcome
    if (errorCount === 0) {
      toast.success(
        migratedCount > 0
          ? `Your lists are synced! (${migratedCount} items)`
          : "Your lists are up to date.",
        { id: "list-migration" },
      );
    } else {
      toast.error(
        `${migratedCount} items synced, ${errorCount} failed. Your local data is preserved.`,
        { id: "list-migration" },
      );
      // Don't clear localStorage on partial failure — let the user retry
      return;
    }

    // Clear localStorage migration flag and local data
    try {
      localStorage.setItem(MIGRATION_DONE_KEY, "true");
    } catch { /* noop */ }

    // Only clear local data if everything succeeded
    clearLocalListData();

    // Re-fetch lists to get fresh data from server
    await fetchLists();
  }

  return null;
}

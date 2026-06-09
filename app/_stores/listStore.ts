"use client";

import { create } from "zustand";
import type {
  ListResponseDto,
  ListItemResponseDto,
  ListItemWithMeta,
  UserListWithMeta,
  AddItemDto,
  MediaType,
} from "@/app/types/lists";
import * as listActions from "@/app/_actions/lists";
import { toast } from "sonner";

// ─── Auth Error Handler ──────────────────────────────

/**
 * Handle 401 (Unauthorized) errors by redirecting to sign-in.
 * This is called from Zustand actions (outside React components).
 * We redirect to /signin which will trigger a full page reload,
 * clearing any stale state and letting the middleware handle auth.
 */
function handleUnauthorized() {
  toast.error("Session expired. Please sign in again.");
  if (typeof window !== "undefined") {
    window.location.href = "/signin";
  }
}

/**
 * Return a user-friendly error message based on status code.
 */
function getStatusCodeMessage(statusCode: number | undefined, fallback: string): string {
  if (statusCode === 401) return "Session expired. Please sign in again.";
  if (statusCode === 403) return "You don't have permission to perform this action.";
  if (statusCode === 503) return "Media service temporarily unavailable. Please try again later.";
  if (statusCode === 409) return "A conflict occurred. The resource may already exist.";
  if (statusCode === 404) return "The requested resource was not found.";
  return fallback;
}

/**
 * Check a server action result for auth errors and return a processed message.
 */
function checkAuthError(result: { success: boolean; statusCode?: number }): boolean {
  if (!result.success && result.statusCode === 401) {
    handleUnauthorized();
    return true;
  }
  return false;
}

// ─── Helpers ─────────────────────────────────────────

function getSystemListKey(key: string): "favorites" | "watchlist" | "watched" {
  if (key === "favorites") return "favorites";
  if (key === "watchlist") return "watchlist";
  if (key === "watched") return "watched";
  return "favorites";
}

// ─── State Interface ─────────────────────────────────

interface ListState {
  // ── Data ──────────────────────────────────────────
  /** All user lists (system + custom), indexed by id for O(1) lookup */
  listsById: Record<string, UserListWithMeta>;
  /** Ordered list of list IDs (system first, then custom by creation date) */
  listIds: string[];

  // ── Global Loading States ─────────────────────────
  /** True while initializing (fetching all lists on mount) */
  isInitialized: boolean;
  /** True while fetching lists */
  isLoadingLists: boolean;
  /** Per-list item loading (listId -> true/false) */
  isLoadingItems: Record<string, boolean>;

  // ── Error States ──────────────────────────────────
  /** Global error message */
  error: string | null;

  // ── Item Presence Maps (O(1) lookup) ──────────────
  favoritesItemsMap: Record<number, boolean>; // tmdbId -> in favorites
  watchlistItemsMap: Record<number, boolean>; // tmdbId -> in watchlist
  watchedItemsMap: Record<number, boolean>; // tmdbId -> in watched
  customListItemsMap: Record<string, Record<number, boolean>>; // listId -> tmdbId -> present

  // ── Actions ───────────────────────────────────────

  /** Initialize: fetch all lists from API and hydrate the store */
  initialize: () => Promise<void>;

  /** Fetch all user lists (lightweight — no items) */
  fetchLists: () => Promise<void>;

  /** Fetch items for a specific list */
  fetchListItems: (
    listId: string,
    params?: {
      page?: number;
      perPage?: number;
      mediaType?: MediaType;
      sortBy?: string;
      order?: "ASC" | "DESC";
    },
  ) => Promise<void>;

  /** Add an item to a list (optimistic + API call). Returns true on success. */
  addItem: (listId: string, data: AddItemDto) => Promise<boolean>;

  /** Remove an item from a list (optimistic + API call). Returns true on success. */
  removeItem: (listId: string, mediaType: string, tmdbId: number) => Promise<boolean>;

  /** Create a new custom list. Returns the created list or null on failure. */
  createList: (data: { name: string; slug?: string }) => Promise<ListResponseDto | null>;

  /** Update a custom list (name/slug). Returns true on success. */
  updateList: (id: string, data: { name?: string; slug?: string }) => Promise<boolean>;

  /** Delete a custom list. Returns true on success. */
  deleteList: (id: string) => Promise<boolean>;

  // ── Convenience Selectors ─────────────────────────
  getSystemList: (key: "favorites" | "watchlist" | "watched") => UserListWithMeta | undefined;
  getListById: (id: string) => UserListWithMeta | undefined;
  getAllLists: () => UserListWithMeta[];
  getCustomLists: () => UserListWithMeta[];

  /** Check if a tmdbId exists in a given list */
  isInList: (listId: string, tmdbId: number) => boolean;
  isFavorite: (tmdbId: number) => boolean;
  isInWatchlist: (tmdbId: number) => boolean;
  isWatched: (tmdbId: number) => boolean;
}

// ─── Store ───────────────────────────────────────────

export const useListStore = create<ListState>((set, get) => {
  // ── Internal Helpers ──────────────────────────────

  /** Build an items presence map from an array of items */
  function buildItemsMap(items: ListItemResponseDto[]): Record<number, boolean> {
    const map: Record<number, boolean> = {};
    for (const item of items) {
      if (item.tmdbId) map[item.tmdbId] = true;
    }
    return map;
  }

  /** Update a specific list's items and metadata */
  function updateListItems(listId: string, updater: (items: ListItemWithMeta[] | undefined) => ListItemWithMeta[] | undefined) {
    set((state) => {
      const list = state.listsById[listId];
      if (!list) return state;
      const newItems = updater(list.items);
      return {
        listsById: {
          ...state.listsById,
          [listId]: { ...list, items: newItems },
        },
      };
    });
  }

  /** Update the item count for a list */
  function updateListCount(listId: string, count: number) {
    set((state) => {
      const list = state.listsById[listId];
      if (!list) return state;
      return {
        listsById: {
          ...state.listsById,
          [listId]: { ...list, itemCount: count },
        },
      };
    });
  }

  /** Update the presence map for a system list */
  function updatePresenceMap(
    mapKey: "favoritesItemsMap" | "watchlistItemsMap" | "watchedItemsMap",
    tmdbId: number,
    present: boolean,
  ) {
    set((state) => ({
      [mapKey]: { ...state[mapKey], [tmdbId]: present },
    }));
  }

  /** Update the custom list presence map */
  function updateCustomListPresence(listId: string, tmdbId: number, present: boolean) {
    set((state) => ({
      customListItemsMap: {
        ...state.customListItemsMap,
        [listId]: { ...(state.customListItemsMap[listId] || {}), [tmdbId]: present },
      },
    }));
  }

  /** Get the correct presence map key for a system list */
  function getPresenceMapKey(listKey: string): "favoritesItemsMap" | "watchlistItemsMap" | "watchedItemsMap" | null {
    if (listKey === "favorites") return "favoritesItemsMap";
    if (listKey === "watchlist") return "watchlistItemsMap";
    if (listKey === "watched") return "watchedItemsMap";
    return null;
  }

  // ── Rebuild all presence maps from current state ──
  function rebuildPresenceMaps() {
    const state = get();
    const favoritesMap: Record<number, boolean> = {};
    const watchlistMap: Record<number, boolean> = {};
    const watchedMap: Record<number, boolean> = {};
    const customMap: Record<string, Record<number, boolean>> = {};

    for (const listId of state.listIds) {
      const list = state.listsById[listId];
      if (!list?.items) continue;

      const map = buildItemsMap(list.items);

      if (list.isSystem) {
        const key = list.listKey;
        if (key === "favorites") Object.assign(favoritesMap, map);
        else if (key === "watchlist") Object.assign(watchlistMap, map);
        else if (key === "watched") Object.assign(watchedMap, map);
      } else {
        customMap[listId] = map;
      }
    }

    set({
      favoritesItemsMap: favoritesMap,
      watchlistItemsMap: watchlistMap,
      watchedItemsMap: watchedMap,
      customListItemsMap: customMap,
    });
  }

  // ── Return the store ──────────────────────────────
  return {
    // ── Initial State ─────────────────────────────
    listsById: {},
    listIds: [],
    isInitialized: false,
    isLoadingLists: false,
    isLoadingItems: {},
    error: null,
    favoritesItemsMap: {},
    watchlistItemsMap: {},
    watchedItemsMap: {},
    customListItemsMap: {},

    // ── Actions ───────────────────────────────────

    initialize: async () => {
      set({ isLoadingLists: true, error: null });
      try {
        const result = await listActions.getAllListsAction({ perPage: 50 });
        if (checkAuthError(result)) {
          set({ isLoadingLists: false, isInitialized: true });
          return;
        }
        if (result.success && result.data) {
          const lists = result.data;
          const listsById: Record<string, UserListWithMeta> = {};
          const listIds: string[] = [];

          for (const list of lists) {
            listsById[list.id] = { ...list, items: [], _loadingItems: false };
            listIds.push(list.id);
          }

          set({
            listsById,
            listIds,
            isInitialized: true,
            isLoadingLists: false,
          });

          // Fetch items for system lists so presence maps are populated
          const systemLists = lists.filter((l) => l.isSystem);
          const systemIds = systemLists.map((l) => l.id);
          if (systemIds.length > 0) {
            await Promise.all(
              systemIds.map((id) => get().fetchListItems(id, { perPage: 100 })),
            );
          }
        } else {
          set({
            error: getStatusCodeMessage(result.statusCode, result.message || "Failed to initialize lists"),
            isInitialized: true,
            isLoadingLists: false,
          });
        }
      } catch (err) {
        set({
          error: err instanceof Error ? err.message : "Failed to initialize lists",
          isInitialized: true,
          isLoadingLists: false,
        });
      }
    },

    fetchLists: async () => {
      set({ isLoadingLists: true, error: null });
      try {
        const result = await listActions.getAllListsAction({ perPage: 50 });
        if (checkAuthError(result)) {
          set({ isLoadingLists: false });
          return;
        }
        if (result.success && result.data) {
          const lists = result.data;
          const listsById: Record<string, UserListWithMeta> = { ...get().listsById };
          const listIds: string[] = [];

          for (const list of lists) {
            // Preserve existing items if we already have them
            const existing = listsById[list.id];
            listsById[list.id] = {
              ...list,
              items: existing?.items || [],
              _loadingItems: existing?._loadingItems || false,
            };
            listIds.push(list.id);
          }

          set({ listsById, listIds, isLoadingLists: false });
        } else {
          set({
            error: getStatusCodeMessage(result.statusCode, result.message || "Failed to fetch lists"),
            isLoadingLists: false,
          });
        }
      } catch (err) {
        set({
          error: err instanceof Error ? err.message : "Failed to fetch lists",
          isLoadingLists: false,
        });
      }
    },

    fetchListItems: async (listId, params) => {
      const state = get();
      const list = state.listsById[listId];
      if (!list) return;
      if (list._loadingItems) return; // Already loading

      set((s) => ({
        isLoadingItems: { ...s.isLoadingItems, [listId]: true },
        listsById: {
          ...s.listsById,
          [listId]: { ...list, _loadingItems: true },
        },
      }));

      try {
        const result = await listActions.getListByIdAction(listId, {
          perPage: params?.perPage ?? 50,
          page: params?.page ?? 1,
          mediaType: params?.mediaType,
          sortBy: params?.sortBy,
          order: params?.order,
        });

        if (checkAuthError(result)) {
          set((s) => ({
            isLoadingItems: { ...s.isLoadingItems, [listId]: false },
            listsById: {
              ...s.listsById,
              [listId]: {
                ...s.listsById[listId],
                _loadingItems: false,
              },
            },
          }));
          return;
        }

        if (result.success && result.data) {
          const items = (result.data.items?.data || []) as ListItemWithMeta[];
          const paginatedItems = items.map((item) => ({
            ...item,
            _optimistic: false,
          }));

          set((s) => ({
            isLoadingItems: { ...s.isLoadingItems, [listId]: false },
            listsById: {
              ...s.listsById,
              [listId]: {
                ...s.listsById[listId],
                items: paginatedItems,
                itemCount: result.data!.items?.total ?? paginatedItems.length,
                _loadingItems: false,
              },
            },
          }));

          // Rebuild presence maps
          rebuildPresenceMaps();
        } else {
          set((s) => ({
            isLoadingItems: { ...s.isLoadingItems, [listId]: false },
            listsById: {
              ...s.listsById,
              [listId]: {
                ...s.listsById[listId],
                _loadingItems: false,
                _error: getStatusCodeMessage(result.statusCode, result.message || "Failed to load items"),
              },
            },
          }));
        }
      } catch (err) {
        set((s) => ({
          isLoadingItems: { ...s.isLoadingItems, [listId]: false },
          listsById: {
            ...s.listsById,
            [listId]: {
              ...s.listsById[listId],
              _loadingItems: false,
              _error: err instanceof Error ? err.message : "Failed to load items",
            },
          },
        }));
      }
    },

    addItem: async (listId, data) => {
      const state = get();
      const list = state.listsById[listId];
      if (!list) return false;

      // Idempotent: already in list
      if (state.isInList(listId, data.tmdbId)) return true;

      // Save previous state for rollback
      const previousItems = list.items ? [...list.items] : undefined;
      const previousCount = list.itemCount;

      // Optimistic update
      const tempItem: ListItemWithMeta = {
        id: `optimistic-${Date.now()}`,
        mediaType: data.mediaType,
        tmdbId: data.tmdbId,
        title: "",
        posterPath: null,
        releaseDate: null,
        voteAverage: null,
        addedAt: new Date().toISOString(),
        _optimistic: true,
      };

      // Update presence map
      if (list.isSystem) {
        const mapKey = getPresenceMapKey(list.listKey);
        if (mapKey) updatePresenceMap(mapKey, data.tmdbId, true);
      } else {
        updateCustomListPresence(listId, data.tmdbId, true);
      }

      // Add item to list
      updateListItems(listId, (items) => [...(items || []), tempItem]);
      updateListCount(listId, previousCount + 1);

      // Call server action
      const result = await listActions.addItemToListAction(listId, data);

      if (result.success && result.data) {
        // Replace optimistic item with real data
        updateListItems(listId, (items) =>
          items?.map((item) =>
            item._optimistic && item.tmdbId === data.tmdbId
              ? { ...result.data!, _optimistic: false }
              : item,
          ) ?? [],
        );
        return true;
      } else {
        // Check for auth errors (401)
        if (checkAuthError(result)) return false;

        // Rollback on error
        if (list.isSystem) {
          const mapKey = getPresenceMapKey(list.listKey);
          if (mapKey) updatePresenceMap(mapKey, data.tmdbId, false);
        } else {
          updateCustomListPresence(listId, data.tmdbId, false);
        }

        set((s) => ({
          listsById: {
            ...s.listsById,
            [listId]: {
              ...s.listsById[listId],
              items: previousItems as ListItemWithMeta[] | undefined,
              itemCount: previousCount,
            },
          },
        }));
        return false;
      }
    },

    removeItem: async (listId, mediaType, tmdbId) => {
      const state = get();
      const list = state.listsById[listId];
      if (!list) return false;

      // Not in list — nothing to remove
      if (!state.isInList(listId, tmdbId)) return true;

      // Save previous state for rollback
      const previousItems = list.items ? [...list.items] : undefined;
      const previousCount = list.itemCount;

      // Optimistic removal
      if (list.isSystem) {
        const mapKey = getPresenceMapKey(list.listKey);
        if (mapKey) updatePresenceMap(mapKey, tmdbId, false);
      } else {
        updateCustomListPresence(listId, tmdbId, false);
      }

      updateListItems(listId, (items) =>
        items?.filter((item) => !(item.tmdbId === tmdbId)) ?? [],
      );
      updateListCount(listId, Math.max(0, previousCount - 1));

      // Call server action
      const result = await listActions.removeItemFromListAction(listId, mediaType, tmdbId);

      if (result.success) {
        return true;
      } else {
        // Check for auth errors (401)
        if (checkAuthError(result)) return false;

        // Rollback on error
        if (list.isSystem) {
          const mapKey = getPresenceMapKey(list.listKey);
          if (mapKey) updatePresenceMap(mapKey, tmdbId, true);
        } else {
          updateCustomListPresence(listId, tmdbId, true);
        }

        set((s) => ({
          listsById: {
            ...s.listsById,
            [listId]: {
              ...s.listsById[listId],
              items: previousItems as ListItemWithMeta[] | undefined,
              itemCount: previousCount,
            },
          },
        }));
        return false;
      }
    },

    createList: async (data) => {
      try {
        const result = await listActions.createListAction(data);
        if (checkAuthError(result)) return null;
        if (result.success && result.data) {
          const newList: UserListWithMeta = {
            ...result.data,
            items: [],
            _loadingItems: false,
          };
          set((state) => ({
            listsById: { ...state.listsById, [newList.id]: newList },
            listIds: [...state.listIds, newList.id],
          }));
          return result.data;
        }
        return null;
      } catch {
        return null;
      }
    },

    updateList: async (id, data) => {
      try {
        const result = await listActions.updateListAction(id, data);
        if (checkAuthError(result)) return false;
        if (result.success && result.data) {
          set((state) => ({
            listsById: {
              ...state.listsById,
              [id]: { ...state.listsById[id], ...result.data! },
            },
          }));
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },

    deleteList: async (id) => {
      try {
        const result = await listActions.deleteListAction(id);
        if (checkAuthError(result)) return false;
        if (result.success) {
          set((state) => {
            const { [id]: removed, ...rest } = state.listsById;
            const { [id]: removedCustom, ...restCustom } = state.customListItemsMap;
            return {
              listsById: rest,
              listIds: state.listIds.filter((lid) => lid !== id),
              customListItemsMap: restCustom,
            };
          });
          return true;
        }
        return false;
      } catch {
        return false;
      }
    },

    // ── Selectors ────────────────────────────────

    getSystemList: (key) => {
      const state = get();
      for (const listId of state.listIds) {
        const list = state.listsById[listId];
        if (list?.isSystem && list.listKey === key) return list;
      }
      return undefined;
    },

    getListById: (id) => {
      return get().listsById[id];
    },

    getAllLists: () => {
      const state = get();
      return state.listIds.map((id) => state.listsById[id]).filter(Boolean);
    },

    getCustomLists: () => {
      const state = get();
      return state.listIds
        .map((id) => state.listsById[id])
        .filter((list) => list && !list.isSystem);
    },

    isInList: (listId, tmdbId) => {
      const state = get();
      const list = state.listsById[listId];
      if (!list?.items) return false;
      return list.items.some((item) => item.tmdbId === tmdbId);
    },

    isFavorite: (tmdbId) => {
      return !!get().favoritesItemsMap[tmdbId];
    },

    isInWatchlist: (tmdbId) => {
      return !!get().watchlistItemsMap[tmdbId];
    },

    isWatched: (tmdbId) => {
      return !!get().watchedItemsMap[tmdbId];
    },
  };
});

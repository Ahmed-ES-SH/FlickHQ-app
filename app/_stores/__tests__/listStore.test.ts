import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock list actions before importing the store
vi.mock("@/app/_actions/lists", () => ({
  getAllListsAction: vi.fn(),
  getListByIdAction: vi.fn(),
  createListAction: vi.fn(),
  updateListAction: vi.fn(),
  deleteListAction: vi.fn(),
  addItemToListAction: vi.fn(),
  removeItemFromListAction: vi.fn(),
}));

import { useListStore } from "@/app/_stores/listStore";
import * as listActions from "@/app/_actions/lists";
import type { ListResponseDto, ListItemResponseDto } from "@/app/types/lists";

const mockedActions = vi.mocked(listActions);

const systemListFavorites: ListResponseDto = {
  id: "fav-1",
  name: "Favorites",
  slug: "favorites",
  listKey: "favorites",
  isSystem: true,
  itemCount: 2,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-02T00:00:00.000Z",
};

const systemListWatchlist: ListResponseDto = {
  id: "wl-1",
  name: "Watchlist",
  slug: "watchlist",
  listKey: "watchlist",
  isSystem: true,
  itemCount: 1,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-02T00:00:00.000Z",
};

const systemListWatched: ListResponseDto = {
  id: "wt-1",
  name: "Watched",
  slug: "watched",
  listKey: "watched",
  isSystem: true,
  itemCount: 0,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-02T00:00:00.000Z",
};

const customList: ListResponseDto = {
  id: "custom-1",
  name: "My Custom List",
  slug: "my-custom-list",
  listKey: "",
  isSystem: false,
  itemCount: 0,
  createdAt: "2024-01-03T00:00:00.000Z",
  updatedAt: "2024-01-03T00:00:00.000Z",
};

const favoriteItem1: ListItemResponseDto = {
  id: "fi-1",
  mediaType: "movie",
  tmdbId: 101,
  title: "Movie 1",
  posterPath: "/poster1.jpg",
  releaseDate: "2024-01-01",
  voteAverage: 8.0,
  addedAt: "2024-01-02T00:00:00.000Z",
};

const favoriteItem2: ListItemResponseDto = {
  id: "fi-2",
  mediaType: "tv",
  tmdbId: 201,
  title: "Show 1",
  posterPath: "/poster2.jpg",
  releaseDate: "2024-02-01",
  voteAverage: 7.5,
  addedAt: "2024-01-02T00:00:00.000Z",
};

const watchlistItem1: ListItemResponseDto = {
  id: "wi-1",
  mediaType: "movie",
  tmdbId: 301,
  title: "Watch Later",
  posterPath: "/poster3.jpg",
  releaseDate: "2024-03-01",
  voteAverage: 6.5,
  addedAt: "2024-01-02T00:00:00.000Z",
};

function resetStore() {
  useListStore.setState({
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
  });
}

describe("useListStore", () => {
  beforeEach(() => {
    resetStore();
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("starts with empty lists and not initialized", () => {
      const state = useListStore.getState();
      expect(state.listsById).toEqual({});
      expect(state.listIds).toEqual([]);
      expect(state.isInitialized).toBe(false);
      expect(state.isLoadingLists).toBe(false);
      expect(state.error).toBeNull();
      expect(state.favoritesItemsMap).toEqual({});
      expect(state.watchlistItemsMap).toEqual({});
      expect(state.watchedItemsMap).toEqual({});
    });
  });

  describe("initialize", () => {
    it("fetches lists and populates the store", async () => {
      const lists = [systemListFavorites, systemListWatchlist];

      mockedActions.getAllListsAction.mockResolvedValue({
        success: true,
        message: "OK",
        data: lists,
      });

      mockedActions.getListByIdAction.mockImplementation((id) => {
        if (id === "fav-1") {
          return Promise.resolve({
            success: true,
            message: "OK",
            data: {
              list: systemListFavorites,
              items: { data: [favoriteItem1, favoriteItem2], total: 2, page: 1, perPage: 100, lastPage: 1 },
            },
          });
        }
        if (id === "wl-1") {
          return Promise.resolve({
            success: true,
            message: "OK",
            data: {
              list: systemListWatchlist,
              items: { data: [watchlistItem1], total: 1, page: 1, perPage: 100, lastPage: 1 },
            },
          });
        }
        return Promise.resolve({ success: false, message: "Not found", statusCode: 404 });
      });

      await useListStore.getState().initialize();

      const state = useListStore.getState();
      expect(state.isInitialized).toBe(true);
      expect(state.isLoadingLists).toBe(false);
      expect(Object.keys(state.listsById)).toHaveLength(2);
      expect(state.listIds).toEqual(["fav-1", "wl-1"]);

      // Favorites presence map should be populated
      expect(state.isFavorite(101)).toBe(true);
      expect(state.isFavorite(201)).toBe(true);
      expect(state.isFavorite(301)).toBe(false);
      // Watchlist presence map
      expect(state.isInWatchlist(301)).toBe(true);
    });

    it("handles error during initialization", async () => {
      mockedActions.getAllListsAction.mockResolvedValue({
        success: false,
        message: "Server error",
        statusCode: 500,
      });

      await useListStore.getState().initialize();

      const state = useListStore.getState();
      expect(state.isInitialized).toBe(true);
      expect(state.isLoadingLists).toBe(false);
      expect(state.error).toBe("Server error");
    });
  });

  describe("addItem (optimistic update)", () => {
    beforeEach(async () => {
      // Set up initial state with a favorites list
      mockedActions.getAllListsAction.mockResolvedValue({
        success: true,
        message: "OK",
        data: [systemListFavorites],
      });
      mockedActions.getListByIdAction.mockResolvedValue({
        success: true,
        message: "OK",
        data: {
          list: systemListFavorites,
          items: { data: [], total: 0, page: 1, perPage: 100, lastPage: 1 },
        },
      });
      await useListStore.getState().initialize();
    });

    it("optimistically adds item and replaces with server data on success", async () => {
      mockedActions.addItemToListAction.mockResolvedValue({
        success: true,
        message: "Added",
        data: favoriteItem1,
      });

      const result = await useListStore
        .getState()
        .addItem("fav-1", { mediaType: "movie", tmdbId: 101 });

      expect(result).toBe(true);

      // After optimistic update + server response replacement
      const state = useListStore.getState();
      const favList = state.listsById["fav-1"];
      expect(favList?.items).toHaveLength(1);
      expect(favList?.items?.[0].tmdbId).toBe(101);
      expect(favList?.itemCount).toBe(1);
      // Should no longer be optimistic
      expect(favList?.items?.[0]._optimistic).toBe(false);
      // Presence map should be updated
      expect(state.isFavorite(101)).toBe(true);
    });

    it("rolls back on server error", async () => {
      mockedActions.addItemToListAction.mockResolvedValue({
        success: false,
        message: "Failed to add",
        statusCode: 500,
      });

      const result = await useListStore
        .getState()
        .addItem("fav-1", { mediaType: "movie", tmdbId: 101 });

      expect(result).toBe(false);

      // State should be restored
      const state = useListStore.getState();
      const favList = state.listsById["fav-1"];
      expect(favList?.items).toHaveLength(0);
      expect(favList?.itemCount).toBe(0);
      expect(state.isFavorite(101)).toBe(false);
    });

    it("is idempotent — already in list returns true without API call", async () => {
      // First, add an item
      mockedActions.addItemToListAction.mockResolvedValue({
        success: true,
        message: "Added",
        data: favoriteItem1,
      });
      await useListStore.getState().addItem("fav-1", { mediaType: "movie", tmdbId: 101 });
      expect(mockedActions.addItemToListAction).toHaveBeenCalledTimes(1);

      // Try adding again — should skip
      const result = await useListStore
        .getState()
        .addItem("fav-1", { mediaType: "movie", tmdbId: 101 });

      expect(result).toBe(true);
      // API should NOT have been called a second time
      expect(mockedActions.addItemToListAction).toHaveBeenCalledTimes(1);
    });
  });

  describe("removeItem (optimistic update)", () => {
    beforeEach(async () => {
      mockedActions.getAllListsAction.mockResolvedValue({
        success: true,
        message: "OK",
        data: [systemListFavorites],
      });
      mockedActions.getListByIdAction.mockResolvedValue({
        success: true,
        message: "OK",
        data: {
          list: systemListFavorites,
          items: { data: [favoriteItem1], total: 1, page: 1, perPage: 100, lastPage: 1 },
        },
      });
      await useListStore.getState().initialize();
    });

    it("removes item optimistically and confirms on success", async () => {
      mockedActions.removeItemFromListAction.mockResolvedValue({
        success: true,
        message: "Removed",
      });

      const result = await useListStore
        .getState()
        .removeItem("fav-1", "movie", 101);

      expect(result).toBe(true);

      const state = useListStore.getState();
      const favList = state.listsById["fav-1"];
      expect(favList?.items).toHaveLength(0);
      expect(favList?.itemCount).toBe(0);
      expect(state.isFavorite(101)).toBe(false);
    });

    it("rolls back on server error", async () => {
      mockedActions.removeItemFromListAction.mockResolvedValue({
        success: false,
        message: "Failed to remove",
        statusCode: 500,
      });

      const result = await useListStore
        .getState()
        .removeItem("fav-1", "movie", 101);

      expect(result).toBe(false);

      // State should be restored
      const state = useListStore.getState();
      const favList = state.listsById["fav-1"];
      expect(favList?.items).toHaveLength(1);
      expect(favList?.itemCount).toBe(1);
      expect(state.isFavorite(101)).toBe(true);
    });

    it("returns true if item not in list (nothing to remove)", async () => {
      const result = await useListStore
        .getState()
        .removeItem("fav-1", "movie", 999);

      expect(result).toBe(true);
      // API should not have been called
      expect(mockedActions.removeItemFromListAction).not.toHaveBeenCalled();
    });
  });

  describe("selectors", () => {
    beforeEach(async () => {
      mockedActions.getAllListsAction.mockResolvedValue({
        success: true,
        message: "OK",
        data: [systemListFavorites, systemListWatchlist, systemListWatched, customList],
      });
      // Use mockImplementation so each list ID returns its own data
      mockedActions.getListByIdAction.mockImplementation((id) => {
        if (id === "fav-1") {
          return Promise.resolve({
            success: true,
            message: "OK",
            data: {
              list: systemListFavorites,
              items: { data: [favoriteItem1, favoriteItem2], total: 2, page: 1, perPage: 100, lastPage: 1 },
            },
          });
        }
        if (id === "wl-1") {
          return Promise.resolve({
            success: true,
            message: "OK",
            data: {
              list: systemListWatchlist,
              items: { data: [watchlistItem1], total: 1, page: 1, perPage: 100, lastPage: 1 },
            },
          });
        }
        // For "wt-1" (watched) and other lists, return empty items
        return Promise.resolve({
          success: true,
          message: "OK",
          data: {
            list: { id, isSystem: id === "wt-1", listKey: id === "wt-1" ? "watched" : "" } as any,
            items: { data: [], total: 0, page: 1, perPage: 100, lastPage: 0 },
          },
        });
      });
      await useListStore.getState().initialize();
    });

    it("getSystemList returns the correct list by key", () => {
      const favorites = useListStore.getState().getSystemList("favorites");
      expect(favorites?.id).toBe("fav-1");
      expect(favorites?.listKey).toBe("favorites");

      const watchlist = useListStore.getState().getSystemList("watchlist");
      expect(watchlist?.id).toBe("wl-1");

      const watched = useListStore.getState().getSystemList("watched");
      expect(watched?.id).toBe("wt-1");
    });

    it("getSystemList returns undefined for missing key", () => {
      const result = useListStore.getState().getSystemList("favorites");
      expect(result).toBeDefined();
    });

    it("getListById returns correct list", () => {
      const list = useListStore.getState().getListById("fav-1");
      expect(list?.name).toBe("Favorites");
    });

    it("getListById returns undefined for missing id", () => {
      const list = useListStore.getState().getListById("nonexistent");
      expect(list).toBeUndefined();
    });

    it("getAllLists returns all lists", () => {
      const all = useListStore.getState().getAllLists();
      expect(all).toHaveLength(4);
    });

    it("getCustomLists returns only non-system lists", () => {
      const custom = useListStore.getState().getCustomLists();
      expect(custom).toHaveLength(1);
      expect(custom[0]?.id).toBe("custom-1");
    });

    it("isFavorite returns correct boolean", () => {
      expect(useListStore.getState().isFavorite(101)).toBe(true);
      expect(useListStore.getState().isFavorite(201)).toBe(true);
      expect(useListStore.getState().isFavorite(999)).toBe(false);
    });

    it("isInWatchlist returns correct boolean", () => {
      expect(useListStore.getState().isInWatchlist(101)).toBe(false);
      expect(useListStore.getState().isInWatchlist(301)).toBe(true);
    });

    it("isWatched returns correct boolean", () => {
      expect(useListStore.getState().isWatched(101)).toBe(false);
    });

    it("isInList checks items array directly", () => {
      expect(useListStore.getState().isInList("fav-1", 101)).toBe(true);
      expect(useListStore.getState().isInList("fav-1", 999)).toBe(false);
    });
  });

  describe("createList", () => {
    it("adds a new custom list to the store", async () => {
      mockedActions.createListAction.mockResolvedValue({
        success: true,
        message: "Created",
        data: customList,
      });

      const result = await useListStore.getState().createList({
        name: "My Custom List",
      });

      expect(result).toEqual(customList);
      const state = useListStore.getState();
      expect(state.listsById["custom-1"]).toBeDefined();
      expect(state.listIds).toContain("custom-1");
    });

    it("returns null on failure", async () => {
      mockedActions.createListAction.mockResolvedValue({
        success: false,
        message: "Failed",
        statusCode: 400,
      });

      const result = await useListStore.getState().createList({
        name: "Bad List",
      });

      expect(result).toBeNull();
    });
  });

  describe("deleteList", () => {
    beforeEach(async () => {
      mockedActions.getAllListsAction.mockResolvedValue({
        success: true,
        message: "OK",
        data: [customList],
      });
      mockedActions.getListByIdAction.mockResolvedValue({
        success: true,
        message: "OK",
        data: {
          list: customList,
          items: { data: [], total: 0, page: 1, perPage: 100, lastPage: 1 },
        },
      });
      await useListStore.getState().initialize();
    });

    it("removes a custom list from the store", async () => {
      mockedActions.deleteListAction.mockResolvedValue({
        success: true,
        message: "Deleted",
      });

      const result = await useListStore.getState().deleteList("custom-1");

      expect(result).toBe(true);
      const state = useListStore.getState();
      expect(state.listsById["custom-1"]).toBeUndefined();
      expect(state.listIds).not.toContain("custom-1");
    });

    it("returns false on failure", async () => {
      mockedActions.deleteListAction.mockResolvedValue({
        success: false,
        message: "Forbidden",
        statusCode: 403,
      });

      const result = await useListStore.getState().deleteList("custom-1");

      expect(result).toBe(false);
      // List should still exist
      expect(useListStore.getState().listsById["custom-1"]).toBeDefined();
    });
  });
});

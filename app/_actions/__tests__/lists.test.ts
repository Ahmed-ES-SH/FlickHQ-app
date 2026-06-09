import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/app/_helpers/globalRequest", () => ({
  globalRequest: vi.fn(),
}));

import { globalRequest } from "@/app/_helpers/globalRequest";
import { API_ENDPOINTS } from "@/app/constants/apis";
import {
  createListAction,
  getAllListsAction,
  getListByIdAction,
  updateListAction,
  deleteListAction,
  addItemToListAction,
  removeItemFromListAction,
} from "@/app/_actions/lists";
import type { ListResponseDto, ListItemResponseDto } from "@/app/types/lists";

const mockedGlobalRequest = vi.mocked(globalRequest);

function mockResponse<T>(data: T, options?: { status?: number; message?: string }) {
  return {
    success: (options?.status ?? 200) >= 200 && (options?.status ?? 200) < 300,
    message: options?.message ?? "Request successful",
    data,
    statusCode: options?.status ?? 200,
  };
}

function mockErrorResponse(message: string, status: number) {
  return {
    success: false,
    message,
    statusCode: status,
    errors: undefined,
  };
}

const fakeList: ListResponseDto = {
  id: "list-1",
  name: "My Favorites",
  slug: "my-favorites",
  listKey: "favorites",
  isSystem: false,
  itemCount: 0,
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
};

const fakeItem: ListItemResponseDto = {
  id: "item-1",
  mediaType: "movie",
  tmdbId: 123,
  title: "Test Movie",
  posterPath: "/poster.jpg",
  releaseDate: "2024-01-01",
  voteAverage: 7.5,
  addedAt: "2024-01-01T00:00:00.000Z",
};

describe("createListAction", () => {
  beforeEach(() => {
    mockedGlobalRequest.mockReset();
  });

  it("successfully creates a list", async () => {
    mockedGlobalRequest.mockResolvedValue(mockResponse(fakeList));

    const result = await createListAction({ name: "My Favorites" });

    expect(result.success).toBe(true);
    expect(result.data).toEqual(fakeList);
    expect(mockedGlobalRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: API_ENDPOINTS.LISTS.create,
        method: "POST",
        body: { name: "My Favorites" },
      }),
    );
  });

  it("handles validation error (400)", async () => {
    mockedGlobalRequest.mockResolvedValue(
      mockErrorResponse("Validation failed", 400),
    );

    const result = await createListAction({ name: "" });

    expect(result.success).toBe(false);
    expect(result.message).toBe("Validation failed");
    expect(result.statusCode).toBe(400);
  });

  it("handles slug conflict (409)", async () => {
    mockedGlobalRequest.mockResolvedValue(
      mockErrorResponse("Slug already taken", 409),
    );

    const result = await createListAction({
      name: "My List",
      slug: "my-list",
    });

    expect(result.success).toBe(false);
    expect(result.message).toBe("Slug already taken");
    expect(result.statusCode).toBe(409);
  });
});

describe("getAllListsAction", () => {
  beforeEach(() => {
    mockedGlobalRequest.mockReset();
  });

  it("returns all lists with pagination params", async () => {
    const paginatedResponse = {
      data: [fakeList],
      total: 1,
      page: 1,
      perPage: 50,
      lastPage: 1,
    };
    mockedGlobalRequest.mockResolvedValue(mockResponse(paginatedResponse));

    const result = await getAllListsAction({ page: 1, perPage: 10 });

    expect(result.success).toBe(true);
    expect(result.data).toEqual([fakeList]);
    expect(result.data).toHaveLength(1);
  });

  it("returns all lists without params (uses defaults)", async () => {
    const paginatedResponse = {
      data: [fakeList],
      total: 1,
      page: 1,
      perPage: 50,
      lastPage: 1,
    };
    mockedGlobalRequest.mockResolvedValue(mockResponse(paginatedResponse));

    const result = await getAllListsAction();

    expect(result.success).toBe(true);
    expect(result.data).toEqual([fakeList]);
  });

  it("handles a plain array response", async () => {
    mockedGlobalRequest.mockResolvedValue(mockResponse([fakeList]));

    const result = await getAllListsAction();

    expect(result.success).toBe(true);
    expect(result.data).toEqual([fakeList]);
  });

  it("handles empty response", async () => {
    mockedGlobalRequest.mockResolvedValue(
      mockErrorResponse("Not found", 404),
    );

    const result = await getAllListsAction();

    expect(result.success).toBe(false);
    expect(result.statusCode).toBe(404);
  });
});

describe("getListByIdAction", () => {
  beforeEach(() => {
    mockedGlobalRequest.mockReset();
  });

  it("fetches a single list with items", async () => {
    const singleListResponse = {
      list: fakeList,
      items: {
        data: [fakeItem],
        total: 1,
        page: 1,
        perPage: 50,
        lastPage: 1,
      },
    };
    mockedGlobalRequest.mockResolvedValue(mockResponse(singleListResponse));

    const result = await getListByIdAction("list-1");

    expect(result.success).toBe(true);
    expect(result.data?.list).toEqual(fakeList);
    expect(result.data?.items.data).toEqual([fakeItem]);
    expect(mockedGlobalRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: API_ENDPOINTS.LISTS.getById("list-1"),
        method: "GET",
      }),
    );
  });

  it("passes filter params correctly", async () => {
    mockedGlobalRequest.mockResolvedValue(
      mockResponse({ list: fakeList, items: { data: [], total: 0, page: 1, perPage: 10, lastPage: 0 } }),
    );

    await getListByIdAction("list-1", {
      mediaType: "movie",
      sortBy: "addedAt",
      order: "DESC",
    });

    const callUrl = mockedGlobalRequest.mock.calls[0][0].endpoint;
    expect(callUrl).toContain("mediaType=movie");
    expect(callUrl).toContain("sortBy=addedAt");
    expect(callUrl).toContain("order=DESC");
  });

  it("handles 404 (list not found)", async () => {
    mockedGlobalRequest.mockResolvedValue(
      mockErrorResponse("List not found", 404),
    );

    const result = await getListByIdAction("nonexistent");

    expect(result.success).toBe(false);
    expect(result.statusCode).toBe(404);
  });
});

describe("updateListAction", () => {
  beforeEach(() => {
    mockedGlobalRequest.mockReset();
  });

  it("updates a list name", async () => {
    const updatedList = { ...fakeList, name: "New Name" };
    mockedGlobalRequest.mockResolvedValue(mockResponse(updatedList));

    const result = await updateListAction("list-1", { name: "New Name" });

    expect(result.success).toBe(true);
    expect(result.data?.name).toBe("New Name");
    expect(mockedGlobalRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: API_ENDPOINTS.LISTS.update("list-1"),
        method: "PATCH",
        body: { name: "New Name" },
      }),
    );
  });

  it("handles 403 on system list", async () => {
    mockedGlobalRequest.mockResolvedValue(
      mockErrorResponse("Cannot modify system list", 403),
    );

    const result = await updateListAction("system-list", { name: "Hack" });

    expect(result.success).toBe(false);
    expect(result.statusCode).toBe(403);
  });
});

describe("deleteListAction", () => {
  beforeEach(() => {
    mockedGlobalRequest.mockReset();
  });

  it("deletes a list successfully", async () => {
    mockedGlobalRequest.mockResolvedValue(mockResponse(undefined));

    const result = await deleteListAction("list-1");

    expect(result.success).toBe(true);
    expect(mockedGlobalRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: API_ENDPOINTS.LISTS.delete("list-1"),
        method: "DELETE",
      }),
    );
  });

  it("handles 403 on system list deletion", async () => {
    mockedGlobalRequest.mockResolvedValue(
      mockErrorResponse("Cannot delete system list", 403),
    );

    const result = await deleteListAction("system-list");

    expect(result.success).toBe(false);
    expect(result.statusCode).toBe(403);
  });
});

describe("addItemToListAction", () => {
  beforeEach(() => {
    mockedGlobalRequest.mockReset();
  });

  it("adds an item successfully", async () => {
    mockedGlobalRequest.mockResolvedValue(mockResponse(fakeItem));

    const result = await addItemToListAction("list-1", {
      mediaType: "movie",
      tmdbId: 123,
    });

    expect(result.success).toBe(true);
    expect(result.data?.tmdbId).toBe(123);
    expect(result.data?.title).toBe("Test Movie");
    expect(mockedGlobalRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: API_ENDPOINTS.LISTS.addItem("list-1"),
        method: "POST",
        body: { mediaType: "movie", tmdbId: 123 },
      }),
    );
  });

  it("handles 404 (list not found)", async () => {
    mockedGlobalRequest.mockResolvedValue(
      mockErrorResponse("List not found", 404),
    );

    const result = await addItemToListAction("nonexistent", {
      mediaType: "movie",
      tmdbId: 123,
    });

    expect(result.success).toBe(false);
    expect(result.statusCode).toBe(404);
  });

  it("handles 503 (TMDB unavailable)", async () => {
    mockedGlobalRequest.mockResolvedValue(
      mockErrorResponse("TMDB temporarily unavailable", 503),
    );

    const result = await addItemToListAction("list-1", {
      mediaType: "tv",
      tmdbId: 456,
    });

    expect(result.success).toBe(false);
    expect(result.statusCode).toBe(503);
  });

  it("is idempotent — adding same item returns success with existing data", async () => {
    mockedGlobalRequest.mockResolvedValue(mockResponse(fakeItem, { status: 201 }));

    const result = await addItemToListAction("list-1", {
      mediaType: "movie",
      tmdbId: 123,
    });

    expect(result.success).toBe(true);
    expect(result.statusCode).toBe(201);
  });
});

describe("removeItemFromListAction", () => {
  beforeEach(() => {
    mockedGlobalRequest.mockReset();
  });

  it("removes an item successfully", async () => {
    mockedGlobalRequest.mockResolvedValue(mockResponse(undefined));

    const result = await removeItemFromListAction("list-1", "movie", 123);

    expect(result.success).toBe(true);
    expect(mockedGlobalRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        endpoint: API_ENDPOINTS.LISTS.removeItem("list-1", "movie", 123),
        method: "DELETE",
      }),
    );
  });

  it("handles 404 (item not found)", async () => {
    mockedGlobalRequest.mockResolvedValue(
      mockErrorResponse("Item not found", 404),
    );

    const result = await removeItemFromListAction("list-1", "movie", 999);

    expect(result.success).toBe(false);
    expect(result.statusCode).toBe(404);
  });
});

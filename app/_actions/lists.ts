"use server";

import { globalRequest } from "@/app/_helpers/globalRequest";
import { API_ENDPOINTS } from "@/app/constants/apis";
import type {
  ListResponseDto,
  ListItemResponseDto,
  PaginatedResult,
  SingleListWithItems,
  AddItemDto,
  CreateListDto,
  UpdateListDto,
  MediaType,
} from "@/app/types/lists";

// ─── Shared Result Type ──────────────────────────────

export interface ListActionResult<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

// ─── Helper ──────────────────────────────────────────

function buildQueryString(
  params?: Record<string, string | number | undefined>,
): string {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && `${value}` !== "") {
      searchParams.append(key, String(value));
    }
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

// ─── 1. Create List ──────────────────────────────────

export async function createListAction(
  data: CreateListDto,
): Promise<ListActionResult<ListResponseDto>> {
  const res = await globalRequest<CreateListDto, ListResponseDto>({
    endpoint: API_ENDPOINTS.LISTS.create,
    method: "POST",
    body: data,
    defaultErrorMessage: "Failed to create list",
  });
  return {
    success: res.success,
    message: res.message,
    data: res.data,
    statusCode: res.statusCode,
    errors: res.errors,
  };
}

// ─── 2. Get All Lists ────────────────────────────────

export async function getAllListsAction(
  params?: {
    page?: number;
    perPage?: number;
  },
): Promise<ListActionResult<ListResponseDto[]>> {
  const query = buildQueryString(params);
  const res = await globalRequest<undefined, PaginatedResult<ListResponseDto>>({
    endpoint: `${API_ENDPOINTS.LISTS.getAll}${query}`,
    method: "GET",
    defaultErrorMessage: "Failed to fetch lists",
  });
  if (res.success && res.data) {
    // The API may return paginated data: { data: [...], total, page, ... }
    // or a plain array. Handle both cases.
    const paginated = res.data as unknown as PaginatedResult<ListResponseDto>;
    const lists = Array.isArray(paginated)
      ? paginated
      : Array.isArray(paginated?.data)
        ? paginated.data
        : [];
    return { success: true, message: res.message, data: lists, statusCode: res.statusCode };
  }
  return {
    success: false,
    message: res.message,
    statusCode: res.statusCode,
    errors: res.errors,
  };
}

// ─── 3. Get List By Id ───────────────────────────────

export async function getListByIdAction(
  id: string,
  params?: {
    page?: number;
    perPage?: number;
    mediaType?: MediaType;
    sortBy?: string;
    order?: "ASC" | "DESC";
  },
): Promise<ListActionResult<SingleListWithItems>> {
  const query = buildQueryString(params as Record<string, string | number | undefined>);
  const res = await globalRequest<undefined, SingleListWithItems>({
    endpoint: `${API_ENDPOINTS.LISTS.getById(id)}${query}`,
    method: "GET",
    defaultErrorMessage: "Failed to fetch list",
  });
  return {
    success: res.success,
    message: res.message,
    data: res.data,
    statusCode: res.statusCode,
    errors: res.errors,
  };
}

// ─── 4. Update List ──────────────────────────────────

export async function updateListAction(
  id: string,
  data: UpdateListDto,
): Promise<ListActionResult<ListResponseDto>> {
  const res = await globalRequest<UpdateListDto, ListResponseDto>({
    endpoint: API_ENDPOINTS.LISTS.update(id),
    method: "PATCH",
    body: data,
    defaultErrorMessage: "Failed to update list",
  });
  return {
    success: res.success,
    message: res.message,
    data: res.data,
    statusCode: res.statusCode,
    errors: res.errors,
  };
}

// ─── 5. Delete List ──────────────────────────────────

export async function deleteListAction(
  id: string,
): Promise<ListActionResult<void>> {
  const res = await globalRequest<void, void>({
    endpoint: API_ENDPOINTS.LISTS.delete(id),
    method: "DELETE",
    defaultErrorMessage: "Failed to delete list",
  });
  return {
    success: res.success,
    message: res.message,
    statusCode: res.statusCode,
    errors: res.errors,
  };
}

// ─── 6. Add Item To List ─────────────────────────────

export async function addItemToListAction(
  listId: string,
  data: AddItemDto,
): Promise<ListActionResult<ListItemResponseDto>> {
  const res = await globalRequest<AddItemDto, ListItemResponseDto>({
    endpoint: API_ENDPOINTS.LISTS.addItem(listId),
    method: "POST",
    body: data,
    defaultErrorMessage: "Failed to add item to list",
  });
  return {
    success: res.success,
    message: res.message,
    data: res.data,
    statusCode: res.statusCode,
    errors: res.errors,
  };
}

// ─── 7. Remove Item From List ────────────────────────

export async function removeItemFromListAction(
  listId: string,
  mediaType: string,
  tmdbId: number,
): Promise<ListActionResult<void>> {
  const res = await globalRequest<void, void>({
    endpoint: API_ENDPOINTS.LISTS.removeItem(listId, mediaType, tmdbId),
    method: "DELETE",
    defaultErrorMessage: "Failed to remove item from list",
  });
  return {
    success: res.success,
    message: res.message,
    statusCode: res.statusCode,
    errors: res.errors,
  };
}

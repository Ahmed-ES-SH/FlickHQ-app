// ─── Media Types ─────────────────────────────────────

export type MediaType = "movie" | "tv";

// ─── System List Keys ────────────────────────────────

export type SystemListKey = "favorites" | "watchlist" | "watched";

// ─── API Response DTOs ───────────────────────────────

export interface ListResponseDto {
  id: string;
  name: string;
  slug: string;
  listKey: string;
  isSystem: boolean;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ListItemResponseDto {
  id: string;
  mediaType: MediaType;
  tmdbId: number;
  title: string;
  posterPath: string | null;
  releaseDate: string | null;
  voteAverage: number | null;
  addedAt: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  lastPage: number;
}

export interface SingleListWithItems {
  list: ListResponseDto;
  items: PaginatedResult<ListItemResponseDto>;
}

// ─── Request Body DTOs ───────────────────────────────

export interface AddItemDto {
  mediaType: MediaType;
  tmdbId: number;
}

export interface CreateListDto {
  name: string;
  slug?: string;
}

export interface UpdateListDto {
  name?: string;
  slug?: string;
}

// ─── Local Store Types (with UI metadata) ────────────

export interface ListItemWithMeta extends ListItemResponseDto {
  _optimistic?: boolean;
  _error?: string;
}

export interface UserListWithMeta extends ListResponseDto {
  items?: ListItemWithMeta[];
  _loadingItems?: boolean;
  _error?: string;
  _itemActionLoading?: Record<string, boolean>;
}

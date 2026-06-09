# User Lists Module — Frontend Implementation Plan

> **Target:** Replace client-side localStorage list management with full backend API integration via the NestJS User Lists module. Use **Zustand** for state management, **Server Actions** for API calls, and deliver a polished UX with proper loading/error/success feedback.
>
> **List management UI lives under `/userpanal/*`** — this replaces the existing `app/profile/*` list pages. The `app/profile/*` routes will redirect to `/userpanal/*` equivalents OR be removed.
>
> **Status:** Planning phase — not yet implemented.

---

## Table of Contents

1. [Current State Analysis](#1-current-state-analysis)
2. [Architecture Overview](#2-architecture-overview)
3. [Route Design](#3-route-design)
4. [New Files To Create](#4-new-files-to-create)
5. [Files To Modify](#5-files-to-modify)
6. [Implementation Phases](#6-implementation-phases)
7. [Detailed State Management Design](#7-detailed-state-management-design)
8. [Component Integration Map](#8-component-integration-map)
9. [Loading & Error UX Patterns](#9-loading--error-ux-patterns)
10. [Profile → Userpanal Migration](#10-profile--userpanal-migration)
11. [API Endpoints Reference](#11-api-endpoints-reference)
12. [Data Migration Strategy](#12-data-migration-strategy)
13. [Testing Strategy](#13-testing-strategy)

---

## 1. Current State Analysis

### What exists today

| Aspect | Current State |
|--------|---------------|
| **State management** | React Context (`ListContext`) — no Zustand store exists for lists |
| **Storage** | `localStorage` only — no backend integration |
| **Lists managed** | 3 hardcoded lists: Favorites, Watchlist, Watched |
| **Server actions** | None for lists — only auth and user profile actions exist |
| **API endpoints config** | No `/lists` endpoints in `API_ENDPOINTS` |
| **TypeScript types** | No list-specific types defined |
| **"Add to List" UI** | Missing — `MediaActionBar` buttons are decorative only |
| **HeroSlider watchlist btn** | No `onClick` handler — does nothing |
| **Profile pages** | Read directly from `localStorage` (not from `ListContext`) — may be out of sync |

### Userpanal area (`/userpanal/*`)

| Page | Current State | Problem |
|------|---------------|---------|
| `/userpanal` (Overview) | Edit profile, security, mock recent watchlist, mock activity | Uses mock data |
| `/userpanal/watchlist` | Shows 6 mock items | **All mock data** — no real API integration |
| `/userpanal/watched` | Shows 6 mock items | **All mock data** — no real API integration |
| `/userpanal/favouritlist` | Shows 6 mock items | **All mock data** — no real API integration |
| `/userpanal/subscription` | Subscription plans with mock data | Separate concern (not in scope) |

The `userpanal` uses a **different `MediaCard`** (`_userpanal/MediaCard.tsx`) that takes a mock `MediaCardItem` type instead of the real `ShowType`. This card must be replaced with the real `MediaCard` (`_website/_movies/MediaCard.tsx`) that displays actual TMDB data.

### Profile area (`/profile/*`)

| Page | Current State | Action |
|------|---------------|--------|
| `/profile` | Real profile data (auth store) | Keep or merge into `/userpanal` |
| `/profile/watchlist` | Reads from `localStorage` key `watchList` | **Redirect** to `/userpanal/watchlist` |
| `/profile/watched` | Reads from `localStorage` key `watchedList` | **Redirect** to `/userpanal/watched` |
| `/profile/favouritlist` | Reads from `localStorage` key `favouritList` | **Redirect** to `/userpanal/favouritlist` |
| `/profile/layout.tsx` | Renders `Sidebar` component | Merge sidebar into userpanal sidebar |

### Components with list actions (all use `ListContext` / `localStorage` only)

| Component | List Action | File |
|-----------|-------------|------|
| `HeartIcon` | Add to Favorites | `app/_components/_website/_movies/HeartIcon.tsx` |
| `IconsCard` | Add to Watchlist / Watched | `app/_components/_website/_movies/IconsCard.tsx` |
| `MainBTNS` | Add to Watchlist / Watched | `app/_components/_client/movies/MainBTNS.tsx` |
| `CurrentSlideComponent` | Add to Watchlist / Watched | `app/_components/_client/CurrentSlideComponent.tsx` |
| `MediaActionBar` | **Decorative only** (no onClick) | `app/_components/_client/movies/MediaActionBar.tsx` |
| `HeroSlider` | **No onClick** on Watchlist button | `app/_components/_client/Sliders/HeroSlider.tsx` |

### Provider hierarchy (from `ClientLayout.tsx`)

```
QueryClientProvider
  └─ AuthBootstrap (hydrates authStore)
  └─ VaribalesProvider (UI state)
      └─ ListProvider (3 lists in localStorage)  ← TO BE REPLACED by Zustand store
          └─ DataProvider (genres data)
              └─ children
```

---

## 2. Architecture Overview

### Target Architecture

```
Server Actions (app/_actions/lists.ts)           ← "use server"
      │
      ▼
globalRequest()                                   ← HTTP calls to backend /lists/*
      │
      ▼
Zustand Store (app/_stores/listStore.ts)         ← Single source of truth
      │
      ├─▶ ListBootstrap (hydration on mount)     ← Fetches all lists from API
      │
      ├─▶ Mutation Components                    ← HeartIcon, IconsCard, MainBTNS, etc.
      │       │
      │       └─ Optimistic update → on success keep / on error revert
      │
      ├─▶ Userpanal List Pages                   ← /userpanal/watchlist, /watched, /favouritlist
      │       │
      │       └─ Read from store, show skeletons while loading
      │       └─ Use real ShowType-based MediaCard (not mock MediaCardItem)
      │
      └─▶ "Add to List" dropdown                 ← New: custom list picker
              │
              └─ Show all lists, toggle items on/off
```

### Data Flow

```
User clicks "Add to Favorites" on HeartIcon
  │
  ├─ 1. Check auth (useAuthStore.isAuthenticated)
  │      └─ Not authenticated → redirect to /signin with toast
  │
  ├─ 2. Optimistic update in Zustand store
  │      └─ Add item to local state immediately
  │      └─ Show loading state on the button
  │
  ├─ 3. Call server action: addItemToListAction(listId, { mediaType, tmdbId })
  │      └─ Server action calls globalRequest() → POST /lists/:id/items
  │
  ├─ 4. On success:
  │      └─ Keep the optimistic update
  │      └─ Show success toast
  │      └─ Clear loading state
  │
  └─ 5. On error:
         └─ Revert the optimistic update
         └─ Show error toast
         └─ Clear loading state
```

---

## 3. Route Design

### Final Route Map

| Route | Purpose | Data Source |
|-------|---------|-------------|
| `/userpanal` | Profile overview (edit name, avatar, security, recent activity) | Auth store + list store |
| `/userpanal/watchlist` | Watchlist items from the backend system list | Zustand store → API |
| `/userpanal/watched` | Watched items from the backend system list | Zustand store → API |
| `/userpanal/favouritlist` | Favorites items from the backend system list | Zustand store → API |
| `/userpanal/lists` | **NEW** — All custom lists with create/rename/delete | Zustand store → API |
| `/userpanal/lists/[id]` | **NEW** — Single custom list with its items | Zustand store → API |
| `/userpanal/subscription` | Subscription management (existing) | Separate module |

### Route Relationships

```
/userpanal                    ← Profile overview (existing, rewire recent activity)
  ├── /watchlist              ← System list: watchlist (was mock, now real API data)
  ├── /watched                ← System list: watched (was mock, now real API data)
  ├── /favouritlist           ← System list: favorites (was mock, now real API data)
  ├── /lists                  ← NEW: all custom lists management hub
  │     └── /lists/[id]       ← NEW: single custom list detail
  └── /subscription           ← Existing, no change
```

### Profile → Userpanal Redirection

The old `app/profile/*` list pages will redirect to `app/userpanal/*`:

```
/profile/watchlist     → 301 redirect to /userpanal/watchlist
/profile/watched       → 301 redirect to /userpanal/watched
/profile/favouritlist  → 301 redirect to /userpanal/favouritlist
```

This is done by replacing the page files with simple redirect components:

```typescript
// app/profile/watchlist/page.tsx
import { redirect } from 'next/navigation';
export default function () { redirect('/userpanal/watchlist'); }
```

The `/profile` root and `/profile/layout.tsx` can be kept for the profile overview if desired, or the entire profile route group can be redirected to `/userpanal`.

---

## 4. New Files To Create

### 4.1 Types — `app/types/lists.ts`

Response types from the Lists API:

```typescript
export type MediaType = 'movie' | 'tv';

export type SystemListKey = 'favorites' | 'watchlist' | 'watched';

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

// Request body types
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

// Local item with UI metadata (used in the store)
export interface ListItemWithMeta extends ListItemResponseDto {
  _optimistic?: boolean;
  _error?: string;
}

// Local list with items + UI metadata
export interface UserListWithMeta extends ListResponseDto {
  items?: ListItemWithMeta[];
  _loadingItems?: boolean;
  _error?: string;
  _itemActionLoading?: Record<string, boolean>;
}
```

### 4.2 API Endpoints — `app/constants/apis.tsx` (add to existing `API_ENDPOINTS`)

```typescript
LISTS: {
  base: "/lists",
  create: "/lists",
  getAll: "/lists",
  getById: (id: string) => `/lists/${id}`,
  update: (id: string) => `/lists/${id}`,
  delete: (id: string) => `/lists/${id}`,
  addItem: (listId: string) => `/lists/${listId}/items`,
  removeItem: (listId: string, mediaType: string, tmdbId: number) =>
    `/lists/${listId}/items/${mediaType}/${tmdbId}`,
},
```

### 4.3 Server Actions — `app/_actions/lists.ts`

7 server actions mirroring the backend API:

| Action | Method | Endpoint |
|--------|--------|----------|
| `createListAction(data)` | POST | `/lists` |
| `getAllListsAction(params?)` | GET | `/lists` |
| `getListByIdAction(id, params?)` | GET | `/lists/:id` |
| `updateListAction(id, data)` | PATCH | `/lists/:id` |
| `deleteListAction(id)` | DELETE | `/lists/:id` |
| `addItemToListAction(listId, data)` | POST | `/lists/:id/items` |
| `removeItemFromListAction(listId, mediaType, tmdbId)` | DELETE | `/lists/:id/items/:mediaType/:tmdbId` |

All use `globalRequest()` which automatically forwards the auth cookie.

### 4.4 Zustand Store — `app/_stores/listStore.ts`

Full design in [Section 7](#7-detailed-state-management-design).

### 4.5 Bootstrap Component — `app/_components/_client/lists/ListBootstrap.tsx`

A client component (renders `null`) that:
1. Checks `useAuthStore.isAuthenticated`
2. If authenticated: calls `getAllListsAction()`, hydrates the Zustand store
3. If unauthenticated: loads from `localStorage` (fallback compatibility)
4. Handles localStorage→API data migration (see [Section 12](#12-data-migration-strategy))

### 4.6 Add To List Dropdown — `app/_components/_client/lists/AddToListDropdown.tsx`

A popover/dropdown that:
- Lists all user lists (system + custom) with checkboxes
- Shows which lists the current media item is already in
- Allows toggling items on/off with optimistic updates
- Includes "Create New List" button at the bottom
- Shows loading spinners per list during add/remove

### 4.7 Create List Modal — `app/_components/_client/lists/CreateListModal.tsx`

A modal form for creating a new custom list:
- Name field (required, max 80 chars)
- Slug field (optional, auto-generated from name)
- Validation errors displayed inline
- Loading state on submit button

### 4.8 List Action Button — `app/_components/_client/lists/ListActionButton.tsx`

Reusable button component with visual states:
- **Idle**: Normal icon/button
- **Loading**: Spinning loader replacing icon
- **Success**: Brief checkmark animation
- **Error**: Shake animation + fallback to idle

### 4.9 Userpanal List Pages (rewrites)

| Page | File | What changes |
|------|------|--------------|
| Watchlist | `app/userpanal/watchlist/page.tsx` | Replace mock data → real data from Zustand store |
| Watched | `app/userpanal/watched/page.tsx` | Replace mock data → real data from Zustand store |
| Favorites | `app/userpanal/favouritlist/page.tsx` | Replace mock data → real data from Zustand store |
| My Lists (NEW) | `app/userpanal/lists/page.tsx` | Show all custom lists with CRUD |
| List Detail (NEW) | `app/userpanal/lists/[id]/page.tsx` | Show single custom list items |

### 4.10 Loading Skeleton — `app/_components/_globalComponents/ListSkeleton.tsx`

Grid skeleton for loading states on userpanal list pages.

### 4.11 Empty State — `app/_components/_globalComponents/ListEmptyState.tsx`

Empty state component with tailored messages per list type.

---

## 5. Files To Modify

### 5.1 Core / Structural Changes

| File | What to Change |
|------|----------------|
| `app/constants/apis.tsx` | Add `LISTS` section to `API_ENDPOINTS` |
| `app/context/ListContext.tsx` | **Deprecate** — keep as fallback for unauthenticated users. Consumers transition to Zustand store. |
| `app/types/ContextType.ts` | Add new list-related types (or remove `ListContextType` after full migration) |
| `app/_components/_globalComponents/ClientLayout.tsx` | Add `ListBootstrap` component after `AuthBootstrap` |

### 5.2 Component Updates (List Actions)

These components currently call `useList()` (ListContext). They must be updated to use `useListStore()` (Zustand) and call server actions:

| Component | File | What to Change |
|-----------|------|----------------|
| `HeartIcon` | `app/_components/_website/_movies/HeartIcon.tsx` | Replace `useList()` → `useListStore()`, call `addItemToListAction` / `removeItemFromListAction`, show loading with `ListActionButton` |
| `IconsCard` | `app/_components/_website/_movies/IconsCard.tsx` | Same transition — Watchlist & Watched buttons |
| `MainBTNS` | `app/_components/_client/movies/MainBTNS.tsx` | Same transition |
| `CurrentSlideComponent` | `app/_components/_client/CurrentSlideComponent.tsx` | Same transition |
| `MediaActionBar` | `app/_components/_client/movies/MediaActionBar.tsx` | Wire up Watchlist, Favorites, and Playlist buttons with actual handlers + loading states |
| `HeroSlider` | `app/_components/_client/Sliders/HeroSlider.tsx` | Add `onClick` to Watchlist button that calls store action |
| `MediaCommentsAndReviews` | `app/_components/_client/movies/MediaCommentsAndReviews.tsx` | Pass `media` prop to `MediaActionBar` so it can perform list actions |

### 5.3 Userpanal Sidebar

| File | What to Change |
|------|----------------|
| `app/_components/_website/_userpanal/UserPanelSidebar.tsx` | Add "My Lists" nav item pointing to `/userpanal/lists` |

### 5.4 Userpanal MediaCard

| File | What to Change |
|------|----------------|
| `app/_components/_website/_userpanal/MediaCard.tsx` | **Deprecate** — replace usage with `_website/_movies/MediaCard.tsx` (the real TMDB-backed card). The `MediaCardItem` type becomes unused. |

### 5.5 Profile → Userpanal Redirects

| Old File | Action |
|----------|--------|
| `app/profile/watchlist/page.tsx` | Replace with redirect to `/userpanal/watchlist` |
| `app/profile/watched/page.tsx` | Replace with redirect to `/userpanal/watched` |
| `app/profile/favouritlist/page.tsx` | Replace with redirect to `/userpanal/favouritlist` |

### 5.6 Userpanal Overview Page

| File | What to Change |
|------|----------------|
| `app/userpanal/page.tsx` | Replace the "Recent Watchlist" mock section with real data from the Zustand store. Replace the "Recent Activity" mock section with real list activity. |

### 5.7 Movie/Show Detail Pages

| File | What to Change |
|------|----------------|
| `app/movies/[movie]/page.tsx` | Pass the movie data to `MediaCommentsAndReviews` for list actions (`MediaActionBar` needs the media object) |
| `app/shows/[title]/page.tsx` | Pass show data to `ShowDetails` → eventually to `MediaActionBar` |

---

## 6. Implementation Phases

### Phase 1 — Foundation (Day 1)

**Goal:** Set up the core infrastructure without breaking existing functionality.

| Step | Task | Files |
|------|------|-------|
| 1.1 | Create list TypeScript types | `app/types/lists.ts` |
| 1.2 | Add `LISTS` endpoints to `API_ENDPOINTS` | `app/constants/apis.tsx` |
| 1.3 | Create server actions for all 7 list operations | `app/_actions/lists.ts` |
| 1.4 | Create Zustand store (`useListStore`) | `app/_stores/listStore.ts` |
| 1.5 | Create `ListBootstrap` component | `app/_components/_client/lists/ListBootstrap.tsx` |
| 1.6 | Add `ListBootstrap` to `ClientLayout` | `app/_components/_globalComponents/ClientLayout.tsx` |
| 1.7 | Write tests for server actions | `app/_actions/__tests__/lists.test.ts` |
| 1.8 | Write tests for Zustand store | `app/_stores/__tests__/listStore.test.ts` |

**Risks & Mitigation:**
- Existing `ListContext` remains untouched — zero risk to current functionality
- New store and server actions are purely additive

### Phase 2 — Component Migration (Day 2–3)

**Goal:** Transition all existing list action components from `ListContext` to `useListStore`.

| Step | Task | Details |
|------|------|---------|
| 2.1 | Create `ListActionButton` component | Reusable button with loading/error/success states |
| 2.2 | Update `HeartIcon` | Replace `useList()` with `useListStore()`, call server actions, show loading |
| 2.3 | Update `IconsCard` | Same transition |
| 2.4 | Update `MainBTNS` | Same transition |
| 2.5 | Update `CurrentSlideComponent` | Same transition |
| 2.6 | Wire up `MediaActionBar` | Add `media` prop, wire Watchlist/Favorites/Playlist buttons |
| 2.7 | Wire up `HeroSlider` Watchlist button | Add `onClick` handler |
| 2.8 | Update `MediaCommentsAndReviews` | Pass `media` prop down to `MediaActionBar` |

**Key Design Decision — Dual Mode (Authenticated vs Guest):**
During Phase 2, each component checks `useAuthStore.isAuthenticated`:
- **Authenticated:** Use server action + Zustand store
- **Not authenticated:** Fall back to `localStorage` (`ListContext`) with toast "Sign in to sync your lists"

This ensures the app works for both logged-in and logged-out users.

**Rollback Plan:**
If server actions fail, each component catches the error and falls back to `ListContext` automatically. The `ListContext` is NOT removed until Phase 5 is complete and stable.

### Phase 3 — Userpanal List Pages (Day 3–4)

**Goal:** Replace mock data on all three userpanal list pages with real API-backed data. Use the real `ShowType`-based `MediaCard` from `_website/_movies/MediaCard.tsx`.

| Step | Task | Details |
|------|------|---------|
| 3.1 | Rewrite `userpanal/watchlist/page.tsx` | Fetch from store → show skeleton while loading → render `MediaCard` grid → empty state → remove item with confirmation |
| 3.2 | Rewrite `userpanal/watched/page.tsx` | Same pattern |
| 3.3 | Rewrite `userpanal/favouritlist/page.tsx` | Same pattern |
| 3.4 | Create `ListSkeleton` component | Grid of animated placeholder cards |
| 3.5 | Create `ListEmptyState` component | Tailored messages per list type |
| 3.6 | Update userpanal overview page | Replace mock "Recent Watchlist" with real data |
| 3.7 | Deprecate `_userpanal/MediaCard.tsx` | Remove imports, use `_website/_movies/MediaCard.tsx` everywhere |
| 3.8 | Add `loading.tsx` for each userpanal list page | `app/userpanal/watchlist/loading.tsx`, etc. |
| 3.9 | Add `error.tsx` for userpanal list pages | `app/userpanal/watchlist/error.tsx`, etc. |

#### Detailed page structure for each list page:

```typescript
// app/userpanal/watchlist/page.tsx
'use client';

import { useEffect } from 'react';
import { useListStore } from '@/app/_stores/listStore';
import { useAuthStore } from '@/app/_stores/authStore';
import { MediaCard } from '@/app/_components/_website/_movies/MediaCard';
import { ListSkeleton } from '@/app/_components/_globalComponents/ListSkeleton';
import { ListEmptyState } from '@/app/_components/_globalComponents/ListEmptyState';
import { useData } from '@/app/context/DataContext';
import { toast } from 'sonner';

export default function WatchlistPage() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const list = useListStore(s => s.getSystemList('watchlist'));
  const isLoadingItems = useListStore(s => s.isLoadingItems[list?.id || '']);
  const fetchListItems = useListStore(s => s.fetchListItems);
  const removeItem = useListStore(s => s.removeItem);
  const { genres, genres_Shows } = useData();

  useEffect(() => {
    if (isAuthenticated && list?.id && !list.items) {
      fetchListItems(list.id, { perPage: 50 });
    }
  }, [isAuthenticated, list?.id, fetchListItems]);

  if (!isAuthenticated) {
    return <SignInPrompt />;
  }

  if (isLoadingItems || !list?.items) {
    return <ListSkeleton count={8} />;
  }

  if (list.items.length === 0) {
    return (
      <ListEmptyState
        type="watchlist"
        title="Your watchlist is empty"
        description="Add movies and shows you want to watch later."
        actionLabel="Browse Movies"
        actionHref="/movies"
      />
    );
  }

  const handleRemove = async (item: ListItemWithMeta) => {
    const confirmed = window.confirm(`Remove "${item.title}" from Watchlist?`);
    if (!confirmed) return;
    const success = await removeItem(list.id, item.mediaType, item.tmdbId);
    if (success) toast.success('Removed from watchlist');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">My Watchlist</h1>
        <span className="text-sm text-second_text">{list.itemCount} items</span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {list.items.map((item, index) => {
          // Convert ListItemResponseDto -> ShowType for MediaCard
          const media = convertToShowType(item);
          const matchedGenres = matchGenres(media, genres, genres_Shows);
          return (
            <div key={item.tmdbId} className="relative group">
              <MediaCard media={media} genres={matchedGenres} index={index} />
              <button
                onClick={() => handleRemove(item)}
                className="absolute top-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500/80 text-white p-2 rounded-lg hover:bg-red-600"
                aria-label={`Remove ${item.title}`}
              >
                <LuX className="size-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

### Phase 4 — Custom Lists (Day 4–5)

**Goal:** Add custom list support — create, rename, delete lists, and an "Add to List" picker on media detail pages.

| Step | Task | Details |
|------|------|---------|
| 4.1 | Create `AddToListDropdown` | Popover with all lists, checkboxes, toggle on/off |
| 4.2 | Create `CreateListModal` | Form: name (required) + slug (optional) |
| 4.3 | Add "Add to List" button to `MediaActionBar` | Opens dropdown, replaces the current decorative Playlist button |
| 4.4 | Create `/userpanal/lists` page | Shows all custom lists in a grid with create/rename/delete |
| 4.5 | Create `/userpanal/lists/[id]` page | Shows items in a single custom list |
| 4.6 | Update `UserPanelSidebar` | Add "My Lists" nav item |
| 4.7 | Wire custom lists into the Zustand store | Full CRUD via server actions |

### Phase 5 — Polish & Stabilize (Day 5–6)

**Goal:** Error handling, edge cases, performance, testing.

| Step | Task |
|------|------|
| 5.1 | Add optimistic update rollback for all mutations |
| 5.2 | Handle 401 errors → redirect to signin |
| 5.3 | Handle 503 (TMDB unavailable) gracefully |
| 5.4 | Add `Suspense` boundaries for list loading |
| 5.5 | Add `error.tsx` boundary for userpanal list pages |
| 5.6 | Thorough testing of all new server actions |
| 5.7 | Thorough testing of the Zustand store |
| 5.8 | Remove `ListContext` and `ListProvider` (after confirming stability) |
| 5.9 | Remove `_userpanal/MediaCard.tsx` and `MediaCardItem` type |
| 5.10 | Handle localStorage data migration (import existing data to backend on first login) |

---

## 7. Detailed State Management Design

### 7.1 Zustand Store — `useListStore`

```typescript
'use client';

import { create } from 'zustand';
import type {
  ListResponseDto,
  ListItemResponseDto,
  ListItemWithMeta,
  UserListWithMeta,
  AddItemDto,
  MediaType,
} from '@/app/types/lists';
import * as listActions from '@/app/_actions/lists';

interface ListState {
  // ── Data ──────────────────────────────────────────────────────────
  /** All user lists (system + custom), indexed by id for O(1) lookup */
  listsById: Record<string, UserListWithMeta>;
  /** Ordered list of list IDs (system first, then custom by creation date) */
  listIds: string[];

  // ── Global Loading States ─────────────────────────────────────────
  /** True while initializing (fetching all lists on mount) */
  isInitialized: boolean;
  /** True while fetching lists */
  isLoadingLists: boolean;
  /** Per-list item loading (listId -> true/false) */
  isLoadingItems: Record<string, boolean>;

  // ── Error States ──────────────────────────────────────────────────
  /** Global error message */
  error: string | null;

  // ── Item Presence Maps (O(1) lookup) ──────────────────────────────
  favoritesItemsMap: Record<number, boolean>;   // tmdbId -> in favorites
  watchlistItemsMap: Record<number, boolean>;   // tmdbId -> in watchlist
  watchedItemsMap: Record<number, boolean>;     // tmdbId -> in watched
  customListItemsMap: Record<string, Record<number, boolean>>; // listId -> tmdbId -> present

  // ── Actions ───────────────────────────────────────────────────────

  /** Initialize: fetch all lists from API */
  initialize: () => Promise<void>;

  /** Fetch all user lists (lightweight — no items) */
  fetchLists: () => Promise<void>;

  /** Fetch items for a specific list */
  fetchListItems: (listId: string, params?: {
    page?: number;
    perPage?: number;
    mediaType?: MediaType;
    sortBy?: string;
    order?: 'ASC' | 'DESC';
  }) => Promise<void>;

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

  // ── Convenience Selectors ─────────────────────────────────────────
  getSystemList: (key: 'favorites' | 'watchlist' | 'watched') => UserListWithMeta | undefined;
  getListById: (id: string) => UserListWithMeta | undefined;
  getAllLists: () => UserListWithMeta[];
  getCustomLists: () => UserListWithMeta[];

  /** Check if a tmdbId exists in a given list */
  isInList: (listId: string, tmdbId: number) => boolean;
  isFavorite: (tmdbId: number) => boolean;
  isInWatchlist: (tmdbId: number) => boolean;
  isWatched: (tmdbId: number) => boolean;
}
```

### 7.2 Store Initialization Flow

```
App mounts
  │
  ├─ AuthBootstrap hydrates useAuthStore
  │
  ├─ ListBootstrap checks useAuthStore.isAuthenticated
  │    │
  │    ├─ AUTHENTICATED:
  │    │    ├─ Set isLoadingLists = true
  │    │    ├─ Call getAllListsAction()
  │    │    │    ├─ Success: hydrate listsById, listIds, itemsMaps
  │    │    │    └─ Error: show toast, fall back to localStorage
  │    │    ├─ Set isLoadingLists = false, isInitialized = true
  │    │    └─ Trigger localStorage migration (see Section 12)
  │    │
  │    └─ NOT AUTHENTICATED:
  │         ├─ Load from localStorage (existing ListContext behavior)
  │         ├─ Set isInitialized = true
  │         └─ Done
  │
  └─ Ready for user interactions
```

### 7.3 Optimistic Update Pattern

Every mutation follows this exact pattern:

```typescript
async function addItem(listId: string, data: AddItemDto) {
  const state = get();

  // 1. Check if already in list (idempotent — API always returns 201)
  if (state.isInList(listId, data.tmdbId)) {
    return true; // Already there, no action needed
  }

  // 2. Save previous state for rollback
  const previousItems = state.listsById[listId]?.items;
  const previousCount = state.listsById[listId]?.itemCount ?? 0;

  // 3. Optimistic update — add temporary item
  const tempItem: ListItemWithMeta = {
    id: `optimistic-${Date.now()}`,
    mediaType: data.mediaType,
    tmdbId: data.tmdbId,
    title: '', // Will be updated from server response
    posterPath: null,
    releaseDate: null,
    voteAverage: null,
    addedAt: new Date().toISOString(),
    _optimistic: true,
  };

  // Update the items map and list
  updateItemsMap(listId, data.tmdbId, true);
  updateListItems(listId, items => [...(items || []), tempItem]);
  updateListCount(listId, previousCount + 1);

  // 4. Call server action
  const result = await listActions.addItemToListAction(listId, data);

  if (result.success && result.data) {
    // 5. Replace optimistic item with real data from server
    updateListItems(listId, items =>
      items?.map(item =>
        item._optimistic && item.tmdbId === data.tmdbId
          ? { ...result.data!, _optimistic: false }
          : item
      ) ?? []
    );
    return true;
  } else {
    // 6. ROLLBACK on error
    updateItemsMap(listId, data.tmdbId, false);
    updateListItems(listId, () => previousItems || []);
    updateListCount(listId, previousCount);
    return false;
  }
}
```

### 7.4 Item Presence Maps

For O(1) lookup of whether a media item is in a list — critical for rendering heart filled/unfilled, watchlist checkmark, etc.:

```typescript
// Derived maps in the store
favoritesItemsMap: Record<number, boolean>   // tmdbId -> true
watchlistItemsMap: Record<number, boolean>   // tmdbId -> true
watchedItemsMap: Record<number, boolean>     // tmdbId -> true
customListItemsMap: Record<string, Record<number, boolean>>  // listId -> tmdbId -> true
```

These are updated on:
- Store hydration (from API response)
- After every successful add/remove
- On optimistic add/remove
- On rollback

This means checking `useListStore(s => s.isFavorite(tmdbId))` is an **O(1) operation** — no array iteration.

---

## 8. Component Integration Map

### 8.1 HeartIcon — Favorites Toggle

```typescript
// app/_components/_website/_movies/HeartIcon.tsx
'use client';

import { useListStore } from '@/app/_stores/listStore';
import { useAuthStore } from '@/app/_stores/authStore';
import { useRouter } from 'next/navigation';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { ListActionButton } from '@/app/_components/_client/lists/ListActionButton';

interface Props { media: ShowType; size?: string; }

export default function HeartIcon({ media, size = 'size-5' }: Props) {
  const router = useRouter();
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const isFavorite = useListStore(s => s.isFavorite(media.id));
  const addItem = useListStore(s => s.addItem);
  const removeItem = useListStore(s => s.removeItem);
  const systemListId = useListStore(s => s.getSystemList('favorites')?.id);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info('Sign in to save favorites');
      router.push('/signin');
      return;
    }

    if (!systemListId) {
      toast.error('Favorites list not found');
      return;
    }

    const mediaType = (media.media_type || (media.title ? 'movie' : 'tv')) as MediaType;

    if (isFavorite) {
      const success = await removeItem(systemListId, mediaType, media.id);
      if (success) toast.success('Removed from favorites');
    } else {
      const success = await addItem(systemListId, { mediaType, tmdbId: media.id });
      if (success) toast.success('Added to favorites');
    }
  };

  return (
    <button
      onClick={handleToggle}
      className="flex items-center justify-center w-11 h-11 bg-black/40 backdrop-blur-md border border-white/10 hover:border-accent/50 hover:bg-accent/20 rounded-xl cursor-pointer group/heart transition-all duration-300 shadow-xl"
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      {isFavorite ? (
        <FaHeart className={`${size} text-accent`} />
      ) : (
        <FaRegHeart className={`${size} text-gray-300 group-hover/heart:text-accent`} />
      )}
    </button>
  );
}
```

### 8.2 MediaActionBar — All List Actions

The Playlist button becomes an "Add to List" button that opens the `AddToListDropdown`:

```typescript
// Updated MediaActionBar.tsx
interface Props {
  media: ShowType;
  onOpenComments: () => void;
}

export default function MediaActionBar({ media, onOpenComments }: Props) {
  const isFavorite = useListStore(s => s.isFavorite(media.id));
  const isInWatchlist = useListStore(s => s.isInWatchlist(media.id));
  const [showPlaylist, setShowPlaylist] = useState(false);

  const ACTIONS = [
    {
      icon: isInWatchlist ? IoCheckmark : IoAdd,
      label: 'Watchlist',
      onClick: handleToggleWatchlist,
      active: isInWatchlist,
    },
    {
      icon: isFavorite ? IoHeart : IoHeartOutline,
      label: 'Favorites',
      onClick: handleToggleFavorites,
      active: isFavorite,
    },
    {
      icon: IoList,
      label: 'Playlist',
      onClick: () => setShowPlaylist(true),
      dropdown: true,
    },
    { icon: IoShareSocial, label: 'Share', onClick: handleShare },
  ];
  // ...
}
```

### 8.3 HeroSlider — Watchlist Button

```typescript
// In HeroSlider.tsx, the Watchlist button receives real functionality:
const mediaType = movie.media_type || (movie.title ? 'movie' : 'tv');
const isInList = useListStore(s => s.isInWatchlist(movie.id));
const watchlistId = useListStore(s => s.getSystemList('watchlist')?.id);

const handleWatchlist = async () => {
  if (!isAuthenticated) {
    toast.info('Sign in to use watchlist');
    router.push('/signin');
    return;
  }
  if (!watchlistId) return;

  if (isInList) {
    await removeItem(watchlistId, mediaType, movie.id);
    toast.success('Removed from watchlist');
  } else {
    await addItem(watchlistId, { mediaType: mediaType as MediaType, tmdbId: movie.id });
    toast.success('Added to watchlist');
  }
};

// In the JSX:
<button onClick={handleWatchlist} className="...">
  {isInList ? <IoCheckmark /> : <FaPlus />}
  <span>{isInList ? 'In Watchlist' : 'Watchlist'}</span>
</button>
```

### 8.4 Userpanal List Pages

Each userpanal list page follows this pattern:

```
1. Check authentication → show SignInPrompt if not authenticated
2. Fetch list items from store (triggered in useEffect)
3. Show ListSkeleton while loading
4. Show ListEmptyState if no items
5. Render MediaCard grid with real ShowType data
6. Add remove button (with confirmation dialog) per item
7. Show toast feedback for all operations
```

---

## 9. Loading & Error UX Patterns

### 9.1 Button Loading States

Every actionable button (HeartIcon, Watchlist toggle, etc.) has 4 visual states:

| State | Visual |
|-------|--------|
| **Idle (not in list)** | Default icon + color |
| **Idle (in list)** | Filled/active icon + accent color |
| **Loading** | Spinning loader replacing the icon |
| **Error** | Brief shake animation + toast, then revert to idle |

### 9.2 Skeleton Loading

```typescript
// app/_components/_globalComponents/ListSkeleton.tsx
export function ListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="aspect-[2/3] rounded-xl bg-panel_bg animate-pulse overflow-hidden">
          <div className="w-full h-full bg-white/5 rounded-xl" />
        </div>
      ))}
    </div>
  );
}
```

### 9.3 Empty States

| List Type | Title | Description | Action |
|-----------|-------|-------------|--------|
| **Favorites** | "No favorites yet" | "Browse movies and TV shows and tap the heart icon to save your favorites." | "Browse Movies" → /movies |
| **Watchlist** | "Your watchlist is empty" | "Add movies and shows you want to watch later." | "Browse Movies" → /movies |
| **Watched** | "Nothing watched yet" | "You haven't marked anything as watched." | "Browse Movies" → /movies |
| **Custom list** | "This list is empty" | "Add items from movie and show pages." | "Browse Movies" → /movies |

### 9.4 Error States

| Error | UX Handling |
|-------|-------------|
| **401 Unauthorized** | Token expired → redirect to `/signin`, show toast "Session expired" |
| **403 Forbidden** | Shouldn't happen in normal flow (system list actions are hidden). Show toast + log. |
| **404 Not Found** | List or item not found → show toast, remove from local state |
| **409 Conflict** | Slug already taken → show inline validation on create list form |
| **503 TMDB Unavailable** | Show toast "Media service temporarily unavailable. Please try again later." |
| **Network error** | Show toast "Network error. Check your connection." Keep optimistic update with retry option |

### 9.5 Toast Notifications

Using `sonner` (already in the project):

| Event | Toast Type | Message |
|-------|-----------|---------|
| Add to list success | `success` | "Added to [list name]" |
| Remove from list success | `info` | "Removed from [list name]" |
| Already in list | `info` | "Already in this list" |
| Add to list error | `error` | "Failed to add. [details]" |
| Remove error | `error` | "Failed to remove. [details]" |
| Auth required | `info` | "Sign in to save to lists" |
| List created | `success` | "List created successfully" |
| List deleted | `success` | "[Name] deleted" |
| Lists synced | `success` | "Your lists have been synced" |

---

## 10. Profile → Userpanal Migration

### What changes for the user

| Old Route | New Route | What happens to old data |
|-----------|-----------|--------------------------|
| `/profile/watchlist` | `/userpanal/watchlist` | localStorage data migrated to backend API on first sign-in |
| `/profile/watched` | `/userpanal/watched` | localStorage data migrated to backend API on first sign-in |
| `/profile/favouritlist` | `/userpanal/favouritlist` | localStorage data migrated to backend API on first sign-in |
| `/profile` | `/userpanal` (or kept as is) | Profile overview remains or redirects |

### Redirect Implementation

```typescript
// app/profile/watchlist/page.tsx
import { redirect } from 'next/navigation';
export default function OldWatchlistPage() {
  redirect('/userpanal/watchlist');
}
```

### Sidebar Update

The `UserPanelSidebar` already handles navigation for the 3 system lists. We add:

```typescript
const navItems = [
  { label: "Overview",      href: "/userpanal",              icon: LuUser },
  { label: "Watched",       href: "/userpanal/watched",      icon: LuEye },
  { label: "Watchlist",     href: "/userpanal/watchlist",    icon: LuBookmark },
  { label: "Favorites",     href: "/userpanal/favouritlist", icon: LuHeart },
  { label: "My Lists",      href: "/userpanal/lists",        icon: LuList},   // ← NEW
  { label: "Subscription",  href: "/userpanal/subscription", icon: LuRadio },
];
```

### MediaCard Replacement

The `_userpanal/MediaCard.tsx` (mock data, `MediaCardItem` type) is replaced by `_website/_movies/MediaCard.tsx` (real TMDB data, `ShowType` type) on all userpanal list pages.

```typescript
// Convert ListItemResponseDto -> ShowType for MediaCard
function convertToShowType(item: ListItemResponseDto): ShowType {
  return {
    id: item.tmdbId,
    title: item.title,
    name: item.mediaType === 'tv' ? item.title : '',
    poster_path: item.posterPath || '',
    release_date: item.releaseDate || '',
    first_air_date: item.mediaType === 'tv' ? item.releaseDate || '' : '',
    vote_average: item.voteAverage || 0,
    // ... other fields with safe defaults
  } as ShowType;
}
```

---

## 11. API Endpoints Reference

| Method | Endpoint | Server Action | Purpose |
|--------|----------|---------------|---------|
| `POST` | `/lists` | `createListAction` | Create custom list |
| `GET` | `/lists` | `getAllListsAction` | Get all user lists (paginated) |
| `GET` | `/lists/:id` | `getListByIdAction` | Get single list + items |
| `PATCH` | `/lists/:id` | `updateListAction` | Rename/re-slug custom list |
| `DELETE` | `/lists/:id` | `deleteListAction` | Delete custom list + items |
| `POST` | `/lists/:id/items` | `addItemToListAction` | Add item (idempotent, always `201`) |
| `DELETE` | `/lists/:id/items/:mediaType/:tmdbId` | `removeItemFromListAction` | Remove item |

**Key behavioral notes:**
- All endpoints require auth JWT cookie (`flick_auth_token`) — forwarded automatically by `globalRequest`
- `addItem` is idempotent: if the item already exists, returns existing item with `201` (no error)
- System lists (`isSystem: true`) cannot be updated or deleted — `403 Forbidden`
- The backend sorts system lists first (`isSystem DESC`, then `createdAt DESC`)

---

## 12. Data Migration Strategy

Users currently have data only in `localStorage`. When they sign in, we migrate their existing data to the backend.

### Migration Flow

```
User signs in
  │
  ├─ ListBootstrap detects authenticated state
  │
  ├─ Check localStorage for existing list data
  │    ├─ Read keys: favouritList, watchedList, watchList
  │    │
  │    └─ If any data exists:
  │         ├─ Show toast: "Syncing your local lists..."
  │         │
  │         ├─ Get system list IDs from the API response
  │         │    favorites_id, watchlist_id, watched_id
  │         │
  │         ├─ For each item in favouritList:
  │         │    POST /lists/:favoritesId/items { mediaType, tmdbId }
  │         │
  │         ├─ For each item in watchList:
  │         │    POST /lists/:watchlistId/items { mediaType, tmdbId }
  │         │
  │         ├─ For each item in watchedList:
  │         │    POST /lists/:watchedId/items { mediaType, tmdbId }
  │         │
  │         ├─ On completion:
  │         │    ├─ Clear localStorage keys
  │         │    ├─ Re-fetch all lists from API
  │         │    └─ Show success toast: "Your lists are synced!"
  │         │
  │         └─ On error:
  │              └─ Keep localStorage data, log error, show toast
  │
  └─ Done
```

### Migration Safeguards

- **Idempotency:** `POST /lists/:id/items` returns existing item if already present — duplicate uploads are harmless
- **Batching:** If the user has 100+ items, batch them in groups of 10 with `Promise.allSettled`
- **Abort safety:** If migration is interrupted, it safely continues next time (already synced items are skipped due to idempotency)

---

## 13. Testing Strategy

### 13.1 Unit Tests — Server Actions (`app/_actions/__tests__/lists.test.ts`)

| Test Case | What It Verifies |
|-----------|------------------|
| `createListAction` success | Calls `globalRequest` with correct endpoint, method, body |
| `createListAction` validation error | Handles 400 response correctly |
| `createListAction` slug conflict | Handles 409 response correctly |
| `getAllListsAction` with pagination | Passes query params correctly |
| `getAllListsAction` without params | Uses defaults (page=1, perPage=50) |
| `getListByIdAction` | Calls correct URL, returns typed response |
| `getListByIdAction` with filters | Passes mediaType, sortBy, order params |
| `updateListAction` success | PATCH with correct body |
| `updateListAction` 403 (system list) | Handles forbidden error |
| `deleteListAction` success | DELETE with correct URL |
| `deleteListAction` 403 | Handles system list deletion attempt |
| `addItemToListAction` success | POST with correct body, returns ListItemResponseDto |
| `addItemToListAction` 404 | Handles list not found |
| `addItemToListAction` 503 | Handles TMDB unavailable |
| `removeItemFromListAction` | DELETE with URL-encoded params |
| `removeItemFromListAction` 404 | Handles item not found |

### 13.2 Unit Tests — Zustand Store (`app/_stores/__tests__/listStore.test.ts`)

| Test Case | What It Verifies |
|-----------|------------------|
| Initial state is correct | Empty lists, not initialized, no error |
| `initialize` fetches lists | Calls `getAllListsAction`, populates `listsById` |
| `initialize` handles error | Sets error state, isInitialized=false |
| `addItem` optimistic update | Item appears immediately in state |
| `addItem` success | Optimistic item replaced with server data |
| `addItem` rollback | State restored to previous on error |
| `removeItem` optimistic update | Item removed immediately |
| `removeItem` rollback | Item restored on error |
| `isInList` returns correct boolean | O(1) lookup works |
| `isFavorite` / `isInWatchlist` / `isWatched` | Convenience selectors work |
| `createList` adds new list | List appears in state |
| `deleteList` removes list | List disappears from state |
| `getSystemList` returns correct list | Lookup by key works |
| `getCustomLists` filters correctly | Only non-system lists returned |

### 13.3 Component Tests

| Component | Tests |
|-----------|-------|
| `HeartIcon` | Renders filled/outline based on `isFavorite`, calls add/remove, shows loading state, redirects if unauthenticated |
| `ListActionButton` | Renders loading spinner, success state auto-clears, error state shows shake |
| `AddToListDropdown` | Lists all user lists, shows checkmark for items already in list, toggles on/off |
| `CreateListModal` | Validates name, shows slug conflict error, calls create action |

### 13.4 Integration / E2E Tests

| Flow | Steps |
|------|-------|
| Add to favorites from MediaCard | Click heart → toast success → heart fills red → navigate to `/userpanal/favouritlist` → item appears |
| Remove from favorites | Click filled heart → toast → heart outline → navigate to `/userpanal/favouritlist` → item gone |
| Add to watchlist from HeroSlider | Click Watchlist → toast → navigate to `/userpanal/watchlist` → item appears |
| Create custom list | Navigate to `/userpanal/lists` → click "Create" → enter name → submit → list appears |
| Delete custom list | Click delete on custom list → confirm → list removed → items no longer in dropdown |
| Add to custom list from movie page | Click "Add to List" → select custom list → toast → navigate to list → item appears |
| Sign in with localStorage data | Existing items auto-synced → localStorage cleared → items visible in `/userpanal/*` |
| Old profile URLs redirect | `/profile/watchlist` → 301 → `/userpanal/watchlist` |
| Unauthenticated user clicks add | Redirect to `/signin` with toast |

---

## Appendix A: Dependency Graph

```
Lists Module Implementation
│
├── Phase 1: Foundation (no deps)
│   ├── types/lists.ts
│   ├── constants/apis.tsx (LISTS section)
│   ├── _actions/lists.ts
│   ├── _stores/listStore.ts
│   ├── _components/_client/lists/ListBootstrap.tsx
│   └── _components/_globalComponents/ClientLayout.tsx (add ListBootstrap)
│
├── Phase 2: Component Migration (depends on Phase 1)
│   ├── _components/_client/lists/ListActionButton.tsx
│   ├── _components/_website/_movies/HeartIcon.tsx (rewrite)
│   ├── _components/_website/_movies/IconsCard.tsx (rewrite)
│   ├── _components/_client/movies/MainBTNS.tsx (rewrite)
│   ├── _components/_client/CurrentSlideComponent.tsx (rewrite)
│   ├── _components/_client/movies/MediaActionBar.tsx (wire up)
│   ├── _components/_client/Sliders/HeroSlider.tsx (wire up)
│   └── _components/_client/movies/MediaCommentsAndReviews.tsx (pass media)
│
├── Phase 3: Userpanal List Pages (depends on Phase 1+2)
│   ├── userpanal/watchlist/page.tsx (rewrite — mock → real API data)
│   ├── userpanal/watched/page.tsx (rewrite)
│   ├── userpanal/favouritlist/page.tsx (rewrite)
│   ├── userpanal/page.tsx (update recent activity)
│   ├── _components/_globalComponents/ListSkeleton.tsx
│   ├── _components/_globalComponents/ListEmptyState.tsx
│   ├── profile/* redirects (redirect to /userpanal/*)
│   └── _components/_website/_userpanal/MediaCard.tsx (deprecate)
│
├── Phase 4: Custom Lists (depends on Phase 3)
│   ├── _components/_client/lists/AddToListDropdown.tsx
│   ├── _components/_client/lists/CreateListModal.tsx
│   ├── userpanal/lists/page.tsx (NEW)
│   ├── userpanal/lists/[id]/page.tsx (NEW)
│   └── _components/_website/_userpanal/UserPanelSidebar.tsx (add "My Lists")
│
└── Phase 5: Polish (depends on all previous)
    ├── Error boundaries for userpanal pages
    ├── Migration logic in ListBootstrap
    ├── Remove legacy ListContext
    ├── Remove _userpanal/MediaCard.tsx
    └── Full test suite
```

---

## Appendix B: Key Files Reference

| File | Purpose | Phase |
|------|---------|-------|
| `app/types/lists.ts` | All list-related TypeScript types | 1 |
| `app/constants/apis.tsx` | API endpoint constants for `/lists` | 1 |
| `app/_actions/lists.ts` | Server actions for all 7 list operations | 1 |
| `app/_stores/listStore.ts` | Zustand store for list state management | 1 |
| `app/_components/_client/lists/ListBootstrap.tsx` | Hydrates store on mount, handles migration | 1 |
| `app/_components/_client/lists/ListActionButton.tsx` | Reusable action button with loading/error states | 2 |
| `app/_components/_client/lists/AddToListDropdown.tsx` | Custom list picker dropdown | 4 |
| `app/_components/_client/lists/CreateListModal.tsx` | Create custom list form modal | 4 |
| `app/_components/_globalComponents/ListSkeleton.tsx` | Loading skeleton for userpanal list pages | 3 |
| `app/_components/_globalComponents/ListEmptyState.tsx` | Empty state component per list type | 3 |
| `app/userpanal/watchlist/page.tsx` | Rewrite: mock → real API data | 3 |
| `app/userpanal/watched/page.tsx` | Rewrite: mock → real API data | 3 |
| `app/userpanal/favouritlist/page.tsx` | Rewrite: mock → real API data | 3 |
| `app/userpanal/lists/page.tsx` | NEW: all custom lists hub | 4 |
| `app/userpanal/lists/[id]/page.tsx` | NEW: single custom list detail | 4 |
| `app/profile/watchlist/page.tsx` | Redirect to `/userpanal/watchlist` | 3 |
| `app/profile/watched/page.tsx` | Redirect to `/userpanal/watched` | 3 |
| `app/profile/favouritlist/page.tsx` | Redirect to `/userpanal/favouritlist` | 3 |

---

> **Next step:** Begin Phase 1 implementation — start with `app/types/lists.ts` and `app/_actions/lists.ts`, then build the Zustand store and bootstrap component.

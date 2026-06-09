"use client";

import { useEffect, useState, useCallback, use } from "react";
import { motion } from "framer-motion";
import {
  LuList,
  LuX,
  LuArrowLeft,
  LuTrash2,
  LuPencil,
  LuLoader,
} from "react-icons/lu";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  UserListWithMeta,
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

// ─── Rename inline dialog ─────────────────────────

function InlineRename({
  list,
  onClose,
}: {
  list: UserListWithMeta;
  onClose: () => void;
}) {
  const updateList = useListStore((s) => s.updateList);
  const [name, setName] = useState(list.name);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed === list.name) {
      onClose();
      return;
    }
    if (trimmed.length > 80) {
      toast.error("List name must be 80 characters or less");
      return;
    }

    setIsSubmitting(true);
    const success = await updateList(list.id, { name: trimmed });
    setIsSubmitting(false);

    if (success) {
      toast.success(`Renamed to "${trimmed}"`);
      onClose();
    } else {
      toast.error("Failed to rename list");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={80}
        autoFocus
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit();
          if (e.key === "Escape") onClose();
        }}
        className="bg-fourth_color border border-accent/50 rounded-lg px-3 py-1.5 text-lg font-bold text-white outline-none w-48"
      />
      <button
        onClick={handleSubmit}
        disabled={isSubmitting || !name.trim()}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-green-400 hover:bg-green-500/10 transition-colors disabled:opacity-50"
        aria-label="Save name"
      >
        {isSubmitting ? (
          <LuLoader className="size-4 animate-spin" />
        ) : (
          <span className="text-lg leading-none">✓</span>
        )}
      </button>
      <button
        onClick={onClose}
        disabled={isSubmitting}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
        aria-label="Cancel rename"
      >
        <LuX className="size-4" />
      </button>
    </div>
  );
}

// ─── Sign-in prompt ────────────────────────────────

function SignInPrompt({ listName }: { listName?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <LuList className="size-12 text-second_text/40 mb-4" />
      <h2 className="text-xl font-bold text-white mb-2">Sign in required</h2>
      <p className="text-second_text text-sm max-w-md mb-6">
        Sign in to view {listName ? `"${listName}"` : "this list"}.
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

interface Props {
  params: Promise<{ id: string }>;
}

export default function CustomListDetailPage({ params }: Props) {
  const { id } = use(params);

  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialized = useListStore((s) => s.isInitialized);
  const list = useListStore((s) => s.getListById(id));
  const isLoadingItems = useListStore((s) =>
    list?.id ? s.isLoadingItems[list.id] ?? false : false,
  );
  const fetchListItems = useListStore((s) => s.fetchListItems);
  const removeItem = useListStore((s) => s.removeItem);
  const deleteList = useListStore((s) => s.deleteList);
  const { genres, genres_Shows } = useData();

  const [removingIds, setRemovingIds] = useState<Record<number, boolean>>({});
  const [isRenaming, setIsRenaming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch list items if not loaded
  useEffect(() => {
    if (
      isAuthenticated &&
      list?.id &&
      !list.items &&
      !list._loadingItems
    ) {
      fetchListItems(list.id, { perPage: 50 });
    }
  }, [isAuthenticated, list?.id, list?.items, list?._loadingItems, fetchListItems]);

  // Redirect to lists overview if the list was deleted
  useEffect(() => {
    if (isInitialized && !list) {
      toast.error("List not found");
      router.replace("/userpanal/lists");
    }
  }, [isInitialized, list, router]);

  const handleRemove = useCallback(
    async (item: ListItemWithMeta) => {
      if (!list?.id) return;
      const confirmed = window.confirm(
        `Remove "${item.title}" from "${list.name}"?`,
      );
      if (!confirmed) return;

      setRemovingIds((prev) => ({ ...prev, [item.tmdbId]: true }));
      const success = await removeItem(list.id, item.mediaType, item.tmdbId);
      setRemovingIds((prev) => ({ ...prev, [item.tmdbId]: false }));

      if (success) {
        toast.success(`Removed from "${list.name}"`);
      } else {
        toast.error(`Failed to remove "${item.title}"`);
      }
    },
    [list?.id, list?.name, removeItem],
  );

  const handleDeleteList = useCallback(async () => {
    if (!list?.id) return;
    const confirmed = window.confirm(
      `Delete "${list.name}" and all its items? This cannot be undone.`,
    );
    if (!confirmed) return;

    setIsDeleting(true);
    const success = await deleteList(list.id);
    setIsDeleting(false);

    if (success) {
      toast.success(`"${list.name}" deleted`);
      router.replace("/userpanal/lists");
    } else {
      toast.error("Failed to delete list");
    }
  }, [list?.id, list?.name, deleteList, router]);

  // ── Not authenticated ──────────────────────────

  if (!isAuthenticated) {
    return <SignInPrompt listName={list?.name} />;
  }

  // ── Loading ─────────────────────────────────────

  if (!isInitialized || isLoadingItems || !list?.items) {
    return (
      <div className="space-y-6">
        <FadeIn delay={0}>
          <div className="flex items-center gap-3">
            <Link
              href="/userpanal/lists"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Back to lists"
            >
              <LuArrowLeft className="size-5" />
            </Link>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-2">
                <LuList className="text-accent" />
                {list?.name || "Loading…"}
              </h1>
              <p className="text-second_text text-sm mt-1">
                Loading list items…
              </p>
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
          <Header
            list={list}
            isRenaming={isRenaming}
            setIsRenaming={setIsRenaming}
            isDeleting={isDeleting}
            onDelete={handleDeleteList}
            onRename={() => setIsRenaming(true)}
          />
        </FadeIn>
        <ListEmptyState
          type="custom"
          title={`"${list.name}" is empty`}
          description="Add movies and shows from their detail pages using the 'Add to List' option."
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
        <Header
          list={list}
          isRenaming={isRenaming}
          setIsRenaming={setIsRenaming}
          isDeleting={isDeleting}
          onDelete={handleDeleteList}
          onRename={() => setIsRenaming(true)}
        />
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

// ─── Header Sub-component ─────────────────────────

function Header({
  list,
  isRenaming,
  setIsRenaming,
  isDeleting,
  onDelete,
  onRename,
}: {
  list: UserListWithMeta;
  isRenaming: boolean;
  setIsRenaming: (v: boolean) => void;
  isDeleting: boolean;
  onDelete: () => void;
  onRename: () => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-3 min-w-0">
        <Link
          href="/userpanal/lists"
          className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          aria-label="Back to lists"
        >
          <LuArrowLeft className="size-5" />
        </Link>

        {isRenaming ? (
          <InlineRename list={list} onClose={() => setIsRenaming(false)} />
        ) : (
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-2">
              <LuList className="text-accent" />
              {list.name}
            </h1>
            <p className="text-second_text text-sm mt-1">
              {list.itemCount}{" "}
              {list.itemCount === 1 ? "item" : "items"} in this list
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {!isRenaming && (
          <>
            <button
              onClick={onRename}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-second_text hover:text-white border border-glass_border hover:border-white/20 active:scale-95 transition-all"
              aria-label="Rename list"
            >
              <LuPencil className="size-4" />
              <span className="hidden sm:inline">Rename</span>
            </button>
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 border border-glass_border hover:border-red-500/30 active:scale-95 transition-all disabled:opacity-50"
              aria-label="Delete list"
            >
              {isDeleting ? (
                <LuLoader className="size-4 animate-spin" />
              ) : (
                <LuTrash2 className="size-4" />
              )}
              <span className="hidden sm:inline">Delete</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

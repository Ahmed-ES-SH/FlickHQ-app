"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuList,
  LuPlus,
  LuCheck,
  LuLoader,
  LuHeart,
  LuBookmark,
  LuEye,
} from "react-icons/lu";
import { useListStore } from "@/app/_stores/listStore";
import { useAuthStore } from "@/app/_stores/authStore";
import { useClickOutside } from "@/app/hooks/useClickOutside";
import { toast } from "sonner";
import CreateListModal from "./CreateListModal";
import type { ShowType } from "@/app/types/websiteTypes";
import type { MediaType, UserListWithMeta } from "@/app/types/lists";

interface Props {
  /** The media item to add/remove from lists */
  media: ShowType;
  /** Whether the dropdown is open */
  isOpen: boolean;
  /** Called when the dropdown should close */
  onClose: () => void;
}

// ─── System list icon mapping ───────────────────────

const systemIcons: Record<string, React.ReactNode> = {
  favorites: <LuHeart className="size-4" />,
  watchlist: <LuBookmark className="size-4" />,
  watched: <LuEye className="size-4" />,
};

const systemLabels: Record<string, string> = {
  favorites: "Favorites",
  watchlist: "Watchlist",
  watched: "Watched",
};

/**
 * AddToListDropdown — Popover that shows all user lists (system + custom)
 * and lets the user toggle whether the current media item is in each list.
 *
 * Features:
 * - Checkmark next to lists the item is already in
 * - Toggle on/off with per-list loading spinner
 * - "Create new list" button at the bottom
 * - Click-outside to close
 */
export default function AddToListDropdown({
  media,
  isOpen,
  onClose,
}: Props) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const lists = useListStore((s) => s.getAllLists());
  const isInList = useListStore((s) => s.isInList);
  const addItem = useListStore((s) => s.addItem);
  const removeItem = useListStore((s) => s.removeItem);

  const [loadingLists, setLoadingLists] = useState<Record<string, boolean>>(
    {},
  );
  const [showCreateModal, setShowCreateModal] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, onClose);

  // Derive media type from the ShowType
  const mediaType: MediaType = (media.media_type ||
    (media.title ? "movie" : "tv")) as MediaType;

  // ── Toggle item in a list ───────────────────────

  const handleToggle = useCallback(
    async (list: UserListWithMeta) => {
      const listId = list.id;
      const tmdbId = media.id;

      // Avoid double-clicks
      if (loadingLists[listId]) return;

      setLoadingLists((prev) => ({ ...prev, [listId]: true }));

      const alreadyInList = isInList(listId, tmdbId);

      if (alreadyInList) {
        const success = await removeItem(listId, mediaType, tmdbId);
        if (success) {
          toast.success(`Removed from ${list.name}`);
        } else {
          toast.error(`Failed to remove from ${list.name}`);
        }
      } else {
        const success = await addItem(listId, {
          mediaType,
          tmdbId,
        });
        if (success) {
          toast.success(`Added to ${list.name}`);
        } else {
          toast.error(`Failed to add to ${list.name}`);
        }
      }

      setLoadingLists((prev) => ({ ...prev, [listId]: false }));
    },
    [media.id, mediaType, isInList, addItem, removeItem, loadingLists],
  );

  // ── Handle successful list creation ────────────

  const handleCreatedList = useCallback(
    async (_listId: string) => {
      // After creating a list, auto-add the current media item to it
      const newList = useListStore.getState().getListById(_listId);
      if (newList) {
        setLoadingLists((prev) => ({ ...prev, [_listId]: true }));
        const success = await addItem(_listId, {
          mediaType,
          tmdbId: media.id,
        });
        if (success) {
          toast.success(`Added to ${newList.name}`);
        } else {
          toast.error(`Failed to add to ${newList.name}`);
        }
        setLoadingLists((prev) => ({ ...prev, [_listId]: false }));
      }
    },
    [media.id, mediaType, addItem],
  );

  // ── Render helper for a single list row ─────────

  const renderListRow = (list: UserListWithMeta) => {
    const isLoading = loadingLists[list.id] ?? false;
    const inList = isInList(list.id, media.id);
    const systemIcon = list.isSystem ? systemIcons[list.listKey] : null;

    return (
      <button
        key={list.id}
        onClick={() => handleToggle(list)}
        disabled={isLoading}
        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all text-left group ${
          inList
            ? "text-accent bg-accent/5 hover:bg-accent/10"
            : "text-second_text hover:text-white hover:bg-white/5"
        } disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-label={
          inList
            ? `Remove from ${list.name}`
            : `Add to ${list.name}`
        }
      >
        {/* Checkbox / loading indicator */}
        <span className="w-5 h-5 flex items-center justify-center shrink-0">
          {isLoading ? (
            <LuLoader className="size-4 animate-spin text-accent" />
          ) : (
            <span
              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                inList
                  ? "bg-accent border-accent"
                  : "border-gray-600 group-hover:border-gray-400"
              }`}
            >
              {inList && <LuCheck className="size-3 text-white" />}
            </span>
          )}
        </span>

        {/* Icon */}
        <span className="shrink-0 opacity-60">
          {systemIcon || <LuList className="size-4" />}
        </span>

        {/* Label */}
        <span className="flex-1 truncate font-medium">
          {systemLabels[list.listKey] || list.name}
        </span>

        {/* Badge for system lists */}
        {list.isSystem && (
          <span className="text-[10px] uppercase tracking-wider text-gray-500 bg-white/5 px-1.5 py-0.5 rounded shrink-0">
            System
          </span>
        )}
      </button>
    );
  };

  // ── Render ─────────────────────────────────────

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-full mt-2 w-72 bg-panel_bg border border-glass_border rounded-xl shadow-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-glass_border">
              <p className="text-xs font-medium text-second_text uppercase tracking-wider">
                Add to List
              </p>
              <p className="text-xs text-second_text mt-0.5 truncate">
                {media.title || media.name}
              </p>
            </div>

            {/* List items */}
            <div className="max-h-64 overflow-y-auto py-1">
              {lists.length === 0 ? (
                <div className="px-4 py-6 text-center">
                  <LuList className="size-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-second_text">
                    No lists yet
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Create your first list below
                  </p>
                </div>
              ) : (
                lists.map(renderListRow)
              )}
            </div>

            {/* Create new list */}
            <div className="border-t border-glass_border p-2">
              <button
                onClick={() => setShowCreateModal(true)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-accent hover:bg-accent/10 transition-colors"
              >
                <span className="w-5 h-5 flex items-center justify-center">
                  <LuPlus className="size-4" />
                </span>
                Create new list
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create list modal */}
      <CreateListModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreatedList}
      />
    </>
  );
}

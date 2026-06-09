"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  LuList,
  LuPlus,
  LuTrash2,
  LuPencil,
  LuX,
  LuCheck,
  LuLoader,
  LuArrowRight,
  LuCalendarDays,
  LuFilm,
} from "react-icons/lu";
import Link from "next/link";
import { useListStore } from "@/app/_stores/listStore";
import { useAuthStore } from "@/app/_stores/authStore";
import { ListSkeleton } from "@/app/_components/_globalComponents/ListSkeleton";
import { ListEmptyState } from "@/app/_components/_globalComponents/ListEmptyState";
import CreateListModal from "@/app/_components/_client/lists/CreateListModal";
import { toast } from "sonner";
import type { UserListWithMeta } from "@/app/types/lists";

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

// ─── Rename dialog ────────────────────────────────

function RenameDialog({
  list,
  onClose,
}: {
  list: UserListWithMeta;
  onClose: () => void;
}) {
  const updateList = useListStore((s) => s.updateList);
  const [name, setName] = useState(list.name);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="relative w-full max-w-sm bg-panel_bg border border-glass_border rounded-xl shadow-2xl p-6"
      >
        <h3 className="text-base font-bold text-white mb-1">Rename List</h3>
        <p className="text-xs text-second_text mb-4">
          Enter a new name for &ldquo;{list.name}&rdquo;
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            disabled={isSubmitting}
            className="w-full bg-fourth_color border border-glass_border rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 disabled:opacity-50"
          />
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg text-sm text-second_text hover:text-white border border-glass_border hover:border-white/20 active:scale-95 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="flex items-center gap-2 bg-accent text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-red-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <LuLoader className="size-4 animate-spin" />
              ) : (
                <LuCheck className="size-4" />
              )}
              Rename
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// ─── Delete confirm dialog ─────────────────────────

function DeleteConfirmDialog({
  list,
  onClose,
}: {
  list: UserListWithMeta;
  onClose: () => void;
}) {
  const deleteList = useListStore((s) => s.deleteList);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    setIsSubmitting(true);
    const success = await deleteList(list.id);
    setIsSubmitting(false);

    if (success) {
      toast.success(`"${list.name}" deleted`);
      onClose();
    } else {
      toast.error("Failed to delete list");
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="relative w-full max-w-sm bg-panel_bg border border-glass_border rounded-xl shadow-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center">
            <LuTrash2 className="size-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Delete List</h3>
            <p className="text-xs text-second_text">
              This action cannot be undone
            </p>
          </div>
        </div>

        <p className="text-sm text-second_text mb-1">
          Are you sure you want to delete &ldquo;
          <span className="text-white font-medium">{list.name}</span>
          &rdquo;?
        </p>
        {list.itemCount > 0 && (
          <p className="text-xs text-second_text mb-4">
            {list.itemCount} item{list.itemCount !== 1 ? "s" : ""} in this list
            will also be removed.
          </p>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg text-sm text-second_text hover:text-white border border-glass_border hover:border-white/20 active:scale-95 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-red-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <LuLoader className="size-4 animate-spin" />
            ) : (
              <LuTrash2 className="size-4" />
            )}
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Sign-in prompt ────────────────────────────────

function SignInPrompt() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <LuList className="size-12 text-second_text/40 mb-4" />
      <h2 className="text-xl font-bold text-white mb-2">Sign in required</h2>
      <p className="text-second_text text-sm max-w-md mb-6">
        Sign in to create and manage custom lists.
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

// ─── List Card ────────────────────────────────────

function ListCard({
  list,
  onRename,
  onDelete,
  index,
}: {
  list: UserListWithMeta;
  onRename: (list: UserListWithMeta) => void;
  onDelete: (list: UserListWithMeta) => void;
  index: number;
}) {
  const createdDate = new Date(list.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05, ease: "easeOut" }}
    >
      <Link
        href={`/userpanal/lists/${list.id}`}
        className="group block bg-panel_bg border border-glass_border rounded-xl overflow-hidden hover:border-accent/30 hover:bg-accent/[0.02] transition-all duration-300"
      >
        {/* Card content */}
        <div className="p-5">
          {/* Icon + name */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                <LuList className="size-5 text-accent" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-white truncate group-hover:text-accent transition-colors">
                  {list.name}
                </h3>
                {list.slug && (
                  <p className="text-[11px] text-second_text truncate">
                    /{list.slug}
                  </p>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div
              className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              onClick={(e) => e.preventDefault()}
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onRename(list);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
                aria-label={`Rename ${list.name}`}
              >
                <LuPencil className="size-4" />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onDelete(list);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                aria-label={`Delete ${list.name}`}
              >
                <LuTrash2 className="size-4" />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-second_text">
            <span className="flex items-center gap-1.5">
              <LuFilm className="size-3.5" />
              {list.itemCount} item{list.itemCount !== 1 ? "s" : ""}
            </span>
            <span className="flex items-center gap-1.5">
              <LuCalendarDays className="size-3.5" />
              {createdDate}
            </span>
          </div>
        </div>

        {/* Bottom "View" indicator */}
        <div className="px-5 py-2.5 border-t border-glass_border flex items-center gap-1.5 text-xs text-accent font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          View list
          <LuArrowRight className="size-3.5" />
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────

export default function CustomListsPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const customLists = useListStore((s) => s.getCustomLists());
  const fetchLists = useListStore((s) => s.fetchLists);
  const isLoadingLists = useListStore((s) => s.isLoadingLists);
  const isInitialized = useListStore((s) => s.isInitialized);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [renameTarget, setRenameTarget] = useState<UserListWithMeta | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<UserListWithMeta | null>(
    null,
  );

  // Refresh lists on mount if needed
  // (ListBootstrap already initializes, but this ensures fresh data)
  const [hasFetched, setHasFetched] = useState(false);
  useEffect(() => {
    if (isAuthenticated && isInitialized && !hasFetched) {
      fetchLists();
      setHasFetched(true);
    }
  }, [isAuthenticated, isInitialized, hasFetched, fetchLists]);

  // ── Not authenticated ──────────────────────────

  if (!isAuthenticated) {
    return <SignInPrompt />;
  }

  // ── Loading ─────────────────────────────────────

  if (!isInitialized || isLoadingLists) {
    return (
      <div className="space-y-6">
        <FadeIn delay={0}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-2">
                <LuList className="text-accent" />
                My Lists
              </h1>
              <p className="text-second_text text-sm mt-1">
                Loading your custom lists…
              </p>
            </div>
          </div>
        </FadeIn>
        <ListSkeleton count={4} />
      </div>
    );
  }

  // ── Empty state ────────────────────────────────

  if (customLists.length === 0) {
    return (
      <div className="space-y-6">
        <FadeIn delay={0}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-2">
                <LuList className="text-accent" />
                My Lists
              </h1>
              <p className="text-second_text text-sm mt-1">
                Organize your favorites into custom collections
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-red-700 active:scale-95 transition-all duration-200 shrink-0"
            >
              <LuPlus className="size-4" />
              Create List
            </button>
          </div>
        </FadeIn>
        <ListEmptyState
          type="custom"
          actionLabel="Browse Movies"
          actionHref="/movies"
        />
      </div>
    );
  }

  // ── Render lists ───────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <FadeIn delay={0}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-2">
              <LuList className="text-accent" />
              My Lists
            </h1>
            <p className="text-second_text text-sm mt-1">
              {customLists.length}{" "}
              {customLists.length === 1 ? "list" : "lists"} created
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-red-700 active:scale-95 transition-all duration-200 shrink-0"
          >
            <LuPlus className="size-4" />
            Create List
          </button>
        </div>
      </FadeIn>

      {/* Grid */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {customLists.map((list, index) => (
            <ListCard
              key={list.id}
              list={list}
              onRename={setRenameTarget}
              onDelete={setDeleteTarget}
              index={index}
            />
          ))}
        </div>
      </FadeIn>

      {/* Create list modal */}
      <CreateListModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {/* Rename dialog */}
      {renameTarget && (
        <RenameDialog
          list={renameTarget}
          onClose={() => setRenameTarget(null)}
        />
      )}

      {/* Delete confirm dialog */}
      {deleteTarget && (
        <DeleteConfirmDialog
          list={deleteTarget}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

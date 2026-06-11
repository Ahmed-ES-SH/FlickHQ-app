"use client";

import { useState, useEffect } from "react";
import { useListStore } from "@/app/_stores/listStore";
import { useAuthStore } from "@/app/_stores/authStore";
import { ListSkeleton } from "@/app/_components/_globalComponents/ListSkeleton";
import { ListEmptyState } from "@/app/_components/_globalComponents/ListEmptyState";
import FadeIn from "@/app/_components/_client/lists/FadeIn";
import ListsPageHeader from "@/app/_components/_client/lists/ListsPageHeader";
import ListCard from "@/app/_components/_client/lists/ListCard";
import RenameDialog from "@/app/_components/_client/lists/RenameDialog";
import DeleteConfirmDialog from "@/app/_components/_client/lists/DeleteConfirmDialog";
import SignInPrompt from "@/app/_components/_client/lists/SignInPrompt";
import CreateListModal from "@/app/_components/_client/lists/CreateListModal";
import type { UserListWithMeta } from "@/app/types/lists";

//////////////////////////////////////////////////////////////////////////////
///////// CustomListsPage — Main page for managing custom lists //////////////
//////////////////////////////////////////////////////////////////////////////

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
          <ListsPageHeader subtitle="Loading your custom lists…" />
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
          <ListsPageHeader
            subtitle="Organize your favorites into custom collections"
            showCreateButton
            onCreateClick={() => setShowCreateModal(true)}
          />
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
      <FadeIn delay={0}>
        <ListsPageHeader
          subtitle={`${customLists.length} ${customLists.length === 1 ? "list" : "lists"} created`}
          showCreateButton
          onCreateClick={() => setShowCreateModal(true)}
        />
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

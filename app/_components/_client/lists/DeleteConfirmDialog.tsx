"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LuTrash2, LuLoader } from "react-icons/lu";
import { useListStore } from "@/app/_stores/listStore";
import { toast } from "sonner";
import type { UserListWithMeta } from "@/app/types/lists";

//////////////////////////////////////////////////////////////////////////////
///////// DeleteConfirmDialog — Confirmation modal for deleting a list ///////
//////////////////////////////////////////////////////////////////////////////

interface DeleteConfirmDialogProps {
  list: UserListWithMeta;
  onClose: () => void;
}

export default function DeleteConfirmDialog({
  list,
  onClose,
}: DeleteConfirmDialogProps) {
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

"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { LuLoader, LuCheck } from "react-icons/lu";
import { useListStore } from "@/app/_stores/listStore";
import { toast } from "sonner";
import type { UserListWithMeta } from "@/app/types/lists";

//////////////////////////////////////////////////////////////////////////////
///////// RenameDialog — Modal for renaming a custom list ////////////////////
//////////////////////////////////////////////////////////////////////////////

interface RenameDialogProps {
  list: UserListWithMeta;
  onClose: () => void;
}

export default function RenameDialog({ list, onClose }: RenameDialogProps) {
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

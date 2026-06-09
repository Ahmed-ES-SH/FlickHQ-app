"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuX, LuList } from "react-icons/lu";
import { useListStore } from "@/app/_stores/listStore";
import { useClickOutside } from "@/app/hooks/useClickOutside";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (listId: string) => void;
}

/**
 * CreateListModal — Modal form for creating a new custom list.
 *
 * - Name is required (1–80 chars)
 * - Slug is optional; auto-generated from name if left empty
 * - After successful creation, calls `onSuccess` with the new list ID
 */
export default function CreateListModal({ isOpen, onClose, onSuccess }: Props) {
  const createList = useListStore((s) => s.createList);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const modalRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Close on click outside
  useClickOutside(modalRef, onClose);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  // Focus the name input when the modal opens
  useEffect(() => {
    if (isOpen) {
      // Small delay so the modal is in the DOM first
      const t = setTimeout(() => nameInputRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setName("");
      setSlug("");
      setSlugManuallyEdited(false);
      setError(null);
      setFieldErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  // Auto-generate slug from name
  const handleNameChange = useCallback(
    (value: string) => {
      setName(value);
      setFieldErrors((prev) => ({ ...prev, name: "" }));
      if (!slugManuallyEdited) {
        setSlug(
          value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, ""),
        );
      }
    },
    [slugManuallyEdited],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    // Client-side validation
    const trimmedName = name.trim();
    if (!trimmedName) {
      setFieldErrors({ name: "List name is required" });
      return;
    }
    if (trimmedName.length > 80) {
      setFieldErrors({ name: "List name must be 80 characters or less" });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: { name: string; slug?: string } = { name: trimmedName };
      const trimmedSlug = slug.trim();
      if (trimmedSlug) {
        payload.slug = trimmedSlug;
      }

      const result = await createList(payload);

      if (result) {
        toast.success(`"${result.name}" created`);
        onSuccess?.(result.id);
        onClose();
      } else {
        // Check for slug conflict or other server errors
        setError("Failed to create list. The slug may already be taken.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-md bg-panel_bg border border-glass_border rounded-2xl shadow-2xl overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-list-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-glass_border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
                  <LuList className="size-5 text-accent" />
                </div>
                <div>
                  <h2
                    id="create-list-title"
                    className="text-lg font-bold text-white"
                  >
                    Create New List
                  </h2>
                  <p className="text-xs text-second_text">
                    Organize your favorite movies and shows
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close"
              >
                <LuX className="size-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Name */}
              <div className="space-y-1.5">
                <label
                  htmlFor="list-name"
                  className="text-xs font-medium text-second_text uppercase tracking-wider"
                >
                  Name <span className="text-accent">*</span>
                </label>
                <input
                  ref={nameInputRef}
                  id="list-name"
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g., Sci-Fi Favorites"
                  maxLength={80}
                  disabled={isSubmitting}
                  className={`w-full bg-fourth_color border rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors disabled:opacity-50 ${
                    fieldErrors.name
                      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
                      : "border-glass_border focus:border-accent/50 focus:ring-1 focus:ring-accent/20"
                  }`}
                  aria-invalid={!!fieldErrors.name}
                  aria-describedby={
                    fieldErrors.name ? "name-error" : undefined
                  }
                />
                {fieldErrors.name && (
                  <p id="name-error" className="text-xs text-red-400">
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              {/* Slug */}
              <div className="space-y-1.5">
                <label
                  htmlFor="list-slug"
                  className="text-xs font-medium text-second_text uppercase tracking-wider"
                >
                  Slug <span className="text-gray-500">(optional)</span>
                </label>
                <input
                  id="list-slug"
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setSlugManuallyEdited(true);
                    setFieldErrors((prev) => ({ ...prev, slug: "" }));
                  }}
                  placeholder="sci-fi-favorites"
                  disabled={isSubmitting}
                  className="w-full bg-fourth_color border border-glass_border rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors focus:border-accent/50 focus:ring-1 focus:ring-accent/20 disabled:opacity-50"
                />
                {fieldErrors.slug && (
                  <p className="text-xs text-red-400">{fieldErrors.slug}</p>
                )}
                <p className="text-[11px] text-second_text">
                  Used in URLs. Auto-generated from the name if left empty.
                </p>
              </div>

              {/* General error */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                  <p className="text-xs text-red-400">{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-second_text hover:text-white border border-glass_border hover:border-white/20 active:scale-95 transition-all duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !name.trim()}
                  className="flex items-center gap-2 bg-accent text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-red-700 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="size-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Creating…
                    </>
                  ) : (
                    "Create List"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

"use client";

import { motion } from "framer-motion";
import {
  LuList,
  LuPencil,
  LuTrash2,
  LuFilm,
  LuCalendarDays,
  LuArrowRight,
} from "react-icons/lu";
import Link from "next/link";
import type { UserListWithMeta } from "@/app/types/lists";

//////////////////////////////////////////////////////////////////////////////
///////// ListCard — Individual custom list card with actions ////////////////
//////////////////////////////////////////////////////////////////////////////

interface ListCardProps {
  list: UserListWithMeta;
  onRename: (list: UserListWithMeta) => void;
  onDelete: (list: UserListWithMeta) => void;
  index: number;
}

export default function ListCard({
  list,
  onRename,
  onDelete,
  index,
}: ListCardProps) {
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

"use client";

import { motion } from "framer-motion";

type TabId = "recommended" | "related" | "cast" | "extras" | "reviews" | "comments";

interface TabConfig {
  id: TabId;
  label: string;
}

interface Props {
  /** Currently active tab */
  activeTab: TabId;
  /** Callback when a tab is selected */
  onTabChange: (tab: TabId) => void;
  /** Total number of reviews (displayed in tab label) */
  reviewsCount: number;
  /** Total number of comments (displayed in tab label) */
  commentsCount: number;
}

export default function MediaContentTabs({
  activeTab,
  onTabChange,
  reviewsCount,
  commentsCount,
}: Props) {
  // Define tabs with dynamic counts for reviews and comments
  const tabs: TabConfig[] = [
    { id: "recommended", label: "Recommended" },
    { id: "related", label: "Related" },
    { id: "cast", label: "Cast" },
    { id: "extras", label: "Extras" },
    { id: "reviews", label: `Reviews (${reviewsCount})` },
    { id: "comments", label: `Discussion (${commentsCount})` },
  ];

  return (
    <div className="flex items-center gap-6 lg:gap-8 border-b border-white/5 pb-4 overflow-x-auto scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`relative text-xs lg:text-sm font-black uppercase tracking-[0.15em] transition-colors duration-300 shrink-0 pb-1 ${
            activeTab === tab.id
              ? "text-accent"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          {tab.label}
          {/* Animated underline for active tab */}
          {activeTab === tab.id && (
            <motion.div
              layoutId="tabUnderline"
              className="absolute -bottom-4 left-0 right-0 h-0.5 bg-accent shadow-[0_0_10px_rgba(229,9,20,0.5)]"
            />
          )}
        </button>
      ))}
    </div>
  );
}

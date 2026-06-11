// //////////////////////////////////////////////////////////////////////////////
// Show tabs — tab navigation with animated active indicator ///////////////////
// //////////////////////////////////////////////////////////////////////////////

"use client";

import { motion } from "framer-motion";
import { showDetailsTabs } from "@/app/data/shows/showDetailsTabs";

interface Props {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function ShowTabs({ activeTab, onTabChange }: Props) {
  return (
    <div className="border-b border-white/10">
      <div className="flex items-center gap-6">
        {showDetailsTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative pb-4 text-sm font-semibold transition-all duration-300 ${
              activeTab === tab.id
                ? "text-accent"
                : "text-gray-400 hover:text-white"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import {
  IoPlay,
  IoAdd,
  IoHeart,
  IoShareSocial,
  IoChatbubble,
  IoList,
} from "react-icons/io5";

interface Props {
  /** Callback to switch to the comments tab */
  onOpenComments: () => void;
}

// Action button configuration
const ACTIONS = [
  { icon: IoAdd, label: "Watchlist" },
  { icon: IoHeart, label: "Favorites" },
  { icon: IoList, label: "Playlist" },
  { icon: IoShareSocial, label: "Share" },
];

export default function MediaActionBar({ onOpenComments }: Props) {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-6 p-4 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-xl">
      {/* Primary Play Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-accent text-white font-black uppercase tracking-wider shadow-lg shadow-accent/30 group"
      >
        <IoPlay className="size-5 group-hover:scale-110 duration-300" />
        <span>Play Now</span>
      </motion.button>

      {/* Secondary Action Buttons */}
      <div className="flex items-center justify-between md:justify-start gap-4 lg:gap-8 px-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
        {ACTIONS.map((action, i) => (
          <button
            key={i}
            className="flex flex-col items-center gap-2 text-gray-500 hover:text-white duration-300 transition-colors group shrink-0 min-w-[60px]"
          >
            <action.icon className="size-6 group-hover:scale-110 duration-300" />
            <span className="text-[9px] font-black uppercase tracking-widest">
              {action.label}
            </span>
          </button>
        ))}

        {/* Comments button - navigates to discussion tab */}
        <button
          onClick={onOpenComments}
          className="flex flex-col items-center gap-2 text-gray-500 hover:text-white duration-300 transition-colors group shrink-0 min-w-[60px]"
        >
          <IoChatbubble className="size-6 group-hover:scale-110 duration-300" />
          <span className="text-[9px] font-black uppercase tracking-widest">
            Comments
          </span>
        </button>
      </div>
    </div>
  );
}

"use client";

import { FaPlus } from "react-icons/fa";
import { IoCheckmark } from "react-icons/io5";

// //////////////////////////////////////////////////////////////////////////////
// ///////// Watchlist toggle button with loading / check / plus states /////////
// //////////////////////////////////////////////////////////////////////////////

export default function HeroWatchlistButton({
  isInWatchlist,
  isLoading,
  onToggle,
}: {
  isInWatchlist: boolean;
  isLoading: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      disabled={isLoading}
      className={`group flex items-center gap-2 px-5 py-3 sm:px-6 z-999 sm:py-3.5 font-medium transition-colors min-h-[44px] rounded-md disabled:opacity-60 ${
        isInWatchlist
          ? "text-accent hover:text-accent/80"
          : "text-white hover:text-accent"
      }`}
      aria-label={`${isInWatchlist ? "Remove from" : "Add to"} watchlist`}
    >
      {isLoading ? (
        <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-current border-t-transparent animate-spin" />
      ) : isInWatchlist ? (
        <IoCheckmark className="w-4 h-4 sm:w-5 sm:h-5" />
      ) : (
        <FaPlus className="w-4 h-4 sm:w-5 sm:h-5" />
      )}
      <span className="hidden sm:inline">
        {isLoading ? "..." : isInWatchlist ? "In Watchlist" : "Watchlist"}
      </span>
      <span className="sm:hidden">
        {isLoading ? "..." : isInWatchlist ? "In List" : "List"}
      </span>
    </button>
  );
}

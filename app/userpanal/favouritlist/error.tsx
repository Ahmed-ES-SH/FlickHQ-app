"use client";

import { useEffect } from "react";
import { LuHeart, LuRefreshCw } from "react-icons/lu";

export default function FavouritlistError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Favorites page error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="mb-6">
        <LuHeart className="size-12 text-red-500/60 mx-auto" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">
        Something went wrong
      </h2>
      <p className="text-second_text text-sm max-w-md mb-2">
        We couldn&apos;t load your favorites. Please try again.
      </p>
      <p className="text-xs text-red-400/60 mb-8 max-w-sm truncate">
        {error.message}
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-lg text-sm font-bold hover:bg-red-700 active:scale-95 transition-all duration-200"
      >
        <LuRefreshCw className="size-4" />
        Try Again
      </button>
    </div>
  );
}

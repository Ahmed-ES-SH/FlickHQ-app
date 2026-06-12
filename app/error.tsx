"use client";

import { useEffect } from "react";
import { LuTriangleAlert, LuRefreshCw } from "react-icons/lu";
import { toast } from "sonner";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
    if (error.name === "ChunkLoadError") {
      toast.error(
        "A required module failed to load. Please refresh the page.",
        { duration: 6000 }
      );
    } else {
      toast.error("Something went wrong. Please try again.", {
        duration: 6000,
      });
    }
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-main_bg">
      <div className="mb-6">
        <LuTriangleAlert className="size-16 text-accent/70 mx-auto" />
      </div>
      <h2 className="text-3xl font-bold text-white mb-3">
        Something went wrong
      </h2>
      <p className="text-second_text text-base max-w-md mb-2">
        We encountered an unexpected error. Please try again.
      </p>
      <p className="text-xs text-red-400/60 mb-10 max-w-sm truncate">
        {error.message}
      </p>
      <button
        onClick={reset}
        className="inline-flex items-center gap-2 bg-accent text-white px-8 py-3.5 rounded-lg text-sm font-bold hover:bg-red-700 active:scale-95 transition-all duration-200"
      >
        <LuRefreshCw className="size-4" />
        Try Again
      </button>
    </div>
  );
}

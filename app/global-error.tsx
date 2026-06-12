"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Critical application error:", error);
    if (error.name === "ChunkLoadError") {
      toast.error(
        "A required module failed to load. Please refresh the page.",
        { duration: 8000 }
      );
    } else {
      toast.error("A critical error occurred. Please refresh.", {
        duration: 8000,
      });
    }
  }, [error]);

  return (
    <html>
      <body className="bg-main_bg text-white">
        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
          <div className="size-16 rounded-full bg-accent/10 flex items-center justify-center mb-6">
            <span className="text-accent text-3xl font-bold">!</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            Critical Error
          </h1>
          <p className="text-second_text text-base max-w-md mb-2">
            The application encountered a critical error. Please refresh to
            continue.
          </p>
          <p className="text-xs text-red-400/60 mb-10 max-w-sm truncate">
            {error.message}
          </p>
          <button
            onClick={reset}
            className="bg-accent text-white px-8 py-3.5 rounded-lg text-sm font-bold hover:bg-red-700 active:scale-95 transition-all duration-200"
          >
            Refresh Page
          </button>
        </div>
      </body>
    </html>
  );
}

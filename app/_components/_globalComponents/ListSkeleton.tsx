/**
 * ListSkeleton — Grid of animated placeholder cards for loading states.
 *
 * Used on userpanal list pages (watchlist, watched, favourites) while
 * items are being fetched from the API.
 */
export function ListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="aspect-[2/3] rounded-xl bg-panel_bg border border-white/5 overflow-hidden animate-pulse"
        >
          <div className="w-full h-full flex flex-col">
            {/* Poster area */}
            <div className="flex-1 bg-white/5" />
            {/* Info area */}
            <div className="p-3.5 space-y-2">
              <div className="h-3 bg-white/10 rounded-full w-3/4" />
              <div className="h-2 bg-white/5 rounded-full w-1/2" />
              <div className="flex gap-2 mt-2">
                <div className="h-4 bg-white/5 rounded w-12" />
                <div className="h-4 bg-white/5 rounded w-16" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

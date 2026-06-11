"use client";

// //////////////////////////////////////////////////////////////////////////////
// ///////// Empty state for HeroSlider when no data is available ///////////////
// //////////////////////////////////////////////////////////////////////////////

export default function HeroEmptyState({
  trendingState,
  onToggle,
}: {
  trendingState: "movies" | "shows";
  onToggle: () => void;
}) {
  return (
    <div className="relative min-h-[60vh] flex items-center justify-center bg-main_bg">
      <div className="text-center px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          No Trending Content
        </h2>
        <p className="text-second_text mb-6 max-w-md">
          We couldn&apos;t find any trending movies or shows right now. Check
          back later or browse our catalog.
        </p>
        <button
          onClick={onToggle}
          className="px-6 py-3 bg-accent text-white font-semibold hover:bg-red-700 transition-colors"
        >
          Switch to {trendingState === "movies" ? "Shows" : "Movies"}
        </button>
      </div>
    </div>
  );
}

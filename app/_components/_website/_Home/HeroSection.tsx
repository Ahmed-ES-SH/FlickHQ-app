import FetchData from "@/app/hooks/FetchData";
import HeroSlider from "../../_client/Sliders/HeroSlider";
import { trendingMovies, trendingShows } from "@/app/constants/apis";

export default async function HeroSection() {
  const { results: moviesResults } = await FetchData(trendingMovies, false);
  const { results: showsResults } = await FetchData(trendingShows, false);

  // We trim to the top 10 for the slider as requested
  const top10Movies = moviesResults?.slice(0, 10) || [];
  const top10Shows = showsResults?.slice(0, 10) || [];

  return (
    <div className="relative min-h-screen w-full">
      {/* Interactive Cinematic Hero Slider */}
      <HeroSlider movies={top10Movies} shows={top10Shows} />
    </div>
  );
}

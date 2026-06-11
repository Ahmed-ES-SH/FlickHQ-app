import HeroSection from "./_components/_website/_Home/HeroSection";
import MoviesSection from "./_components/_website/_Home/MoviesSection";
import PlansSection from "./_components/_website/_Home/PlansSection";
import TopRatedMovies from "./_components/_website/_Home/TopRatedMovies";
import TopRatedShows from "./_components/_website/_Home/TopRatedShows";
import { getSharedMetadata } from "./_helpers/shared/SharedMetadata";
import type { Metadata } from "next";

export function generateMetadata(): Metadata {
  const title = "FlickHQ – Movies & TV Shows - Home Page";
  const description =
    "Discover and stream the latest movies and TV shows on FlickHQ. Browse trending, top-rated, and popular titles, build your watchlist, and enjoy an immersive online cinema experience.";
  return getSharedMetadata(title, description);
}

export default function Home() {
  return (
    <>
      <HeroSection />
      <MoviesSection />
      <TopRatedMovies />
      <TopRatedShows />
      <PlansSection />
    </>
  );
}

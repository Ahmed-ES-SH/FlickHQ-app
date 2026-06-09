import HeroSection from "./_components/_website/_Home/HeroSection";
import MoviesSection from "./_components/_website/_Home/MoviesSection";
import PlansSection from "./_components/_website/_Home/PlansSection";
import TopRatedMovies from "./_components/_website/_Home/TopRatedMovies";
import TopRatedShows from "./_components/_website/_Home/TopRatedShows";

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

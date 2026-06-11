import { getSharedMetadata } from "@/app/_helpers/shared/SharedMetadata";
import WatchlistPageClient from "@/app/_components/_userpanal/WatchlistPageClient";

// //////////////////////////////////////////////////////////////////////////////
// ///////// Metadata for the Watchlist page ////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////

export function generateMetadata() {
  const title = "FlickHQ – Movies & TV Shows - Watchlist";
  const description =
    "View and manage your watchlist on FlickHQ. Keep track of movies and TV shows you want to watch.";

  return getSharedMetadata(title, description);
}

// //////////////////////////////////////////////////////////////////////////////
// ///////// Entry point — delegates to the client component ////////////////////
// //////////////////////////////////////////////////////////////////////////////

export default function WatchlistPage() {
  return <WatchlistPageClient />;
}

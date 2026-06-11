import { getSharedMetadata } from "@/app/_helpers/shared/SharedMetadata";
import FavouritlistPageClient from "@/app/_components/_userpanal/FavouritlistPageClient";

//////////////////////////////////////////////////////////////////////////////
///////// Metadata for the Favouritlist page /////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

export function generateMetadata() {
  const title = "FlickHQ – Movies & TV Shows - My Favorites";
  const description =
    "View and manage your favorites list on FlickHQ. Keep track of movies and TV shows you love.";

  return getSharedMetadata(title, description);
}

//////////////////////////////////////////////////////////////////////////////
///////// Entry point — delegates to the client component ////////////////////
//////////////////////////////////////////////////////////////////////////////

export default function FavouritlistPage() {
  return <FavouritlistPageClient />;
}

import { getSharedMetadata } from "@/app/_helpers/shared/SharedMetadata";
import WatchedPageClient from "@/app/_components/_userpanal/WatchedPageClient";

// //////////////////////////////////////////////////////////////////////////////
// ///////// Metadata for the Watched History page ///////////////////////////////
// //////////////////////////////////////////////////////////////////////////////

export function generateMetadata() {
  const title = "FlickHQ – Movies & TV Shows - Watched History";
  const description =
    "View your watched history on FlickHQ. Keep track of movies and TV shows you've watched.";

  return getSharedMetadata(title, description);
}

// //////////////////////////////////////////////////////////////////////////////
// ///////// Entry point — delegates to the client component ////////////////////
// //////////////////////////////////////////////////////////////////////////////

export default function WatchedPage() {
  return <WatchedPageClient />;
}

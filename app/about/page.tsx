import { getSharedMetadata } from "@/app/_helpers/shared/SharedMetadata";
import type { Metadata } from "next";
import AboutPageContent from "@/app/_components/_website/_about/AboutPageContent";

export function generateMetadata(): Metadata {
  const title = "FlickHQ – Movies & TV Shows - About Page";
  const description =
    "Learn about FlickHQ — your premier destination for movies and TV shows. Discover our story, how it works, and the features that make streaming magical.";
  return getSharedMetadata(title, description);
}

export default function AboutPage() {
  return <AboutPageContent />;
}

////////////////////////////////////////////////////////////////////////////////
///////// Static data for the Pricing page — feature cards ////////////////////
////////////////////////////////////////////////////////////////////////////////

import type { ReactNode } from "react";
import { TiBook } from "react-icons/ti";
import { TbTicket } from "react-icons/tb";
import { PiScreencastBold } from "react-icons/pi";
import { CiVideoOn } from "react-icons/ci";

export interface FeatureCardData {
  title: string;
  content: string;
  icon: ReactNode;
}

/**
 * Feature cards displayed on the Pricing page.
 * These are static product-highlight cards — not fetched from an API.
 */
export const featureCards: FeatureCardData[] = [
  {
    title: "Curated Library",
    content:
      "Explore thousands of movies, series, and documentaries — from indie gems to blockbuster hits. Our editorial team handpicks every title so you spend less time searching and more time watching.",
    icon: <TiBook className="size-10 text-accent" />,
  },
  {
    title: "Digital Premieres",
    content:
      "Get front-row access to exclusive virtual screenings and early releases. Buy digital tickets for premiere events and watch new releases alongside a global community of film lovers.",
    icon: <TbTicket className="size-10 text-accent" />,
  },
  {
    title: "Interactive Screenings",
    content:
      "Watch together with synchronized playback, live chat, and real-time reactions. Host watch parties, vote on what to play next, and turn movie night into a shared experience.",
    icon: <PiScreencastBold className="size-10 text-accent" />,
  },
  {
    title: "Behind the Scenes",
    content:
      "Go beyond the screen with exclusive director's cuts, making-of documentaries, cast interviews, and behind-the-scenes footage. See how your favorite films come to life.",
    icon: <CiVideoOn className="size-10 text-accent" />,
  },
];

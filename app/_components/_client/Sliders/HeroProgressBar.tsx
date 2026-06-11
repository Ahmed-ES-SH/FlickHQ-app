"use client";

import type { RefObject } from "react";

// //////////////////////////////////////////////////////////////////////////////
// ///////// Autoplay progress bar for HeroSlider ///////////////////////////////
// //////////////////////////////////////////////////////////////////////////////

export default function HeroProgressBar({
  progressRef,
}: {
  progressRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="absolute bottom-20 sm:bottom-24 md:bottom-28 left-4 md:left-16 right-4 md:right-16 z-30">
      <div className="h-0.5 bg-white/20 overflow-hidden">
        <div
          ref={progressRef}
          className="h-full bg-accent transition-none"
          style={{ width: "0%" }}
        />
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";

////////////////////////////////////////////////////////////////////////////////
///////// Animation variants for staggered entrance ////////////////////////////
////////////////////////////////////////////////////////////////////////////////
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
  },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

export default function AboutHero() {
  return (
    <>
      {/* Hero Heading */}
      <motion.h1
        variants={itemVariants}
        className="text-white text-3xl sm:text-4xl xl:text-6xl mb-8 font-bold tracking-tight leading-tight"
      >
        FlickHQ – Best place for movies
      </motion.h1>

      {/* Brand Story */}
      <motion.div variants={itemVariants} className="max-w-3xl mb-16">
        <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-6">
          FlickHQ is where cinema meets community. We&apos;ve built a platform
          that brings together the world&apos;s most extensive film library with
          cutting-edge streaming technology, so every movie night feels like
          opening night.
        </p>
        <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
          From indie darlings to blockbuster premieres, our curated
          collection and AI-powered discovery engine ensure you&apos;ll always
          find something that moves you. No filler, no algorithms that
          repeat the same suggestions—just great films, presented
          beautifully.
        </p>
      </motion.div>
    </>
  );
}

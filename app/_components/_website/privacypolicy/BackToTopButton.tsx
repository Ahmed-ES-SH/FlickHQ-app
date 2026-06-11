"use client";

///////////////////////////////////////////////////////////////////////////////
///////// Floating back-to-top button with animated visibility ////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowUp } from "react-icons/fi";

export default function BackToTopButton() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  /////////////////////////////////////////////////////////////////////////////
  ///////// Track scroll position to show/hide the button /////////////////////
  /////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {showBackToTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-accent hover:bg-accent/90 text-white rounded-full shadow-lg shadow-accent/25 flex items-center justify-center transition-colors z-50"
          aria-label="Back to top"
        >
          <FiArrowUp className="size-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

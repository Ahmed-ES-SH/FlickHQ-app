"use client";

///////////////////////////////////////////////////////////////////////////////
///////// Table of Contents — desktop sidebar + mobile collapsible menu //////
///////////////////////////////////////////////////////////////////////////////

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import { navSections } from "@/app/data/privacypolicy/privacyPolicy";
import type { NavSection } from "@/app/data/privacypolicy/privacyPolicy";

export default function TableOfContents() {
  const [activeSection, setActiveSection] = useState("information");
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileTocOpen(false);
    }
  };

  /////////////////////////////////////////////////////////////////////////////
  ///////// Track which section is currently in view //////////////////////////
  /////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px" },
    );

    navSections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Desktop Sticky Table of Contents */}
      <aside className="hidden lg:block">
        <div className="sticky top-32">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
            Contents
          </h3>
          <nav className="flex flex-col gap-0.5 border-l border-white/10">
            {navSections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`text-left text-sm transition-all duration-200 py-2 pl-4 -ml-px border-l ${
                  activeSection === section.id
                    ? "text-accent border-accent font-medium"
                    : "text-gray-500 border-transparent hover:text-gray-300"
                }`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile TOC Toggle */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setMobileTocOpen(!mobileTocOpen)}
          className="flex items-center gap-2 px-4 py-2.5 bg-panel_bg border border-white/10 rounded-xl text-sm font-medium text-gray-300 hover:border-accent/30 transition-colors"
        >
          {mobileTocOpen ? (
            <FiX className="size-4" />
          ) : (
            <FiMenu className="size-4" />
          )}
          {mobileTocOpen ? "Close Contents" : "View Contents"}
        </button>

        <AnimatePresence>
          {mobileTocOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 bg-panel_bg border border-white/10 rounded-xl overflow-hidden"
            >
              <div className="flex flex-col">
                {navSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`text-left text-sm px-4 py-3 transition-colors ${
                      activeSection === section.id
                        ? "text-accent bg-accent/5 font-medium"
                        : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

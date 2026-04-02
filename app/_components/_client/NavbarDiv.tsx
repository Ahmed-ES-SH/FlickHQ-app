"use client";
import { useVariables } from "@/app/context/VariablesContext";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { CiCircleList } from "react-icons/ci";
import { AnimatePresence, motion } from "framer-motion";

interface props {
  children: React.ReactNode;
}

export default function NavbarDiv({ children }: props) {
  const { scrollY, showMobail, showSidebar, setShowSidebar } = useVariables();
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname.includes("/profile")) {
      setShowSidebar(true);
    }
  }, [pathname, setShowSidebar]);

  return (
    <div
      className={`w-full fixed top-0 transition-all duration-500 left-0 z-[999] border-b border-transparent ${
        scrollY > 5 || pathname.startsWith("/profile") || showMobail
          ? "bg-black/90 backdrop-blur-md border-white/5"
          : "bg-transparent"
      }`}
    >
      <AnimatePresence>
        {!showSidebar && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setShowSidebar(true)}
            className={`w-8 h-8 cursor-pointer flex items-center justify-center text-white bg-accent absolute ${
              showMobail ? "top-72" : "top-16"
            } duration-500 left-4 z-[9] rounded-b-md hover:bg-accent/90 transition-colors`}
            aria-label="Show sidebar"
          >
            <CiCircleList className="size-5" />
          </motion.button>
        )}
      </AnimatePresence>
      {children}
    </div>
  );
}

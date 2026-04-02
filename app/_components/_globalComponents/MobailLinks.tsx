"use client";
import { useVariables } from "@/app/context/VariablesContext";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import { FaCircle } from "react-icons/fa";
import DotsNavbar from "../_client/DotsNavbar";
import { navLinks } from "@/app/constants/website";

export default function MobailLinks() {
  const { showMobail } = useVariables();
  return (
    <AnimatePresence>
      {showMobail && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="xl:hidden w-full bg-black/95 backdrop-blur-md border-b border-white/5 relative z-[100]"
        >
          <div className="flex flex-col gap-4 px-6 py-5">
            {navLinks.map((item) => {
              if (item.type === "link") {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium text-white/70 hover:text-white transition-colors py-2 min-h-[44px] flex items-center"
                  >
                    {item.label}
                  </Link>
                );
              } else if (item.type === "custom") {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 text-white/70 text-sm font-medium hover:text-white transition-colors py-2 min-h-[44px]"
                  >
                    <span className="whitespace-nowrap">{item.label}</span>
                    <FaCircle className="size-1.5 text-accent" />
                  </Link>
                );
              }
              return null;
            })}

            <div className="pt-3 mt-1 w-fit mr-auto border-t border-white/5 flex justify-center">
              <DotsNavbar />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

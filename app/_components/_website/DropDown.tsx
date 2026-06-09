"use client";
import { useVariables } from "@/app/context/VariablesContext";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { Dispatch, SetStateAction } from "react";

interface props {
  setShowDrop: Dispatch<SetStateAction<boolean>>;
  opation: { text: string; link?: string }[];
  className: string;
  dropState: boolean;
}

const dropdownVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function Dropdown({
  setShowDrop,
  opation,
  className = "",
  dropState,
}: props) {
  const { setShowMobail } = useVariables();
  const router = useRouter();

  const handleGo = (path: string) => {
    router.push(path);
    setShowDrop(false);
    setShowMobail(false);
  };
  return (
    <AnimatePresence>
      {dropState && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={dropdownVariants}
          className={className}
        >
          <ul>
            {opation.map((link) => (
              <div
                onClick={() => handleGo(link.link ? link.link : "#")}
                className="block p-1 hover:text-primary_blue duration-200 cursor-pointer"
                key={link.text}
              >
                {link.text}
              </div>
            ))}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

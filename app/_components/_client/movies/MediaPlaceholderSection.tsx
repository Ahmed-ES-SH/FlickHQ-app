"use client";

import { motion } from "framer-motion";

interface Props {
  /** Title for the placeholder section (e.g., "Cast", "Extras") */
  title: string;
}

export default function MediaPlaceholderSection({ title }: Props) {
  return (
    <motion.div
      key={title}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center py-20 text-gray-500"
    >
      <div className="text-xl font-black uppercase tracking-widest italic">
        Coming Soon
      </div>
      <p className="text-sm">
        We&apos;re working on bringing you more {title.toLowerCase()} details.
      </p>
    </motion.div>
  );
}

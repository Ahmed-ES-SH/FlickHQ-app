"use client";

import { motion } from "framer-motion";
import { FeaturesCards } from "@/app/constants/website";

////////////////////////////////////////////////////////////////////////////////
///////// Animation variants for features cards staggered entrance /////////////
////////////////////////////////////////////////////////////////////////////////
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
  },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
};

export default function FeaturesSection() {
  return (
    ////////////////////////////////////////////////////////////////////////////////
    ///////// "Subscribe features" section with staggered card entrance ////////////
    ////////////////////////////////////////////////////////////////////////////////
    <motion.div variants={containerVariants} className="w-full mt-24">
      <motion.h2
        variants={itemVariants}
        className="text-white text-2xl xl:text-4xl mb-16 font-bold"
      >
        Subscribe features
      </motion.h2>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12">
        {FeaturesCards.map((card, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{ x: 4 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-full flex items-start gap-4 lg:gap-6 p-4 rounded-xl hover:bg-white/5 transition-colors duration-300"
          >
            <div className="flex-shrink-0 mt-1 text-accent">
              {card.icon}
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-2">
                {card.title}
              </h3>
              <p className="text-gray-300 text-base xl:text-lg leading-relaxed max-w-xl">
                {card.content}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

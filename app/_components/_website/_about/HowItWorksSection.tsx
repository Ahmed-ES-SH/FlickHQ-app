"use client";

import { motion } from "framer-motion";
import { cards } from "@/app/constants/website";

////////////////////////////////////////////////////////////////////////////////
///////// Animation variants for section cards staggered entrance //////////////
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

export default function HowItWorksSection() {
  return (
    ////////////////////////////////////////////////////////////////////////////////
    ///////// "How it works" section with staggered card entrance //////////////////
    ////////////////////////////////////////////////////////////////////////////////
    <motion.div variants={containerVariants} className="w-full mt-16">
      <motion.h2
        variants={itemVariants}
        className="text-white text-2xl xl:text-4xl mb-12 font-bold"
      >
        How it works
      </motion.h2>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-8">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-full bg-panel_bg/60 border border-white/10 rounded-2xl p-8 xl:p-10 hover:border-accent/30 transition-colors duration-300"
          >
            <div className="flex items-center gap-4 lg:gap-6 mb-6">
              <div className="w-14 h-14 rounded-full font-bold flex items-center justify-center text-xl bg-accent/10 text-accent border border-accent/20">
                {card.number}
              </div>
              <h3 className="text-white text-lg xl:text-xl font-bold">
                {card.title}
              </h3>
            </div>
            <p className="text-gray-300 text-base xl:text-lg leading-relaxed">
              {card.content}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

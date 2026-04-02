/* eslint-disable react/no-unescaped-entities */
"use client";
import React from "react";
import { motion } from "framer-motion";

import PlansSection from "@/app/_components/_website/_Home/PlansSection";
import SwiperBartners from "@/app/_components/_website/_pricing/SwiperBartners";
import { cards, FeaturesCards } from "@/app/constants/website";

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
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function page() {
  return (
    <>
      <div className="lg:mt-32 mt-20 custom-container min-h-screen">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
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
              FlickHQ is where cinema meets community. We've built a platform
              that brings together the world's most extensive film library with
              cutting-edge streaming technology, so every movie night feels like
              opening night.
            </p>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
              From indie darlings to blockbuster premieres, our curated
              collection and AI-powered discovery engine ensure you'll always
              find something that moves you. No filler, no algorithms that
              repeat the same suggestions—just great films, presented
              beautifully.
            </p>
          </motion.div>

          {/* How It Works Cards */}
          <motion.div
            variants={containerVariants}
            className="w-full mt-16"
          >
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

          {/* Features Section */}
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
        </motion.div>
      </div>

      {/* Plans Section */}
      <PlansSection />

      {/* Swiper partners */}
      <div className="custom-container">
        <SwiperBartners />
      </div>
    </>
  );
}

"use client";

import { motion } from "framer-motion";
import AboutHero from "./AboutHero";
import HowItWorksSection from "./HowItWorksSection";
import FeaturesSection from "./FeaturesSection";
import PlansSection from "@/app/_components/_website/_Home/PlansSection";
import SwiperBartners from "@/app/_components/_website/_pricing/SwiperBartners";

////////////////////////////////////////////////////////////////////////////////
///////// Animation variants for outer container staggered entrance ////////////
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

export default function AboutPageContent() {
  return (
    <>
      <div className="lg:mt-32 mt-20 custom-container min-h-screen">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Section — heading + brand story */}
          <AboutHero />

          {/* How It Works — cards grid */}
          <HowItWorksSection />

          {/* Features Section — feature cards grid */}
          <FeaturesSection />
        </motion.div>
      </div>

      {/* Plans Section */}
      <PlansSection />

      {/* Partners Swiper */}
      <div className="custom-container">
        <SwiperBartners />
      </div>
    </>
  );
}

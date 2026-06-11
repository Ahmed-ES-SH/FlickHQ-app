"use client";

////////////////////////////////////////////////////////////////////////////////
///////// Pricing page — feature cards grid section ////////////////////////////
////////////////////////////////////////////////////////////////////////////////

import { motion } from "framer-motion";
import { featureCards } from "@/app/data/pricing";

interface FeatureCardsSectionProps {
  prefersReducedMotion: boolean | null;
}

export default function FeatureCardsSection({
  prefersReducedMotion,
}: FeatureCardsSectionProps) {
  return (
    <section className="mb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {featureCards.map((card) => (
          <motion.div
            key={card.title}
            className="flex gap-5 p-6 rounded-lg bg-panel_bg border border-white/5 hover:border-white/10 hover:-translate-y-0.5 transition-all duration-200"
            whileHover={!prefersReducedMotion ? { y: -2 } : undefined}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="shrink-0 mt-1">{card.icon}</div>
            <div>
              <h2 className="text-white text-lg font-semibold mb-2">
                {card.title}
              </h2>
              <p className="text-second_text text-sm leading-relaxed font-light max-w-[75ch]">
                {card.content}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

"use client";

///////////////////////////////////////////////////////////////////////////////
///////// Reusable component for rendering a single policy section ///////////
///////////////////////////////////////////////////////////////////////////////

import React from "react";
import { motion } from "framer-motion";
import type { SectionContent, Paragraph } from "@/app/data/privacypolicy/privacyPolicy";
import { contactInfo } from "@/app/data/privacypolicy/privacyPolicy";

interface PolicySectionProps {
  section: SectionContent;
}

export default function PolicySection({ section }: PolicySectionProps) {
  return (
    <section id={section.id} className="scroll-mt-32 mb-12">
      <h2 className="font-bold text-xl text-white mb-4 flex items-center gap-3">
        <span className="w-1 h-6 bg-accent rounded-full" />
        {section.title}
      </h2>
      <div className="flex flex-col gap-4 text-gray-300 leading-relaxed ml-4">
        {section.paragraphs.map((paragraph, index) => (
          <ParagraphRenderer key={index} paragraph={paragraph} />
        ))}
      </div>
    </section>
  );
}

///////////////////////////////////////////////////////////////////////////////
///////// Paragraph renderer (handles standard + contact card types) //////////
///////////////////////////////////////////////////////////////////////////////

function ParagraphRenderer({ paragraph }: { paragraph: Paragraph }) {
  /////////////////////////////////////////////////////////////////////////////
  ///////// Contact card special rendering ////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////
  if (paragraph.type === "contact") {
    return (
      <div className="bg-panel_bg border border-accent/20 rounded-xl p-6 mt-2">
        <p className="text-gray-200 font-semibold mb-2">
          {contactInfo.teamName}
        </p>
        <p className="text-gray-400 mb-1">
          Email:{" "}
          <a
            href={`mailto:${contactInfo.email}`}
            className="text-accent hover:underline transition-colors"
          >
            {contactInfo.email}
          </a>
        </p>
        <p className="text-gray-400">{contactInfo.address}</p>
      </div>
    );
  }

  /////////////////////////////////////////////////////////////////////////////
  ///////// Standard paragraph with optional subtitle /////////////////////////
  /////////////////////////////////////////////////////////////////////////////
  return (
    <motion.p
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      {paragraph.subtitle && (
        <strong className="text-gray-200">{paragraph.subtitle} </strong>
      )}
      {paragraph.text}
    </motion.p>
  );
}

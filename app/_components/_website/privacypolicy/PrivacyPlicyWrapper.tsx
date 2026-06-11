/* eslint-disable react/no-unescaped-entities */
"use client";

///////////////////////////////////////////////////////////////////////////////
///////// Privacy Policy page — orchestrates layout and composes sections /////
///////////////////////////////////////////////////////////////////////////////

import { motion } from "framer-motion";
import TableOfContents from "./TableOfContents";
import PolicySection from "./PolicySection";
import BackToTopButton from "./BackToTopButton";
import { sectionContents } from "@/app/data/privacypolicy/privacyPolicy";

export default function PrivacyPolicyWrapper() {
  return (
    <div className="lg:mt-32 mt-20 min-h-screen pb-16">
      <div className="w-[95%] max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">
        <TableOfContents />

        {/* Main Content */}
        <main>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="mb-10 pb-8 border-b border-white/10">
              <h1 className="text-white text-3xl xl:text-5xl mb-3 font-bold tracking-tight">
                Privacy Policy
              </h1>
              <p className="text-sm text-gray-500">
                Last Updated: April 2, 2026
              </p>
            </div>

            <p className="text-base text-gray-300 mb-5 leading-relaxed">
              FlickHQ (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is
              committed to protecting your privacy. This Privacy Policy explains
              how we collect, use, disclose, and safeguard your information when
              you visit our website or use our streaming services. Please read
              this policy carefully. If you do not agree with the terms of this
              policy, please do not access the site.
            </p>

            <p className="text-base text-gray-300 mb-12 leading-relaxed">
              We reserve the right to make changes to this Privacy Policy at any
              time and for any reason. We will alert you about any changes by
              updating the &quot;Last Updated&quot; date at the top of this
              page.
            </p>

            {/* Render all policy sections from data */}
            {sectionContents.map((section) => (
              <PolicySection key={section.id} section={section} />
            ))}

            {/* Footer Note */}
            <div className="mt-12 pt-8 border-t border-white/10">
              <p className="text-gray-500 text-sm italic">
                By using FlickHQ, you acknowledge that you have read and
                understood this Privacy Policy and agree to its terms.
              </p>
            </div>
          </motion.div>
        </main>
      </div>

      <BackToTopButton />
    </div>
  );
}

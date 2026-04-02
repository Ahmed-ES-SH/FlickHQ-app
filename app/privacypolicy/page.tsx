/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiArrowUp } from "react-icons/fi";

const sections = [
  { id: "information", label: "1. Information We Collect" },
  { id: "usage", label: "2. How We Use Your Information" },
  { id: "cookies", label: "3. Cookies & Tracking" },
  { id: "sharing", label: "4. Data Sharing & Disclosure" },
  { id: "rights", label: "5. Your Rights & Choices" },
  { id: "security", label: "6. Data Security" },
  { id: "children", label: "7. Children's Privacy" },
  { id: "transfers", label: "8. International Transfers" },
  { id: "changes", label: "9. Changes to Policy" },
  { id: "contact", label: "10. Contact Us" },
];

export default function PrivacyPolicy() {
  const [activeSection, setActiveSection] = useState("information");
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileTocOpen(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px" }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="lg:mt-32 mt-20 min-h-screen pb-16">
      <div className="w-[95%] max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">
        {/* Desktop Sticky Table of Contents */}
        <aside className="hidden lg:block">
          <div className="sticky top-32">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Contents
            </h3>
            <nav className="flex flex-col gap-0.5 border-l border-white/10">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`text-left text-sm transition-all duration-200 py-2 pl-4 -ml-px border-l ${
                    activeSection === section.id
                      ? "text-accent border-accent font-medium"
                      : "text-gray-500 border-transparent hover:text-gray-300"
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile TOC Toggle */}
        <div className="lg:hidden mb-6">
          <button
            onClick={() => setMobileTocOpen(!mobileTocOpen)}
            className="flex items-center gap-2 px-4 py-2.5 bg-panel_bg border border-white/10 rounded-xl text-sm font-medium text-gray-300 hover:border-accent/30 transition-colors"
          >
            {mobileTocOpen ? (
              <FiX className="size-4" />
            ) : (
              <FiMenu className="size-4" />
            )}
            {mobileTocOpen ? "Close Contents" : "View Contents"}
          </button>

          <AnimatePresence>
            {mobileTocOpen && (
              <motion.nav
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-3 bg-panel_bg border border-white/10 rounded-xl overflow-hidden"
              >
                <div className="flex flex-col">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`text-left text-sm px-4 py-3 transition-colors ${
                        activeSection === section.id
                          ? "text-accent bg-accent/5 font-medium"
                          : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                      }`}
                    >
                      {section.label}
                    </button>
                  ))}
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </div>

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
              FlickHQ ("we," "our," or "us") is committed to protecting your
              privacy. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you visit our
              website or use our streaming services. Please read this policy
              carefully. If you do not agree with the terms of this policy,
              please do not access the site.
            </p>

            <p className="text-base text-gray-300 mb-12 leading-relaxed">
              We reserve the right to make changes to this Privacy Policy at any
              time and for any reason. We will alert you about any changes by
              updating the "Last Updated" date at the top of this page.
            </p>

            {/* Section 1 */}
            <section id="information" className="scroll-mt-32 mb-12">
              <h2 className="font-bold text-xl text-white mb-4 flex items-center gap-3">
                <span className="w-1 h-6 bg-accent rounded-full" />
                1. Information We Collect
              </h2>
              <div className="flex flex-col gap-4 text-gray-300 leading-relaxed ml-4">
                <p>
                  <strong className="text-gray-200">1.1 Personal Data:</strong>{" "}
                  We may collect personally identifiable information that you
                  voluntarily provide when you create an account, subscribe to a
                  plan, or contact us. This includes your name, email address,
                  payment information, and profile preferences.
                </p>
                <p>
                  <strong className="text-gray-200">1.2 Usage Data:</strong> We
                  automatically collect information about how you interact with
                  our services, including viewing history, search queries,
                  watchlist activity, device information, IP address, browser
                  type, and access times.
                </p>
                <p>
                  <strong className="text-gray-200">1.3 Third-Party Data:</strong>{" "}
                  Our platform integrates with The Movie Database (TMDB) API to
                  provide movie and TV show metadata, ratings, and imagery. When
                  you use our services, TMDB may collect anonymized usage data
                  in accordance with their own privacy policy.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="usage" className="scroll-mt-32 mb-12">
              <h2 className="font-bold text-xl text-white mb-4 flex items-center gap-3">
                <span className="w-1 h-6 bg-accent rounded-full" />
                2. How We Use Your Information
              </h2>
              <div className="flex flex-col gap-4 text-gray-300 leading-relaxed ml-4">
                <p>
                  <strong className="text-gray-200">2.1 Service Delivery:</strong>{" "}
                  We use your information to provide, maintain, and improve our
                  streaming services, including personalized recommendations,
                  watchlist synchronization, and cross-device continuity.
                </p>
                <p>
                  <strong className="text-gray-200">2.2 Personalization:</strong>{" "}
                  We analyze your viewing habits and preferences to curate
                  content recommendations tailored to your interests.
                </p>
                <p>
                  <strong className="text-gray-200">2.3 Communication:</strong>{" "}
                  We may send you service-related announcements, plan updates,
                  promotional offers, and newsletters. You can opt out of
                  marketing communications at any time.
                </p>
                <p>
                  <strong className="text-gray-200">2.4 Security & Compliance:</strong>{" "}
                  We process your data to detect fraud, enforce our terms of
                  service, and comply with applicable legal obligations.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section id="cookies" className="scroll-mt-32 mb-12">
              <h2 className="font-bold text-xl text-white mb-4 flex items-center gap-3">
                <span className="w-1 h-6 bg-accent rounded-full" />
                3. Cookies and Tracking Technologies
              </h2>
              <div className="flex flex-col gap-4 text-gray-300 leading-relaxed ml-4">
                <p>
                  <strong className="text-gray-200">3.1 Essential Cookies:</strong>{" "}
                  These are required for the core functionality of our services,
                  such as maintaining your login session and remembering your
                  preferences.
                </p>
                <p>
                  <strong className="text-gray-200">3.2 Analytics Cookies:</strong>{" "}
                  We use analytics tools to understand how users interact with
                  our platform. This helps us improve performance, fix bugs, and
                  optimize the user experience.
                </p>
                <p>
                  <strong className="text-gray-200">3.3 Managing Cookies:</strong>{" "}
                  You can control cookie preferences through your browser
                  settings. Note that disabling certain cookies may affect the
                  functionality of our services.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section id="sharing" className="scroll-mt-32 mb-12">
              <h2 className="font-bold text-xl text-white mb-4 flex items-center gap-3">
                <span className="w-1 h-6 bg-accent rounded-full" />
                4. Data Sharing and Disclosure
              </h2>
              <div className="flex flex-col gap-4 text-gray-300 leading-relaxed ml-4">
                <p>
                  <strong className="text-gray-200">4.1 Third-Party Services:</strong>{" "}
                  We share limited data with trusted partners such as payment
                  processors, analytics providers, and the TMDB API to deliver
                  our services. These partners are bound by confidentiality
                  agreements and may not use your data for any other purpose.
                </p>
                <p>
                  <strong className="text-gray-200">4.2 Legal Requirements:</strong>{" "}
                  We may disclose your information if required by law,
                  regulation, legal process, or governmental request.
                </p>
                <p>
                  <strong className="text-gray-200">4.3 Business Transfers:</strong>{" "}
                  In the event of a merger, acquisition, or sale of assets, your
                  personal information may be transferred as part of that
                  transaction.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section id="rights" className="scroll-mt-32 mb-12">
              <h2 className="font-bold text-xl text-white mb-4 flex items-center gap-3">
                <span className="w-1 h-6 bg-accent rounded-full" />
                5. Your Rights and Choices
              </h2>
              <div className="flex flex-col gap-4 text-gray-300 leading-relaxed ml-4">
                <p>
                  <strong className="text-gray-200">5.1 Access and Correction:</strong>{" "}
                  You have the right to access, update, or correct your personal
                  information at any time through your account settings.
                </p>
                <p>
                  <strong className="text-gray-200">5.2 Data Deletion:</strong>{" "}
                  You may request the deletion of your account and associated
                  personal data. Please note that some information may be
                  retained for legal or legitimate business purposes.
                </p>
                <p>
                  <strong className="text-gray-200">5.3 Opt-Out:</strong> You can
                  unsubscribe from marketing communications by clicking the
                  "unsubscribe" link in any email we send. You cannot opt out of
                  service-related communications.
                </p>
                <p>
                  <strong className="text-gray-200">5.4 Data Portability:</strong>{" "}
                  Upon request, we will provide you with a copy of your personal
                  data in a structured, machine-readable format.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section id="security" className="scroll-mt-32 mb-12">
              <h2 className="font-bold text-xl text-white mb-4 flex items-center gap-3">
                <span className="w-1 h-6 bg-accent rounded-full" />
                6. Data Security
              </h2>
              <div className="flex flex-col gap-4 text-gray-300 leading-relaxed ml-4">
                <p>
                  We implement industry-standard security measures to protect
                  your personal information, including encryption in transit
                  (HTTPS/TLS), secure payment processing, and regular security
                  audits. However, no method of transmission over the Internet
                  or electronic storage is 100% secure, and we cannot guarantee
                  absolute security.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section id="children" className="scroll-mt-32 mb-12">
              <h2 className="font-bold text-xl text-white mb-4 flex items-center gap-3">
                <span className="w-1 h-6 bg-accent rounded-full" />
                7. Children's Privacy
              </h2>
              <div className="flex flex-col gap-4 text-gray-300 leading-relaxed ml-4">
                <p>
                  Our services are not intended for children under the age of
                  13. We do not knowingly collect personal information from
                  children under 13. If we become aware that we have
                  inadvertently collected such data, we will take steps to delete
                  it promptly. Parents who believe we may have collected
                  information about a child under 13 should contact us
                  immediately.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section id="transfers" className="scroll-mt-32 mb-12">
              <h2 className="font-bold text-xl text-white mb-4 flex items-center gap-3">
                <span className="w-1 h-6 bg-accent rounded-full" />
                8. International Data Transfers
              </h2>
              <div className="flex flex-col gap-4 text-gray-300 leading-relaxed ml-4">
                <p>
                  Your information may be transferred to and processed in
                  countries other than your country of residence. These countries
                  may have data protection laws that differ from those in your
                  jurisdiction. We ensure that appropriate safeguards are in
                  place to protect your information in accordance with this
                  policy.
                </p>
              </div>
            </section>

            {/* Section 9 */}
            <section id="changes" className="scroll-mt-32 mb-12">
              <h2 className="font-bold text-xl text-white mb-4 flex items-center gap-3">
                <span className="w-1 h-6 bg-accent rounded-full" />
                9. Changes to This Policy
              </h2>
              <div className="flex flex-col gap-4 text-gray-300 leading-relaxed ml-4">
                <p>
                  We may update this Privacy Policy from time to time to reflect
                  changes in our practices, technology, legal requirements, or
                  other factors. When we make significant changes, we will notify
                  you through a prominent notice on our website or via email. We
                  encourage you to review this policy periodically.
                </p>
              </div>
            </section>

            {/* Section 10 */}
            <section id="contact" className="scroll-mt-32 mb-12">
              <h2 className="font-bold text-xl text-white mb-4 flex items-center gap-3">
                <span className="w-1 h-6 bg-accent rounded-full" />
                10. Contact Us
              </h2>
              <div className="flex flex-col gap-4 text-gray-300 leading-relaxed ml-4">
                <p>
                  If you have questions or concerns about this Privacy Policy or
                  our data practices, please contact us at:
                </p>
                <div className="bg-panel_bg border border-accent/20 rounded-xl p-6 mt-2">
                  <p className="text-gray-200 font-semibold mb-2">
                    FlickHQ Privacy Team
                  </p>
                  <p className="text-gray-400 mb-1">
                    Email:{" "}
                    <a
                      href="mailto:privacy@flickhq.com"
                      className="text-accent hover:underline transition-colors"
                    >
                      privacy@flickhq.com
                    </a>
                  </p>
                  <p className="text-gray-400">
                    Address: 123 Streaming Lane, Los Angeles, CA 90001
                  </p>
                </div>
              </div>
            </section>

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

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 w-12 h-12 bg-accent hover:bg-accent/90 text-white rounded-full shadow-lg shadow-accent/25 flex items-center justify-center transition-colors z-50"
            aria-label="Back to top"
          >
            <FiArrowUp className="size-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

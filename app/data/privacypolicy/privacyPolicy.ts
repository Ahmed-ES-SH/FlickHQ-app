///////////////////////////////////////////////////////////////////////////////
///////// Static data for the Privacy Policy page /////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export interface Paragraph {
  subtitle?: string;
  text?: string;
  type?: "standard" | "contact";
}

export interface SectionContent {
  id: string;
  title: string;
  paragraphs: Paragraph[];
}

export interface NavSection {
  id: string;
  label: string;
}

///////////////////////////////////////////////////////////////////////////////
///////// Navigation sections (used in Table of Contents) /////////////////////
///////////////////////////////////////////////////////////////////////////////

export const navSections: NavSection[] = [
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

///////////////////////////////////////////////////////////////////////////////
///////// Contact card information ////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export const contactInfo = {
  teamName: "FlickHQ Privacy Team",
  email: "privacy@flickhq.com",
  address: "123 Streaming Lane, Los Angeles, CA 90001",
};

///////////////////////////////////////////////////////////////////////////////
///////// Full policy section content /////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export const sectionContents: SectionContent[] = [
  {
    id: "information",
    title: "1. Information We Collect",
    paragraphs: [
      {
        subtitle: "1.1 Personal Data:",
        text: "We may collect personally identifiable information that you voluntarily provide when you create an account, subscribe to a plan, or contact us. This includes your name, email address, payment information, and profile preferences.",
      },
      {
        subtitle: "1.2 Usage Data:",
        text: "We automatically collect information about how you interact with our services, including viewing history, search queries, watchlist activity, device information, IP address, browser type, and access times.",
      },
      {
        subtitle: "1.3 Third-Party Data:",
        text: "Our platform integrates with The Movie Database (TMDB) API to provide movie and TV show metadata, ratings, and imagery. When you use our services, TMDB may collect anonymized usage data in accordance with their own privacy policy.",
      },
    ],
  },
  {
    id: "usage",
    title: "2. How We Use Your Information",
    paragraphs: [
      {
        subtitle: "2.1 Service Delivery:",
        text: "We use your information to provide, maintain, and improve our streaming services, including personalized recommendations, watchlist synchronization, and cross-device continuity.",
      },
      {
        subtitle: "2.2 Personalization:",
        text: "We analyze your viewing habits and preferences to curate content recommendations tailored to your interests.",
      },
      {
        subtitle: "2.3 Communication:",
        text: "We may send you service-related announcements, plan updates, promotional offers, and newsletters. You can opt out of marketing communications at any time.",
      },
      {
        subtitle: "2.4 Security & Compliance:",
        text: "We process your data to detect fraud, enforce our terms of service, and comply with applicable legal obligations.",
      },
    ],
  },
  {
    id: "cookies",
    title: "3. Cookies and Tracking Technologies",
    paragraphs: [
      {
        subtitle: "3.1 Essential Cookies:",
        text: "These are required for the core functionality of our services, such as maintaining your login session and remembering your preferences.",
      },
      {
        subtitle: "3.2 Analytics Cookies:",
        text: "We use analytics tools to understand how users interact with our platform. This helps us improve performance, fix bugs, and optimize the user experience.",
      },
      {
        subtitle: "3.3 Managing Cookies:",
        text: "You can control cookie preferences through your browser settings. Note that disabling certain cookies may affect the functionality of our services.",
      },
    ],
  },
  {
    id: "sharing",
    title: "4. Data Sharing and Disclosure",
    paragraphs: [
      {
        subtitle: "4.1 Third-Party Services:",
        text: "We share limited data with trusted partners such as payment processors, analytics providers, and the TMDB API to deliver our services. These partners are bound by confidentiality agreements and may not use your data for any other purpose.",
      },
      {
        subtitle: "4.2 Legal Requirements:",
        text: "We may disclose your information if required by law, regulation, legal process, or governmental request.",
      },
      {
        subtitle: "4.3 Business Transfers:",
        text: "In the event of a merger, acquisition, or sale of assets, your personal information may be transferred as part of that transaction.",
      },
    ],
  },
  {
    id: "rights",
    title: "5. Your Rights and Choices",
    paragraphs: [
      {
        subtitle: "5.1 Access and Correction:",
        text: "You have the right to access, update, or correct your personal information at any time through your account settings.",
      },
      {
        subtitle: "5.2 Data Deletion:",
        text: "You may request the deletion of your account and associated personal data. Please note that some information may be retained for legal or legitimate business purposes.",
      },
      {
        subtitle: "5.3 Opt-Out:",
        text: "You can unsubscribe from marketing communications by clicking the \"unsubscribe\" link in any email we send. You cannot opt out of service-related communications.",
      },
      {
        subtitle: "5.4 Data Portability:",
        text: "Upon request, we will provide you with a copy of your personal data in a structured, machine-readable format.",
      },
    ],
  },
  {
    id: "security",
    title: "6. Data Security",
    paragraphs: [
      {
        text: "We implement industry-standard security measures to protect your personal information, including encryption in transit (HTTPS/TLS), secure payment processing, and regular security audits. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.",
      },
    ],
  },
  {
    id: "children",
    title: "7. Children's Privacy",
    paragraphs: [
      {
        text: "Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have inadvertently collected such data, we will take steps to delete it promptly. Parents who believe we may have collected information about a child under 13 should contact us immediately.",
      },
    ],
  },
  {
    id: "transfers",
    title: "8. International Data Transfers",
    paragraphs: [
      {
        text: "Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from those in your jurisdiction. We ensure that appropriate safeguards are in place to protect your information in accordance with this policy.",
      },
    ],
  },
  {
    id: "changes",
    title: "9. Changes to This Policy",
    paragraphs: [
      {
        text: "We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make significant changes, we will notify you through a prominent notice on our website or via email. We encourage you to review this policy periodically.",
      },
    ],
  },
  {
    id: "contact",
    title: "10. Contact Us",
    paragraphs: [
      {
        text: "If you have questions or concerns about this Privacy Policy or our data practices, please contact us at:",
      },
      {
        type: "contact",
      },
    ],
  },
];

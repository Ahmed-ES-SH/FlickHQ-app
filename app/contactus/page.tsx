// //////////////////////////////////////////////////////////////////////////////
// /////// Contact Us page — Server Component entry point /////////////////////
// //////////////////////////////////////////////////////////////////////////////

import { getSharedMetadata } from "@/app/_helpers/shared/SharedMetadata";
import type { Metadata } from "next";
import ContactForm from "@/app/_components/_website/_contact/ContactForm";
import ContactInfoSection from "@/app/_components/_website/_contact/ContactInfoSection";
import SwiperBartners from "@/app/_components/_website/_pricing/SwiperBartners";

export function generateMetadata(): Metadata {
  const title = "FlickHQ – Movies & TV Shows - Contact Us Page";
  const description =
    "Get in touch with FlickHQ. Send us a message, reach out via email, or connect on social media. We're here to help with your questions and feedback.";
  return getSharedMetadata(title, description);
}

export default function ContactPage() {
  return (
    <>
      <div className="lg:mt-32 mt-20 custom-container min-h-screen">
        <h1 className="text-gray-200 text-2xl xl:text-5xl mb-12">Contact Us</h1>
        <div className="max-lg:flex-col flex items-start justify-between w-full gap-6 mt-12">
          <ContactForm />
          <ContactInfoSection />
        </div>
        <SwiperBartners />
      </div>
    </>
  );
}

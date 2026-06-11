// //////////////////////////////////////////////////////////////////////////////
// /////// Contact info sidebar — Server Component ////////////////////////////
// //////////////////////////////////////////////////////////////////////////////

import { FaPhone } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { socialIcons, CONTACT_INFO } from "@/app/data/contact";

export default function ContactInfoSection() {
  return (
    ////////////////////////////////////////////////////////////////////////////////
    ///////// Static contact info panel (phone, email, social links) ///////////////
    ////////////////////////////////////////////////////////////////////////////////
    <div className="lg:flex-[40%] w-full flex-1 flex flex-col gap-4 max-lg:pt-5 max-lg:border-t max-lg:border-gray-600">
      <h1 className="text-white text-xl lg:text-4xl">Info</h1>
      <p className="text-lg text-white leading-8">{CONTACT_INFO.description}</p>

      {/* Phone Number */}
      <div className="flex items-baseline gap-2 md:mt-6">
        <FaPhone className="text-primary_blue size-6 lg:size-8 rotate-[150deg]" />
        <p className="cursor-pointer hover:text-primary_blue duration-300 lg:text-xl text-lg text-white">
          {CONTACT_INFO.phone}
        </p>
      </div>

      {/* Email */}
      <div className="flex items-center gap-2 mt-2">
        <MdEmail className="text-primary_blue size-6 lg:size-8" />
        <p className="cursor-pointer hover:text-primary_blue duration-300 lg:text-xl text-lg text-white">
          {CONTACT_INFO.email}
        </p>
      </div>

      {/* Social Icons */}
      <div className="flex items-center gap-6 mt-6">
        {socialIcons.map((item, index) => (
          <div
            key={index}
            className={`w-10 h-10 hover:-translate-y-2 duration-200 cursor-pointer rounded-full ${item.bg_color} flex items-center justify-center`}
          >
            {item.icon}
          </div>
        ))}
      </div>
    </div>
  );
}

// //////////////////////////////////////////////////////////////////////////////
// /////// Contact page static data ///////////////////////////////////////////
// //////////////////////////////////////////////////////////////////////////////

import type { ReactNode } from "react";
import { BiLogoFacebook } from "react-icons/bi";
import { FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { CiInstagram } from "react-icons/ci";

export interface SocialIcon {
  icon: ReactNode;
  bg_color: string;
}

export const socialIcons: SocialIcon[] = [
  { icon: <BiLogoFacebook className="size-6" />, bg_color: "bg-[#1877f2]" },
  { icon: <FaXTwitter className="size-6" />, bg_color: "bg-[#000000]" },
  { icon: <CiInstagram className="size-6" />, bg_color: "bg-[#f56040]" },
  { icon: <FaTiktok className="size-6" />, bg_color: "bg-[#000000]" },
];

export const CONTACT_INFO = {
  description:
    "It is a long fact that a reader will be distracted by the readable content of a page when looking at its layout",
  phone: "+1 809 234-56-78",
  email: "support@FlickHQ.template",
} as const;

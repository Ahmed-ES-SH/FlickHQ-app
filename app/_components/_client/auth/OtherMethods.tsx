"use client";
import React from "react";

import { toast } from "sonner";
import { FaFacebookF, FaXTwitter, FaGoogle } from "react-icons/fa6";
export default function OtherMethods() {
  const handleClickTwitter = () => {
    toast.warning("This Will be Available Soon .");
  };

  const socialButtons = [
    {
      name: "Google",
      // onClick: () => signInWith("oauth_google"),
      borderColor: "border-white/10",
      hoverBg: "hover:bg-white",
      hoverText: "hover:text-black",
      icon: <FaGoogle className="size-5" />,
    },
    {
      name: "Facebook",
      // onClick: () => signInWith("oauth_facebook"),
      borderColor: "border-white/10",
      hoverBg: "hover:bg-[#1877F2]",
      hoverText: "hover:text-white",
      icon: <FaFacebookF className="size-5" />,
    },
    {
      name: "Twitter",
      onClick: handleClickTwitter,
      borderColor: "border-white/10",
      hoverBg: "hover:bg-white",
      hoverText: "hover:text-black",
      icon: <FaXTwitter className="size-5" />,
    },
  ];
  return (
    <div className="flex justify-center gap-6 w-full">
      {socialButtons.map(({ name, onClick, borderColor, hoverBg, hoverText, icon }) => (
        <button
          key={name}
          onClick={onClick}
          className={`flex-1 flex items-center justify-center py-3 rounded-xl border ${borderColor} ${hoverBg} ${hoverText} text-white transition-all duration-500 ease-out cursor-pointer group`}
          aria-label={`Sign in with ${name}`}
        >
          <span className="group-hover:scale-110 transition-transform duration-300">
            {icon}
          </span>
        </button>
      ))}
    </div>
  );
}

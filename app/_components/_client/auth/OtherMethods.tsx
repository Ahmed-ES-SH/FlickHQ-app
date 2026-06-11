"use client";
import React, { useState } from "react";

import { VscLoading } from "react-icons/vsc";
import { toast } from "sonner";
import { FaFacebookF, FaXTwitter, FaGoogle } from "react-icons/fa6";
import { API_ENDPOINTS } from "@/app/constants/apis";

export default function OtherMethods() {
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleClickTwitter = () => {
    toast.warning("This Will be Available Soon .");
  };

  const handleClickFacebook = () => {
    toast.warning("This Will be Available Soon .");
  };

  const handleClickGoogle = () => {
    if (googleLoading) return;
    setGoogleLoading(true);
    const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!baseURL) {
      toast.error("Backend URL is not configured");
      setGoogleLoading(false);
      return;
    }
    window.location.href = `${baseURL}${API_ENDPOINTS.AUTH.google}`;
  };

  const socialButtons = [
    {
      name: "Google",
      onClick: handleClickGoogle,
      disabled: googleLoading,
      borderColor: googleLoading ? "border-white/20" : "border-white/10",
      hoverBg: "hover:bg-white",
      hoverText: "hover:text-black",
      icon: googleLoading ? (
        <VscLoading className="size-5 animate-spin" />
      ) : (
        <FaGoogle className="size-5" />
      ),
    },
    {
      name: "Facebook",
      onClick: handleClickFacebook,
      disabled: false,
      borderColor: "border-white/10",
      hoverBg: "hover:bg-[#1877F2]",
      hoverText: "hover:text-white",
      icon: <FaFacebookF className="size-5" />,
    },
    {
      name: "Twitter",
      onClick: handleClickTwitter,
      disabled: false,
      borderColor: "border-white/10",
      hoverBg: "hover:bg-white",
      hoverText: "hover:text-black",
      icon: <FaXTwitter className="size-5" />,
    },
  ];
  return (
    <div className="flex justify-center gap-6 w-full">
      {socialButtons.map(({ name, onClick, disabled, borderColor, hoverBg, hoverText, icon }) => (
        <button
          key={name}
          onClick={onClick}
          disabled={disabled}
          className={`flex-1 flex items-center justify-center py-3 rounded-xl border ${borderColor} ${hoverBg} ${hoverText} text-white transition-all duration-500 ease-out cursor-pointer group disabled:opacity-60 disabled:cursor-not-allowed`}
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

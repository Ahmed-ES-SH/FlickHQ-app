"use client";
import React, { useRef, useState } from "react";
import Dropdown from "../_website/DropDown";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { opation_nav } from "@/app/constants/website";
import { useClickOutside } from "@/app/hooks/useClickOutside";

export default function DotsNavbar() {
  const [showDrop, setShowDrop] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setShowDrop(false));

  const handleToggle = () => {
    setShowDrop((prev) => !prev);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={handleToggle}
        className="w-10 h-10 flex items-center justify-center rounded-md text-white/60 hover:text-white hover:bg-white/5 transition-colors"
        aria-label="More options"
      >
        <BiDotsHorizontalRounded className="size-5" />
      </button>
      <Dropdown
        setShowDrop={setShowDrop}
        dropState={showDrop}
        className="w-[180px] max-h-[240px] absolute top-10 overflow-y-auto p-2 rounded-md bg-[#141414] border border-white/5 text-white z-[999]"
        opation={opation_nav}
      />
    </div>
  );
}

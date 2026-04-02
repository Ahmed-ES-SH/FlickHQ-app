"use client";
import Link from "next/link";
import React from "react";
import { PiSignIn } from "react-icons/pi";

export default function Signinbtn() {
  return (
    <Link
      href={"/signin"}
      className="flex items-center gap-2 bg-accent px-5 py-2 rounded-md text-white text-sm font-medium hover:bg-accent/90 transition-colors active:scale-[0.98]"
      aria-label="Go to sign in page"
    >
      <PiSignIn className="w-4 h-4" />
      <span className="max-sm:hidden whitespace-nowrap">Sign in</span>
    </Link>
  );
}

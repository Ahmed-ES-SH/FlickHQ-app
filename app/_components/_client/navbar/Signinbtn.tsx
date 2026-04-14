"use client";
import Link from "next/link";
import React from "react";
import { PiSignIn, PiSignOut } from "react-icons/pi";
import { useAuth } from "@/app/context/AuthContext";
import Image from "next/image";

export default function Signinbtn() {
  const { isAuthenticated, user, logout } = useAuth();

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/profile" className="flex items-center gap-2 group">
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10 group-hover:border-accent duration-300">
            <Image
              src={user?.avatar || "/website/avatar.jpg"}
              alt={user?.name || "User"}
              fill
              className="object-cover"
            />
          </div>
          <span className="text-white text-sm font-medium max-lg:hidden group-hover:text-accent duration-300">
            {user?.name}
          </span>
        </Link>
        <button
          onClick={logout}
          className="p-2 text-gray-400 hover:text-accent duration-300 transition-colors"
          title="Logout"
        >
          <PiSignOut className="w-5 h-5" />
        </button>
      </div>
    );
  }

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

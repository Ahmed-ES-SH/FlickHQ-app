"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaEye, FaHeart, FaList, FaUser } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { LuLogIn } from "react-icons/lu";
import { toast } from "sonner";
import { useAuthStore } from "@/app/_stores/authStore";
import { logoutAction } from "@/app/_actions/auth";
import { useClickOutside } from "@/app/hooks/useClickOutside";

const menuItems = [
  { label: "Profile", icon: FaUser, href: "/userpanal" },
  { label: "Watched", icon: FaEye, href: "/userpanal/watched" },
  { label: "Watchlist", icon: FaList, href: "/userpanal/watchlist" },
  { label: "Favorites", icon: FaHeart, href: "/userpanal/favouritlist" },
  { label: "Subscriptions", icon: FaHeart, href: "/userpanal/subscription" },
];

// Brand easing: cubic-bezier(0.16, 1, 0.3, 1) — per design system
const brandEasing = [0.16, 1, 0.3, 1] as const;

const dropdownVariants = {
  hidden: { opacity: 0, y: -6, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: brandEasing },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.96,
    transition: { duration: 0.12, ease: brandEasing },
  },
};

export default function UserButton() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const clear = useAuthStore((s) => s.clear);

  useClickOutside(ref, () => setOpen(false));

  // Close on Escape, restore focus to trigger button
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const handleLogout = async () => {
    setOpen(false);
    try {
      await logoutAction();
      clear();
      toast.info("Signed out successfully");
      router.push("/signin");
      router.refresh();
    } catch {
      toast.error("Failed to sign out. Please try again.");
    }
  };

  if (!isAuthenticated) {
    return (
      <Link
        href="/signin"
        className="touch-target flex items-center gap-2 bg-accent px-5 py-2 rounded-md text-white text-sm font-medium hover:bg-accent/90 transition-colors duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        aria-label="Sign in to your account"
      >
        <LuLogIn className="w-4 h-4" aria-hidden="true" />
        <span className="max-sm:hidden whitespace-nowrap">Sign in</span>
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen((prev) => !prev)}
        className="touch-target flex items-center gap-2 group rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={user?.name ? `User menu for ${user.name}` : "User menu"}
      >
        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10 group-hover:border-accent transition-colors duration-300">
          <Image
            src={user?.avatar || "/website/avatar.jpg"}
            alt={user?.name || user?.email || "User avatar"}
            fill
            className="object-cover"
            sizes="32px"
          />
        </div>
        <span className="text-white text-sm font-medium max-lg:hidden group-hover:text-accent transition-colors duration-300">
          {user?.name?.split(" ")[0] ?? user?.email?.slice(0, 10) ?? ""}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="menu"
            aria-orientation="vertical"
            aria-label="User navigation"
            className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-primary_dash border border-glass_border shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-glass_border">
              <p className="text-white text-sm font-medium truncate">
                {user?.name || "User"}
              </p>
              <p className="text-light_text text-xs truncate mt-0.5">
                {user?.email}
              </p>
            </div>

            <div className="py-1">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-second_text hover:text-white hover:bg-white/5 transition-colors duration-150 focus-visible:outline-none focus-visible:bg-white/5 focus-visible:text-white"
                >
                  <item.icon
                    className="w-4 h-4 text-accent shrink-0"
                    aria-hidden="true"
                  />
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="border-t border-glass_border py-1">
              <button
                onClick={handleLogout}
                role="menuitem"
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-second_text hover:text-white hover:bg-white/5 transition-colors duration-150 focus-visible:outline-none focus-visible:bg-white/5 focus-visible:text-white"
              >
                <MdLogout
                  className="w-4 h-4 text-accent shrink-0"
                  aria-hidden="true"
                />
                Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

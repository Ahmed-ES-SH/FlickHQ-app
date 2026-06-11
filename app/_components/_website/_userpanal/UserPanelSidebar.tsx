"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LuUser,
  LuLogOut,
  LuMenu,
  LuX,
  LuEye,
  LuBookmark,
  LuHeart,
  LuRadio,
  LuList,
  LuMail,
} from "react-icons/lu";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/app/_stores/authStore";
import { logoutAction } from "@/app/_actions/auth";
import { toast } from "sonner";

// ─── Navigation Items ─────────────────────────────

const navItems = [
  { label: "Overview", href: "/userpanal", icon: LuUser },
  { label: "Watched", href: "/userpanal/watched", icon: LuEye },
  { label: "Watchlist", href: "/userpanal/watchlist", icon: LuBookmark },
  { label: "Favorites", href: "/userpanal/favouritlist", icon: LuHeart },
  { label: "Subscription", href: "/userpanal/subscription", icon: LuRadio },
  {
    label: "Contact Messages",
    href: "/userpanal/contact-messages",
    icon: LuMail,
  },
];

// ─── Component ─────────────────────────────────────

export default function UserPanelSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const clear = useAuthStore((s) => s.clear);
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const check = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) setIsOpen(true);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const closeMobile = () => {
    if (!isDesktop) setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logoutAction();
      clear();
      toast.info("Signed out successfully");
      router.push("/signin");
      router.refresh();
    } catch {
      toast.error("Logout failed");
    }
  };

  const isActive = (href: string) => {
    if (href === "/userpanal") return pathname === "/userpanal";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile toggle */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bg-accent bottom-4 right-4 p-4 flex items-center justify-center rounded-full  z-100 text-white lg:hidden"
          aria-label="Open sidebar"
        >
          <LuMenu className="size-6" />
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay (mobile) */}
            {!isDesktop && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-9999 bg-black/60 backdrop-blur-sm lg:hidden"
                onClick={closeMobile}
              />
            )}

            {/* Sidebar */}
            <motion.aside
              initial={isDesktop ? false : { x: -280, opacity: 0 }}
              animate={isDesktop ? {} : { x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={`fixed top-0 left-0 z-99999 h-screen w-70 bg-panel_bg border-r border-glass_border flex flex-col ${
                isDesktop ? "lg:sticky lg:top-18 lg:h-[calc(100vh-72px)]" : ""
              }`}
            >
              {/* Close button (mobile) */}
              <div className="flex items-center justify-between p-4 border-b border-glass_border lg:hidden">
                <span className="text-white font-bold text-lg tracking-tight">
                  Menu
                </span>
                <button
                  onClick={closeMobile}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Close sidebar"
                >
                  <LuX className="size-5" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 p-3 space-y-1 overflow-y-auto pt-4 lg:pt-6">
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobile}
                      className={`group flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all relative ${
                        active
                          ? "bg-accent/10 text-accent"
                          : "text-second_text hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {/* Active indicator (red left bar) */}
                      {active && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-4 rounded-r bg-accent" />
                      )}
                      <Icon className="size-5 shrink-0" />
                      {item.label}
                    </Link>
                  );
                })}

                {/* Divider */}
                <div className="h-px bg-glass_border my-3" />

                {/* Sign Out */}
                <button
                  onClick={handleLogout}
                  className="w-full group flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all"
                >
                  <LuLogOut className="size-5 shrink-0" />
                  Sign Out
                </button>
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

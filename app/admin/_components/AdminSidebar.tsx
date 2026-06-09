"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaHome, FaLayerGroup, FaPlus, FaCog } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { useAuthStore } from "@/app/_stores/authStore";
import { logoutAction } from "@/app/_actions/auth";
import { toast } from "sonner";

const adminLinks = [
  {
    text: "Plans",
    icon: <FaLayerGroup className="text-accent" />,
    link: "/admin/plans",
  },
  {
    text: "Create Plan",
    icon: <FaPlus className="text-accent" />,
    link: "/admin/plans/create",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const user = useAuthStore((s) => s.user);
  const clear = useAuthStore((s) => s.clear);

  useEffect(() => {
    const checkWidth = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) setShowSidebar(true);
    };
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

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

  const isActive = (link: string) => {
    if (link === "/admin/plans") {
      return pathname === "/admin/plans" || pathname.startsWith("/admin/plans/create");
    }
    return pathname === link;
  };

  return (
    <>
      {!showSidebar && !isDesktop && (
        <FaBars
          onClick={() => setShowSidebar(true)}
          className="fixed top-4 left-4 z-[100] text-white size-6 cursor-pointer lg:hidden"
        />
      )}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 left-0 z-[99] h-screen w-[280px] max-lg:w-[300px] bg-fourth_color border-r border-glass_border flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-glass_border">
              <div className="flex items-center justify-between">
                <Link href="/admin/plans" className="text-white font-bold text-lg tracking-tight">
                  Admin Panel
                </Link>
                <RxCross1
                  onClick={() => setShowSidebar(false)}
                  className="text-red-400 cursor-pointer size-5 lg:hidden"
                />
              </div>
              {user && (
                <p className="text-gray-400 text-xs mt-1 truncate">
                  {user.name || user.email}
                  <span className="ml-1 text-accent">(Admin)</span>
                </p>
              )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {adminLinks.map((item) => (
                <Link
                  key={item.link}
                  href={item.link}
                  onClick={() => !isDesktop && setShowSidebar(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive(item.link)
                      ? "bg-accent/10 text-white font-medium"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="size-4 flex items-center justify-center">{item.icon}</span>
                  {item.text}
                </Link>
              ))}
            </nav>

            {/* Bottom actions */}
            <div className="p-3 border-t border-glass_border space-y-1">
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <FaHome className="size-4 text-accent" />
                Back to Site
              </Link>
              <Link
                href="/profile"
                onClick={() => !isDesktop && setShowSidebar(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <FaCog className="size-4 text-accent" />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                <svg className="size-4 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                </svg>
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

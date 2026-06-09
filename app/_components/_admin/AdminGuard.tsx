"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/_stores/authStore";
import { VscLoading } from "react-icons/vsc";

interface AdminGuardProps {
  children: React.ReactNode;
}

/**
 * AdminGuard wraps admin pages and verifies the user has the ADMIN role.
 * Redirects non-admin users to the home page.
 */
export default function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/signin?next=/admin/plans");
      return;
    }

    if (user.role !== "admin") {
      router.replace("/");
      return;
    }
  }, [user, loading, router]);

  // Still loading auth state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <VscLoading className="text-accent text-3xl animate-spin" />
      </div>
    );
  }

  // Not authenticated or not admin — don't render children (redirect will fire)
  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <VscLoading className="text-accent text-3xl animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}

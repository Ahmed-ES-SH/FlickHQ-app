import type { Metadata } from "next";
import AdminSidebar from "./_components/AdminSidebar";
import AdminGuard from "@/app/_components/_admin/AdminGuard";

export const metadata: Metadata = {
  title: "Admin – FlickHQ",
  description: "FlickHQ administration panel",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="flex w-full min-h-screen bg-main_bg">
        <AdminSidebar />
        <main className="flex-1 ml-[280px] max-lg:ml-0 mt-[72px]">
          <div className="p-4 lg:p-8 max-w-[1400px] mx-auto">{children}</div>
        </main>
      </div>
    </AdminGuard>
  );
}

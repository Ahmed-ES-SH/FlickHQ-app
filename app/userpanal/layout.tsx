import type { Metadata } from "next";
import UserPanelSidebar from "@/app/_components/_website/_userpanal/UserPanelSidebar";

export const metadata: Metadata = {
  title: "User Panel – FlickHQ",
  description: "Manage your FlickHQ account, security, and preferences.",
};

export default function UserPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full min-h-screen bg-main_bg pt-[72px]">
      <UserPanelSidebar />
      <main className="flex-1 min-w-0 ">
        <div className="w-full px-4 lg:px-8 py-6 lg:py-8">{children}</div>
      </main>
    </div>
  );
}

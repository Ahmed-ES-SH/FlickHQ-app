import Sidebar from "@/app/_components/_website/_profile/Sidebar";
import React from "react";

interface props {
  children: React.ReactNode;
}

export default function ProfileLayout({ children }: props) {
  return (
    <>
      <div className="flex w-full gap-4 min-h-screen">
        <Sidebar />
        <div className="w-full mt-20">{children}</div>
      </div>
    </>
  );
}

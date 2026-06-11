"use client";

// //////////////////////////////////////////////////////////////////////////////
// ///////// DeviceItem — shows a logged-in device with logout button //////////
// //////////////////////////////////////////////////////////////////////////////

import type { ReactNode } from "react";
import { comingSoonToast } from "@/app/_helpers/helpers";

interface DeviceItemProps {
  icon: ReactNode;
  name: string;
  detail: string;
}

export default function DeviceItem({ icon, name, detail }: DeviceItemProps) {
  return (
    <div className="py-4 flex justify-between items-center border-b border-white/5 last:border-0">
      <div className="flex items-center gap-4">
        <span className="text-accent p-2 bg-fourth_color rounded">{icon}</span>
        <div>
          <p className="text-sm text-white font-medium">{name}</p>
          <p className="text-[11px] text-second_text">{detail}</p>
        </div>
      </div>
      <button
        onClick={() => comingSoonToast("Device logout")}
        className="text-xs text-accent font-medium hover:underline"
      >
        Logout
      </button>
    </div>
  );
}

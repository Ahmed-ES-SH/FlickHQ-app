// //////////////////////////////////////////////////////////////////////////////
// ///////// SubscriptionActiveDevices — list of active streaming devices //////
// //////////////////////////////////////////////////////////////////////////////

import { LuTv, LuSmartphone, LuLaptop } from "react-icons/lu";
import DeviceItem from "./SubscriptionDeviceItem";

interface ActiveDevicesProps {
  isFree: boolean;
}

export default function SubscriptionActiveDevices({ isFree }: ActiveDevicesProps) {
  return (
    <div className="bg-panel_bg border border-white/5 p-5 rounded-xl space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Active Devices</h3>
        {isFree ? (
          <span className="text-xs text-second_text">
            Available on paid plans
          </span>
        ) : (
          <span className="text-xs text-second_text">
            0 of — concurrent streams active
          </span>
        )}
      </div>
      {isFree ? (
        <div className="py-6 text-center text-sm text-second_text">
          <p>Upgrade to a paid plan to manage your devices.</p>
        </div>
      ) : (
        <div className="divide-y divide-white/5">
          <DeviceItem
            icon={<LuTv className="size-5" />}
            name="Living Room TV"
            detail="Sony Bravia 4K • Active Now"
          />
          <DeviceItem
            icon={<LuSmartphone className="size-5" />}
            name="iPhone"
            detail="iPhone • Last used 2h ago"
          />
          <DeviceItem
            icon={<LuLaptop className="size-5" />}
            name="Laptop"
            detail="MacBook Pro • Last used 1d ago"
          />
        </div>
      )}
    </div>
  );
}

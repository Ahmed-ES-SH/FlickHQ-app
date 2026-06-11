// //////////////////////////////////////////////////////////////////////////////
// ///////// SubscriptionProfileOverview — user avatar, name, member since ////
// //////////////////////////////////////////////////////////////////////////////

import Image from "next/image";
import StatCard from "./SubscriptionStatCard";
import type { User } from "@/app/types/auth";

interface ProfileOverviewProps {
  user: Partial<User>;
  displayName: string;
  memberSince: string;
  avatarLetter: string;
  isFree: boolean;
}

export default function SubscriptionProfileOverview({
  user,
  displayName,
  memberSince,
  avatarLetter,
  isFree,
}: ProfileOverviewProps) {
  return (
    <div className="bg-panel_bg border border-white/5 p-5 rounded-xl flex flex-col md:flex-row justify-between items-center gap-5">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-accent bg-fourth_color flex items-center justify-center">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={displayName}
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-3xl text-gray-600 font-bold">
                {avatarLetter}
              </span>
            )}
          </div>
          {!isFree ? (
            <span className="absolute -bottom-2 -right-2 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
              PRO
            </span>
          ) : null}
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-white">
            {displayName}
          </h1>
          <p className="text-sm text-second_text">
            Member since {memberSince}
          </p>
        </div>
      </div>

      <div className="flex gap-4 w-full md:w-auto overflow-x-auto">
        <StatCard value="42" label="Movies Watched" />
        <StatCard value="18" label="Series Binged" />
        <StatCard value="187h" label="Total Time" />
      </div>
    </div>
  );
}

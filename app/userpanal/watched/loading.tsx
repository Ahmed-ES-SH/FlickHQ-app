import { LuEye } from "react-icons/lu";
import { ListSkeleton } from "@/app/_components/_globalComponents/ListSkeleton";

export default function WatchedLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-2">
            <LuEye className="text-accent" />
            Watched History
          </h1>
          <p className="text-second_text text-sm mt-1">Loading your history…</p>
        </div>
      </div>
      <ListSkeleton count={8} />
    </div>
  );
}

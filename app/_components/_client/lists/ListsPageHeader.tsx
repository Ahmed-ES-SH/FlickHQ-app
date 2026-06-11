"use client";

import { LuList, LuPlus } from "react-icons/lu";

//////////////////////////////////////////////////////////////////////////////
///////// ListsPageHeader — Reusable header for the lists page ///////////////
//////////////////////////////////////////////////////////////////////////////

interface ListsPageHeaderProps {
  subtitle: string;
  showCreateButton?: boolean;
  onCreateClick?: () => void;
}

export default function ListsPageHeader({
  subtitle,
  showCreateButton = false,
  onCreateClick,
}: ListsPageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white flex items-center gap-2">
          <LuList className="text-accent" />
          My Lists
        </h1>
        <p className="text-second_text text-sm mt-1">{subtitle}</p>
      </div>
      {showCreateButton && onCreateClick && (
        <button
          onClick={onCreateClick}
          className="flex items-center gap-2 bg-accent text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-red-700 active:scale-95 transition-all duration-200 shrink-0"
        >
          <LuPlus className="size-4" />
          Create List
        </button>
      )}
    </div>
  );
}

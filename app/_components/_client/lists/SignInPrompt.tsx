"use client";

import { LuList } from "react-icons/lu";
import Link from "next/link";

//////////////////////////////////////////////////////////////////////////////
///////// SignInPrompt — Prompt shown when user is not authenticated /////////
//////////////////////////////////////////////////////////////////////////////

export default function SignInPrompt() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <LuList className="size-12 text-second_text/40 mb-4" />
      <h2 className="text-xl font-bold text-white mb-2">Sign in required</h2>
      <p className="text-second_text text-sm max-w-md mb-6">
        Sign in to create and manage custom lists.
      </p>
      <Link
        href="/signin"
        className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-lg text-sm font-bold hover:bg-red-700 active:scale-95 transition-all duration-200"
      >
        Sign In
      </Link>
    </div>
  );
}

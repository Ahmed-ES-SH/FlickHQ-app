"use client";

import Link from "next/link";
import type { ReactNode } from "react";

// ─── Props ────────────────────────────────────────────

interface SignInPromptProps {
  /** The icon element displayed above the heading */
  icon: ReactNode;
  /** Short heading text (e.g. "Sign in required") */
  title?: string;
  /** Description explaining why sign-in is needed */
  description: string;
}

// ─── Component ────────────────────────────────────────
// Reusable sign-in prompt shown when an unauthenticated user
// tries to access a profile/list page that requires authentication.

export function SignInPrompt({
  icon,
  title = "Sign in required",
  description,
}: SignInPromptProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="size-12 text-second_text/40 mb-4">{icon}</div>
      <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
      <p className="text-second_text text-sm max-w-md mb-6">{description}</p>
      <Link
        href="/signin"
        className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-lg text-sm font-bold hover:bg-red-700 active:scale-95 transition-all duration-200"
      >
        Sign In
      </Link>
    </div>
  );
}

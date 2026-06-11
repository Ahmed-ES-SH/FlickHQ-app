import { Suspense } from "react";
import type { Metadata } from "next";
import { getSharedMetadata } from "@/app/_helpers/shared/SharedMetadata";
import VerifyEmailContent from "@/app/_components/_client/auth/VerifyEmailContent";
import ResetShell from "@/app/_components/_client/auth/ResetShell";

// //////////////////////////////////////////////////////////////////////////////
// /////// Verify Email page — Server Component entry point /////////////////////
// //////////////////////////////////////////////////////////////////////////////

export function generateMetadata(): Metadata {
  const title = "FlickHQ – Movies & TV Shows - Verify Email";
  const description =
    "Verify your email address to activate your FlickHQ account and start watching movies and TV shows.";
  return getSharedMetadata(title, description);
}

export default function VerifyEmailPage() {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-black font-sans selection:bg-accent selection:text-white">
      <Suspense
        fallback={
          <ResetShell
            icon="loading"
            title="Verification"
            message="Verifying your email..."
          />
        }
      >
        <VerifyEmailContent />
      </Suspense>
    </div>
  );
}

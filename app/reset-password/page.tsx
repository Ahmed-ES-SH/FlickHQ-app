import { Suspense } from "react";
import type { Metadata } from "next";
import { getSharedMetadata } from "@/app/_helpers/shared/SharedMetadata";
import ResetPasswordContent from "@/app/_components/_client/auth/ResetPasswordContent";
import ResetShell from "@/app/_components/_client/auth/ResetShell";

// //////////////////////////////////////////////////////////////////////////////
// /////// Reset Password page — Server Component entry point //////////////////
// //////////////////////////////////////////////////////////////////////////////

export function generateMetadata(): Metadata {
  const title = "FlickHQ – Movies & TV Shows - Reset Password";
  const description =
    "Set a new password for your FlickHQ account. Enter your new password and confirm it to regain access to your account.";
  return getSharedMetadata(title, description);
}

export default function ResetPasswordPage() {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center bg-black font-sans selection:bg-accent selection:text-white">
      <Suspense
        fallback={
          <ResetShell
            icon="loading"
            title="Loading"
            message="Preparing reset form..."
          />
        }
      >
        <ResetPasswordContent />
      </Suspense>
    </div>
  );
}

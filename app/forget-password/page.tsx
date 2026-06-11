import { getSharedMetadata } from "@/app/_helpers/shared/SharedMetadata";
import type { Metadata } from "next";
import AuthBackground from "@/app/_components/_client/auth/AuthBackground";
import AuthGlowEffect from "@/app/_components/_client/auth/AuthGlowEffect";
import ForgetPasswordContent from "@/app/_components/_client/auth/ForgetPasswordContent";

// //////////////////////////////////////////////////////////////////////////////
// /////// Forget Password page — Server Component entry point /////////////////
// //////////////////////////////////////////////////////////////////////////////

export function generateMetadata(): Metadata {
  const title = "FlickHQ – Movies & TV Shows - Forgot Password";
  const description =
    "Forgot your password? Enter your email to receive a password reset link and regain access to your FlickHQ account.";
  return getSharedMetadata(title, description);
}

export default function ForgetPasswordPage() {
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center lg:justify-start overflow-hidden bg-black font-sans selection:bg-accent selection:text-white">
      <AuthBackground />
      <ForgetPasswordContent />
      <AuthGlowEffect
        className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] pointer-events-none"
        duration={14}
      />
    </div>
  );
}

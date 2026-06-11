import { getSharedMetadata } from "@/app/_helpers/shared/SharedMetadata";
import type { Metadata } from "next";
import AuthBackground from "@/app/_components/_client/auth/AuthBackground";
import AuthContentWrapper from "@/app/_components/_client/auth/AuthContentWrapper";
import AuthHeading from "@/app/_components/_client/auth/AuthHeading";
import AuthFormCard from "@/app/_components/_client/auth/AuthFormCard";
import AuthGlowEffect from "@/app/_components/_client/auth/AuthGlowEffect";
import SigninForm from "@/app/_components/_client/auth/SigninForm";

export function generateMetadata(): Metadata {
  const title = "FlickHQ – Movies & TV Shows - Login Page";
  const description =
    "Sign in to your FlickHQ account to watch movies and TV shows, continue watching, save your favorites, and access your personalized cinema experience.";
  return getSharedMetadata(title, description);
}

export default function SignInPage() {
  return (
    <div className="relative w-full min-h-screen mt-16 max-md:mt-20 flex items-center justify-center overflow-hidden bg-black font-sans selection:bg-accent selection:text-white">
      <AuthBackground />
      <AuthContentWrapper>
        <div className="flex flex-col gap-5 sm:gap-6 md:gap-8">
          <AuthHeading
            title="Ready to"
            highlight="Watch?"
            subtitle="Unlimited movies, TV shows, and more."
            subtitleItalic="Sign in to resume your journey."
          />
          <AuthFormCard>
            <SigninForm />
          </AuthFormCard>
        </div>
      </AuthContentWrapper>
      <AuthGlowEffect />
    </div>
  );
}

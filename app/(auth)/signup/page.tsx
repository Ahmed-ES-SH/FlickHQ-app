import { getSharedMetadata } from "@/app/_helpers/shared/SharedMetadata";
import type { Metadata } from "next";
import AuthBackground from "@/app/_components/_client/auth/AuthBackground";
import AuthContentWrapper from "@/app/_components/_client/auth/AuthContentWrapper";
import AuthHeading from "@/app/_components/_client/auth/AuthHeading";
import AuthFormCard from "@/app/_components/_client/auth/AuthFormCard";
import AuthGlowEffect from "@/app/_components/_client/auth/AuthGlowEffect";
import SignupForm from "@/app/_components/_client/auth/SignupForm";

export function generateMetadata(): Metadata {
  const title = "FlickHQ – Movies & TV Shows - Sign Up Page";
  const description =
    "Create your FlickHQ account to access unlimited movies and TV shows. Join millions of movie enthusiasts and start your cinematic journey today.";
  return getSharedMetadata(title, description);
}

export default function SignUpPage() {
  return (
    <div className="relative w-full min-h-screen max-md:mt-20 mt-16 flex items-center justify-center lg:justify-start overflow-hidden bg-black font-sans selection:bg-accent selection:text-white">
      <AuthBackground />
      <AuthContentWrapper>
        <div className="flex flex-col gap-5 sm:gap-6 md:gap-8">
          <AuthHeading
            title="Start Your"
            highlight="Experience."
            subtitle="Join millions of movie enthusiasts."
            subtitleItalic="Your cinematic journey begins now."
          />
          <AuthFormCard>
            <SignupForm />
          </AuthFormCard>
        </div>
      </AuthContentWrapper>
      <AuthGlowEffect
        className="absolute top-[-10%] right-[-5%] w-175 h-175 bg-accent/10 rounded-full blur-[160px] pointer-events-none"
        xAnimation={[0, -20, 0]}
        yAnimation={[0, 20, 0]}
        duration={12}
      />
    </div>
  );
}

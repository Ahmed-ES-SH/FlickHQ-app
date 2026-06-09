import type { Metadata } from "next";
import { Outfit, Newsreader } from "next/font/google";
import Navbar from "./_components/_globalComponents/Navbar";
import Footer from "./_components/_globalComponents/Footer";
import ClientLayout from "./_components/_globalComponents/ClientLayout";

import { Toaster } from "sonner";
import { globalRequest } from "./_helpers/globalRequest";
import { API_ENDPOINTS } from "./constants/apis";
import type { CurrentUserResponse } from "./types/auth";
import type { CurrentUserSubscriptionDto } from "./types/subscriptions";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FlickHQ – Movies & TV Shows, Online cinema",
  description: "FlickHQ – Movies & TV Shows, Online cinema",
};

async function getInitialAuthData(): Promise<{
  user: CurrentUserResponse | null;
  subscription: CurrentUserSubscriptionDto | null;
}> {
  try {
    const res = await globalRequest({
      endpoint: API_ENDPOINTS.AUTH.currentUser,
      method: "GET",
      defaultErrorMessage: "Not authenticated",
    });
    if (res.success && res.data) {
      const data = res.data as {
        user: CurrentUserResponse;
        subscription: CurrentUserSubscriptionDto | null;
      };
      return {
        user: data.user,
        subscription: data.subscription ?? null,
      };
    }
  } catch {
    // silent fail -> treated as logged out
  }
  return { user: null, subscription: null };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user: initialUser, subscription: initialSubscription } =
    await getInitialAuthData();

  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${newsreader.variable} font-sans antialiased`}
      >
        <ClientLayout
          initialUser={initialUser}
          initialSubscription={initialSubscription}
        >
          <Navbar />
          <Toaster richColors position="top-right" />
          {children}
          <Footer />
        </ClientLayout>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Outfit, Newsreader } from "next/font/google";
import Navbar from "./_components/_globalComponents/Navbar";
import Footer from "./_components/_globalComponents/Footer";
import ClientLayout from "./_components/_globalComponents/ClientLayout";

import { Toaster } from "sonner";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${newsreader.variable} font-sans antialiased`}>
        <ClientLayout>
          <Navbar />
          <Toaster richColors position="top-right" />
          {children}
          <Footer />
        </ClientLayout>
      </body>
    </html>
  );
}

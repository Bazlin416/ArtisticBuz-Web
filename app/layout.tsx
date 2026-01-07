import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/auth-context";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CookieConsent } from "@/components/CookieConsent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://artisticbuz.com"),

  title: {
    default: "ArtisticBuz – Hair Graft Calculator & Hair Restoration Insights",
    template: "%s | ArtisticBuz",
  },

  description:
    "Estimate hair graft requirements, explore hair restoration options, and read expert-backed hair loss insights using our professional hair graft calculator.",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    siteName: "ArtisticBuz",
    locale: "en_US",
    title: "ArtisticBuz – Hair Graft Calculator",
    description:
      "Use a professional hair graft calculator and explore expert insights on hair restoration and hair loss.",
    url: "https://artisticbuz.com",
  },

  twitter: {
    card: "summary_large_image",
    title: "ArtisticBuz – Hair Graft Calculator",
    description:
      "Estimate hair graft needs and explore expert hair restoration insights.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <CookieConsent />
        </AuthProvider>
      </body>
    </html>
  );
}




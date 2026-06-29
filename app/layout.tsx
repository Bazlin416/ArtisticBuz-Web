import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/contexts/auth-context";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CookieConsent } from "@/components/CookieConsent";
import Script from 'next/script'
import MetaPixel from '@/components/MetaPixel'

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
    images: [
      {
        url: "https://artisticbuz.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "ArtisticBuz – Hair Graft Calculator",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "ArtisticBuz – Hair Graft Calculator",
    description:
      "Estimate hair graft needs and explore expert hair restoration insights.",
    images: ["https://artisticbuz.com/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '742765721814649');
          fbq('track', 'PageView');
        `,
          }}
        />
        <Script
          id="buzcall-voice-widget"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
           (function(w,d,s,o,f,js){
    w[o]=w[o]||function(){(w[o].q=w[o].q||[]).push(arguments)};
    js=d.createElement(s);js.id=o;js.src=f;js.async=1;
    (d.head||d.body).appendChild(js);
  }(window,document,'script','vw','https://buzcall.ai/widget/embed.js'));
  vw('init', 'wgt_ymS8wuyv_stTKgAvBEwcuJ36');
        `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=742765721814649&ev=PageView&noscript=1"
          />
        </noscript>
      </head>

      <body className={inter.className}>
        <AuthProvider>
          <MetaPixel />

          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />

          <CookieConsent />
        </AuthProvider>
      </body>

    </html>
  );
}




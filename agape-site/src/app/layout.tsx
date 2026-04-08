import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import GrainOverlay from "@/components/effects/GrainOverlay";
import { PageTransition } from "@/components/layout/PageTransition";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://agapemusic.us"
  ),
  title: {
    default: "AGAPE | Pushing the Limits of Electronic Music in NYC's Underground",
    template: "%s | AGAPE Music",
  },
  description:
    "New York underground electronic music platform and record label. Events, resident DJs, and community in Brooklyn.",
  openGraph: {
    title: "AGAPE | Underground Electronic Music — Brooklyn, NY",
    description: "New York underground electronic music platform and record label. Events, resident DJs, and community in Brooklyn.",
    siteName: "AGAPE Music",
    url: "https://agapemusic.us",
    type: "website",
    locale: "en_US",
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AGAPE | Underground Electronic Music — Brooklyn, NY",
    description: "New York underground electronic music platform and record label. Events, resident DJs, and community in Brooklyn.",
    images: ["/images/og-image.jpg"],
  },
  icons: {
    icon: "/images/favicon.png",
    apple: "/images/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SmoothScroll>
          <PageTransition>
            <GrainOverlay />
            <Navbar />
            <main>{children}</main>
            <Footer />
          </PageTransition>
        </SmoothScroll>
      </body>
    </html>
  );
}

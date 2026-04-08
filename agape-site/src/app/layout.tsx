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
    "Pushing the Limits of Electronic Music in NYC's Underground.",
  openGraph: {
    title: "AGAPE",
    description: "Pushing the Limits of Electronic Music in NYC's Underground.",
    type: "website",
    locale: "en_US",
    images: ["/images/webclip.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AGAPE",
    description: "Pushing the Limits of Electronic Music in NYC's Underground.",
  },
  icons: {
    icon: "/images/favicon.png",
    apple: "/images/webclip.png",
  },
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

import { StaticPage } from "@/components/layout/StaticPage";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Contact",
  description: "Bookings, press, and partnership inquiries for AGAPE Music.",
  path: "/contact",
  noindex: true,
});

export default function ContactPage() {
  return (
    <StaticPage
      eyebrow="05"
      title="Get In Touch"
      description="For bookings, press, and partnerships, reach out directly at bookings@agapemusic.us."
      primaryHref="mailto:bookings@agapemusic.us"
      primaryLabel="Email Us"
      secondaryHref="/"
      secondaryLabel="Back Home"
    />
  );
}

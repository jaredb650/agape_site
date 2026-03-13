import { StaticPage } from "@/components/layout/StaticPage";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Contact",
  description: "Contact AGAPE for bookings, partnerships, and inquiries.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <StaticPage
      eyebrow="05"
      title="Get In Touch"
      description="Bookings and general inquiries can still go directly through the footer email links. This route now stays live while the full contact workflow is finalized."
      primaryHref="/#contact"
      primaryLabel="Go to Contact Section"
      secondaryHref="/"
      secondaryLabel="Back Home"
    />
  );
}

import { StaticPage } from "@/components/layout/StaticPage";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Terms",
  description: "Terms of service for AGAPE Music.",
  path: "/terms",
  noindex: true,
});

export default function TermsPage() {
  return (
    <StaticPage
      eyebrow="Legal"
      title="Terms of Service"
      description="Our full terms of service are being finalized. For any questions, contact legal@agapemusic.us."
      primaryHref="mailto:legal@agapemusic.us"
      primaryLabel="Contact Us"
      secondaryHref="/"
      secondaryLabel="Back Home"
    />
  );
}

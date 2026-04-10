import { StaticPage } from "@/components/layout/StaticPage";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Privacy",
  description: "Privacy policy for AGAPE Music.",
  path: "/privacy",
  noindex: true,
});

export default function PrivacyPage() {
  return (
    <StaticPage
      eyebrow="Legal"
      title="Privacy Policy"
      description="Our full privacy policy is being finalized. For any privacy or data questions, contact privacy@agapemusic.us."
      primaryHref="mailto:privacy@agapemusic.us"
      primaryLabel="Contact Us"
      secondaryHref="/"
      secondaryLabel="Back Home"
    />
  );
}

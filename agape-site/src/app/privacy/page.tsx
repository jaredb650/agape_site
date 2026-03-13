import { StaticPage } from "@/components/layout/StaticPage";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Privacy",
  description: "Privacy information for the AGAPE website.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <StaticPage
      eyebrow="Legal"
      title="Privacy"
      description="This placeholder keeps the legal footer links functional. A full privacy policy can replace it later without changing the current site structure."
      primaryHref="/"
      primaryLabel="Back Home"
    />
  );
}

import { StaticPage } from "@/components/layout/StaticPage";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Terms",
  description: "Terms information for the AGAPE website.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <StaticPage
      eyebrow="Legal"
      title="Terms"
      description="This placeholder keeps the legal footer links functional. A full terms page can replace it later without changing the current site structure."
      primaryHref="/"
      primaryLabel="Back Home"
    />
  );
}

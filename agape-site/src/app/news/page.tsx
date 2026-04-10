import { StaticPage } from "@/components/layout/StaticPage";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "News",
  description: "The latest from AGAPE — announcements, editorials, and updates from the collective.",
  path: "/news",
  noindex: true,
});

export default function NewsPage() {
  return (
    <StaticPage
      eyebrow="03"
      title="News"
      description="Editorial archive coming soon. Follow along on Instagram for announcements and updates."
      primaryHref="https://instagram.com/agapenyc"
      primaryLabel="Instagram"
      secondaryHref="/"
      secondaryLabel="Back Home"
    />
  );
}

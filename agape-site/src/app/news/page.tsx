import { StaticPage } from "@/components/layout/StaticPage";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "News",
  description: "Updates, editorials, and announcements from AGAPE.",
  path: "/news",
});

export default function NewsPage() {
  return (
    <StaticPage
      eyebrow="03"
      title="News Feed In Progress"
      description="This route now exists so the live site no longer advertises dead links. It can be expanded into a proper editorial archive when content is ready."
      primaryHref="/"
      primaryLabel="Back Home"
    />
  );
}

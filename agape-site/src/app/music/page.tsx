import { StaticPage } from "@/components/layout/StaticPage";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Music",
  description: "AGAPE music releases and listening links.",
  path: "/music",
});

export default function MusicPage() {
  return (
    <StaticPage
      eyebrow="02"
      title="Music Archive In Progress"
      description="This route is now intentionally live instead of resolving to a 404. It preserves the current footer navigation while the dedicated release pages are wired up."
      primaryHref="/"
      primaryLabel="Back Home"
    />
  );
}

import { StaticPage } from "@/components/layout/StaticPage";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Music",
  description: "AGAPE Records releases — techno, trance, and hard dance from NYC's underground.",
  path: "/music",
  noindex: true,
});

export default function MusicPage() {
  return (
    <StaticPage
      eyebrow="02"
      title="Music"
      description="Releases from the AGAPE Records catalog are coming soon. In the meantime, follow us on SoundCloud for the latest."
      primaryHref="https://soundcloud.com/agape-nyc"
      primaryLabel="SoundCloud"
      secondaryHref="/"
      secondaryLabel="Back Home"
    />
  );
}

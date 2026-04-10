import { StaticPage } from "@/components/layout/StaticPage";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "About",
  description: "AGAPE is a Brooklyn-based electronic music collective and record label pushing NYC's underground forward.",
  path: "/about",
  noindex: true,
});

export default function AboutPage() {
  return (
    <StaticPage
      eyebrow="04"
      title="About AGAPE"
      description="A Brooklyn-based collective building the next chapter of NYC's underground. Read the full story on the home page."
      primaryHref="/#about"
      primaryLabel="Read More"
      secondaryHref="/"
      secondaryLabel="Back Home"
    />
  );
}

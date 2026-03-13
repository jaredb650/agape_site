import { StaticPage } from "@/components/layout/StaticPage";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "About",
  description: "About AGAPE and the collective behind the events.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <StaticPage
      eyebrow="04"
      title="About AGAPE"
      description="The homepage narrative section remains the primary about experience. This route now mirrors that content direction without leaving users in a 404."
      primaryHref="/#about"
      primaryLabel="Read the About Section"
      secondaryHref="/"
      secondaryLabel="Back Home"
    />
  );
}

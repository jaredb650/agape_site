import { StaticPage } from "@/components/layout/StaticPage";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Events",
  description: "Upcoming AGAPE events and ticket information.",
  path: "/events",
});

export default function EventsPage() {
  return (
    <StaticPage
      eyebrow="01"
      title="Events Are Moving Here Next"
      description="The homepage section is live now. This route is kept active so the current navigation and calls-to-action do not break while the dedicated events experience is being built."
      primaryHref="/#events"
      primaryLabel="View Events Section"
      secondaryHref="/"
      secondaryLabel="Back Home"
    />
  );
}

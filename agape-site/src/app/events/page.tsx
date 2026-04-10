import { StaticPage } from "@/components/layout/StaticPage";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata({
  title: "Events",
  description: "Upcoming AGAPE events in Brooklyn and beyond. Ticket links, lineups, and venues.",
  path: "/events",
  noindex: true,
});

export default function EventsPage() {
  return (
    <StaticPage
      eyebrow="01"
      title="Upcoming Events"
      description="Every upcoming show, lineup, and ticket link lives on the home page for now."
      primaryHref="/#events"
      primaryLabel="View Events"
      secondaryHref="/"
      secondaryLabel="Back Home"
    />
  );
}

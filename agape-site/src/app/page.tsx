import { organizationSchema } from "@/lib/seo";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema()),
        }}
      />

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-5xl font-bold uppercase tracking-wider md:text-7xl lg:text-8xl">
            AGAPE
          </h1>
          <p className="mt-4 font-body text-lg text-tertiary-light md:text-xl">
            Pushing the Limits of Electronic Music in NYC&apos;s Underground.
          </p>
        </div>
      </section>

      {/* Upcoming Events Preview */}
      <section className="mx-auto max-w-[940px] px-6 py-section">
        <h2 className="font-display text-3xl font-bold uppercase tracking-wider md:text-4xl">
          Upcoming Events
        </h2>
        <p className="mt-4 text-tertiary-light">
          Events will be loaded from Sanity CMS once connected.
        </p>
      </section>

      {/* Featured Music Preview */}
      <section className="mx-auto max-w-[940px] px-6 py-section">
        <h2 className="font-display text-3xl font-bold uppercase tracking-wider md:text-4xl">
          Latest Releases
        </h2>
        <p className="mt-4 text-tertiary-light">
          Music releases will be loaded from Sanity CMS once connected.
        </p>
      </section>
    </>
  );
}

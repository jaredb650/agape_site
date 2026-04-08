import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://agapemusic.us";

interface SeoParams {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  type?: "website" | "article";
}

export function generatePageMetadata({
  title,
  description,
  path,
  ogImage = `/images/og-image.jpg`,
  type = "website",
}: SeoParams): Metadata {
  const url = `${SITE_URL}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type,
      images: [ogImage.startsWith("http") ? ogImage : `${SITE_URL}${ogImage}`],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// ===== JSON-LD Schema Builders =====

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AGAPE Music",
    url: SITE_URL,
    logo: `${SITE_URL}/images/agape_logo_white.png`,
    description:
      "Pushing the Limits of Electronic Music in NYC's Underground.",
    sameAs: [],
  };
}

export function eventSchema(event: {
  title: string;
  date: string;
  endDate?: string;
  venue?: string;
  location?: string;
  description?: string;
  ticketUrl?: string;
  ticketPrice?: string;
  image?: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: event.title,
    startDate: event.date,
    ...(event.endDate && { endDate: event.endDate }),
    url: `${SITE_URL}/events/${event.slug}`,
    ...(event.venue && {
      location: {
        "@type": "Place",
        name: event.venue,
        address: {
          "@type": "PostalAddress",
          addressLocality: event.location || "New York",
          addressRegion: "NY",
          addressCountry: "US",
        },
      },
    }),
    ...(event.description && { description: event.description }),
    ...(event.image && { image: event.image }),
    ...(event.ticketUrl && {
      offers: {
        "@type": "Offer",
        url: event.ticketUrl,
        ...(event.ticketPrice && { price: event.ticketPrice }),
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
      },
    }),
    organizer: {
      "@type": "Organization",
      name: "AGAPE Music",
      url: SITE_URL,
    },
  };
}

export function musicAlbumSchema(release: {
  title: string;
  artist?: string;
  releaseDate?: string;
  artwork?: string;
  type?: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "MusicAlbum",
    name: release.title,
    ...(release.artist && {
      byArtist: {
        "@type": "MusicGroup",
        name: release.artist,
      },
    }),
    ...(release.releaseDate && { datePublished: release.releaseDate }),
    ...(release.artwork && { image: release.artwork }),
    url: `${SITE_URL}/music/${release.slug}`,
    albumProductionType:
      release.type === "compilation"
        ? "CompilationAlbum"
        : release.type === "ep"
          ? "EPAlbum"
          : release.type === "single"
            ? "SingleRelease"
            : "StudioAlbum",
  };
}

export function articleSchema(article: {
  title: string;
  publishDate?: string;
  author?: string;
  excerpt?: string;
  image?: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    ...(article.publishDate && { datePublished: article.publishDate }),
    ...(article.author && {
      author: {
        "@type": "Person",
        name: article.author,
      },
    }),
    ...(article.excerpt && { description: article.excerpt }),
    ...(article.image && { image: article.image }),
    url: `${SITE_URL}/news/${article.slug}`,
    publisher: {
      "@type": "Organization",
      name: "AGAPE Music",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/agape_logo_white.png`,
      },
    },
  };
}

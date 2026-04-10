import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://agapemusic.us";

  // Only the home page is fully built out right now. Stub routes (/events,
  // /music, /news, /about, /contact, /privacy, /terms) are marked noindex
  // in their page metadata, so they're intentionally excluded from the sitemap.
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}

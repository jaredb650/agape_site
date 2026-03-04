import { groq } from "next-sanity";

// ===== Events =====

export const upcomingEventsQuery = groq`
  *[_type == "event" && date >= now()] | order(date asc) {
    _id,
    title,
    slug,
    date,
    endDate,
    venue,
    location,
    ticketUrl,
    ticketPrice,
    image,
    lineup
  }
`;

export const pastEventsQuery = groq`
  *[_type == "event" && date < now()] | order(date desc) {
    _id,
    title,
    slug,
    date,
    venue,
    location,
    image
  }
`;

export const eventBySlugQuery = groq`
  *[_type == "event" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    date,
    endDate,
    venue,
    location,
    description,
    lineup,
    ticketUrl,
    ticketPrice,
    image,
    gallery,
    seoTitle,
    seoDescription,
    ogImage
  }
`;

// ===== Releases =====

export const allReleasesQuery = groq`
  *[_type == "release"] | order(releaseDate desc) {
    _id,
    title,
    slug,
    artist,
    releaseDate,
    artwork,
    type,
    featured
  }
`;

export const featuredReleasesQuery = groq`
  *[_type == "release" && featured == true] | order(releaseDate desc)[0...3] {
    _id,
    title,
    slug,
    artist,
    releaseDate,
    artwork,
    type,
    streamingLinks
  }
`;

export const releaseBySlugQuery = groq`
  *[_type == "release" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    artist,
    releaseDate,
    artwork,
    description,
    trackList,
    streamingLinks,
    type,
    seoTitle,
    seoDescription
  }
`;

// ===== Articles =====

export const allArticlesQuery = groq`
  *[_type == "article"] | order(publishDate desc) {
    _id,
    title,
    slug,
    publishDate,
    excerpt,
    featuredImage,
    category->{title, slug},
    author
  }
`;

export const articleBySlugQuery = groq`
  *[_type == "article" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishDate,
    content,
    excerpt,
    featuredImage,
    category->{title, slug},
    author,
    seoTitle,
    seoDescription
  }
`;

// ===== News Categories =====

export const allNewsCategoriesQuery = groq`
  *[_type == "newsCategory"] | order(title asc) {
    _id,
    title,
    slug,
    description
  }
`;

// ===== Site Settings =====

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    siteName,
    tagline,
    description,
    logo,
    ogImage,
    socialLinks,
    contactEmail,
    bookingsEmail,
    footerText,
    googleAnalyticsId
  }
`;

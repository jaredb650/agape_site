import { defineField, defineType } from "sanity";

const streamingPlatforms = [
  { title: "Spotify", value: "spotify" },
  { title: "Apple Music", value: "appleMusic" },
  { title: "Bandcamp", value: "bandcamp" },
  { title: "YouTube", value: "youtube" },
  { title: "SoundCloud", value: "soundcloud" },
  { title: "Deezer", value: "deezer" },
  { title: "Tidal", value: "tidal" },
  { title: "Qobuz", value: "qobuz" },
  { title: "Amazon Music", value: "amazonMusic" },
];

export const release = defineType({
  name: "release",
  title: "Release",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "artist",
      title: "Artist",
      type: "string",
    }),
    defineField({
      name: "releaseDate",
      title: "Release Date",
      type: "date",
    }),
    defineField({
      name: "artwork",
      title: "Artwork",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
      fields: [
        {
          name: "alt",
          title: "Alt Text",
          type: "string",
        },
      ],
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "trackList",
      title: "Track List",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", title: "Track Title", type: "string" },
            {
              name: "duration",
              title: "Duration",
              type: "string",
              description: 'e.g. "4:32"',
            },
          ],
          preview: {
            select: { title: "title", subtitle: "duration" },
          },
        },
      ],
    }),
    defineField({
      name: "streamingLinks",
      title: "Streaming Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "platform",
              title: "Platform",
              type: "string",
              options: {
                list: streamingPlatforms,
              },
            },
            {
              name: "url",
              title: "URL",
              type: "url",
            },
          ],
          preview: {
            select: { title: "platform", subtitle: "url" },
          },
        },
      ],
    }),
    defineField({
      name: "type",
      title: "Release Type",
      type: "string",
      options: {
        list: [
          { title: "Album", value: "album" },
          { title: "EP", value: "ep" },
          { title: "Single", value: "single" },
          { title: "Compilation", value: "compilation" },
        ],
      },
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      group: "seo",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 3,
      group: "seo",
    }),
  ],
  groups: [{ name: "seo", title: "SEO" }],
  orderings: [
    {
      title: "Release Date (Newest)",
      name: "releaseDateDesc",
      by: [{ field: "releaseDate", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      artist: "artist",
      media: "artwork",
    },
    prepare({ title, artist, media }) {
      return {
        title,
        subtitle: artist || "Unknown Artist",
        media,
      };
    },
  },
});

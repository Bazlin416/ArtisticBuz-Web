import { defineType } from 'sanity'

export const blog = defineType({
  name: 'blog',
  title: 'Blog Posts',
  type: 'document',

  fields: [
    /* -----------------------------
     * BASIC METADATA
     * ----------------------------- */
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) =>
        Rule.required()
          .max(110)
          .warning('Google Discover prefers clear, non-clickbait titles under ~110 characters'),
    },

    {
      name: 'seoTitle',
      title: 'SEO / Discover Title',
      description: 'Optional optimized headline for Google Discover (leave empty to use Title)',
      type: 'string',
      validation: (Rule: any) => Rule.max(110),
    },

    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule: any) => Rule.required(),
    },

    /* -----------------------------
     * MAIN IMAGE
     * ----------------------------- */
    {
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule: any) =>
        Rule.required().warning(
          'Google Discover strongly prefers large, high-quality images (1200px+)',
        ),
    },

    {
      name: 'seoDescription',
      title: 'SEO / Discover Description',
      type: 'text',
      validation: (Rule: any) => Rule.max(160),
    },

    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
    },

    /* -----------------------------
     * PUBLISHING
     * ----------------------------- */
    {
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      validation: (Rule: any) => Rule.required(),
    },

    {
      name: 'updatedAt',
      title: 'Last Updated',
      type: 'datetime',
    },

    /* -----------------------------
     * DISCOVER CONTROLS
     * ----------------------------- */
    {
      name: 'discoverEligible',
      title: 'Eligible for Google Discover',
      type: 'boolean',
      initialValue: true,
    },

    {
      name: 'discoverPriority',
      title: 'Discover Priority',
      type: 'string',
      options: {
        list: [
          { title: 'Normal', value: 'normal' },
          { title: 'High (Featured)', value: 'high' },
        ],
        layout: 'radio',
      },
      initialValue: 'normal',
    },

    {
      name: 'contentType',
      title: 'Content Type',
      type: 'string',
      options: {
        list: [
          { title: 'Evergreen', value: 'evergreen' },
          { title: 'News / Timely', value: 'news' },
        ],
        layout: 'radio',
      },
      initialValue: 'evergreen',
    },

    /* -----------------------------
     * TOPICAL AUTHORITY
     * ----------------------------- */
    {
      name: 'topic',
      title: 'Primary Topic',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },

    /* -----------------------------
     * TAGS
     * ----------------------------- */
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    },

    /* -----------------------------
     * CONTENT - SANITY V4 COMPATIBLE SYNTAX
     * ----------------------------- */
    {
      name: 'body',
      title: 'Content',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          fields: [
            { name: 'alt', type: 'string', title: 'Alt text' },
            { name: 'caption', type: 'string', title: 'Caption' }
          ]
        }
      ]
    },

    /* -----------------------------
     * AUTHOR
     * ----------------------------- */
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      validation: (Rule: any) => Rule.required(),
    },
  ],

  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
      discover: 'discoverEligible',
      authorName: 'author.name',
    },
    prepare({ title, media, discover, authorName }: any) {
      return {
        title,
        subtitle: `${authorName ? `By ${authorName} · ` : ''}${discover ? 'Eligible for Google Discover' : '❌ Not eligible for Discover'}`,
        media,
      }
    },
  },
})
import { defineType, defineField } from 'sanity';

export const blog = defineType({
    name: 'blog',
    title: 'Blog Posts',
    type: 'document',

    fields: [
        /* -----------------------------
         * BASIC METADATA
         * ----------------------------- */
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule) =>
                Rule.required().max(110).warning(
                    'Google Discover prefers clear, non-clickbait titles under ~110 characters'
                ),
        }),

        defineField({
            name: 'seoTitle',
            title: 'SEO / Discover Title',
            description:
                'Optional optimized headline for Google Discover (leave empty to use Title)',
            type: 'string',
            validation: (Rule) => Rule.max(110),
        }),

        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: { source: 'title', maxLength: 96 },
            validation: (Rule) => Rule.required(),
        }),

        /* -----------------------------
         * MAIN IMAGE
         * ----------------------------- */
        defineField({
            name: 'mainImage',
            title: 'Main Image',
            type: 'image',
            options: { hotspot: true },
            validation: (Rule) =>
                Rule.required().warning(
                    'Google Discover strongly prefers large, high-quality images (1200px+)'
                ),
        }),

        defineField({
            name: 'seoDescription',
            title: 'SEO / Discover Description',
            type: 'text',
            rows: 3,
            validation: (Rule) => Rule.max(160),
        }),

        defineField({
            name: 'excerpt',
            title: 'Excerpt',
            type: 'text',
            rows: 3,
        }),

        /* -----------------------------
         * PUBLISHING
         * ----------------------------- */
        defineField({
            name: 'publishedAt',
            title: 'Published Date',
            type: 'datetime',
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'updatedAt',
            title: 'Last Updated',
            type: 'datetime',
        }),

        /* -----------------------------
         * DISCOVER CONTROLS
         * ----------------------------- */
        defineField({
            name: 'discoverEligible',
            title: 'Eligible for Google Discover',
            type: 'boolean',
            initialValue: true,
        }),

        defineField({
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
        }),

        defineField({
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
        }),

        /* -----------------------------
         * TOPICAL AUTHORITY
         * ----------------------------- */
        defineField({
            name: 'topic',
            title: 'Primary Topic',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'tags',
            title: 'Tags',
            type: 'array',
            of: [{ type: 'string' }],
            options: { layout: 'tags' },
        }),

        /* -----------------------------
         * CONTENT
         * ----------------------------- */
        defineField({
            name: 'body',
            title: 'Content',
            type: 'array',
            of: [
                { type: 'block' },
                {
                    type: 'image',
                    options: { hotspot: true },
                    fields: [
                        { name: 'alt', type: 'string', title: 'Alt text' },
                        { name: 'caption', type: 'string', title: 'Caption' },
                    ],
                },
            ],
        }),

        /* -----------------------------
         * AUTHOR
         * ----------------------------- */
        defineField({
            name: 'author',
            title: 'Author',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
    ],

    preview: {
        select: {
            title: 'title',
            media: 'mainImage',
            discover: 'discoverEligible',
        },
        prepare({ title, media, discover }) {
            return {
                title,
                subtitle: discover
                    ? 'Eligible for Google Discover'
                    : '❌ Not eligible for Discover',
                media,
            };
        },
    },
});
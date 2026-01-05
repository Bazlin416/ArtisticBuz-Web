import { defineType, defineField } from 'sanity';

export default defineType({
    name: 'partner',
    title: 'Partner Clinics',
    type: 'document',

    fields: [
        defineField({
            name: 'name',
            title: 'Clinic Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'logo',
            title: 'Clinic Logo',
            type: 'image',
            options: { hotspot: true },
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'city',
            title: 'City',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'country',
            title: 'Country',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),

        defineField({
            name: 'website',
            title: 'Website URL',
            type: 'url',
            description: 'Official clinic website',
        }),

        defineField({
            name: 'isActive',
            title: 'Active Partner',
            type: 'boolean',
            initialValue: true,
            description: 'Toggle visibility on the website',
        }),

        defineField({
            name: 'orderRank',
            title: 'Display Order',
            type: 'number',
            description: 'Lower numbers appear first',
            initialValue: 1,
        }),
    ],

    preview: {
        select: {
            title: 'name',
            subtitle: 'country',
            media: 'logo',
        },
    },
});

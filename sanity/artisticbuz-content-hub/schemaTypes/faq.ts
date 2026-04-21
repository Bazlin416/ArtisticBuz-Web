import { defineType, defineField } from 'sanity'
import { HelpCircleIcon } from '@sanity/icons'

export default defineType({
  name: 'faq',
  title: 'FAQs',
  type: 'document',
  icon: HelpCircleIcon,

  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'General', value: 'general' },
          { title: 'Procedure', value: 'procedure' },
          { title: 'Recovery', value: 'recovery' },
          { title: 'Pricing', value: 'pricing' },
          { title: 'Calculator', value: 'calculator' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'general',
    }),

    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
      initialValue: 0,
      validation: (Rule) => Rule.min(0).integer(),
    }),

    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
      description: 'Toggle visibility on the website',
    }),
  ],

  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrderAsc',
      by: [{ field: 'displayOrder', direction: 'asc' }],
    },
  ],

  preview: {
    select: {
      title: 'question',
      subtitle: 'category',
      active: 'isActive',
    },
    prepare({ title, subtitle, active }: any) {
      return {
        title,
        subtitle: `${subtitle ?? 'general'}${active ? '' : ' · Hidden'}`,
      }
    },
  },
})

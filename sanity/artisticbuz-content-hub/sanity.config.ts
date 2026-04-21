import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import {
  DocumentTextIcon,
  UserIcon,
  HelpCircleIcon,
  HeartIcon,
} from '@sanity/icons'
import { schemaTypes } from './schemaTypes'

const SITE_URL = 'https://artisticbuz.com'

export default defineConfig({
  name: 'default',
  title: 'ArtisticBuz Content Hub',

  projectId: 'e0x9v54x',
  dataset: 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Blog Posts')
              .icon(DocumentTextIcon)
              .child(
                S.documentTypeList('blog')
                  .title('Blog Posts')
                  .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
              ),

            S.listItem()
              .title('Authors')
              .icon(UserIcon)
              .child(S.documentTypeList('author').title('Authors')),

            S.divider(),

            S.listItem()
              .title('FAQs')
              .icon(HelpCircleIcon)
              .child(
                S.documentTypeList('faq')
                  .title('FAQs')
                  .defaultOrdering([{ field: 'displayOrder', direction: 'asc' }])
              ),

            S.divider(),

            S.listItem()
              .title('Partner Clinics')
              .icon(HeartIcon)
              .child(
                S.documentTypeList('partner')
                  .title('Partner Clinics')
                  .defaultOrdering([{ field: 'orderRank', direction: 'asc' }])
              ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  document: {
    productionUrl: async (_prev, ctx) => {
      const { document } = ctx
      if (document._type === 'blog') {
        const slug = (document.slug as any)?.current
        if (slug) return `${SITE_URL}/blogs/${slug}`
      }
      return undefined
    },
  },
})

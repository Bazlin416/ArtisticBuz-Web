import { type SchemaTypeDefinition } from 'sanity'
import { blog } from './blog'
import partner from './partner'
import author from './author'
import faq from './faq'

export const schemaTypes: SchemaTypeDefinition[] = [blog, author, faq, partner]


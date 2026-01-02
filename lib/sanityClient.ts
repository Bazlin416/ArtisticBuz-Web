import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from './sanityEnv'

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})


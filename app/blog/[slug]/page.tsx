import { sanityClient } from '@/lib/sanityClient'
import { urlFor } from '@/lib/sanityImage'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import Link from 'next/link'

const BLOG_POST_QUERY = `
*[_type == "blog" && slug.current == $slug][0]{
  title,
  seoTitle,
  seoDescription,
  publishedAt,
  updatedAt,
  author,
  topic,
  tags,
  mainImage,
  body
}
`

const portableTextComponents = {
    types: {
        image: ({ value }: any) => (
            <figure className="my-12">
                <Image
                    src={urlFor(value).width(1200).url()}
                    alt={value.alt || ''}
                    width={1200}
                    height={800}
                    className="rounded-2xl"
                />
                {value.caption && (
                    <figcaption className="mt-3 text-sm text-gray-500 text-center">
                        {value.caption}
                    </figcaption>
                )}
            </figure>
        ),
    },
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const blog = await sanityClient.fetch(BLOG_POST_QUERY, {
        slug: params.slug,
    })

    if (!blog) return notFound()

    return (
        <article className="bg-white">
            <div className="container mx-auto px-4 max-w-3xl py-28">

                {/* Back to Blog */}
                <div className="mb-8">
                    <Link
                        href="/blog"
                        className="inline-block text-emerald-600 font-semibold hover:underline"
                    >
                        ← Back to Blog
                    </Link>
                </div>

                {/* Topic */}
                {blog.topic && (
                    <p className="text-sm uppercase tracking-wide text-emerald-600 font-semibold mb-4">
                        {blog.topic}
                    </p>
                )}

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                    {blog.seoTitle || blog.title}
                </h1>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 mb-12">
                    <span>By {blog.author}</span>
                    <span>•</span>
                    <time>{new Date(blog.publishedAt).toLocaleDateString()}</time>
                    {blog.updatedAt && (
                        <>
                            <span>•</span>
                            <span>Updated</span>
                        </>
                    )}
                </div>

                {/* Hero Image */}
                <Image
                    src={urlFor(blog.mainImage).width(1200).height(630).url()}
                    alt={blog.title}
                    width={1200}
                    height={630}
                    className="rounded-3xl mb-16"
                    priority
                />

                {/* Content */}
                <div className="prose prose-emerald prose-lg max-w-none">
                    <PortableText
                        value={blog.body}
                        components={portableTextComponents}
                    />
                </div>

                {/* Tags */}
                {blog.tags?.length > 0 && (
                    <div className="mt-16 pt-10 border-t">
                        <div className="flex flex-wrap gap-2">
                            {blog.tags.map((tag: string) => (
                                <span
                                    key={tag}
                                    className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-700"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </article>
    )
}




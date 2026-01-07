import { sanityClient } from '@/lib/sanityClient'
import { urlFor } from '@/lib/sanityImage'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import Link from 'next/link'
import type { Metadata } from 'next'
import { use } from 'react'

/* =========================
   ISR (Discover-aware)
========================= */
export const revalidate = 60

/* =========================
   Metadata (SAFE)
========================= */
export async function generateMetadata({
    params,
}: {
    params?: Promise<{ slug?: string }> // mark as Promise
}): Promise<Metadata> {

    // unwrap the promise
    const resolvedParams = params ? await params : undefined

    if (!resolvedParams?.slug) {
        return {
            title: 'Blog',
            robots: { index: false, follow: false },
        }
    }

    const blog = await sanityClient.fetch(
        `
    *[_type == "blog" && slug.current == $slug][0]{
      title,
      seoTitle,
      seoDescription,
      excerpt,
      mainImage,
      discoverEligible
    }
    `,
        { slug: resolvedParams.slug }
    )

    if (!blog || blog.discoverEligible === false) {
        return {
            title: blog?.title ?? 'Blog not found',
            robots: { index: false, follow: false },
        }
    }

    const title = blog.seoTitle || blog.title
    const description = blog.seoDescription || blog.excerpt || ''

    return {
        title,
        description,
        alternates: {
            canonical: `/blogs/${resolvedParams.slug}`,
        },
        robots: {
            index: true,
            follow: true,
        },
        openGraph: {
            title,
            description,
            type: 'article',
            images: blog.mainImage
                ? [
                    {
                        url: urlFor(blog.mainImage)
                            .width(1200)
                            .height(630)
                            .url(),
                    },
                ]
                : [],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: blog.mainImage ? [urlFor(blog.mainImage).width(1200).url()] : [],
        }
    }

}

/* =========================
   GROQ Query (FULL schema)
========================= */
const BLOG_POST_QUERY = `
*[_type == "blog" && slug.current == $slug][0]{
  title,
  seoTitle,
  seoDescription,
  excerpt,
  publishedAt,
  updatedAt,
  author,
  topic,
  tags,
  contentType,
  discoverPriority,
  discoverEligible,
  mainImage,
  body
}
`

/* =========================
   Portable Text
========================= */
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
    block: {
        h1: ({ children }: any) => (
            <h1 className="text-4xl md:text-5xl font-bold my-8">{children}</h1>
        ),
        h2: ({ children }: any) => (
            <h2 className="text-3xl font-semibold my-6">{children}</h2>
        ),
        h3: ({ children }: any) => (
            <h3 className="text-2xl font-semibold my-4">{children}</h3>
        ),
        h4: ({ children }: any) => (
            <h4 className="text-xl font-semibold my-3">{children}</h4>
        ),
        normal: ({ children }: any) => (
            <p className="my-4 leading-relaxed">{children}</p>
        ),
        blockquote: ({ children }: any) => (
            <blockquote className="border-l-4 border-emerald-500 pl-4 italic my-6 text-gray-700">
                {children}
            </blockquote>
        ),
    },
    list: {
        bullet: ({ children }: any) => (
            <ul className="list-disc list-inside my-4">{children}</ul>
        ),
        number: ({ children }: any) => (
            <ol className="list-decimal list-inside my-4">{children}</ol>
        ),
    },
    listItem: {
        bullet: ({ children }: any) => <li className="ml-2">{children}</li>,
        number: ({ children }: any) => <li className="ml-2">{children}</li>,
    },
    marks: {
        strong: ({ children }: any) => <strong className="font-semibold">{children}</strong>,
        em: ({ children }: any) => <em className="italic">{children}</em>,
        code: ({ children }: any) => (
            <code className="bg-gray-100 px-1 py-0.5 rounded">{children}</code>
        ),
        link: ({ children, value }: any) => (
            <a
                href={value.href}
                target={value.blank ? '_blank' : '_self'}
                className="text-emerald-600 hover:underline"
            >
                {children}
            </a>
        ),
    },
}


/* =========================
   Page (SAFE)
========================= */
export default async function BlogPostPage({
    params,
}: {
    params?: { slug?: string } | Promise<{ slug?: string }>
}) {
    // unwrap promise if needed
    const resolvedParams = params ? await params : undefined

    if (!resolvedParams?.slug) {
        return notFound()
    }

    const blog = await sanityClient.fetch(BLOG_POST_QUERY, {
        slug: resolvedParams.slug,
    })

    if (!blog || blog.discoverEligible === false) {
        return notFound()
    }

    const isFeatured = blog.discoverPriority === 'high'

    return (
        <>
            <article className="bg-white">
                <div className="container mx-auto px-4 max-w-3xl py-28">

                    {/* Back */}
                    <Link
                        href="/blogs"
                        className="inline-block mb-8 text-emerald-600 font-semibold hover:underline"
                    >
                        ← Back to Blogs
                    </Link>

                    {/* Topic */}
                    <p className="text-sm uppercase tracking-wide text-emerald-600 font-semibold mb-4">
                        {blog.topic}
                    </p>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                        {blog.seoTitle || blog.title}
                    </h1>

                    {/* Featured */}
                    {isFeatured && (
                        <span className="inline-block mb-6 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700">
                            Featured Article
                        </span>
                    )}

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 mb-12">
                        <span>By {blog.author}</span>
                        <span>•</span>
                        <time>{new Date(blog.publishedAt).toLocaleDateString()}</time>

                        {blog.updatedAt && (
                            <>
                                <span>•</span>
                                <time>
                                    Updated {new Date(blog.updatedAt).toLocaleDateString()}
                                </time>
                            </>
                        )}

                        <span>•</span>
                        <span className="capitalize">{blog.contentType}</span>
                    </div>

                    {/* Hero Image */}
                    <Image
                        src={urlFor(blog.mainImage)
                            .width(1200)
                            .height(630)
                            .url()}
                        alt={blog.title}
                        width={1200}
                        height={630}
                        className="rounded-3xl mb-16"
                        priority={isFeatured}
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

                    {/* Back */}
                    <Link
                        href="/blogs"
                        className="inline-block mb-8 text-emerald-600 font-semibold hover:underline"
                    >
                        ← Back to Blogs
                    </Link>
                </div>
            </article>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "BlogPosting",
                        headline: blog.seoTitle || blog.title,
                        image: blog.mainImage
                            ? [urlFor(blog.mainImage).width(1200).url()]
                            : undefined,
                        author: {
                            "@type": "Person",
                            name: blog.author,
                        },
                        datePublished: blog.publishedAt,
                        dateModified: blog.updatedAt || blog.publishedAt,
                        description: blog.seoDescription || blog.excerpt || "",
                        mainEntityOfPage: {
                            "@type": "WebPage",
                            "@id": `/blogs/${resolvedParams.slug}`,
                        },
                    }),
                }}
            />
        </>

    )

}








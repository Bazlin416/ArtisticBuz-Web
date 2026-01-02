import { sanityClient } from '@/lib/sanityClient'
import { urlFor } from '@/lib/sanityImage'
import Link from 'next/link'
import Image from 'next/image'

const BLOG_QUERY = `
*[_type == "blog" && discoverEligible == true]
| order(publishedAt desc) {
  title,
  slug,
  excerpt,
  publishedAt,
  topic,
  mainImage
}
`

export default async function BlogPage() {
    const blogs = await sanityClient.fetch(BLOG_QUERY)

    return (
        <section className="bg-white">
            <div className="container mx-auto px-4 max-w-6xl py-28">

                {/* Back to Home */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-block text-emerald-600 font-semibold hover:underline"
                    >
                        ← Back to Home
                    </Link>
                </div>

                {/* Header */}
                <header className="mb-20 max-w-3xl">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Blog & Insights
                    </h1>
                    <p className="text-lg text-gray-600">
                        Expert insights, educational guides, and research-backed articles
                        curated by our team.
                    </p>
                </header>

                {/* Articles */}
                <div className="space-y-20">
                    {blogs.map((blog: any) => (
                        <article
                            key={blog.slug.current}
                            className="grid gap-10 md:grid-cols-3 items-start"
                        >
                            {/* Image */}
                            <Link href={`/blog/${blog.slug.current}`} className="group">
                                <Image
                                    src={urlFor(blog.mainImage).width(700).height(460).url()}
                                    alt={blog.title}
                                    width={700}
                                    height={460}
                                    className="rounded-3xl object-cover transition group-hover:opacity-90"
                                />
                            </Link>

                            {/* Content */}
                            <div className="md:col-span-2">
                                {blog.topic && (
                                    <p className="text-xs uppercase tracking-wide text-emerald-600 font-semibold mb-2">
                                        {blog.topic}
                                    </p>
                                )}

                                <h2 className="text-2xl md:text-3xl font-semibold mb-4 leading-snug">
                                    <Link
                                        href={`/blog/${blog.slug.current}`}
                                        className="hover:text-emerald-600 transition"
                                    >
                                        {blog.title}
                                    </Link>
                                </h2>

                                <p className="text-gray-600 mb-6 line-clamp-3">
                                    {blog.excerpt}
                                </p>

                                <div className="flex items-center justify-between">
                                    <time className="text-sm text-gray-400">
                                        {new Date(blog.publishedAt).toLocaleDateString()}
                                    </time>

                                    <Link
                                        href={`/blog/${blog.slug.current}`}
                                        className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                                    >
                                        Read article →
                                    </Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}




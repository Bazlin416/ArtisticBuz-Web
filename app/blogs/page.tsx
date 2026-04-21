import { sanityClient } from '@/lib/sanityClient'
import { urlFor } from '@/lib/sanityImage'
import Link from 'next/link'
import Image from 'next/image'

import type { Metadata } from "next";

export const revalidate = 60

export const metadata: Metadata = {
    title: "Hair Loss & Hair Restoration Blog",
    description:
        "Expert articles on hair loss, hair restoration, and graft planning backed by clinical insights.",
    alternates: {
        canonical: "https://artisticbuz.com/blogs",
    },
    openGraph: {
        title: "Hair Loss & Hair Restoration Blog",
        description:
            "Expert articles on hair loss, hair restoration, and graft planning backed by clinical insights.",
        url: "https://artisticbuz.com/blogs",
        siteName: "ArtisticBuz",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Hair Loss & Hair Restoration Blog",
        description:
            "Expert articles on hair loss, hair restoration, and graft planning backed by clinical insights.",
    },
};



const BLOG_QUERY = `
*[_type == "blog" && discoverEligible == true]
| order(publishedAt desc) {
  title,
  seoTitle,
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
            <div className="container mx-auto px-4 max-w-7xl py-28">

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
                <header className="mb-20 max-w-7xl">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Blogs & Insights
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
                            <Link href={`/blogs/${blog.slug.current}`} className="group">
                                {blog.mainImage && (
                                    <Image
                                        src={urlFor(blog.mainImage).width(700).height(460).url()}
                                        alt={blog.seoTitle || blog.title}
                                        width={700}
                                        height={460}
                                        className="rounded-3xl object-cover transition group-hover:opacity-90"
                                    />
                                )}
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
                                        href={`/blogs/${blog.slug.current}`}
                                        className="hover:text-emerald-600 transition"
                                    >
                                        {blog.seoTitle || blog.title}
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
                                        href={`/blogs/${blog.slug.current}`}
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

            {/* CTA Banner */}
            <div className="container mx-auto px-4 max-w-7xl pb-28">
                <div className="rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 p-12 text-center text-white shadow-xl">
                    <p className="text-xs font-semibold uppercase tracking-widest text-emerald-200 mb-3">
                        Ready to Start?
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                        Put the Knowledge Into Action
                    </h2>
                    <p className="text-emerald-100 mb-8 max-w-xl mx-auto leading-relaxed text-lg">
                        Our hair graft calculator gives you a clinically guided estimate in minutes. Understand your options before you book anything.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/#calculator"
                            className="px-8 py-4 rounded-xl bg-white text-emerald-700 font-semibold text-lg hover:bg-emerald-50 shadow-lg transition-all duration-300"
                        >
                            Try the Calculator →
                        </Link>
                        <Link
                            href="/"
                            className="px-8 py-4 rounded-xl border-2 border-white/60 text-white font-semibold text-lg hover:bg-white/10 transition-all duration-300"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}





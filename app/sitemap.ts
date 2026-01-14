import { sanityClient } from "@/lib/sanityClient";
import type { MetadataRoute } from "next";

export const revalidate = 60;

const BLOG_SITEMAP_QUERY = `
  *[
    _type == "blog" &&
    discoverEligible == true &&
    defined(slug.current)
  ]{
    "slug": slug.current,
    publishedAt
  }
`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const blogs = await sanityClient.fetch(BLOG_SITEMAP_QUERY);

    const blogUrls = blogs.map((blog: any) => ({
        url: `https://artisticbuz.com/blogs/${blog.slug}`,
        lastModified: blog.publishedAt,
        changeFrequency: "weekly",
        priority: 0.8,
    }));

    return [
        {
            url: "https://artisticbuz.com",
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: "https://artisticbuz.com/blogs",
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        ...blogUrls,
    ];
}


import { sanityClient } from "@/lib/sanityClient";

export default async function sitemap() {
    const blogs = await sanityClient.fetch(
        `*[_type == "blog"]{ "slug": slug.current }`
    );

    const blogUrls = blogs.map((blog: any) => ({
        url: `https://artisticbuz.com/blogs/${blog.slug}`,
        lastModified: new Date(),
    }));

    return [
        { url: "https://artisticbuz.com", lastModified: new Date() },
        { url: "https://artisticbuz.com/blogs", lastModified: new Date() },
        ...blogUrls,
    ];
}

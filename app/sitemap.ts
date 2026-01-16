import type { MetadataRoute } from "next"

import { getAllBlogPosts } from "@/lib/blog-store"
import { BLOG_ENABLE } from "@/lib/blog-settings"
import { getSiteUrl } from "@/lib/site-meta"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()
  const now = new Date()

  const staticRoutes = ["", "/contacto", "/faq"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
  }))

  if (!BLOG_ENABLE) {
    return staticRoutes
  }

  const posts = await getAllBlogPosts()
  const blogRoutes = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : now,
  }))

  return [
    ...staticRoutes,
    {
      url: `${siteUrl}/blog`,
      lastModified: now,
    },
    ...blogRoutes,
  ]
}

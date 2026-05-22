import { notFound } from "next/navigation"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BlogContent } from "@/components/blog-content"
import { getAllBlogPosts, getBlogCategories } from "@/lib/blog-store"
import { BLOG_ENABLE } from "@/lib/blog-settings"

export const metadata = {
  title: "Blog",
  description: "Últimas noticias, actualizaciones y recursos sobre gestión empresarial y tecnología ERP.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog",
    description: "Últimas noticias, actualizaciones y recursos sobre gestión empresarial y tecnología ERP.",
    url: "/blog",
  },
  twitter: {
    title: "Blog",
    description: "Últimas noticias, actualizaciones y recursos sobre gestión empresarial y tecnología ERP.",
  },
}

export default async function BlogPage() {
  if (!BLOG_ENABLE) {
    notFound()
  }

  const posts = await getAllBlogPosts()
  const categories = getBlogCategories(posts)
  const postSummaries = posts.map(({ contentHtml, ...rest }) => rest)

  return (
    <div className="min-h-screen overflow-hidden">
      <Header />
      <main className="flex flex-col items-center pt-24 pb-16 bg-bg">
        <BlogContent posts={postSummaries} categories={categories} />
      </main>
      <Footer />
    </div>
  )
}

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BlogContent } from "@/components/blog-content"
import { getAllBlogPosts, getBlogCategories } from "@/lib/blog-store"

export const metadata = {
  title: "Blog - YiQi ERP",
  description: "Ultimas noticias, actualizaciones y recursos sobre gestion empresarial y tecnologia ERP.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Blog - YiQi ERP",
    description: "Ultimas noticias, actualizaciones y recursos sobre gestion empresarial y tecnologia ERP.",
    url: "/blog",
  },
  twitter: {
    title: "Blog - YiQi ERP",
    description: "Ultimas noticias, actualizaciones y recursos sobre gestion empresarial y tecnologia ERP.",
  },
}

export default async function BlogPage() {
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

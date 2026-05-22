import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BlogPostContent } from "@/components/blog-post-content"
import { getAllBlogPosts, getBlogPostBySlug } from "@/lib/blog-store"
import { BLOG_ENABLE } from "@/lib/blog-settings"

type BlogPostPageProps = {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  if (!BLOG_ENABLE) {
    return []
  }

  const posts = await getAllBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  if (!BLOG_ENABLE) {
    return {
      title: "Blog no disponible",
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    return {
      title: "Artículo no encontrado",
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const title = post.title
  const canonical = "/blog/" + post.slug

  return {
    title,
    description: post.excerpt,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description: post.excerpt,
      url: canonical,
      type: "article",
      images: [
        {
          url: "/images/logoheader.png",
          alt: "YiQi ERP",
        },
      ],
    },
    twitter: {
      title,
      description: post.excerpt,
      images: ["/images/logoheader.png"],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  if (!BLOG_ENABLE) {
    notFound()
  }

  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen overflow-hidden">
      <Header />
      <BlogPostContent post={post} />
      <Footer />
    </div>
  )
}

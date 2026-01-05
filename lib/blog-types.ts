export interface BlogPost {
  id: string
  title: string
  excerpt: string
  category: string
  date: string
  author: string
  image: string
  readTime: string
  slug: string
  contentHtml: string
}

export type BlogPostSummary = Omit<BlogPost, "contentHtml">

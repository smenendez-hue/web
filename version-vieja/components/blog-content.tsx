"use client"

import { useEffect, useMemo, useState } from "react"
import { Search, Calendar, Tag, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import type { BlogPostSummary } from "@/lib/blog-types"

interface BlogContentProps {
  posts: BlogPostSummary[]
  categories: string[]
}

const POSTS_PER_PAGE = 9

export function BlogContent({ posts, categories }: BlogContentProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todas")
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest")

  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(term) ||
          post.excerpt.toLowerCase().includes(term) ||
          post.category.toLowerCase().includes(term),
      )
    }

    if (selectedCategory !== "Todas") {
      filtered = filtered.filter((post) => post.category === selectedCategory)
    }

    return [...filtered].sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortBy === "newest" ? dateB - dateA : dateA - dateB
    })
  }, [posts, searchTerm, selectedCategory, sortBy])

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedPosts.length / POSTS_PER_PAGE))
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory, sortBy, filteredAndSortedPosts.length])

  const visiblePosts = filteredAndSortedPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE,
  )

  return (
    <section className="w-full page-shell max-w-[1200px] py-8 flex flex-col items-center gap-12">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="ty-h1 night-text">
          Blog<span className="brand-orange-text">.</span>
        </h1>
        <p className="ty-body text-text-secondary max-w-[700px]">
          Descubre las últimas tendencias, consejos y actualizaciones sobre gestión empresarial y tecnología ERP.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="w-full flex flex-col gap-6">
        <div className="w-full relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            placeholder="Buscar artículos..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-bg-tertiary rounded-2xl text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-all"
          />
        </div>

        <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "bg-brand-orange text-zinc-100"
                    : "bg-bg-tertiary text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-text-secondary" />
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as "newest" | "oldest")}
              className="px-3 py-2 bg-bg-tertiary rounded-xl text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-blue/50 cursor-pointer"
            >
              <option value="newest">Más recientes</option>
              <option value="oldest">Más antiguos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Blog Posts Grid */}
      {filteredAndSortedPosts.length > 0 ? (
        <>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visiblePosts.map((post) => {
              const trimmedImage = post.image?.trim()
              const shouldUseUnoptimizedImage = Boolean(trimmedImage && !trimmedImage.startsWith("/"))
              const shouldShowImage = Boolean(trimmedImage)

             return (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <article className="group bg-bg-tertiary rounded-2xl overflow-hidden border border-white/5 hover:border-brand-orange/30 transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                    {/* Image */}
                    <div className="relative w-full h-48 overflow-hidden bg-bg-elevated">
                      {shouldShowImage ? (
                        <Image
                          src={trimmedImage!}
                          alt={post.title}
                          fill
                          unoptimized={shouldUseUnoptimizedImage}
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-linear-to-br from-bg-elevated to-bg-tertiary" />
                      )}
                      {/* Badge */}
                      <div className="absolute top-3 left-3 px-3 py-1 bg-brand-orange/90 backdrop-blur-sm rounded-full">
                        <span className="text-xs font-semibold text-zinc-100 flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {post.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col gap-3">
                      <div className="flex items-center gap-3 text-xs text-text-secondary">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.date).toLocaleDateString("es-AR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                        {post.readTime && (
                          <>
                            <span className="text-text-secondary">·</span>
                            <span>{post.readTime} lectura</span>
                          </>
                        )}
                      </div>

                      <h3 className="text-lg font-semibold text-text-primary leading-snug group-hover:text-brand-orange transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">{post.excerpt}</p>

                      <div
                        className={`flex items-center mt-2 pt-3 border-t border-white/5 ${
                          post.author ? "justify-between" : "justify-end"
                        }`}
                      >
                        {post.author && (
                          <span className="text-xs text-text-secondary">Por {post.author}</span>
                        )}
                        <span className="text-sm font-medium text-brand-blue group-hover:text-brand-orange transition-colors flex items-center gap-1">
                          Leer más
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              )
            })}
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between w-full max-w-[420px] mt-6">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-semibold rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-bg-tertiary text-text-primary hover:bg-bg-elevated"
              >
                Anterior
              </button>
              <span className="text-sm text-text-secondary">
                Página {currentPage} de {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-semibold rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-bg-tertiary text-text-primary hover:bg-bg-elevated"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-text-secondary ty-body">No se encontraron artículos que coincidan con tu búsqueda.</p>
        </div>
      )}

      {/* CTA Section */}
    </section>
  )
}

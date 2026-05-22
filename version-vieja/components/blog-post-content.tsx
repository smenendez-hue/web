"use client"

import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, User, ArrowLeft, Tag } from "lucide-react"
import type { BlogPost } from "@/lib/blog-types"

interface BlogPostContentProps {
  post: BlogPost
}

export function BlogPostContent({ post }: BlogPostContentProps) {
  const heroImageSrc = post.image?.trim()
  const heroImageUnoptimized = Boolean(heroImageSrc && !heroImageSrc.startsWith("/"))

  return (
    <div className="min-h-screen bg-bg">
      {/* Back Button */}
      <div className="w-full page-shell max-w-[900px] pt-24 py-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-brand-orange transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al blog
        </Link>
      </div>

      {/* Hero Section */}
      <article className="w-full page-shell max-w-[900px] pb-16 flex flex-col gap-8">
        {/* Category Badge */}
        <div className="flex items-center gap-2">
          <div className="px-4 py-2 bg-brand-orange/10 border border-brand-orange/30 rounded-full inline-flex items-center gap-2">
            <Tag className="w-4 h-4 text-brand-orange" />
            <span className="text-sm font-semibold text-brand-orange">{post.category}</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="ty-h1 text-text-primary text-balance">{post.title}</h1>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary pb-6 border-b border-white/10">
          {post.author && (
            <>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <span className="text-text-secondary">·</span>
            </>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(post.date).toLocaleDateString("es-AR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          {post.readTime && (
            <>
              <span className="text-text-secondary">·</span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime} de lectura</span>
              </div>
            </>
          )}
        </div>

        {/* Featured Image */}
        {heroImageSrc && (
          <div className="relative w-full h-[400px] rounded-2xl overflow-hidden border border-white/10">
            <Image
              src={heroImageSrc}
              alt={post.title}
              fill
              unoptimized={heroImageUnoptimized}
              className="object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="blog-markdown" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />

        {/* CTA Section */}
        <div className="mt-12 p-8 bg-linear-to-br from-brand-orange/10 to-brand-blue/10 border border-brand-orange/30 rounded-2xl text-center flex flex-col items-center gap-4">
          <h3 className="text-2xl font-bold text-text-primary">¿Listo para optimizar tu negocio?</h3>
          <p className="text-text-secondary max-w-[600px]">
            Descubre cómo YiQi ERP puede transformar la gestión de tu empresa con herramientas potentes y fáciles de
            usar.
          </p>
          <Link
            href="/#demo"
            className="px-6 py-2 bg-brand-blue text-zinc-100 rounded-full font-semibold hover:bg-brand-blue/90 transition-colors"
          >
            Reserva tu demo
          </Link>
        </div>

        {/* Back to Blog */}
        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-brand-blue hover:text-brand-orange transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Ver más artículos
          </Link>
        </div>
      </article>
    </div>
  )
}


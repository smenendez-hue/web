import { remark } from "remark"
import remarkGfm from "remark-gfm"
import remarkHtml from "remark-html"

import { getMissingDbEnv, getSqlPool } from "./db"
import { buildImageSource } from "./image-utils"
import type { BlogPost } from "./blog-types"

const SQL_QUERY = `
SELECT
    BLOG_ID,
    BLOG_TITULO as Titulo,
    CAST('' AS XML).value (
        'xs:base64Binary(sql:column("ARCH.ARCH_CONTENIDO"))',
        'VARCHAR(MAX)'
    ) as blogImage,
    ARCH_TIPO as typeImage,
    BLOG_BLOG as Contenido,
    BLOG_FECHA as FechaPublicacion,
    BLOG_AUTOR as Autor,
    BLOG_TIEMPO_DE_LECTURA as TiempoDeLectura
FROM
    ENT_BLOG BLOG
    LEFT JOIN ADM_ARCHIVO ARCH ON BLOG.BLOG_IMAGEN = ARCH.ARCH_CODIGO
ORDER BY BLOG.BLOG_FECHA DESC;
`

const DEFAULT_CATEGORY = "Noticias"
const EXCERPT_LIMIT = 160
const HTML_TAG_PATTERN = /^<([a-z][^/\s>]*)(\s|>)/i
const HTML_CLOSE_TAG_PATTERN = /<\/[a-z][^>]*>/i
const SLUG_SANITIZE_PATTERN = /[^a-z0-9]+/gi

const markdownToHtml = async (markdown: string) => {
  const processed = await remark().use(remarkGfm).use(remarkHtml).process(markdown)
  return processed.toString()
}

const looksLikeHtml = (value: string) => {
  const trimmed = value.trim()
  if (!trimmed) return false
  return HTML_TAG_PATTERN.test(trimmed) && HTML_CLOSE_TAG_PATTERN.test(trimmed)
}

const formatContentHtml = async (content: string) => {
  const trimmed = content.trim()
  if (!trimmed) return ""
  if (looksLikeHtml(trimmed)) return trimmed

  try {
    return await markdownToHtml(trimmed)
  } catch {
    return trimmed
  }
}

const stripHtmlTags = (value: string) => value.replace(/<[^>]+>/g, " ")

const ENTITY_MAP: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
}

const decodeHtmlEntities = (value: string) =>
  value.replace(/&(#x?[0-9a-fA-F]+|\w+);/g, (_, entity) => {
    if (entity.startsWith("#x") || entity.startsWith("#X")) {
      const code = parseInt(entity.slice(2), 16)
      return Number.isNaN(code) ? "" : String.fromCharCode(code)
    }
    if (entity.startsWith("#")) {
      const code = parseInt(entity.slice(1), 10)
      return Number.isNaN(code) ? "" : String.fromCharCode(code)
    }
    return ENTITY_MAP[entity] ?? ""
  })

const createExcerpt = (html: string) => {
  const cleaned = decodeHtmlEntities(stripHtmlTags(html)).replace(/\s+/g, " ").trim()
  if (!cleaned) return ""
  if (cleaned.length <= EXCERPT_LIMIT) return cleaned
  return `${cleaned.slice(0, EXCERPT_LIMIT).trim()}...`
}

const slugifyValue = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(SLUG_SANITIZE_PATTERN, "-")
    .replace(/^-+|-+$/g, "")

const createSlug = (title: string, id: string) => {
  const slugTitle = slugifyValue(title)
  const slugId = slugifyValue(id)

  if (slugTitle && slugId) {
    return slugTitle === slugId ? slugTitle : `${slugTitle}-${slugId}`
  }

  if (slugTitle) {
    return slugTitle
  }

  if (slugId) {
    return slugId
  }

  return title
}

const normalizeDate = (value: unknown) => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString()
  }
  if (typeof value === "string" && value.trim()) {
    const parsed = new Date(value.trim())
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString()
    }
    return value.trim()
  }
  if (typeof value === "number" && !Number.isNaN(value)) {
    return new Date(value).toISOString()
  }
  return new Date().toISOString()
}

const normalizeReadTime = (value: unknown) => {
  if (value == null) return ""
  const text = String(value).trim()
  if (!text) return ""
  if (/[a-z]/i.test(text)) return text
  return `${text} min`
}

const normalizeText = (value: unknown) => (typeof value === "string" ? value.trim() : "")

interface BlogRecord {
  BLOG_ID: string | number
  Titulo: string
  blogImage: string | null
  typeImage: string | null
  Contenido: string | null
  FechaPublicacion: Date | string | null
  Autor: string | null
  TiempoDeLectura: string | number | null
}

const mapRecordToBlogPost = async (record: BlogRecord): Promise<BlogPost> => {
  const idRaw = record.BLOG_ID ?? ""
  const idValue = typeof idRaw === "number" ? String(idRaw) : normalizeText(idRaw)
  const title = normalizeText(record.Titulo) || "Blog"
  const contentHtml = await formatContentHtml(record.Contenido ?? "")
  const excerpt = createExcerpt(contentHtml)
  const author = normalizeText(record.Autor)
  const readTime = normalizeReadTime(record.TiempoDeLectura)
  const date = normalizeDate(record.FechaPublicacion)
  const fallbackId = idValue || slugifyValue(title) || title

  return {
    id: idValue || fallbackId,
    title,
    excerpt,
    category: DEFAULT_CATEGORY,
    date,
    author,
    image: buildImageSource(record.blogImage, record.typeImage),
    readTime,
    slug: createSlug(title, fallbackId),
    contentHtml,
  }
}

export const getAllBlogPosts = async (): Promise<BlogPost[]> => {
  const missingEnv = getMissingDbEnv()
  if (missingEnv.length > 0) {
    console.warn(
      `Blog data unavailable. Missing database environment variables: ${missingEnv.join(", ")}`
    )
    return []
  }

  const pool = await getSqlPool()
  const result = await pool.request().query(SQL_QUERY)
  const records = (result.recordset ?? []) as BlogRecord[]
  return Promise.all(records.map(mapRecordToBlogPost))
}

export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | undefined> => {
  const posts = await getAllBlogPosts()
  return posts.find((post) => post.slug === slug)
}

export const getBlogCategories = (posts: BlogPost[]) => {
  const categories = Array.from(new Set(posts.map((post) => post.category))).filter(Boolean)
  return ["Todas", ...categories]
}

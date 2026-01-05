import { getSqlPool } from "./db"

export interface FAQEntry {
  id: string
  category: string
  question: string
  answer: string
}

export interface FAQCategory {
  category: string
  questions: Array<{
    id: string
    question: string
    answer: string
  }>
}

const FAQ_QUERY = `
SELECT
    FAQ0_ID as id,
    FAQ0_CATEGORIA as category,
    FAQ0_PREGUNTA as question,
    FAQ0_RESPUESTA as answer
FROM
    ENT_S_FAQ;
`

const normalizeText = (value: unknown) => {
  if (typeof value === "string") {
    return value.trim()
  }
  if (typeof value === "number") {
    return String(value)
  }
  return ""
}

export const getFaqEntries = async (): Promise<FAQEntry[]> => {
  const pool = await getSqlPool()
  const result = await pool.request().query(FAQ_QUERY)

  const recordset = result.recordset ?? []
  return recordset
    .map((item) => ({
      id: normalizeText(item.id),
      category: normalizeText(item.category) || "General",
      question: normalizeText(item.question),
      answer: normalizeText(item.answer),
    }))
    .filter((entry) => entry.id && entry.question && entry.answer)
}

export const groupFaqsByCategory = (entries: FAQEntry[]): FAQCategory[] => {
  const groupedMap = new Map<string, FAQCategory>()

  for (const entry of entries) {
    if (!groupedMap.has(entry.category)) {
      groupedMap.set(entry.category, { category: entry.category, questions: [] })
    }
    groupedMap.get(entry.category)!.questions.push({
      id: entry.id,
      question: entry.question,
      answer: entry.answer,
    })
  }

  return Array.from(groupedMap.values())
}

const parseTtl = (value: string | undefined, fallback: number) => {
  if (!value) return fallback
  const parsed = Number(value)
  if (Number.isNaN(parsed) || parsed <= 0) return fallback
  return parsed
}

const limitCategories = (categories: FAQCategory[], maxEntries: number): FAQCategory[] => {
  if (!Number.isFinite(maxEntries) || maxEntries <= 0) {
    return []
  }

  const limited: FAQCategory[] = []
  let remaining = Math.floor(maxEntries)

  for (const category of categories) {
    if (remaining <= 0) break
    const questions = category.questions.slice(0, remaining)
    if (questions.length === 0) continue
    limited.push({ category: category.category, questions })
    remaining -= questions.length
  }

  return limited
}

const DEFAULT_FAQ_CACHE_TTL = 1000 * 60 * 2
const FAQ_CACHE_TTL = parseTtl(process.env.FAQ_CACHE_TTL_MS, DEFAULT_FAQ_CACHE_TTL)
let faqCache: { data: FAQCategory[]; expires: number } | null = null
let faqPromise: Promise<FAQCategory[]> | null = null

const fetchGroupedFaqCategories = async (): Promise<FAQCategory[]> => {
  const entries = await getFaqEntries()
  return groupFaqsByCategory(entries)
}

const getCachedFaqCategories = async (): Promise<FAQCategory[]> => {
  const now = Date.now()
  if (faqCache && faqCache.expires > now) {
    return faqCache.data
  }

  if (faqPromise) {
    return faqPromise
  }

  faqPromise = (async () => {
    try {
      const grouped = await fetchGroupedFaqCategories()
      faqCache = { data: grouped, expires: Date.now() + FAQ_CACHE_TTL }
      return grouped
    } finally {
      faqPromise = null
    }
  })()

  return faqPromise
}

export const loadFaqCategories = async (options?: { maxEntries?: number }): Promise<FAQCategory[]> => {
  const grouped = await getCachedFaqCategories()

  if (options?.maxEntries && Number.isFinite(options.maxEntries)) {
    return limitCategories(grouped, options.maxEntries)
  }

  return grouped
}

export const clearFaqCache = () => {
  faqCache = null
  faqPromise = null
}

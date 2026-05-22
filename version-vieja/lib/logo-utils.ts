import { getMissingDbEnv, getSqlPool } from "./db"
import { buildImageSource } from "./image-utils"

export interface LogoRecord {
  clientName: string | null
  clientImage: string | null
  typeImage: string | null
  radioTamano: number | null
}

export interface LogoItem {
  src: string
  alt: string
  scale?: number
}

const clampScale = (value: number) => {
  const normalized = 1 + value / 100
  return Math.min(1.5, Math.max(0.75, normalized))
}

const mapRecordToLogo = (record: LogoRecord, fallbackName: string): LogoItem | null => {
  const source = buildImageSource(record.clientImage, record.typeImage)
  if (!source) return null

  const name =
    typeof record.clientName === "string" && record.clientName.trim()
      ? record.clientName.trim()
      : fallbackName
  const radioValue = typeof record.radioTamano === "number" ? record.radioTamano : 0
  const hasRadio = !Number.isNaN(radioValue) && radioValue !== 0

  return {
    src: source,
    alt: name,
    ...(hasRadio ? { scale: clampScale(radioValue) } : {}),
  }
}

const parseTtl = (value: string | undefined, fallback: number) => {
  if (!value) return fallback
  const parsed = Number(value)
  if (Number.isNaN(parsed) || parsed <= 0) return fallback
  return parsed
}

const DEFAULT_LOGO_CACHE_TTL = 1000 * 60 * 5
const LOGO_CACHE_TTL = parseTtl(process.env.LOGO_CACHE_TTL_MS, DEFAULT_LOGO_CACHE_TTL)
const logoCache = new Map<
  string,
  { data: LogoItem[]; expires: number }
>()
const logoPromises = new Map<string, Promise<LogoItem[]>>()

const cacheKey = (query: string, fallbackName: string) =>
  `${query.trim()}|${fallbackName.trim()}`

export const loadLogoItems = async (query: string, fallbackName: string): Promise<LogoItem[]> => {
  const missingEnv = getMissingDbEnv()
  if (missingEnv.length > 0) {
    console.warn(
      `Logo data unavailable. Missing database environment variables: ${missingEnv.join(", ")}`
    )
    return []
  }

  const key = cacheKey(query, fallbackName)
  const now = Date.now()
  const cached = logoCache.get(key)

  if (cached && cached.expires > now) {
    return cached.data
  }

  if (logoPromises.has(key)) {
    return logoPromises.get(key)!
  }

  const promise = (async () => {
    try {
      const pool = await getSqlPool()
      const result = await pool.request().query(query)
      const records = (result.recordset ?? []) as LogoRecord[]
      const items = records
        .map((record) => mapRecordToLogo(record, fallbackName))
        .filter(Boolean) as LogoItem[]

      logoCache.set(key, { data: items, expires: Date.now() + LOGO_CACHE_TTL })
      return items
    } finally {
      logoPromises.delete(key)
    }
  })()

  logoPromises.set(key, promise)
  return promise
}

export const clearLogoCache = () => {
  logoCache.clear()
  logoPromises.clear()
}

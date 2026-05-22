import { getMissingYiqiAuthEnv, getYiqiToken } from "./yiqi-api"

const DEFAULT_PUBLIC_BASE_URL = "https://api.yiqi.com.ar/api/public"
const DEFAULT_SCHEMA_ID = 1387
const DEFAULT_PAGE_SIZE = 50
const MAX_PAGES = 200

interface NovedadQueryColumn {
  field: string
  title: string
  sortDirection?: "ASC" | "DESC"
  sortOrder?: number
}

interface NovedadQueryFilter {
  columnName: string
  operator: string
  value: string
}

interface NovedadQueryPayload {
  page: number
  pageSize: number
  search: string
  columns: NovedadQueryColumn[]
  filters: NovedadQueryFilter[]
}

interface NovedadRecord {
  NOVE_TITULO?: string | null
  NOVE_FECHA?: string | null
  NOVE_DESCRIPCION?: string | null
  NOVE_MODULO?: string | null
  NOVE_PRODUCTO?: string | null
  NOVE_TIPO?: string | null
  NOVE_LINK_WIKI?: string | null
  NOVE_INTERNA?: string | null
  NOVE_IMPORTANTE?: string | null
  NOVE_ESQUEMA?: string | null
  NOVE_MENSAJE_PROCESADO?: string | null
  DESC_ESTADO?: string | null
}

interface NovedadQueryResponse {
  total?: number
  data?: NovedadRecord[]
}

export interface NovedadItem {
  id: string
  titulo: string
  descripcion: string
  fecha: string
  modulo: string
  tipo: string
  producto: string
  linkWiki: string
  estado: string
}

const queryColumns: NovedadQueryColumn[] = [
  { field: "NOVE_TITULO", title: "NOVE_TITULO" },
  { field: "NOVE_FECHA", title: "NOVE_FECHA", sortDirection: "DESC", sortOrder: 1 },
  { field: "NOVE_DESCRIPCION", title: "NOVE_DESCRIPCION" },
  { field: "NOVE_MODULO", title: "NOVE_MODULO" },
  { field: "NOVE_PRODUCTO", title: "NOVE_PRODUCTO" },
  { field: "NOVE_TIPO", title: "NOVE_TIPO" },
  { field: "NOVE_LINK_WIKI", title: "NOVE_LINK_WIKI" },
  { field: "NOVE_INTERNA", title: "NOVE_INTERNA" },
  { field: "NOVE_IMPORTANTE", title: "NOVE_IMPORTANTE" },
  { field: "NOVE_ESQUEMA", title: "NOVE_ESQUEMA" },
  { field: "NOVE_MENSAJE_PROCESADO", title: "NOVE_MENSAJE_PROCESADO" },
  { field: "DESC_ESTADO", title: "DESC_ESTADO" },
]

const queryFilters: NovedadQueryFilter[] = [
  {
    columnName: "DESC_ESTADO",
    operator: "=",
    value: "Publicada",
  },
]

const parseSchemaId = () => {
  const raw = process.env.YIQI_API_SCHEMA_ID
  if (!raw) return DEFAULT_SCHEMA_ID
  const parsed = Number(raw)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_SCHEMA_ID
}

const getPublicBaseUrl = () => process.env.YIQI_API_PUBLIC_BASE_URL || DEFAULT_PUBLIC_BASE_URL

const toSafeText = (value: unknown) => (typeof value === "string" ? value.trim() : "")

const normalizeItem = (record: NovedadRecord, index: number): NovedadItem => {
  const titulo = toSafeText(record.NOVE_TITULO) || "Sin título"
  const descripcion = toSafeText(record.NOVE_DESCRIPCION)
  const modulo = toSafeText(record.NOVE_MODULO)
  const tipo = toSafeText(record.NOVE_TIPO)
  const producto = toSafeText(record.NOVE_PRODUCTO)
  const linkWiki = toSafeText(record.NOVE_LINK_WIKI)
  const estado = toSafeText(record.DESC_ESTADO)
  const fecha = toSafeText(record.NOVE_FECHA)
  const fallbackId = `${titulo.toLowerCase().replace(/\s+/g, "-") || "novedad"}-${index}`

  return {
    id: fallbackId,
    titulo,
    descripcion,
    fecha,
    modulo,
    tipo,
    producto,
    linkWiki,
    estado,
  }
}

const buildPayload = (page: number): NovedadQueryPayload => ({
  page,
  pageSize: DEFAULT_PAGE_SIZE,
  search: "",
  columns: queryColumns,
  filters: queryFilters,
})

const fetchNovedadesPage = async (page: number, token: string): Promise<NovedadQueryResponse> => {
  const schemaId = parseSchemaId()
  const baseUrl = getPublicBaseUrl().replace(/\/+$/, "")
  const url = `${baseUrl}/NOVEDADES/query?schemaId=${schemaId}`

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(buildPayload(page)),
    cache: "no-store",
  })

  if (!response.ok) {
    const details = await response.text().catch(() => "")
    throw new Error(`Failed NOVEDADES query on page ${page} (${response.status}): ${details || "No details"}`)
  }

  return (await response.json()) as NovedadQueryResponse
}

export const getNovedades = async (): Promise<NovedadItem[]> => {
  const missingAuth = getMissingYiqiAuthEnv()
  if (missingAuth.length > 0) {
    console.warn(`Novedades unavailable. Missing YiQi API auth env: ${missingAuth.join(", ")}`)
    return []
  }

  let token: string
  try {
    token = await getYiqiToken()
  } catch (error) {
    console.warn("Novedades unavailable. Could not get YiQi API token", error)
    return []
  }

  const collected: NovedadRecord[] = []

  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const response = await fetchNovedadesPage(page, token)
    const pageData = Array.isArray(response.data) ? response.data : []
    const total = Number(response.total)
    const currentCount = Number.isFinite(total) ? total : pageData.length

    collected.push(...pageData)

    if (currentCount < DEFAULT_PAGE_SIZE) {
      break
    }
  }

  return collected.map(normalizeItem)
}

export const getNovedadesFilterOptions = (items: NovedadItem[]) => {
  const modulos = Array.from(new Set(items.map((item) => item.modulo).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b),
  )
  const tipos = Array.from(new Set(items.map((item) => item.tipo).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b),
  )

  return {
    modulos,
    tipos,
  }
}

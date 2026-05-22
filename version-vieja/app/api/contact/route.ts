import sql from "mssql"
import { NextResponse } from "next/server"
import { createHash } from "node:crypto"

import { getSqlPool } from "@/lib/db"

export const runtime = "nodejs"

const CONTACT_DESTINATION = process.env.CONTACT_MAIL_TO ?? "comercial@yiqi.com.ar"
const CONTACT_SENDER_MAIL = process.env.CONTACT_SENDER_MAIL ?? "info@yiqi.com.ar"
const CONTACT_SENDER_NAME = process.env.CONTACT_SENDER_NAME ?? "YiQi Web"
const AUDIT_USER = process.env.CONTACT_AUDIT_USER ?? "WEB"
const MAIL_STATUS_PENDING = "P"
const SUBJECT_MAX_LENGTH = 100
const MAX_BODY_BYTES = 12_000
const MIN_FORM_COMPLETION_MS = 1500
const MAX_NAME_LENGTH = 120
const MAX_EMAIL_LENGTH = 320
const MAX_PHONE_LENGTH = 40
const MAX_COMPANY_LENGTH = 120
const MAX_MESSAGE_LENGTH = 2000
const MAX_RECAPTCHA_TOKEN_LENGTH = 4096
const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify"
const RECAPTCHA_TIMEOUT_MS = 3000
const DEFAULT_RECAPTCHA_ALLOWED_HOSTNAMES = "www.yiqi.com.ar,yiqi.com.ar,localhost,127.0.0.1"
const USER_AGENT_MAX_LOG_LENGTH = 160

const parseIntegerEnv = (value: string | undefined, fallback: number) => {
  const parsed = Number.parseInt(value ?? "", 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

const parseScoreEnv = (value: string | undefined, fallback: number) => {
  const parsed = Number.parseFloat(value ?? "")
  return Number.isFinite(parsed) && parsed >= 0 && parsed <= 1 ? parsed : fallback
}

const CONTACT_RATE_LIMIT_MAX = parseIntegerEnv(process.env.CONTACT_RATE_LIMIT_MAX, 5)
const CONTACT_RATE_LIMIT_WINDOW_MS = parseIntegerEnv(process.env.CONTACT_RATE_LIMIT_WINDOW_MS, 600_000)
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY ?? ""
const RECAPTCHA_EXPECTED_ACTION = process.env.RECAPTCHA_EXPECTED_ACTION ?? "contact_submit"
const RECAPTCHA_MIN_SCORE = parseScoreEnv(process.env.RECAPTCHA_MIN_SCORE, 0.5)

const normalizeOrigin = (value: string) => {
  if (!value) return ""
  try {
    return new URL(value).origin
  } catch {
    return ""
  }
}

const normalizeHostname = (value: string) => {
  if (!value) return ""
  const candidate = value.trim()
  if (!candidate) return ""

  try {
    const withScheme = candidate.includes("://") ? candidate : `https://${candidate}`
    return new URL(withScheme).hostname.toLowerCase()
  } catch {
    return ""
  }
}

const ALLOWED_ORIGINS = (process.env.CONTACT_ALLOWED_ORIGINS ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.SITE_URL ??
  "")
  .split(",")
  .map((value) => normalizeOrigin(value.trim()))
  .filter(Boolean)

const RECAPTCHA_ALLOWED_HOSTNAMES = (
  process.env.RECAPTCHA_ALLOWED_HOSTNAMES ?? DEFAULT_RECAPTCHA_ALLOWED_HOSTNAMES
)
  .split(",")
  .map((value) => normalizeHostname(value))
  .filter(Boolean)

const normalizeText = (value: unknown) => (typeof value === "string" ? value.trim() : "")

const isWithinLimit = (value: string, max: number) => value.length <= max

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

type SecurityReasonCode = "origin_blocked" | "captcha_invalid" | "captcha_unavailable" | "rate_limited"

const RATE_LIMIT_STORE = new Map<string, { count: number; resetAt: number }>()

const getClientIp = (headers: Headers) => {
  const xForwardedFor = headers.get("x-forwarded-for")
  if (xForwardedFor) {
    const firstForwarded = xForwardedFor
      .split(",")
      .map((value) => value.trim())
      .find(Boolean)
    if (firstForwarded) return firstForwarded
  }

  const xRealIp = headers.get("x-real-ip")?.trim()
  if (xRealIp) return xRealIp

  const cfConnectingIp = headers.get("cf-connecting-ip")?.trim()
  if (cfConnectingIp) return cfConnectingIp

  return "unknown"
}

const hashIp = (ip: string) => createHash("sha256").update(ip).digest("hex").slice(0, 16)

const truncate = (value: string, max: number) => (value.length <= max ? value : value.slice(0, max))

const logSecurityEvent = (reasonCode: SecurityReasonCode, headers: Headers, details?: Record<string, unknown>) => {
  const clientIp = getClientIp(headers)
  const origin = normalizeOrigin(extractOrigin(headers))
  const userAgent = truncate(normalizeText(headers.get("user-agent") ?? ""), USER_AGENT_MAX_LOG_LENGTH)

  console.info("[contact-api] blocked request", {
    reason_code: reasonCode,
    ip_hash: hashIp(clientIp),
    origin: origin || "unknown",
    user_agent: userAgent || "unknown",
    ...details,
  })
}

const isRateLimited = (ip: string, now: number) => {
  if (RATE_LIMIT_STORE.size > 5000) {
    for (const [key, entry] of RATE_LIMIT_STORE.entries()) {
      if (entry.resetAt <= now) {
        RATE_LIMIT_STORE.delete(key)
      }
    }
  }

  const bucket = ip || "unknown"
  const current = RATE_LIMIT_STORE.get(bucket)
  if (!current || now >= current.resetAt) {
    RATE_LIMIT_STORE.set(bucket, {
      count: 1,
      resetAt: now + CONTACT_RATE_LIMIT_WINDOW_MS,
    })
    return false
  }

  if (current.count >= CONTACT_RATE_LIMIT_MAX) {
    return true
  }

  current.count += 1
  return false
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;"
      case "<":
        return "&lt;"
      case ">":
        return "&gt;"
      case '"':
        return "&quot;"
      case "'":
        return "&#39;"
      default:
        return char
    }
  })

interface ContactPayload {
  name: string
  email: string
  phone: string
  company: string
  message: string
  recaptchaToken?: string
  website?: string
  startedAt?: number
}

interface RecaptchaVerifyResponse {
  success?: boolean
  score?: number
  action?: string
  hostname?: string
  ["error-codes"]?: string[]
}

const verifyRecaptcha = async ({ token, ip }: { token: string; ip: string }) => {
  if (!RECAPTCHA_SECRET_KEY) {
    return { status: "unavailable" as const, details: { missingSecret: true } }
  }

  const payload = new URLSearchParams()
  payload.set("secret", RECAPTCHA_SECRET_KEY)
  payload.set("response", token)
  if (ip !== "unknown") {
    payload.set("remoteip", ip)
  }

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), RECAPTCHA_TIMEOUT_MS)

  try {
    const response = await fetch(RECAPTCHA_VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: payload.toString(),
      cache: "no-store",
      signal: controller.signal,
    })

    if (!response.ok) {
      return { status: "unavailable" as const, details: { httpStatus: response.status } }
    }

    const data = (await response.json()) as RecaptchaVerifyResponse
    const success = data.success === true
    const score = typeof data.score === "number" ? data.score : 0
    const action = normalizeText(data.action)
    const hostname = normalizeHostname(normalizeText(data.hostname))
    const hostnameAllowed = RECAPTCHA_ALLOWED_HOSTNAMES.includes(hostname)

    if (!success || score < RECAPTCHA_MIN_SCORE || action !== RECAPTCHA_EXPECTED_ACTION || !hostnameAllowed) {
      return {
        status: "invalid" as const,
        details: {
          success,
          score,
          action,
          hostname,
          hostnameAllowed,
        },
      }
    }

    return { status: "valid" as const }
  } catch (error) {
    return {
      status: "unavailable" as const,
      details: {
        message: error instanceof Error ? error.message : "unknown_error",
      },
    }
  } finally {
    clearTimeout(timeoutId)
  }
}

const formatOptional = (value: string) => (value ? value : "No informado")

const buildMailBody = (data: ContactPayload) => {
  const safeName = escapeHtml(data.name)
  const safeEmail = escapeHtml(data.email)
  const safePhone = escapeHtml(formatOptional(data.phone))
  const safeCompany = escapeHtml(formatOptional(data.company))
  const lines = [
    "<p>Nuevo contacto desde el sitio web.</p>",
    `<p><strong>Nombre:</strong> ${safeName}</p>`,
    `<p><strong>Email:</strong> ${safeEmail}</p>`,
    `<p><strong>Telefono:</strong> ${safePhone}</p>`,
    `<p><strong>Empresa:</strong> ${safeCompany}</p>`,
  ]

  if (data.message) {
    const safeMessage = escapeHtml(data.message).replace(/\r?\n/g, "<br />")
    lines.push(`<p><strong>Mensaje:</strong><br />${safeMessage}</p>`)
  }

  return lines.join("")
}

const buildSubject = (name: string) => {
  const base = `Nuevo contacto desde YiQi: ${name}`
  if (base.length <= SUBJECT_MAX_LENGTH) return base
  return base.slice(0, SUBJECT_MAX_LENGTH)
}

const extractOrigin = (headers: Headers) => {
  const originHeader = headers.get("origin")
  if (originHeader) return originHeader
  return headers.get("referer") ?? ""
}

const isOriginAllowed = (headers: Headers) => {
  const originValue = normalizeOrigin(extractOrigin(headers))
  if (!originValue) {
    return false
  }

  if (ALLOWED_ORIGINS.length > 0) {
    return ALLOWED_ORIGINS.includes(originValue)
  }

  const host = headers.get("host")?.toLowerCase()
  if (!host) return false

  try {
    const originHost = new URL(originValue).host.toLowerCase()
    return originHost === host
  } catch {
    return false
  }
}

const INSERT_QUERY = `
INSERT INTO ENT_MAIL_Y (
  MAIY_MAIL_DESTINATARIO,
  MAIY_MAIL_ASUNTO,
  MAIY_MAIL_CUERPO,
  MAIY_MAIL_REMITENTE,
  MAIY_MAIL_REMITENTE_MAIL,
  MAIY_MAIL_COPIA,
  MAIY_MAIL_ESTADO,
  MAIY_MAIL_DETALLEERROR,
  MAIY_ADJUNTO1,
  MAIY_ADJUNTO2,
  MAIY_ADJUNTO3,
  MAIY_ENTIDAD_ORIGEN,
  MAIY_ID_ORIGEN,
  AUDI_USUA_ALTA,
  AUDI_FECHA_ALTA,
  AUDI_USUA_MODIF,
  AUDI_FECHA_MODIF
)
OUTPUT INSERTED.MAIY_ID
VALUES (
  @destinatario,
  @asunto,
  @cuerpo,
  @remitente,
  @remitenteMail,
  @copia,
  @estado,
  @detalleError,
  @adjunto1,
  @adjunto2,
  @adjunto3,
  @entidadOrigen,
  @idOrigen,
  @usuarioAlta,
  GETDATE(),
  @usuarioModif,
  GETDATE()
);
`

export async function POST(req: Request) {
  if (!isOriginAllowed(req.headers)) {
    logSecurityEvent("origin_blocked", req.headers)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const contentType = req.headers.get("content-type") ?? ""
  if (!contentType.includes("application/json")) {
    return NextResponse.json({ error: "Unsupported media type" }, { status: 415 })
  }

  const contentLength = req.headers.get("content-length")
  if (contentLength && Number(contentLength) > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 })
  }

  let payload: unknown

  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const payloadSize = Buffer.byteLength(JSON.stringify(payload), "utf-8")
  if (payloadSize > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 })
  }

  const body = payload as Partial<ContactPayload>
  const name = normalizeText(body.name)
  const email = normalizeText(body.email)
  const phone = normalizeText(body.phone)
  const company = normalizeText(body.company)
  const message = normalizeText(body.message)
  const recaptchaToken = normalizeText(body.recaptchaToken)
  const website = normalizeText(body.website)
  const startedAtRaw = body.startedAt
  const startedAt = typeof startedAtRaw === "number" ? startedAtRaw : Number(startedAtRaw)

  if (!name || !email) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 })
  }

  if (!isWithinLimit(name, MAX_NAME_LENGTH)) {
    return NextResponse.json({ error: "Invalid name length" }, { status: 400 })
  }

  if (!isWithinLimit(email, MAX_EMAIL_LENGTH)) {
    return NextResponse.json({ error: "Invalid email length" }, { status: 400 })
  }

  if (phone && !isWithinLimit(phone, MAX_PHONE_LENGTH)) {
    return NextResponse.json({ error: "Invalid phone length" }, { status: 400 })
  }

  if (company && !isWithinLimit(company, MAX_COMPANY_LENGTH)) {
    return NextResponse.json({ error: "Invalid company length" }, { status: 400 })
  }

  if (!isWithinLimit(message, MAX_MESSAGE_LENGTH)) {
    return NextResponse.json({ error: "Invalid message length" }, { status: 400 })
  }

  if (!recaptchaToken || !isWithinLimit(recaptchaToken, MAX_RECAPTCHA_TOKEN_LENGTH)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  if (website) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  if (!Number.isFinite(startedAt) || startedAt <= 0) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  if (Date.now() - startedAt < MIN_FORM_COMPLETION_MS) {
    return NextResponse.json({ error: "Too fast" }, { status: 400 })
  }

  const clientIp = getClientIp(req.headers)
  const recaptchaStatus = await verifyRecaptcha({
    token: recaptchaToken,
    ip: clientIp,
  })

  if (recaptchaStatus.status === "invalid") {
    logSecurityEvent("captcha_invalid", req.headers, recaptchaStatus.details)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  if (recaptchaStatus.status === "unavailable") {
    logSecurityEvent("captcha_unavailable", req.headers, recaptchaStatus.details)
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 })
  }

  if (isRateLimited(clientIp, Date.now())) {
    logSecurityEvent("rate_limited", req.headers)
    return NextResponse.json({ error: "Too many requests" }, { status: 429 })
  }

  const mailBody = buildMailBody({ name, email, phone, company, message })
  const subject = buildSubject(name)

  const pool = await getSqlPool()
  const request = pool.request()

  request.input("destinatario", sql.NVarChar(320), CONTACT_DESTINATION)
  request.input("asunto", sql.NVarChar(100), subject)
  request.input("cuerpo", sql.NVarChar(sql.MAX), mailBody)
  request.input("remitente", sql.NVarChar(200), CONTACT_SENDER_NAME)
  request.input("remitenteMail", sql.NVarChar(320), CONTACT_SENDER_MAIL)
  request.input("copia", sql.NVarChar(320), null)
  request.input("estado", sql.NVarChar(1), MAIL_STATUS_PENDING)
  request.input("detalleError", sql.NVarChar(sql.MAX), null)
  request.input("adjunto1", sql.NVarChar(260), null)
  request.input("adjunto2", sql.NVarChar(260), null)
  request.input("adjunto3", sql.NVarChar(260), null)
  request.input("entidadOrigen", sql.NVarChar(100), null)
  request.input("idOrigen", sql.NVarChar(100), null)
  request.input("usuarioAlta", sql.NVarChar(50), AUDIT_USER)
  request.input("usuarioModif", sql.NVarChar(50), AUDIT_USER)

  const result = await request.query(INSERT_QUERY)
  const id = result.recordset?.[0]?.MAIY_ID ?? null

  return NextResponse.json({ ok: true, id })
}

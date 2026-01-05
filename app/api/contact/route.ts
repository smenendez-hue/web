import sql from "mssql"
import { NextResponse } from "next/server"

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

const ALLOWED_ORIGINS = (process.env.CONTACT_ALLOWED_ORIGINS ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.SITE_URL ??
  "")
  .split(",")
  .map((value) => value.trim())
  .filter(Boolean)

const normalizeText = (value: unknown) => (typeof value === "string" ? value.trim() : "")

const isWithinLimit = (value: string, max: number) => value.length <= max

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

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
  website?: string
  startedAt?: number
}

const formatOptional = (value: string) => (value ? value : "No informado")

const buildMailBody = (data: ContactPayload) => {
  const safeName = escapeHtml(data.name)
  const safeEmail = escapeHtml(data.email)
  const safePhone = escapeHtml(formatOptional(data.phone))
  const safeCompany = escapeHtml(formatOptional(data.company))
  const safeMessage = escapeHtml(data.message).replace(/\r?\n/g, "<br />")

  return [
    "<p>Nuevo contacto desde el sitio web.</p>",
    `<p><strong>Nombre:</strong> ${safeName}</p>`,
    `<p><strong>Email:</strong> ${safeEmail}</p>`,
    `<p><strong>Telefono:</strong> ${safePhone}</p>`,
    `<p><strong>Empresa:</strong> ${safeCompany}</p>`,
    `<p><strong>Mensaje:</strong><br />${safeMessage}</p>`,
  ].join("")
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

const parseOrigin = (value: string) => {
  if (!value) return ""
  try {
    return new URL(value).origin
  } catch {
    return ""
  }
}

const isOriginAllowed = (headers: Headers) => {
  const originValue = parseOrigin(extractOrigin(headers))
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
  const website = normalizeText(body.website)
  const startedAtRaw = body.startedAt
  const startedAt = typeof startedAtRaw === "number" ? startedAtRaw : Number(startedAtRaw)

  if (!name || !email || !message) {
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

  if (website) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  if (!Number.isFinite(startedAt) || startedAt <= 0) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  if (Date.now() - startedAt < MIN_FORM_COMPLETION_MS) {
    return NextResponse.json({ error: "Too fast" }, { status: 400 })
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

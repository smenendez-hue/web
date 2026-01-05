import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@/lib/db", () => ({
  getSqlPool: vi.fn(),
}))

const ALLOWED_ORIGIN = "https://example.com"

const buildPayload = (overrides: Partial<Record<string, unknown>> = {}) => ({
  name: "Juan Perez",
  email: "juan@example.com",
  phone: "111111111",
  company: "YiQi",
  message: "Necesito mas info.",
  website: "",
  startedAt: Date.now() - 2000,
  ...overrides,
})

const buildRequest = (payload: Record<string, unknown>, headers: Record<string, string> = {}) =>
  new Request("http://localhost/api/contact", {
    method: "POST",
    headers: {
      origin: ALLOWED_ORIGIN,
      "content-type": "application/json",
      ...headers,
    },
    body: JSON.stringify(payload),
  })

const setupDbMock = async () => {
  const dbModule = await import("@/lib/db")
  const getSqlPool = dbModule.getSqlPool as unknown as ReturnType<typeof vi.fn>
  const inputSpy = vi.fn().mockReturnThis()
  const querySpy = vi.fn().mockResolvedValue({ recordset: [{ MAIY_ID: 1 }] })
  getSqlPool.mockResolvedValue({
    request: () => ({
      input: inputSpy,
      query: querySpy,
    }),
  })

  return { inputSpy, querySpy }
}

const loadRoute = async () => {
  process.env.CONTACT_ALLOWED_ORIGINS = ALLOWED_ORIGIN
  process.env.NEXT_PUBLIC_SITE_URL = ""
  process.env.SITE_URL = ""
  vi.resetModules()
  return import("@/app/api/contact/route")
}

describe("contact route", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("rejects missing origin", async () => {
    const { POST } = await loadRoute()
    await setupDbMock()
    const req = buildRequest(buildPayload(), { origin: "" })
    const res = await POST(req)
    expect(res.status).toBe(403)
  })

  it("rejects invalid content type", async () => {
    const { POST } = await loadRoute()
    await setupDbMock()
    const req = buildRequest(buildPayload(), { "content-type": "text/plain" })
    const res = await POST(req)
    expect(res.status).toBe(415)
  })

  it("rejects payloads that are too large", async () => {
    const { POST } = await loadRoute()
    await setupDbMock()
    const req = buildRequest(buildPayload(), { "content-length": "13000" })
    const res = await POST(req)
    expect(res.status).toBe(413)
  })

  it("rejects invalid email", async () => {
    const { POST } = await loadRoute()
    await setupDbMock()
    const req = buildRequest(buildPayload({ email: "invalid-email" }))
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it("rejects honeypot submissions", async () => {
    const { POST } = await loadRoute()
    await setupDbMock()
    const req = buildRequest(buildPayload({ website: "spam" }))
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it("rejects too-fast submissions", async () => {
    const { POST } = await loadRoute()
    await setupDbMock()
    const req = buildRequest(buildPayload({ startedAt: Date.now() }))
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it("saves a valid payload and enforces sender/subject rules", async () => {
    const { POST } = await loadRoute()
    const { inputSpy } = await setupDbMock()
    const longName = "Nombre Largo ".repeat(8)
    const req = buildRequest(buildPayload({ name: longName }))
    const res = await POST(req)
    expect(res.status).toBe(200)

    const subjectCall = inputSpy.mock.calls.find((call) => call[0] === "asunto")
    expect(subjectCall).toBeTruthy()
    expect(String(subjectCall?.[2] ?? "").length).toBeLessThanOrEqual(100)

    const senderCall = inputSpy.mock.calls.find((call) => call[0] === "remitenteMail")
    expect(senderCall?.[2]).toBe("info@yiqi.com.ar")
  })
})

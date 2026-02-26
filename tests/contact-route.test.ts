import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

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
  recaptchaToken: "token-ok",
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
      "x-forwarded-for": "198.51.100.10",
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

  return { inputSpy, querySpy, getSqlPool }
}

const mockRecaptchaResponse = (overrides: Partial<Record<string, unknown>> = {}) =>
  vi.spyOn(globalThis, "fetch").mockImplementation(async () =>
    new Response(
      JSON.stringify({
        success: true,
        score: 0.9,
        action: "contact_submit",
        hostname: "example.com",
        ...overrides,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    ),
  )

type LoadRouteOptions = {
  allowedOrigins?: string | null
  nextPublicSiteUrl?: string | null
  siteUrl?: string | null
  recaptchaSecretKey?: string | null
  recaptchaMinScore?: string | null
  recaptchaExpectedAction?: string | null
  recaptchaAllowedHostnames?: string | null
  contactRateLimitMax?: string | null
  contactRateLimitWindowMs?: string | null
}

const setEnvValue = (key: string, value: string | null) => {
  if (value === null) {
    delete process.env[key]
    return
  }
  process.env[key] = value
}

const loadRoute = async ({
  allowedOrigins = ALLOWED_ORIGIN,
  nextPublicSiteUrl = "",
  siteUrl = "",
  recaptchaSecretKey = "test-secret",
  recaptchaMinScore = "0.5",
  recaptchaExpectedAction = "contact_submit",
  recaptchaAllowedHostnames = "example.com,fallback.example,valid.example,www.yiqi.com.ar,yiqi.com.ar,localhost,127.0.0.1",
  contactRateLimitMax = "5",
  contactRateLimitWindowMs = "600000",
}: LoadRouteOptions = {}) => {
  setEnvValue("CONTACT_ALLOWED_ORIGINS", allowedOrigins)
  setEnvValue("NEXT_PUBLIC_SITE_URL", nextPublicSiteUrl)
  setEnvValue("SITE_URL", siteUrl)
  setEnvValue("RECAPTCHA_SECRET_KEY", recaptchaSecretKey)
  setEnvValue("RECAPTCHA_MIN_SCORE", recaptchaMinScore)
  setEnvValue("RECAPTCHA_EXPECTED_ACTION", recaptchaExpectedAction)
  setEnvValue("RECAPTCHA_ALLOWED_HOSTNAMES", recaptchaAllowedHostnames)
  setEnvValue("CONTACT_RATE_LIMIT_MAX", contactRateLimitMax)
  setEnvValue("CONTACT_RATE_LIMIT_WINDOW_MS", contactRateLimitWindowMs)
  vi.resetModules()
  return import("@/app/api/contact/route")
}

describe("contact route", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it("rejects missing origin", async () => {
    const { POST } = await loadRoute()
    await setupDbMock()
    const req = buildRequest(buildPayload(), { origin: "" })
    const res = await POST(req)
    expect(res.status).toBe(403)
  })

  it("accepts origin when allowlist entries include trailing slash", async () => {
    const { POST } = await loadRoute({ allowedOrigins: "https://example.com/" })
    await setupDbMock()
    mockRecaptchaResponse()
    const req = buildRequest(buildPayload(), { origin: "https://example.com" })
    const res = await POST(req)
    expect(res.status).toBe(200)
  })

  it("accepts localhost when explicitly allowlisted", async () => {
    const { POST } = await loadRoute({ allowedOrigins: "http://localhost:3000,http://127.0.0.1:3000" })
    await setupDbMock()
    mockRecaptchaResponse({ hostname: "localhost" })
    const req = buildRequest(buildPayload(), { origin: "http://localhost:3000" })
    const res = await POST(req)
    expect(res.status).toBe(200)
  })

  it("accepts requests when origin is provided via referer", async () => {
    const { POST } = await loadRoute()
    await setupDbMock()
    mockRecaptchaResponse()
    const req = buildRequest(buildPayload(), { origin: "", referer: "https://example.com/contacto" })
    const res = await POST(req)
    expect(res.status).toBe(200)
  })

  it("uses NEXT_PUBLIC_SITE_URL as fallback allowlist when CONTACT_ALLOWED_ORIGINS is undefined", async () => {
    const { POST } = await loadRoute({
      allowedOrigins: null,
      nextPublicSiteUrl: "https://fallback.example/",
    })
    await setupDbMock()
    mockRecaptchaResponse({ hostname: "fallback.example" })
    const req = buildRequest(buildPayload(), { origin: "https://fallback.example" })
    const res = await POST(req)
    expect(res.status).toBe(200)
  })

  it("accepts allowlist values with spaces and ignores invalid entries", async () => {
    const { POST } = await loadRoute({
      allowedOrigins: " not-a-url, https://valid.example/ , ",
    })
    await setupDbMock()
    mockRecaptchaResponse({ hostname: "valid.example" })
    const req = buildRequest(buildPayload(), { origin: "https://valid.example" })
    const res = await POST(req)
    expect(res.status).toBe(200)
  })

  it("rejects origins outside allowlist", async () => {
    const { POST } = await loadRoute({ allowedOrigins: "https://www.yiqi.com.ar,https://yiqi.com.ar" })
    const req = buildRequest(buildPayload(), { origin: "https://attacker.example" })
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

  it("rejects missing recaptcha token", async () => {
    const { POST } = await loadRoute()
    const { getSqlPool } = await setupDbMock()
    const req = buildRequest(buildPayload({ recaptchaToken: "" }))
    const res = await POST(req)
    expect(res.status).toBe(400)
    expect(getSqlPool).not.toHaveBeenCalled()
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

  it("rejects captcha responses marked as invalid", async () => {
    const { POST } = await loadRoute()
    const { getSqlPool } = await setupDbMock()
    mockRecaptchaResponse({ success: false })
    const req = buildRequest(buildPayload())
    const res = await POST(req)
    expect(res.status).toBe(403)
    expect(getSqlPool).not.toHaveBeenCalled()
  })

  it("rejects captcha responses below minimum score", async () => {
    const { POST } = await loadRoute()
    const { getSqlPool } = await setupDbMock()
    mockRecaptchaResponse({ score: 0.1 })
    const req = buildRequest(buildPayload())
    const res = await POST(req)
    expect(res.status).toBe(403)
    expect(getSqlPool).not.toHaveBeenCalled()
  })

  it("rejects captcha responses with unexpected action", async () => {
    const { POST } = await loadRoute()
    const { getSqlPool } = await setupDbMock()
    mockRecaptchaResponse({ action: "other_action" })
    const req = buildRequest(buildPayload())
    const res = await POST(req)
    expect(res.status).toBe(403)
    expect(getSqlPool).not.toHaveBeenCalled()
  })

  it("rejects captcha responses with invalid hostname", async () => {
    const { POST } = await loadRoute()
    const { getSqlPool } = await setupDbMock()
    mockRecaptchaResponse({ hostname: "attacker.example" })
    const req = buildRequest(buildPayload())
    const res = await POST(req)
    expect(res.status).toBe(403)
    expect(getSqlPool).not.toHaveBeenCalled()
  })

  it("returns 503 when captcha verification fails", async () => {
    const { POST } = await loadRoute()
    const { getSqlPool } = await setupDbMock()
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("network error"))
    const req = buildRequest(buildPayload())
    const res = await POST(req)
    expect(res.status).toBe(503)
    expect(getSqlPool).not.toHaveBeenCalled()
  })

  it("allows up to five requests and blocks the sixth in the same window", async () => {
    const { POST } = await loadRoute({
      contactRateLimitMax: "5",
      contactRateLimitWindowMs: "600000",
    })
    const { getSqlPool } = await setupDbMock()
    mockRecaptchaResponse()

    for (let index = 0; index < 5; index += 1) {
      const res = await POST(buildRequest(buildPayload()))
      expect(res.status).toBe(200)
    }

    const blockedRes = await POST(buildRequest(buildPayload()))
    expect(blockedRes.status).toBe(429)
    expect(getSqlPool).toHaveBeenCalledTimes(5)
  })

  it("resets rate limit after the configured window", async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-01-01T00:00:00.000Z"))

    const { POST } = await loadRoute({
      contactRateLimitMax: "1",
      contactRateLimitWindowMs: "1000",
    })
    await setupDbMock()
    mockRecaptchaResponse()

    const firstRes = await POST(buildRequest(buildPayload()))
    expect(firstRes.status).toBe(200)

    const blockedRes = await POST(buildRequest(buildPayload()))
    expect(blockedRes.status).toBe(429)

    vi.setSystemTime(new Date("2026-01-01T00:00:01.100Z"))
    const recoveredRes = await POST(buildRequest(buildPayload()))
    expect(recoveredRes.status).toBe(200)
  })

  it("saves a valid payload and enforces sender and subject rules", async () => {
    const { POST } = await loadRoute()
    const { inputSpy } = await setupDbMock()
    mockRecaptchaResponse()

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

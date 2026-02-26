// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { ContactContent } from "@/components/contact-content"

const RECAPTCHA_ERROR_MESSAGE = "Ocurrio un error al enviar el mensaje. Intenta nuevamente."

const fillRequiredFields = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText(/Nombre/i), "Juan Perez")
  await user.type(screen.getByLabelText(/Email/i), "juan@example.com")
  await user.type(screen.getByLabelText(/Mensaje/i), "Necesito mas informacion.")
}

const mockFetchResponse = (status: number) =>
  vi.spyOn(globalThis, "fetch").mockImplementation(async () =>
    new Response(JSON.stringify({ ok: status >= 200 && status < 300 }), {
      status,
      headers: { "Content-Type": "application/json" },
    }),
  )

const mockGrecaptcha = (token = "recaptcha-token") => {
  window.grecaptcha = {
    ready: (callback: () => void) => callback(),
    execute: vi.fn().mockResolvedValue(token),
  }
}

describe("ContactContent", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY = "test-site-key"
  })

  afterEach(() => {
    cleanup()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    delete window.grecaptcha
    delete process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
  })

  it("blocks submit and shows an error on too-long message", async () => {
    const user = userEvent.setup()
    const fetchSpy = mockFetchResponse(200)
    render(<ContactContent />)

    await user.type(screen.getByLabelText(/Nombre/i), "Juan Perez")
    await user.type(screen.getByLabelText(/Email/i), "juan@example.com")
    const longMessage = "a".repeat(2100)
    fireEvent.change(screen.getByLabelText(/Mensaje/i), {
      target: { value: longMessage },
    })
    await user.click(screen.getByRole("button", { name: /Enviar mensaje/i }))

    expect(screen.getByText(/mensaje es demasiado largo/i)).toBeTruthy()
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it("does not send request when recaptcha is unavailable", async () => {
    const user = userEvent.setup()
    const fetchSpy = mockFetchResponse(200)
    render(<ContactContent />)

    await fillRequiredFields(user)
    await user.click(screen.getByRole("button", { name: /Enviar mensaje/i }))

    await screen.findByText(RECAPTCHA_ERROR_MESSAGE)
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it("sends recaptcha token in request payload", async () => {
    const user = userEvent.setup()
    const fetchSpy = mockFetchResponse(200)
    mockGrecaptcha("token-123")
    render(<ContactContent />)

    await fillRequiredFields(user)
    await user.click(screen.getByRole("button", { name: /Enviar mensaje/i }))

    await waitFor(() => expect(fetchSpy).toHaveBeenCalledTimes(1))
    const payload = JSON.parse(String(fetchSpy.mock.calls[0]?.[1]?.body ?? "{}"))
    expect(payload.recaptchaToken).toBe("token-123")
  })

  it.each([403, 429, 503])("shows generic error for blocked status %s", async (status) => {
    const user = userEvent.setup()
    mockFetchResponse(status)
    mockGrecaptcha()
    render(<ContactContent />)

    await fillRequiredFields(user)
    await user.click(screen.getByRole("button", { name: /Enviar mensaje/i }))

    await screen.findByText(RECAPTCHA_ERROR_MESSAGE)
  })

  it("sets maxLength for key fields", () => {
    render(<ContactContent />)

    const nameInput = screen.getByLabelText(/Nombre/i) as HTMLInputElement
    const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement
    const phoneInput = screen.getByLabelText(/Tel/i) as HTMLInputElement
    const companyInput = screen.getByLabelText(/Empresa/i) as HTMLInputElement
    const messageInput = screen.getByLabelText(/Mensaje/i) as HTMLTextAreaElement

    expect(nameInput.maxLength).toBe(120)
    expect(emailInput.maxLength).toBe(320)
    expect(phoneInput.maxLength).toBe(40)
    expect(companyInput.maxLength).toBe(120)
    expect(messageInput.maxLength).toBe(2000)
  })
})

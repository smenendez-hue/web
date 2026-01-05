// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { ContactContent } from "@/components/contact-content"

describe("ContactContent", () => {
  beforeEach(() => {
    if (!globalThis.fetch) {
      vi.stubGlobal(
        "fetch",
        vi.fn(() =>
          Promise.resolve(
            new Response(JSON.stringify({ ok: true }), {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }),
          ),
        ),
      )
    } else {
      vi.spyOn(globalThis, "fetch").mockResolvedValue(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      )
    }
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it("blocks submit and shows an error on too-long message", async () => {
    const user = userEvent.setup()
    render(<ContactContent />)

    await user.type(screen.getByLabelText(/Nombre/i), "Juan Perez")
    await user.type(screen.getByLabelText(/Email/i), "juan@example.com")
    const longMessage = "a".repeat(2100)
    fireEvent.change(screen.getByLabelText(/Mensaje/i), {
      target: { value: longMessage },
    })
    await user.click(screen.getByRole("button", { name: /Enviar mensaje/i }))

    expect(screen.getByText(/mensaje es demasiado largo/i)).toBeTruthy()
    expect(globalThis.fetch).not.toHaveBeenCalled()
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

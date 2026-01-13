"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Send } from "lucide-react"

const COOLDOWN_MS = 5000
const MAX_NAME_LENGTH = 120
const MAX_EMAIL_LENGTH = 320
const MAX_PHONE_LENGTH = 40
const MAX_COMPANY_LENGTH = 120
const MAX_MESSAGE_LENGTH = 2000
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const FORM_FIELDS = ["name", "email", "phone", "company", "message", "website"] as const

type ContactFormState = {
  name: string
  email: string
  phone: string
  company: string
  message: string
  website: string
  startedAt: number
}

export function ContactContent() {
  const [formData, setFormData] = useState<ContactFormState>({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    website: "",
    startedAt: Date.now(),
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCooldown, setIsCooldown] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const cooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) {
        clearTimeout(cooldownTimerRef.current)
      }
    }
  }, [])

  const startCooldown = () => {
    if (cooldownTimerRef.current) {
      clearTimeout(cooldownTimerRef.current)
    }

    setIsCooldown(true)
    cooldownTimerRef.current = setTimeout(() => {
      setIsCooldown(false)
      setSubmitStatus("idle")
    }, COOLDOWN_MS)
  }

  const validateForm = (data: ContactFormState) => {
    if (!data.name.trim()) return "Completa tu nombre."
    if (data.name.length > MAX_NAME_LENGTH) return "El nombre es demasiado largo."
    if (!data.email.trim()) return "Completa tu email."
    if (!EMAIL_PATTERN.test(data.email)) return "El email no es valido."
    if (data.email.length > MAX_EMAIL_LENGTH) return "El email es demasiado largo."
    if (data.phone && data.phone.length > MAX_PHONE_LENGTH) return "El telefono es demasiado largo."
    if (data.company && data.company.length > MAX_COMPANY_LENGTH) return "La empresa es demasiado larga."
    if (!data.message.trim()) return "Completa tu mensaje."
    if (data.message.length > MAX_MESSAGE_LENGTH) return "El mensaje es demasiado largo."
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting || isCooldown) return

    const validationError = validateForm(formData)
    if (validationError) {
      setErrorMessage(validationError)
      setSubmitStatus("error")
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")
    setErrorMessage(null)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Contact request failed")
      }

      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: "",
        website: "",
        startedAt: Date.now(),
      })
      setSubmitStatus("success")
      setErrorMessage(null)
      startCooldown()
    } catch (error) {
      setSubmitStatus("error")
      setErrorMessage("Ocurrio un error al enviar el mensaje. Intenta nuevamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (!FORM_FIELDS.includes(name as (typeof FORM_FIELDS)[number])) {
      return
    }
    if (errorMessage) {
      setErrorMessage(null)
      if (submitStatus === "error") {
        setSubmitStatus("idle")
      }
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <div className="w-full max-w-7xl px-8 py-16 flex flex-col items-center gap-16">
      {/* Header Section */}
      <div className="w-full flex flex-col items-center gap-6 text-center">
        <div className="inline-flex items-center px-4 py-2 rounded-full border border-brand-blue-light/30 gap-2">
          <div className="w-2 h-2 bg-brand-blue-light rounded-full animate-pulse" />
          <span className="text-text-muted text-sm font-normal">ESTAMOS AQUÍ PARA AYUDARTE</span>
        </div>

        <h1 className="text-white text-5xl md:text-6xl font-extrabold font-['Montserrat'] leading-tight">
          Hablemos de tu <span className="brand-orange-text">empresa</span>
          <span className="text-text-secondary">.</span>
        </h1>

        <p className="text-text-secondary text-xl font-light max-w-2xl">
          Cuéntanos cómo podemos ayudarte a optimizar tu gestión empresarial. Nuestro equipo está listo para responder
          todas tus consultas.
        </p>
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="w-full">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <Input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={formData.website}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-text-primary text-sm font-medium">
                Nombre completo *
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                required
                maxLength={MAX_NAME_LENGTH}
                value={formData.name}
                onChange={handleChange}
                placeholder="Nombre y apellido"
                className="px-4 py-3 bg-bg-elevated rounded-2xl border border-white/10 text-text-primary placeholder:text-text-muted focus:border-brand-blue-light focus:ring-2 focus:ring-brand-blue-light/20 transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-text-primary text-sm font-medium">
                Email *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                maxLength={MAX_EMAIL_LENGTH}
                value={formData.email}
                onChange={handleChange}
                placeholder="empresa@empresa.com"
                className="px-4 py-3 bg-bg-elevated rounded-2xl border border-white/10 text-text-primary placeholder:text-text-muted focus:border-brand-blue-light focus:ring-2 focus:ring-brand-blue-light/20 transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="text-text-primary text-sm font-medium">
                Teléfono
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                maxLength={MAX_PHONE_LENGTH}
                value={formData.phone}
                onChange={handleChange}
                placeholder="+54 11 9999-9999"
                className="px-4 py-3 bg-bg-elevated rounded-2xl border border-white/10 text-text-primary placeholder:text-text-muted focus:border-brand-blue-light focus:ring-2 focus:ring-brand-blue-light/20 transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="company" className="text-text-primary text-sm font-medium">
                Empresa
              </label>
              <Input
                id="company"
                name="company"
                type="text"
                maxLength={MAX_COMPANY_LENGTH}
                value={formData.company}
                onChange={handleChange}
                placeholder="Mi Empresa S.A."
                className="px-4 py-3 bg-bg-elevated rounded-2xl border border-white/10 text-text-primary placeholder:text-text-muted focus:border-brand-blue-light focus:ring-2 focus:ring-brand-blue-light/20 transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-text-primary text-sm font-medium">
                Mensaje *
              </label>
              <Textarea
                id="message"
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="Cuéntanos cómo podemos ayudarte..."
                rows={6}
                maxLength={MAX_MESSAGE_LENGTH}
                className="px-4 py-3 bg-bg-elevated rounded-2xl border border-white/10 text-text-primary placeholder:text-text-muted focus:border-brand-blue-light focus:ring-2 focus:ring-brand-blue-light/20 transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isCooldown}
              className="w-full px-6 py-4 bg-brand-orange rounded-2xl text-white font-semibold text-base flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Enviando...
                </>
              ) : submitStatus === "success" ? (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  ¡Mensaje enviado!
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Enviar mensaje
                </>
              )}
            </button>

            {submitStatus === "success" && (
              <div className="p-4 bg-brand-mint/10 border border-brand-mint/30 rounded-2xl">
                <p className="text-brand-mint text-sm text-center">
                  ¡Gracias por contactarnos! Te responderemos pronto.
                </p>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="p-4 bg-brand-orange/10 border border-brand-orange/30 rounded-2xl">
                <p className="text-brand-orange text-sm text-center">
                  {errorMessage ?? "Ocurrio un error al enviar el mensaje. Intenta nuevamente."}
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Contact Info */}
        <div className="w-full flex flex-col gap-8">
          {/* Contact Cards */}
          <div className="flex flex-col gap-4">
            <div className="p-6 bg-bg-elevated rounded-2xl border border-white/10 flex items-start gap-4 hover:border-brand-blue-light/30 transition-all">
              <div className="w-12 h-12 bg-brand-blue-light/10 rounded-xl flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6 text-brand-blue-light" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-text-primary font-semibold text-lg">Email</h3>
                <a
                  href="mailto:comercial@yiqi.com.ar"
                  className="text-text-secondary hover:text-brand-blue-light transition-colors"
                >
                  comercial@yiqi.com.ar
                </a>
              </div>
            </div>

            <div className="p-6 bg-bg-elevated rounded-2xl border border-white/10 flex items-start gap-4 hover:border-brand-orange/30 transition-all">
              <div className="w-12 h-12 bg-brand-orange/10 rounded-xl flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6 text-brand-orange" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-text-primary font-semibold text-lg">Teléfono</h3>
                <a href="tel:+541170799474" className="text-text-secondary hover:text-brand-orange transition-colors">
                  +54 11 7079-9474
                </a>
              </div>
            </div>

          </div>

          {/* CTA Card */}
          <div className="p-8 bg-linear-to-br from-brand-blue-light/10 to-brand-purple/10 rounded-2xl border border-brand-blue-light/20 flex flex-col gap-4">
            <h3 className="text-white font-bold text-2xl">¿Prefieres una demo en vivo?</h3>
            <p className="text-text-secondary text-base">
              Agenda una reunión personalizada con nuestro equipo para conocer YiQi en profundidad.
            </p>
            <a
              href="https://calendly.com/javierperez/meet-30-demo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-[var(--gradient-purple-start)] to-[var(--gradient-purple-end)] text-white font-semibold text-base rounded-2xl border border-[var(--gradient-purple-border)] hover:opacity-90 transition-opacity"
            >
              Reservar demo
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}



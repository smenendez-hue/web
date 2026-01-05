"use client"

import { useState } from "react"
import { ChevronDown, Search } from "lucide-react"
import type { FAQCategory } from "@/lib/faq-store"

interface FAQPageContentProps {
  categories: FAQCategory[]
}

export function FAQPageContent({ categories }: FAQPageContentProps) {
  const [openIndex, setOpenIndex] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const toggleItem = (categoryIndex: number, questionIndex: number) => {
    const key = `${categoryIndex}-${questionIndex}`
    setOpenIndex((current) => (current === key ? null : key))
  }

  const filteredCategories = categories
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((category) => category.questions.length > 0)

  return (
    <section className="w-full page-shell max-w-[1100px] py-8 flex flex-col items-center gap-8 sm:gap-12">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="ty-h1 night-text">
          Preguntas frecuentes<span className="brand-orange-text">.</span>
        </h1>
        <p className="ty-body text-text-secondary max-w-[600px]">
          Encuentra respuestas a las preguntas más comunes sobre YiQi ERP. Si no encuentras lo que buscas, no dudes en
          contactarnos.
        </p>

        <div className="w-full max-w-[600px] mt-4 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            placeholder="Buscar pregunta..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-bg-tertiary rounded-2xl text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-all"
          />
        </div>
      </div>

      <div className="w-full flex flex-col gap-8 sm:gap-12">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category, categoryIndex) => (
            <div key={category.category} className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <h2 className="ty-h3 brand-orange-text">{category.category}</h2>
              </div>

              <div className="w-full flex flex-col gap-3">
                {category.questions.map((faq, questionIndex) => {
                  const key = `${categoryIndex}-${questionIndex}`
                  const isOpen = openIndex === key

                  return (
                    <div
                      key={`${faq.id}-${key}`}
                      className="bg-bg-tertiary rounded-2xl px-6 py-1 shadow-sm transition-colors"
                    >
                      <button
                        type="button"
                        className="w-full flex items-center justify-between gap-4 py-5 text-left cursor-pointer group"
                        onClick={() => toggleItem(categoryIndex, questionIndex)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${key}`}
                      >
                        <span className="text-text-primary text-base font-medium leading-6 group-hover:text-brand-orange transition-colors">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-brand-blue transition-all duration-300 shrink-0 ${
                            isOpen ? "rotate-180 text-brand-orange" : ""
                          }`}
                          strokeWidth={2}
                        />
                      </button>

                      {isOpen && (
                        <div
                          id={`faq-panel-${key}`}
                          className="pb-5 pt-1 text-text-secondary text-sm leading-6 animate-slideDown"
                        >
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-text-secondary ty-body">No se encontraron preguntas que coincidan con tu búsqueda.</p>
          </div>
        )}
      </div>

      <div className="w-full max-w-[800px] mt-6 sm:mt-8 p-6 sm:p-8 bg-linear-to-br from-bg-tertiary to-bg-secondary rounded-3xl border border-white/10 text-center">
        <h3 className="ty-h3 night-text mb-3">¿No encuentras tu respuesta?</h3>
        <p className="text-text-secondary ty-body mb-6">
          Nuestro equipo está listo para ayudarte con cualquier consulta que tengas.
        </p>
        <a
          href="/contacto"
          className="inline-flex items-center justify-center px-8 py-3 bg-brand-orange rounded-2xl text-zinc-100 font-semibold hover:opacity-90 transition-opacity"
        >
          Contáctanos
        </a>
      </div>
    </section>
  )
}

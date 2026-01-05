"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import type { FAQCategory } from "@/lib/faq-store"

interface FAQSectionProps {
  categories: FAQCategory[]
}

export function FAQSection({ categories }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<string | null>(null)

  const toggleItem = (categoryIndex: number, questionIndex: number) => {
    const key = `${categoryIndex}-${questionIndex}`
    setOpenIndex((current) => (current === key ? null : key))
  }

  const categoriesToRender = categories

  return (
    <section className="w-full page-shell max-w-[992px] py-12 sm:py-16 flex flex-col items-center gap-6 sm:gap-8">
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-center text-3xl font-extrabold leading-8 night-text">
          Preguntas frecuentes<span className="text-brand">.</span>
        </h2>
      </div>

      <div className="w-full flex flex-col gap-4">
        {categoriesToRender.map((category, categoryIndex) => (
          <div key={category.category} className="flex flex-col gap-3">
            {/* <div className="text-xs uppercase tracking-[0.4em] text-text-secondary">{category.category}</div> */}
            {category.questions.map((faq, questionIndex) => {
              const key = `${categoryIndex}-${questionIndex}`
              const isOpen = openIndex === key

              return (
                <div key={`${faq.id}-${key}`} className="bg-bg-tertiary rounded-2xl px-4 sm:px-6 py-1 shadow-sm">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between gap-4 py-4 text-left cursor-pointer"
                    onClick={() => toggleItem(categoryIndex, questionIndex)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${key}`}
                  >
                    <span className="text-text-primary text-sm font-normal leading-4">{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-brand-blue transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      strokeWidth={1.33}
                    />
                  </button>

                  {isOpen ? (
                    <div id={`faq-panel-${key}`} className="pb-4 pt-1 text-text-secondary text-sm leading-5">
                      {faq.answer}
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </section>
  )
}

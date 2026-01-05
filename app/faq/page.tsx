import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FAQPageContent } from "@/components/faq-page-content"
import { loadFaqCategories } from "@/lib/faq-store"

export const metadata = {
  title: "Preguntas Frecuentes - YiQi ERP",
  description:
    "Encuentra respuestas a las preguntas mas comunes sobre YiQi ERP, el sistema de gestion empresarial completo en la nube.",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "Preguntas Frecuentes - YiQi ERP",
    description:
      "Encuentra respuestas a las preguntas mas comunes sobre YiQi ERP, el sistema de gestion empresarial completo en la nube.",
    url: "/faq",
  },
  twitter: {
    title: "Preguntas Frecuentes - YiQi ERP",
    description:
      "Encuentra respuestas a las preguntas mas comunes sobre YiQi ERP, el sistema de gestion empresarial completo en la nube.",
  },
}

export default async function FAQPage() {
  const faqCategories = await loadFaqCategories()

  return (
    <div className="min-h-screen overflow-hidden">
      <Header />
      <main className="flex flex-col items-center pt-20 sm:pt-24 pb-12 sm:pb-16">
        <FAQPageContent categories={faqCategories} />
      </main>
      <Footer />
    </div>
  )
}

import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { IntegrationsSection } from "@/components/integrations-section"
import { ValueProposition } from "@/components/value-proposition"
import { ModulesSection } from "@/components/modules-section"
import { BenefitsSection } from "@/components/benefits-section"
import { DemoSection } from "@/components/demo-section"
import { PricingSection } from "@/components/pricing-section"
import { TransformSection } from "@/components/transform-section"
import { ClientsSection } from "@/components/clients-section"
import { FAQSection } from "@/components/faq-section"
import { Footer } from "@/components/footer"
import { loadFaqCategories } from "@/lib/faq-store"

export const metadata = {
  title: "YiQi - El ERP mas completo del mercado",
  description:
    "Gestiona tu empresa con un ERP inteligente que automatiza tareas, conecta areas y te da control total en tiempo real.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "YiQi - El ERP mas completo del mercado",
    description:
      "Gestiona tu empresa con un ERP inteligente que automatiza tareas, conecta areas y te da control total en tiempo real.",
    url: "/",
  },
  twitter: {
    title: "YiQi - El ERP mas completo del mercado",
    description:
      "Gestiona tu empresa con un ERP inteligente que automatiza tareas, conecta areas y te da control total en tiempo real.",
  },
}

export default async function Home() {
  const faqCategories = await loadFaqCategories({ maxEntries: 7 })

  return (
    <div className="min-h-screen overflow-hidden">
      <Header />
      <main className="flex flex-col items-center gap-6 sm:gap-8 pt-16 pb-4 sm:pb-2">
        <HeroSection />
        <ValueProposition />
        <IntegrationsSection />
        <ModulesSection />
        <BenefitsSection />
        {/* <DemoSection /> */}
        <PricingSection />
        <TransformSection />
        <ClientsSection />
        <FAQSection categories={faqCategories} />
      </main>
      <Footer />
    </div>
  )
}

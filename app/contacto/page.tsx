import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ContactContent } from "@/components/contact-content"

export const metadata = {
  title: "Contacto - YiQi ERP",
  description: "Ponte en contacto con el equipo de YiQi. Estamos aqui para ayudarte a transformar la gestion de tu empresa.",
  alternates: {
    canonical: "/contacto",
  },
  openGraph: {
    title: "Contacto - YiQi ERP",
    description: "Ponte en contacto con el equipo de YiQi. Estamos aqui para ayudarte a transformar la gestion de tu empresa.",
    url: "/contacto",
  },
  twitter: {
    title: "Contacto - YiQi ERP",
    description: "Ponte en contacto con el equipo de YiQi. Estamos aqui para ayudarte a transformar la gestion de tu empresa.",
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen overflow-hidden">
      <Header />
      <main className="flex flex-col items-center pt-24 pb-16">
        <ContactContent />
      </main>
      <Footer />
    </div>
  )
}

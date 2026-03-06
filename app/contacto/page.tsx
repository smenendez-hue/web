import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ContactContent } from "@/components/contact-content"

export const metadata = {
  title: "Contacto",
  description: "Ponte en contacto con el equipo de YiQi. Estamos aquí para ayudarte a transformar la gestión de tu empresa.",
  alternates: {
    canonical: "/contacto",
  },
  openGraph: {
    title: "Contacto",
    description: "Ponte en contacto con el equipo de YiQi. Estamos aquí para ayudarte a transformar la gestión de tu empresa.",
    url: "/contacto",
  },
  twitter: {
    title: "Contacto",
    description: "Ponte en contacto con el equipo de YiQi. Estamos aquí para ayudarte a transformar la gestión de tu empresa.",
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

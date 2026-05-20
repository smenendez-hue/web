import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { NovedadesContent } from "@/components/novedades-content"
import { getNovedades, getNovedadesFilterOptions } from "@/lib/novedades-store"

export const metadata = {
  title: "Novedades",
  description: "Últimas novedades y mejoras de YiQi ERP, con búsqueda y filtros por módulo y tipo.",
  alternates: {
    canonical: "/novedades",
  },
  openGraph: {
    title: "Novedades",
    description: "Últimas novedades y mejoras de YiQi ERP, con búsqueda y filtros por módulo y tipo.",
    url: "/novedades",
  },
  twitter: {
    title: "Novedades",
    description: "Últimas novedades y mejoras de YiQi ERP, con búsqueda y filtros por módulo y tipo.",
  },
}

export default async function NovedadesPage() {
  const items = await getNovedades()
  const { modulos, tipos } = getNovedadesFilterOptions(items)

  return (
    <div className="min-h-screen overflow-hidden">
      <Header />
      <main className="flex flex-col items-center pt-24 pb-16 bg-bg">
        <NovedadesContent items={items} modulos={modulos} tipos={tipos} />
      </main>
      <Footer />
    </div>
  )
}

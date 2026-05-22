"use client"

import { useMemo, useState } from "react"
import { Search, ExternalLink } from "lucide-react"

import type { NovedadItem } from "@/lib/novedades-store"

interface NovedadesContentProps {
  items: NovedadItem[]
  modulos: string[]
  tipos: string[]
}

const formatDate = (value: string) => {
  if (!value) return ""
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return value
  }
  return parsed.toLocaleDateString("es-AR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function NovedadesContent({ items, modulos, tipos }: NovedadesContentProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedModulo, setSelectedModulo] = useState("Todos")
  const [selectedTipo, setSelectedTipo] = useState("Todos")

  const filteredItems = useMemo(() => {
    const search = searchTerm.trim().toLowerCase()

    return items.filter((item) => {
      const byModulo = selectedModulo === "Todos" || item.modulo === selectedModulo
      const byTipo = selectedTipo === "Todos" || item.tipo === selectedTipo

      if (!byModulo || !byTipo) {
        return false
      }

      if (!search) {
        return true
      }

      return [item.titulo, item.descripcion, item.modulo, item.tipo, item.producto]
        .join(" ")
        .toLowerCase()
        .includes(search)
    })
  }, [items, searchTerm, selectedModulo, selectedTipo])

  return (
    <section className="w-full page-shell max-w-[1200px] py-8 flex flex-col items-center gap-8 sm:gap-12">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="ty-h1 night-text">
          Novedades<span className="brand-orange-text">.</span>
        </h1>
        <p className="ty-body text-text-secondary max-w-[760px]">
          Descubrí las últimas mejoras de YiQi. Buscá por palabras clave y filtrá por módulo o tipo para encontrar
          más rápido lo que necesitás.
        </p>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
          <input
            type="text"
            placeholder="Buscar por título, descripción, módulo o tipo..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-bg-tertiary rounded-2xl text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4">
          <select
            value={selectedModulo}
            onChange={(event) => setSelectedModulo(event.target.value)}
            className="px-3 py-3 bg-bg-tertiary rounded-2xl text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
          >
            <option value="Todos">Todos los módulos</option>
            {modulos.map((modulo) => (
              <option key={modulo} value={modulo}>
                {modulo}
              </option>
            ))}
          </select>

          <select
            value={selectedTipo}
            onChange={(event) => setSelectedTipo(event.target.value)}
            className="px-3 py-3 bg-bg-tertiary rounded-2xl text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
          >
            <option value="Todos">Todos los tipos</option>
            {tipos.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredItems.length > 0 ? (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <article
              key={item.id}
              className="bg-bg-tertiary rounded-2xl border border-white/5 p-5 flex flex-col gap-4 transition-colors hover:border-brand-blue/40"
            >
              <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold text-text-primary leading-snug">{item.titulo}</h2>
                {item.fecha && <p className="text-xs text-text-secondary">{formatDate(item.fecha)}</p>}
              </div>

              <p className="text-sm text-text-secondary leading-relaxed line-clamp-4">
                {item.descripcion || "Sin descripción disponible."}
              </p>

              <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary">
                {item.modulo && (
                  <span className="px-2 py-1 rounded-full bg-bg-elevated border border-white/10">Módulo: {item.modulo}</span>
                )}
                {item.tipo && (
                  <span className="px-2 py-1 rounded-full bg-bg-elevated border border-white/10">Tipo: {item.tipo}</span>
                )}
              </div>

              <div className="mt-auto pt-2">
                {item.linkWiki ? (
                  <a
                    href={item.linkWiki}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium text-brand-blue hover:text-brand-orange transition-colors"
                  >
                    Más ayuda
                    <ExternalLink className="w-4 h-4" />
                  </a>
                ) : (
                  <span className="text-xs text-text-secondary">Sin enlace de ayuda.</span>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-text-secondary ty-body">No hay novedades que coincidan con la búsqueda o los filtros.</p>
        </div>
      )}
    </section>
  )
}

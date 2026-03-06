"use client"

import { useEffect, useRef, useState, type PointerEvent } from "react"
import Image from "next/image"

export function TransformSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const dragState = useRef({ startX: 0, delta: 0, pointerId: null as number | null })

  const handleSelect = (index: number) => {
    setSelectedFeature((current) => (current === index ? null : index))
  }

  const features = [
    {
      icon: {
        src: "/images/transforma/Icon-5.svg",
        alt: "Control de costos",
      },
      title: "Control total de tus costos en tiempo real",
      description: "Monitorea y optimiza tus gastos con visibilidad completa e instantánea de todas tus operaciones.",
      bgColor: "bg-accent-green",
    },
    {
      icon: {
        src: "/images/transforma/Icon-4.svg",
        alt: "Gestión centralizada",
      },
      title: "Gestión centralizada de stock, precios y finanzas",
      description: "Administra tu inventario, precios y finanzas desde una plataforma unificada y eficiente.",
      bgColor: "bg-accent-yellow",
    },
    {
      icon: {
        src: "/images/transforma/Icon-3.svg",
        alt: "Integración automática",
      },
      title: "Integración automática entre todos tus canales de venta",
      description: "Conecta y sincroniza todas tus plataformas de venta en un solo lugar sin complicaciones.",
      bgColor: "bg-accent-cyan",
    },
    {
      icon: {
        src: "/images/transforma/Icon-2.svg",
        alt: "Automatización",
      },
      title: "Automatización de procesos y flujos de trabajo",
      description: "Elimina tareas repetitivas y optimiza tu tiempo con automatizaciones inteligentes.",
      bgColor: "bg-brand-purple",
    },
    {
      icon: {
        src: "/images/transforma/Icon-1.svg",
        alt: "Reportes inteligentes",
      },
      title: "Reportes inteligentes para decisiones basadas en datos",
      description: "Accede a insights precisos y visualizaciones que impulsan decisiones estratégicas informadas.",
      bgColor: "bg-accent-pink",
    },
    {
      icon: {
        src: "/images/transforma/Icon.svg",
        alt: "Plataforma en la nube",
      },
      title: "Plataforma 100% en la nube, segura y escalable",
      description: "Trabaja desde cualquier lugar con la confianza de una infraestructura robusta y flexible.",
      bgColor: "bg-brand-orange",
    },
  ]

  const featureCount = features.length

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)")
    const handleChange = () => setIsMobile(media.matches)

    handleChange()

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", handleChange)
    } else {
      media.addListener(handleChange)
    }

    return () => {
      if (typeof media.removeEventListener === "function") {
        media.removeEventListener("change", handleChange)
      } else {
        media.removeListener(handleChange)
      }
    }
  }, [])

  useEffect(() => {
    if (!isMobile || isDragging) return
    const intervalId = setInterval(() => {
      setActiveIndex((current) => (current + 1) % featureCount)
    }, 6000)

    return () => clearInterval(intervalId)
  }, [featureCount, isMobile, isDragging])

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return
    dragState.current = { startX: event.clientX, delta: 0, pointerId: event.pointerId }
    setIsDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragState.current.pointerId !== event.pointerId) return
    const delta = event.clientX - dragState.current.startX
    dragState.current.delta = delta
    setDragOffset(delta)
  }

  const handlePointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (dragState.current.pointerId !== event.pointerId) return
    const delta = dragState.current.delta
    const threshold = 60

    if (delta <= -threshold) {
      setActiveIndex((current) => (current + 1) % featureCount)
    } else if (delta >= threshold) {
      setActiveIndex((current) => (current - 1 + featureCount) % featureCount)
    }

    dragState.current = { startX: 0, delta: 0, pointerId: null }
    setDragOffset(0)
    setIsDragging(false)
    event.currentTarget.releasePointerCapture(event.pointerId)
  }

  return (
    <section className="w-full page-shell max-w-[1080px] pt-16 sm:pt-20 pb-12 sm:pb-16">
      <div className="flex flex-col items-center gap-12">
        {/* Header */}
        <div className="w-full flex flex-col items-center gap-4 text-center">
          <h2 className="text-3xl sm:text-6xl font-extrabold leading-tight sm:leading-[64px] night-text max-w-[799px]">
            Transforma tu gestión con una plataforma
            <br />
            pensada para crecer<span className="brand-blue-text">.</span>
          </h2>
          <p className="text-lg sm:text-4xl font-normal leading-7 sm:leading-10 night-text max-w-[786px]">
            Gestiona tu empresa con un ERP inteligente que automatiza tareas, conecta áreas y te da control total en
            tiempo real.
          </p>
        </div>

        {/* Features Carousel (mobile) */}
        <div className="w-full md:hidden">
          <div className="relative pb-10">
            <div
              className="overflow-hidden select-none touch-pan-y"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
              onPointerLeave={handlePointerEnd}
            >
              <div
                className={`flex ${isDragging ? "" : "transition-transform duration-500 ease-out"}`}
                style={{ transform: `translateX(calc(-${activeIndex * 100}% + ${dragOffset}px))` }}
              >
                {features.map((feature, index) => (
                  <div key={feature.title} className="w-full shrink-0 px-2">
                    <div
                      className={`bg-bg-secondary rounded-2xl p-5 flex flex-col gap-4 border transition-colors duration-200 ${
                        activeIndex === index ? "border-brand-blue" : "border-transparent"
                      }`}
                      style={{ borderRadius: "16px" }}
                    >
                      <div className={`${feature.bgColor} w-10 h-10 rounded-xl flex items-center justify-center`}>
                        <Image
                          src={feature.icon.src || "/placeholder.svg"}
                          alt={feature.icon.alt}
                          width={24}
                          height={24}
                          className="w-5 h-5"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <h3 className="text-sm font-bold leading-4 night-text">{feature.title}</h3>
                        <p className="text-xs font-normal leading-4 night-text-secondary">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {features.map((feature, index) => (
                <button
                  key={`${feature.title}-dot`}
                  type="button"
                  aria-label={`Ir al ítem ${index + 1}`}
                  onClick={() => setActiveIndex(index)}
                  className="w-6 h-6 flex items-center justify-center"
                >
                  <span
                    className={`block h-2 w-2 rounded-full transition-colors ${
                      activeIndex === index ? "bg-brand-blue" : "bg-white/30"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Features Grid (desktop) */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-[900px]">
          {features.map((feature, index) => {
            const isSelected = selectedFeature === index

            return (
              <button
                key={feature.title}
                type="button"
                onClick={() => handleSelect(index)}
                aria-pressed={isSelected}
                className={`bg-bg-secondary rounded-2xl p-6 flex flex-col gap-4 border text-left transition-colors duration-200 ${
                  isSelected ? "" : "border-transparent"
                }`}
                style={{ borderRadius: "16px" }}
              >
              <div className={`${feature.bgColor} w-12 h-12 rounded-xl flex items-center justify-center`}>
                <Image
                  src={feature.icon.src || "/placeholder.svg"}
                  alt={feature.icon.alt}
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-sm font-bold leading-4 night-text">{feature.title}</h3>
                <p className="text-xs font-normal leading-4 night-text-secondary">{feature.description}</p>
              </div>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

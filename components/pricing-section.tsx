import Image from "next/image"
import { CircleCheckBig } from "lucide-react"

import { FeatureHighlight } from "@/components/pricing/feature-highlight"

function PlanFeatureItem({ text }: { text: string }) {
  return (
    <div className="self-stretch px-4 py-3 bg-neutral-950 rounded-2xl inline-flex items-center gap-3">
      <CircleCheckBig className="w-5 h-5 text-brand-blue shrink-0" strokeWidth={1.6} />
      <div className="flex-1 text-zinc-100 text-base sm:text-xl font-light leading-6">{text}</div>
    </div>
  )
}

export function PricingSection() {
  type HighlightFeature = { highlightText: string; description: string; icon?: string }
  type BasicFeature = { text: string }

  const features: [HighlightFeature, ...BasicFeature[]] = [
    {
      highlightText: "Implementación personalizada analizando el alcance y complejidad de tu operación.",
      description: "Sin tarifas ocultas y con la flexibilidad de ajustar el servicio cuando lo necesites.",
      icon: "accessibility",
    },
    {
      text: "Módulos configurables según tus áreas de interés (ventas, compras, stock, contabilidad, finanzas, RRHH y más).",
    },
    {
      text: "Integraciones a medida de tus puntos de venta, franquicias y plataformas online.",
    },
    { text: "Dashboards personalizables." },
    { text: "Integración con marketplaces." },
    { text: "Soporte y acompañamiento continuo." },
    { text: "Actualizaciones automáticas sin costo adicional." },
    { text: "Agenda abierta de reuniones y consultas." },
  ]

  const [highlightFeature, ...otherFeatures] = features

  return (
    <section className="plan-section px-4 sm:px-[26px] py-16 sm:py-[128px] gap-12 sm:gap-[81px]">
      <div className="plan-stack">
        {/* Título */}
        <div className="w-full text-center">
          <span className="text-slate-400 text-3xl sm:text-5xl font-extrabold leading-tight sm:leading-12">Planes a medida</span>
          <span className="text-zinc-100 text-3xl sm:text-5xl font-extrabold leading-tight sm:leading-12">.</span>
        </div>

        {/* Card central con logo y descripción */}
        <div className="w-full px-7 py-5 flex flex-col items-center gap-8">
          {/* Logo yiQi */}
          <div className="w-fit h-fit">
            <Image
              src="/images/logo/Property1_Dark.svg"
              alt="yiQi"
              width={150}
              height={286}
              className="w-[clamp(96px,28vw,150px)] h-auto object-contain"
              priority
            />
          </div>

          {/* Subtítulo */}
          <div className="w-full max-w-[320px] sm:w-72 text-center">
            <span className="text-zinc-100 text-base sm:text-xl font-light leading-5">
              Se adapta a las necesidades de cada empresa
            </span>
            <span className="text-blue-500 text-base sm:text-xl font-light leading-5">.</span>
          </div>

          <div className="w-full max-w-[600px] p-4 bg-zinc-900 rounded-2xl inline-flex flex-col items-center justify-center gap-2">
            <div className="w-full text-center text-amber-500 text-sm font-normal leading-4">
              Nuestros planes incluyen todas las herramientas esenciales para optimizar tu gestión y escalar a medida
              que tu negocio crece.
            </div>
          </div>
        </div>

        <div className="plan-row gap-5 w-full">
          {highlightFeature && (
            <FeatureHighlight
              highlightText={highlightFeature.highlightText}
              description={highlightFeature.description}
              icon={highlightFeature.icon}
            />
          )}

          {otherFeatures.map((feature, index) => (
            <PlanFeatureItem key={index} text={feature.text} />
          ))}
        </div>

        <a
          href="https://calendly.com/javierperez/meet-30-demo"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full max-w-[260px] h-12 p-3 bg-blue-500 rounded-2xl inline-flex justify-center items-center gap-2 overflow-hidden text-center text-zinc-100 text-sm sm:text-base font-semibold leading-6 mt-10 sm:mt-16"
        >
          Reserva tu demo
        </a>
      </div>
    </section>
  )
}

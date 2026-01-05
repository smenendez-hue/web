import Image from "next/image"

export function BenefitsSection() {
  const benefits = [
    {
      iconSrc: "/images/beneficios/Gear.svg",
      iconAlt: "Gestión integral",
      title: "Gestión Integral",
      description: "Controla todos los módulos desde una interfaz unificada",
    },
    {
      iconSrc: "/images/beneficios/ShieldCheck.svg",
      iconAlt: "Confiabilidad",
      title: "Confiabilidad",
      description: "Soporte técnico especializado y actualizaciones periódicas",
    },
    {
      iconSrc: "/images/beneficios/ChartLineUp.svg",
      iconAlt: "Escalabilidad",
      title: "Escalabilidad",
      description: "Crecemos contigo, de PYME a gran corporación",
    },
  ]

  const features = [
    {
      iconSrc: "/images/beneficios/Plugs.svg",
      iconAlt: "Integración completa",
      text: "Integración completa con e-commerce y marketplaces",
    },
    {
      iconSrc: "/images/beneficios/Storefront.svg",
      iconAlt: "Gestión unificada",
      text: "Gestión unificada de inventarios multi-sucursal",
    },
    {
      iconSrc: "/images/beneficios/PuzzlePiece.svg",
      iconAlt: "Módulos especializados",
      text: "Módulos especializados para cada área de negocio",
    },
    {
      iconSrc: "/images/beneficios/Files.svg",
      iconAlt: "Reportes avanzados",
      text: "Reportes avanzados",
    },
    {
      iconSrc: "/images/beneficios/Headset.svg",
      iconAlt: "Atención al cliente",
      text: "Atención al cliente especializada",
    },
    {
      iconSrc: "/images/beneficios/ClockClockwise.svg",
      iconAlt: "Actualizaciones periódicas",
      text: "Actualizaciones periódicas y seguridad empresarial",
    },
  ]

  return (
    <section className="feature-bullets px-4 sm:px-6 gap-10 sm:gap-16">
      {/* Beneficios principales */}
      <div className="feature-bullet-row flex-col sm:flex-row sm:flex-nowrap">
        {benefits.map((benefit, index) => (
          <div key={index} className="feature-card w-full sm:w-[263px] sm:max-w-none">
            <div className="feature-icon">
              <Image
                src={benefit.iconSrc || "/placeholder.svg"}
                alt={benefit.iconAlt}
                width={28}
                height={28}
                className="w-7 h-7"
              />
            </div>
            <div className="ty-h5" style={{ color: "#f59e0b" }}>
              {benefit.title}
            </div>
            <div className="ty-sm text-brand-blue-light">{benefit.description}</div>
          </div>
        ))}
      </div>

      {/* Lista de características */}
      <div className="feature-list-card w-full max-w-[420px]">
        {features.map((feature, index) => (
          <div key={index} className="feature-list-row">
            <div
              className="w-6 h-6 min-w-6"
              style={{
                filter:
                  "brightness(0) saturate(100%) invert(56%) sepia(84%) saturate(1234%) hue-rotate(359deg) brightness(102%) contrast(92%)",
              }}
            >
              <Image
                src={feature.iconSrc || "/placeholder.svg"}
                alt={feature.iconAlt}
                width={24}
                height={24}
                className="w-6 h-6"
              />
            </div>
            <span>{feature.text}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

import Image from "next/image"

interface FeatureHighlightProps {
  highlightText: string
  description: string
  icon?: string
}

const resolveIconSrc = (icon?: string) => {
  if (!icon) return "/images/pricing/accessibility.svg"
  if (icon.startsWith("/")) return icon
  return `/images/pricing/${icon}.svg`
}

export function FeatureHighlight({ highlightText, description, icon }: FeatureHighlightProps) {
  const iconSrc = resolveIconSrc(icon)

  return (
    <div className="w-full p-4 sm:p-5 bg-neutral-950 rounded-2xl flex flex-col md:flex-row items-start gap-3 md:gap-4">
      <div className="w-8 h-8 shrink-0 flex items-start justify-center pt-[2px]">
        <Image src={iconSrc} alt="Accesibilidad" width={32} height={32} className="w-full h-full" />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-zinc-100 text-sm sm:text-base font-bold leading-5 underline decoration-[#5686FF] decoration-2 underline-offset-[6px]">
          {highlightText}
        </p>
      </div>

      <div className="w-full md:w-72 lg:w-80 max-w-full px-3 py-2 bg-zinc-900 rounded-lg flex items-center">
        <div className="text-zinc-100 text-sm font-normal leading-5 text-left">{description}</div>
      </div>
    </div>
  )
}

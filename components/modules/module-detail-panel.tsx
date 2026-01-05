import { type ModuleInfo } from "@/data/modules"

export const MODULE_CARD_BACKGROUND = "#050505"
export const MODULE_CARD_BORDER = "rgba(var(--brand-orange-rgb), 0.35)"

interface ModuleDetailPanelProps {
  info: ModuleInfo
}

export function ModuleDetailPanel({ info }: ModuleDetailPanelProps) {
  return (
    <div
      className="col-span-full rounded-3xl p-6 backdrop-blur-sm animate-slideDown"
      style={{
        backgroundColor: MODULE_CARD_BACKGROUND,
        border: `1px solid ${MODULE_CARD_BORDER}`,
      }}
    >
      <h3
        className="ty-h4 brand-orange-text mb-6 text-left font-semibold"
        style={{ color: "var(--Orange)" }}
      >
        {info.headline}
      </h3>

      <div className="flex flex-col gap-4">
        {info.details.map((detail) => (
          <div key={detail.title} className="flex flex-col gap-2">
            <h4 className="ty-sub1 night-text font-semibold">{detail.title}</h4>
            <p className="ty-sm night-text-secondary">{detail.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

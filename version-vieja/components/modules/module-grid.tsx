import Image from "next/image"
import { Fragment, useMemo } from "react"

import { type ModuleInfo, type ModuleItem } from "@/data/modules"
import { useGridColumns } from "@/hooks/use-grid-columns"

import { MODULE_CARD_BACKGROUND, ModuleDetailPanel } from "./module-detail-panel"

interface ModuleGridProps {
  modules: ModuleItem[]
  moduleInfo: Record<number, ModuleInfo>
  selectedIndex: number | null
  onSelect: (index: number) => void
}

const getRowEndIndex = (index: number, columns: number) => Math.floor(index / columns) * columns + columns - 1
const BRAND_ICON_FILTER =
  "brightness(0) saturate(100%) invert(73%) sepia(25%) saturate(1032%) hue-rotate(343deg) brightness(94%) contrast(92%)"

export function ModuleGrid({ modules, moduleInfo, selectedIndex, onSelect }: ModuleGridProps) {
  const { gridRef, cols } = useGridColumns()

  const selectedInfo = selectedIndex !== null ? moduleInfo[selectedIndex] : null
  const selectedRowEnd = useMemo(
    () => (selectedIndex === null ? null : getRowEndIndex(selectedIndex, cols)),
    [selectedIndex, cols],
  )

  return (
    <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {modules.map((module, index) => {
        const isSelected = selectedIndex === index
        const shouldRenderDetail = Boolean(selectedInfo && selectedRowEnd !== null && index === selectedRowEnd)

        return (
          <Fragment key={module.name}>
            <button
              onClick={() => onSelect(isSelected ? null : index)}
              className="h-[64px] px-4 py-1 rounded-2xl flex items-center gap-2.5 transition-all duration-300 cursor-pointer hover:scale-105"
              style={{
                backgroundColor: isSelected ? MODULE_CARD_BACKGROUND : "var(--Orange)",
              }}
            >
              <div className="w-10 h-10 flex justify-center items-center shrink-0">
                <Image
                  src={module.icon || "/placeholder.svg"}
                  alt={module.name.replace("\n", " ")}
                  width={32}
                  height={32}
                  className="w-8 h-8 transition-all duration-300"
                  style={{
                    filter: isSelected ? BRAND_ICON_FILTER : "none",
                  }}
                />
              </div>
              <div
                className={`flex-1 text-left text-base font-semibold font-sans leading-5 whitespace-pre-line transition-colors duration-300 ${
                  isSelected ? "brand-orange-text" : "text-zinc-100"
                }`}
              >
                {module.name}
              </div>
            </button>

            {shouldRenderDetail && selectedInfo && <ModuleDetailPanel info={selectedInfo} />}
          </Fragment>
        )
      })}
    </div>
  )
}

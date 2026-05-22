"use client"

import { useState } from "react"
import Image from "next/image"

import { ModuleDetailPanel } from "@/components/modules/module-detail-panel"
import { MODULE_DETAILS, MODULES } from "@/data/modules"

export function ModulesSection() {
  const [selectedModule, setSelectedModule] = useState<number | null>(null)

  const handleModuleClick = (index: number) => {
    setSelectedModule((current) => (current === index ? null : index))
  }

  const moduleList = MODULES
  const selectedInfo =
    selectedModule === null ? null : MODULE_DETAILS[moduleList[selectedModule].name]

  return (
    <section className="w-full page-shell max-w-[920px] py-[clamp(48px,8vw,96px)] flex flex-col items-center gap-6 sm:gap-8">
      <h2 className="ty-h1 text-center opacity-90 w-full">
        <span className="brand-orange-text">Módulos</span>
        <span className="night-text-secondary">.</span>
      </h2>

      {/* Mobile list */}
      <div className="w-full grid grid-cols-1 gap-4 sm:hidden">
        {moduleList.map((module, index) => {
          const isSelected = selectedModule === index
          const moduleInfo = MODULE_DETAILS[module.name]

          return (
            <div key={module.name} className="flex flex-col gap-4">
              <button
                type="button"
                onClick={() => handleModuleClick(index)}
                aria-pressed={isSelected}
                className="min-h-16 px-4 py-2 bg-brand-orange rounded-2xl flex items-center gap-2.5 text-left shadow-[0_6px_14px_rgba(0,0,0,0.2)] cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
              >
                <div className="w-12 h-12 p-2.5 flex items-center justify-center shrink-0">
                  <Image
                    src={module.icon || "/placeholder.svg"}
                    alt={module.name}
                    width={28}
                    height={28}
                    className="w-7 h-7 object-contain"
                  />
                </div>
                <div className="flex-1">
                  <div className="text-zinc-100 text-base font-semibold leading-4">{module.name}</div>
                  {module.description ? (
                    <div className="mt-1 text-zinc-100 text-xs font-normal leading-3 whitespace-pre-line">
                      {module.description}
                    </div>
                  ) : null}
                </div>
              </button>

              {isSelected && moduleInfo ? <ModuleDetailPanel info={moduleInfo} /> : null}
            </div>
          )
        })}
      </div>

      {/* Desktop grid */}
      <div className="hidden sm:grid w-full grid-cols-2 lg:grid-cols-3 gap-4">
        {/* E.R.P. label removed per request */}
        {moduleList.map((module, index) => {
          const isSelected = selectedModule === index

          return (
            <button
              key={module.name}
              type="button"
              onClick={() => handleModuleClick(index)}
              aria-pressed={isSelected}
              className="min-h-16 px-4 py-2 bg-brand-orange rounded-2xl flex items-center gap-2.5 text-left shadow-[0_6px_14px_rgba(0,0,0,0.2)] cursor-pointer transition-transform duration-200 hover:scale-[1.02]"
            >
              <div className="w-12 h-12 p-2.5 flex items-center justify-center shrink-0">
                <Image
                  src={module.icon || "/placeholder.svg"}
                  alt={module.name}
                  width={28}
                  height={28}
                  className="w-7 h-7 object-contain"
                />
              </div>
              <div className="flex-1">
                <div className="text-zinc-100 text-base font-semibold leading-4">{module.name}</div>
                {module.description ? (
                  <div className="mt-1 text-zinc-100 text-xs font-normal leading-3 whitespace-pre-line">
                    {module.description}
                  </div>
                ) : null}
              </div>
            </button>
          )
        })}
      </div>

      {selectedInfo ? (
        <div className="hidden sm:block w-full">
          <ModuleDetailPanel info={selectedInfo} />
        </div>
      ) : null}
    </section>
  )
}

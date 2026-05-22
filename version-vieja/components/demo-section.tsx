import { Input } from "@/components/ui/input"
import Image from "next/image"

export function DemoSection() {
  return (
    <div className="w-full max-w-[1664px] min-h-[1050px] relative flex flex-col items-center justify-center">
      <div className="w-full max-w-7xl py-12 flex flex-col items-center gap-16">
        {/* Badge */}
        <div className="w-72 h-9 px-4 rounded-full border border-brand-blue-light/30 flex items-center gap-2">
          <div className="w-2 h-2 bg-brand-blue-light rounded-full" />
          <div className="text-text-muted text-sm font-normal font-['Inter'] leading-5">
            AGENDA UNA DEMO PERSONALIZADA
          </div>
        </div>

        <h2 className="text-center text-white text-5xl font-extrabold font-['Montserrat'] leading-12">
          Hablemos de tu empresa.
        </h2>

        <div className="w-[568px] text-center text-gray-300 text-xl font-light font-['Montserrat'] leading-5">
          Estos encuentros están pensados para poder revisar juntos dudas, problemas, operaciones y soluciones con las cuales podremos ayudarte en YiQi, también para hacer una demo si lo necesitas.
        </div>

        {/* Form */}
        <div className="w-96 flex items-center gap-3">
          <Input
            type="email"
            placeholder="youremail@example"
            className="flex-1 px-3 py-1 bg-white/10 rounded-2xl border-0 text-text-secondary text-sm"
          />
          <a
            href="https://calendly.com/javierperez/meet-30-demo"
            target="_blank"
            rel="noopener noreferrer"
            className="w-40 p-3 bg-linear-to-r from-[var(--gradient-purple-start)] to-[var(--gradient-purple-end)] text-brand-purple font-semibold text-base rounded-2xl shadow-[0px_4px_4px_0px_rgba(112,18,235,1)] shadow-[inset_0px_4px_4px_0px_rgba(218,218,218,0.25)] shadow-[inset_0px_3px_4px_0px_rgba(0,0,0,0.5)] border border-[var(--gradient-purple-border)] text-center flex items-center justify-center"
          >
            Reserva tu demo
          </a>
        </div>

        {/* Demo image placeholder */}
        <div className="w-[800px] flex-1 bg-bg-elevated rounded-[32px]" />
      </div>
    </div>
  )
}

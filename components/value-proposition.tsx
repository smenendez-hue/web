import Image from "next/image"

export function ValueProposition() {
  return (
    <section className="w-full page-shell flex flex-col items-center gap-8 sm:gap-10">
      {/* Hero con imagen y overlay */}
      <div className="w-full pb-6 sm:pb-8 flex flex-col items-center gap-8 sm:gap-10">
        <div className="w-full min-h-[220px] sm:min-h-[260px] aspect-[4/3] sm:aspect-[8/3] px-[5px] py-8 sm:py-10 bg-brand-blue rounded-2xl flex flex-col justify-center items-center overflow-hidden relative">
          <Image
            src="/images/design-mode/Banner.png"
            alt="Equipo trabajando"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-full max-w-[480px] min-h-[96px] px-4 flex items-center justify-center text-center">
              <span className="ty-h1 text-white">
                Menos tiempo en tareas,
                <br />
                más foco en resultados<span className="text-black">.</span>
              </span>
            </div>
          </div>
        </div>
        <div className="w-full max-w-[520px] sm:max-w-[860px] -mt-12 sm:-mt-24 relative px-2 sm:px-4">
          <Image
            src="/images/design-mode/image(2).png"
            alt="Dashboard yiQi"
            width={821}
            height={661}
            className="w-full h-auto rounded-2xl shadow-none"
          />
        </div>
        <div className="w-full flex justify-center pt-6">
          <h2 className="ty-title-page text-center">
            <span className="text-zinc-100">Todo desde un solo lugar</span>
            <span className="text-slate-400">.</span>
          </h2>
        </div>
      </div>
    </section>
  )
}

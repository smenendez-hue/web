import Image from "next/image"

export function HeroSection() {
  return (
    <section className="w-full page-shell flex flex-col items-center gap-6 pb-8 sm:gap-8 sm:pb-10">
      {/* Logo y título */}
      <div className="w-full flex flex-col items-center">
        <div className="py-2 sm:py-3 flex flex-col items-center">
          <div className="rounded-2xl shadow-sm flex items-center justify-center">
            <Image
              src="/images/logo/Property1_Dark.svg"
              alt="yiQi Logo"
              width={450}
              height={300}
              className="w-[clamp(180px,60vw,260px)] h-auto"
              priority
            />
          </div>
          <h1 className="text-center ty-title-hero">
            <span className="text-text-secondary block sm:inline">El ERP más completo</span>
            <span className="text-text-secondary block sm:inline">
              {" "}
              del mercado<span className="text-text-primary">.</span>
            </span>
          </h1>
          <a
            href="https://calendly.com/javierperez/meet-30-demo"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 w-full max-w-[240px] px-4 py-3 bg-blue-500 rounded-2xl inline-flex justify-center items-center gap-2 overflow-hidden text-center text-zinc-100 text-sm sm:text-base font-semibold leading-6 whitespace-nowrap"
          >
            Reserva tu demo
          </a>
        </div>
      </div>
    </section>
  )
}


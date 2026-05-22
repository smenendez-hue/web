import { LogoScroller } from "@/components/logo-scroller"
import { getClientLogos } from "@/lib/clients-store"

export async function ClientsSection() {
  const clientLogos = await getClientLogos()

  return (
    <section className="w-full py-[clamp(48px,8vw,88px)] flex flex-col items-center overflow-hidden gap-4 sm:gap-6">
      <div className="page-shell flex flex-col items-center gap-3 text-center">
        <div className="text-center text-base sm:text-xl font-extrabold leading-6 sm:leading-7">
          <span className="text-blue-500">Algunos de nuestros clientes</span>
          <span className="text-zinc-100">.</span>
        </div>
      </div>

      {clientLogos.length > 0 && (
        <div className="full-bleed mt-2 sm:mt-4">
          <div className="md:hidden">
            <LogoScroller logos={clientLogos} width={110} height={64} opacity={0.6} invert />
          </div>
          <div className="hidden md:block">
            <LogoScroller logos={clientLogos} width={120} height={80} opacity={0.6} invert />
          </div>
        </div>
      )}
    </section>
  )
}

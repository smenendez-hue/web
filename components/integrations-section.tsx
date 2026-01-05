import { LogoScroller } from "@/components/logo-scroller"
import { getIntegrationLogos } from "@/lib/integrations-store"

export async function IntegrationsSection() {
  const integrationLogos = await getIntegrationLogos()

  return (
    <section className="w-full py-[clamp(48px,8vw,88px)] flex flex-col items-center overflow-hidden gap-4 sm:gap-6">
      <div className="page-shell flex flex-col items-center gap-3 text-center">
        <h3 className="text-center text-base sm:text-xl font-extrabold leading-6 sm:leading-7 text-zinc-100 opacity-60">
          Multiples integraciones
        </h3>
      </div>

      {integrationLogos.length > 0 && (
        <div className="full-bleed mt-2 sm:mt-4">
          <div className="md:hidden">
            <LogoScroller logos={integrationLogos} width={140} height={48} opacity={0.6} invert />
          </div>
          <div className="hidden md:block">
            <LogoScroller logos={integrationLogos} width={180} height={60} opacity={0.6} invert />
          </div>
        </div>
      )}
    </section>
  )
}

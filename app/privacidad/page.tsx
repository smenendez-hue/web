import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "Política de privacidad",
  description:
    "Conoce cómo YiQi trata la información personal y técnica que recopila a través de su sitio, canales comerciales y servicios ERP.",
  alternates: {
    canonical: "/privacidad",
  },
  openGraph: {
    title: "Política de privacidad",
    description:
      "Conoce cómo YiQi trata la información personal y técnica que recopila a través de su sitio, canales comerciales y servicios ERP.",
    url: "/privacidad",
  },
  twitter: {
    title: "Política de privacidad",
    description:
      "Conoce cómo YiQi trata la información personal y técnica que recopila a través de su sitio, canales comerciales y servicios ERP.",
  },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen overflow-hidden">
      <Header />
      <main className="flex flex-col items-center px-4 pt-24 pb-16 sm:pt-28">
        <section className="page-shell w-full max-w-4xl rounded-3xl border border-white/10 bg-[#111111] px-6 py-10 text-text-primary shadow-[0_30px_80px_rgba(0,0,0,0.18)] sm:px-10 sm:py-12">
          <div className="max-w-3xl space-y-8">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.28em] text-text-secondary">Actualizada: mayo 2026</p>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Política de privacidad</h1>
              <p className="text-base leading-7 text-text-secondary sm:text-lg">
                Esta política explica, de forma simple, cómo YiQi puede recopilar, usar y resguardar información personal
                cuando interactuás con nuestro sitio web, nuestros canales comerciales o nuestros servicios de software.
              </p>
            </div>

            <div className="space-y-6 text-sm leading-7 text-text-secondary sm:text-base">
              <section className="space-y-2">
                <h2 className="text-lg font-medium text-text-primary">1. Información que podemos recopilar</h2>
                <p>
                  Podemos recibir datos que vos o tu organización nos comparten de manera voluntaria, por ejemplo nombre,
                  empresa, cargo, correo electrónico, teléfono, contenido de consultas comerciales o de soporte, y otra
                  información asociada al uso del sitio o de los formularios de contacto.
                </p>
                <p>
                  También podemos recolectar datos técnicos básicos, como dirección IP, tipo de navegador, dispositivo,
                  páginas visitadas y eventos de navegación, con fines de funcionamiento, seguridad y mejora del servicio.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-medium text-text-primary">2. Para qué usamos la información</h2>
                <p>Usamos la información para:</p>
                <ul className="list-disc space-y-1 pl-5">
                  <li>responder consultas y coordinar demos, soporte o seguimiento comercial;</li>
                  <li>prestar y administrar los servicios contratados;</li>
                  <li>mejorar la experiencia de uso, la seguridad y la estabilidad del sitio y la plataforma;</li>
                  <li>cumplir obligaciones legales, contables o contractuales cuando corresponda.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-medium text-text-primary">3. Base de uso y conservación</h2>
                <p>
                  Tratamos los datos en función de la relación que mantenemos con vos o con tu empresa, del interés legítimo
                  de operar y mejorar nuestros servicios, y de los consentimientos que hayas otorgado cuando sean necesarios.
                </p>
                <p>
                  Conservamos la información solo durante el tiempo necesario para cumplir con los fines descriptos, atender
                  obligaciones legales y resolver posibles reclamos o incidencias.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-medium text-text-primary">4. Con quién compartimos datos</h2>
                <p>
                  Podemos compartir información de manera limitada con proveedores que nos ayudan a operar el sitio, alojar
                  infraestructura, brindar soporte, enviar comunicaciones o prestar servicios relacionados. En esos casos,
                  pedimos que la información se trate con niveles razonables de confidencialidad y seguridad.
                </p>
                <p>
                  No vendemos tus datos personales. Si una integración, cliente o proyecto requiere acuerdos adicionales de
                  tratamiento de datos, se podrán documentar por separado.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-medium text-text-primary">5. Seguridad</h2>
                <p>
                  Aplicamos medidas técnicas y organizativas razonables para proteger la información frente a accesos no
                  autorizados, pérdida o uso indebido. Ningún sistema es totalmente infalible, pero trabajamos para reducir
                  riesgos y responder ante incidentes con la mayor rapidez posible.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-medium text-text-primary">6. Tus derechos</h2>
                <p>
                  Según la normativa aplicable, podés solicitar acceso, actualización, rectificación o eliminación de tus
                  datos personales, así como ejercer otros derechos que correspondan. También podés pedir que dejemos de
                  enviarte comunicaciones comerciales cuando aplique.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-medium text-text-primary">7. Menores de edad</h2>
                <p>
                  Nuestros servicios están orientados a organizaciones y personas con capacidad para contratar. Si detectamos
                  datos de menores sin la debida autorización, podremos eliminarlos o pedir validación adicional.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-medium text-text-primary">8. Cambios en esta política</h2>
                <p>
                  Podemos actualizar esta política cuando sea necesario para reflejar cambios legales, técnicos o de negocio.
                  La versión vigente será la publicada en este sitio.
                </p>
              </section>

              <section className="space-y-2">
                <h2 className="text-lg font-medium text-text-primary">9. Contacto</h2>
                <p>
                  Si querés hacer una consulta sobre privacidad o ejercer tus derechos, podés escribirnos a
                  <a className="ml-1 text-text-primary underline decoration-white/30 underline-offset-4 hover:decoration-white" href="mailto:comercial@yiqi.com.ar">
                    comercial@yiqi.com.ar
                  </a>
                  .
                </p>
              </section>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
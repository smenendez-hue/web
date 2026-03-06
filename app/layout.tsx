import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { getSiteUrl } from "@/lib/site-meta"
import "./globals.css"

const siteUrl = getSiteUrl()
const logoUrl = siteUrl + "/images/logoheader.png"
const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "YiQi",
    url: siteUrl,
    logo: logoUrl,
    sameAs: [],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "YiQi",
    url: siteUrl,
  },
]

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "YiQi - El ERP más completo del mercado",
    template: "%s | YiQi ERP",
  },
  description:
    "Gestiona tu empresa con un ERP inteligente que automatiza tareas, conecta áreas y te da control total en tiempo real.",
  generator: "Gabriel Farias",
  applicationName: "YiQi ERP",
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: [
      {
        url: "/images/logo/favicon.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    title: "YiQi - El ERP más completo del mercado",
    description:
      "Gestiona tu empresa con un ERP inteligente que automatiza tareas, conecta áreas y te da control total en tiempo real.",
    url: siteUrl,
    siteName: "YiQi",
    locale: "es_AR",
    type: "website",
    images: [
      {
        url: "/images/logoheader.png",
        alt: "YiQi ERP",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "YiQi - El ERP más completo del mercado",
    description:
      "Gestiona tu empresa con un ERP inteligente que automatiza tareas, conecta áreas y te da control total en tiempo real.",
    images: ["/images/logoheader.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  )
}

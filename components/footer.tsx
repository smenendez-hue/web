import Image from "next/image"
import { Youtube, Linkedin, PhoneCall, Mail, MessageCircle, Instagram } from "lucide-react"

import { BLOG_ENABLE } from "@/lib/blog-settings"

export function Footer() {
  return (
    <footer className="w-full py-12 bg-[#1A1A1A]">
      <div className="page-shell mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        {/* Logo y redes sociales */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center">
            <div className="w-20 h-10 relative">
              <Image
                src="/images/logo/Property1_Dark.svg"
                alt="YiQi"
                width={80}
                height={40}
                className="w-full h-full object-contain"
                priority
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://api.whatsapp.com/send?phone=5491123727422"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-text-primary transition-colors"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
            <a
              href="https://www.youtube.com/@yiqi3369"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-text-primary transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/company/yiqi-sa/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/yiqisa/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="mailto:comercial@yiqi.com.ar"
              className="text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a
              href="tel:+541170799474"
              className="text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Teléfono"
            >
              <PhoneCall className="w-5 h-5" />
            </a>
          </div>
        </div>

        <nav className="flex flex-col gap-4 text-left md:text-right">
          {BLOG_ENABLE && (
            <a
              href="/blog"
              className="text-text-primary hover:text-brand-blue transition-colors text-base font-normal"
            >
              Blog
            </a>
          )}
          <a
            href="/faq"
            className="text-text-primary hover:text-brand-blue transition-colors text-base font-normal"
          >
            Preguntas frecuentes
          </a>
          <a
            href="/contacto"
            className="text-text-primary hover:text-brand-blue transition-colors text-base font-normal"
          >
            Contacto
          </a>
          <a
            href="mailto:cv@yiqi.com.ar"
            className="text-text-primary hover:text-brand-blue transition-colors text-base font-normal"
          >
            Trabaja con nosotros
          </a>
        </nav>
      </div>
      <div className="page-shell mx-auto mt-8">
        <a
          href="/privacidad"
          className="text-xs text-text-secondary/60 hover:text-text-secondary transition-colors"
        >
          Política de privacidad
        </a>
      </div>
    </footer>
  )
}

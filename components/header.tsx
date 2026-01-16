"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Menu, X } from "lucide-react"

import { BLOG_ENABLE } from "@/lib/blog-settings"

const baseNavLinks = [
  { href: "/faq", label: "Preguntas frecuentes" },
  { href: "/contacto", label: "Contacto" },
  {
    href: "mailto:cv@yiqi.com.ar",
    label: "Trabaja con nosotros",
    external: true,
  },
]

const navLinks = [
  ...(BLOG_ENABLE ? [{ href: "/blog", label: "Blog" }] : []),
  ...baseNavLinks,
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isMenuOpen])

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-16 items-center flex bg-[rgba(0,0,0,0.75)] backdrop-blur-sm border-b border-white/5">
        <div className="w-full page-shell mx-auto">
          <div className="flex items-center justify-between gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo/Property1_Dark.svg"
                alt="yiQi Logo"
                width={80}
                height={32}
                className="w-auto max-h-15"
                priority
              />
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex flex-1 justify-end items-center gap-2">
              {navLinks.map((item) =>
                item.external ? (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 text-text-secondary hover:text-night-text transition-colors text-base font-normal"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-3 py-2 text-text-secondary hover:text-night-text transition-colors text-base font-normal"
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </nav>

            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-white/10 text-text-secondary hover:text-night-text transition-colors"
              aria-label={isMenuOpen ? "Cerrar menu" : "Abrir menu"}
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* CTA Button */}
            {/* <a
              href="https://calendly.com/javierperez/meet-30-demo"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-[#5686FF] rounded-2xl flex justify-center items-center gap-2 cursor-pointer hover:bg-[#4070e0] transition-colors"
            >
              <span className="text-center text-zinc-100 text-base font-semibold font-sans leading-6 whitespace-nowrap">
                Reserva tu demo
              </span>
            </a> */}
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-black/70 transition-opacity md:hidden ${
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
        onClick={closeMenu}
      />

      <div
        className={`fixed top-0 right-0 z-50 h-full w-[min(320px,85vw)] bg-black border-l border-white/10 shadow-2xl transition-transform duration-300 md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
        style={{ backgroundColor: "#000" }}
        role="dialog"
        aria-modal="true"
        aria-label="Menu principal"
        aria-hidden={!isMenuOpen}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <span className="text-sm font-semibold text-text-secondary">Menu</span>
          <button
            type="button"
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 text-text-secondary hover:text-night-text transition-colors"
            aria-label="Cerrar menu"
            onClick={closeMenu}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <nav className="flex flex-col px-6 py-6 gap-4">
          {navLinks.map((item) =>
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base text-text-primary hover:text-night-text transition-colors"
                onClick={closeMenu}
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="text-base text-text-primary hover:text-night-text transition-colors"
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>
      </div>
    </>
  )
}

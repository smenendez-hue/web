'use client'

import Image from "next/image"
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react"

interface LogoScrollerProps {
  logos: Array<{
    src: string
    alt: string
    scale?: number
  }>
  opacity?: number
  grayscale?: boolean
  width?: number
  height?: number
  invert?: boolean
}

const MIN_VISIBLE_ITEMS = 8

export function LogoScroller({
  logos,
  opacity = 60,
  grayscale = true,
  width = 140,
  height = 60,
  invert = false,
}: LogoScrollerProps) {
  const normalizedLogos = useMemo(
    () => logos.filter((logo) => Boolean(logo?.src)),
    [logos],
  )

  const baseSet = useMemo(() => {
    if (normalizedLogos.length === 0) return []
    const requiredItems = Math.max(MIN_VISIBLE_ITEMS, normalizedLogos.length)
    return Array.from({ length: requiredItems }, (_, index) => normalizedLogos[index % normalizedLogos.length])
  }, [normalizedLogos])

  const groupRef = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)

  useEffect(() => {
    const node = groupRef.current
    if (!node) return

    const updateWidth = () => {
      setDistance(node.scrollWidth)
    }

    updateWidth()

    if (typeof ResizeObserver === "undefined") {
      return
    }

    const observer = new ResizeObserver(updateWidth)
    observer.observe(node)
    return () => observer.disconnect()
  }, [baseSet])

  if (baseSet.length === 0) {
    return null
  }

  const duration = distance ? Math.max(24, distance / 50) : 30

  const normalizedOpacity = Math.min(
    1,
    Math.max(0, opacity > 1 ? opacity / 100 : opacity),
  )

  const marqueeStyle: CSSProperties = {
    ["--logo-scroll-distance" as string]: `${distance}px`,
    ["--logo-scroll-duration" as string]: `${duration}s`,
  }

  const renderLogos = (sequence: typeof baseSet, keyPrefix: string) =>
    sequence.map((logo, index) => {
      const itemScale = logo.scale ?? 1
      const itemWidth = width * itemScale
      const itemHeight = height * itemScale

      return (
        <div
          key={`${keyPrefix}-${logo.alt}-${index}`}
          className="shrink-0 flex items-center justify-center"
          style={{ width: itemWidth, height: itemHeight }}
        >
          <Image
            src={logo.src || "/placeholder.svg"}
            alt={logo.alt}
            width={itemWidth}
            height={itemHeight}
            className={`max-h-full max-w-full object-contain ${grayscale ? "grayscale" : ""}`}
            style={{ opacity: normalizedOpacity }}
          />
        </div>
      )
    })

  return (
    <div className="logo-marquee" style={marqueeStyle}>
      <div className={`logo-marquee__track ${invert ? "logo-marquee__track--invert" : ""}`}>
        <div className="logo-marquee__group" ref={groupRef}>
          {renderLogos(baseSet, "base")}
        </div>
        <div className="logo-marquee__group" aria-hidden="true">
          {renderLogos(baseSet, "clone")}
        </div>
      </div>
    </div>
  )
}

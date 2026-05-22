import { useEffect, useRef, useState } from "react"

export function useGridColumns() {
  const gridRef = useRef<HTMLDivElement>(null)
  const [cols, setCols] = useState(1)

  useEffect(() => {
    const computeCols = () => {
      const node = gridRef.current
      if (!node) return
      const template = window.getComputedStyle(node).gridTemplateColumns || ""
      const count = template.split(" ").filter(Boolean).length
      setCols(count || 1)
    }

    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(computeCols) : null
    if (gridRef.current && observer) observer.observe(gridRef.current)
    window.addEventListener("resize", computeCols)
    computeCols()

    return () => {
      observer?.disconnect()
      window.removeEventListener("resize", computeCols)
    }
  }, [])

  return { gridRef, cols }
}

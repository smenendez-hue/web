export const buildImageSource = (base64?: string | null, mime?: string | null) => {
  if (!base64) return ""
  const cleaned = base64.replace(/\s+/g, "")
  if (!cleaned) return ""
  const normalizedMime = mime?.trim() || "image/png"
  return `data:${normalizedMime};base64,${cleaned}`
}

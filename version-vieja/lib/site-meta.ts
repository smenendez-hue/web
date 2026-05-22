const DEFAULT_SITE_URL = "https://yiqi.com.ar"

export const getSiteUrl = () => {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? DEFAULT_SITE_URL
  const value = raw.trim() || DEFAULT_SITE_URL
  return value.endsWith("/") ? value.slice(0, -1) : value
}

const truthy = ["true", "1", "yes", "y"]
const falsy = ["false", "0", "no", "n"]

const normalize = (value: string) => value.trim().toLowerCase()

const parseBoolean = (value?: string | null) => {
  if (!value) return undefined
  const normalized = normalize(value)
  if (truthy.includes(normalized)) return true
  if (falsy.includes(normalized)) return false
  return undefined
}

const rawValue = process.env.BLOG_ENABLE ?? process.env.NEXT_PUBLIC_BLOG_ENABLE

export const BLOG_ENABLE = parseBoolean(rawValue) ?? true

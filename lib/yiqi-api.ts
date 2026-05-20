const DEFAULT_SECURITY_BASE_URL = "https://api.yiqi.com.ar"
const TOKEN_GRANT_TYPE = "password"
const TOKEN_REFRESH_SKEW_SECONDS = 60

interface YiqiTokenResponse {
  access_token: string
  expires_in?: number
  token_type?: string
}

interface TokenCache {
  token: string
  expiresAt: number
}

let tokenCache: TokenCache | null = null
let pendingTokenRequest: Promise<string> | null = null

const getSecurityBaseUrl = () => process.env.YIQI_API_SECURITY_BASE_URL || DEFAULT_SECURITY_BASE_URL

const getCredentials = () => {
  const username = process.env.YIQI_API_USERNAME?.trim() || ""
  const password = process.env.YIQI_API_PASSWORD?.trim() || ""
  return { username, password }
}

export const getMissingYiqiAuthEnv = () => {
  const missing: string[] = []
  if (!process.env.YIQI_API_USERNAME?.trim()) missing.push("YIQI_API_USERNAME")
  if (!process.env.YIQI_API_PASSWORD?.trim()) missing.push("YIQI_API_PASSWORD")
  return missing
}

const isCacheValid = () => Boolean(tokenCache && tokenCache.expiresAt > Date.now())

const saveToken = (token: string, expiresInSeconds?: number) => {
  const now = Date.now()
  const expiresInMs = Math.max(0, (expiresInSeconds ?? 0) - TOKEN_REFRESH_SKEW_SECONDS) * 1000
  const fallbackTtlMs = 1000 * 60 * 10

  tokenCache = {
    token,
    expiresAt: now + (expiresInMs || fallbackTtlMs),
  }
}

const requestToken = async (): Promise<string> => {
  const { username, password } = getCredentials()
  if (!username || !password) {
    const missing = getMissingYiqiAuthEnv()
    throw new Error(`Missing YiQi API credentials: ${missing.join(", ")}`)
  }

  const tokenUrl = `${getSecurityBaseUrl().replace(/\/+$/, "")}/token`
  const formData = new URLSearchParams({
    username,
    password,
    grant_type: TOKEN_GRANT_TYPE,
  })

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData.toString(),
    cache: "no-store",
  })

  if (!response.ok) {
    const details = await response.text().catch(() => "")
    throw new Error(`Failed to obtain YiQi token (${response.status}): ${details || "No details"}`)
  }

  const payload = (await response.json()) as YiqiTokenResponse
  const token = payload.access_token?.trim()

  if (!token) {
    throw new Error("YiQi token response does not include access_token")
  }

  saveToken(token, payload.expires_in)
  return token
}

export const getYiqiToken = async (forceRefresh = false): Promise<string> => {
  if (!forceRefresh && isCacheValid()) {
    return tokenCache!.token
  }

  if (!forceRefresh && pendingTokenRequest) {
    return pendingTokenRequest
  }

  pendingTokenRequest = (async () => {
    try {
      return await requestToken()
    } finally {
      pendingTokenRequest = null
    }
  })()

  return pendingTokenRequest
}

export const clearYiqiTokenCache = () => {
  tokenCache = null
  pendingTokenRequest = null
}

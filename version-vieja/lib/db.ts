import sql from "mssql"

const requiredEnv = ["DB_SERVER", "DB_USER", "DB_PASSWORD"]

const parseBoolean = (value?: string) => {
  if (!value) return true
  return value.toLowerCase() === "false" ? false : true
}

export const getMissingDbEnv = () => requiredEnv.filter((key) => !process.env[key])

const buildConfig = (): sql.config => {
  const missingEnv = getMissingDbEnv()
  if (missingEnv.length > 0) {
    throw new Error(`Missing required database environment variables: ${missingEnv.join(", ")}`)
  }

  return {
    server: process.env.DB_SERVER!,
    database: process.env.DB_NAME || "WEB_YIQI",
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    options: {
      encrypt: parseBoolean(process.env.DB_ENCRYPT) ?? true,
      trustServerCertificate: parseBoolean(process.env.DB_TRUST_SERVER_CERTIFICATE),
    },
  }
}

let cachedPool: sql.ConnectionPool | null = null

export const getSqlPool = async (): Promise<sql.ConnectionPool> => {
  if (cachedPool) {
    return cachedPool
  }

  const pool = new sql.ConnectionPool(buildConfig())
  try {
    cachedPool = await pool.connect()
    return cachedPool
  } catch (error) {
    cachedPool = null
    throw error
  }
}

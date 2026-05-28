const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 8080;
const ROOT = __dirname;
const DEFAULT_AUTH_URL = "https://api.yiqi.com.ar/token";
const DEFAULT_PUBLIC_BASE_URL = "https://api.yiqi.com.ar/api/public";
const DEFAULT_SCHEMA_ID = 1387;
const DEFAULT_API_USER = "cristal@yiqi.com.ar";
const DEFAULT_API_PASSWORD = "yiqibot2023X";
const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGES = 200;

let cachedToken = null;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8"
};

function getYiqiConfig() {
  const authUrl = process.env.YIQI_API_AUTH_URL || DEFAULT_AUTH_URL;
  const publicBaseUrl = (process.env.YIQI_API_PUBLIC_BASE_URL || DEFAULT_PUBLIC_BASE_URL).replace(/\/+$/, "");
  const schemaRaw = process.env.YIQI_API_SCHEMA_ID;
  const schemaId = Number.isFinite(Number(schemaRaw)) && Number(schemaRaw) > 0 ? Number(schemaRaw) : DEFAULT_SCHEMA_ID;

  return {
    authUrl,
    publicBaseUrl,
    schemaId,
    user: process.env.YIQI_API_USER || DEFAULT_API_USER,
    password: process.env.YIQI_API_PASSWORD || DEFAULT_API_PASSWORD,
  };
}

function getMissingYiqiAuthEnv(config) {
  const missing = [];
  if (!config.user) missing.push("YIQI_API_USER");
  if (!config.password) missing.push("YIQI_API_PASSWORD");
  return missing;
}

async function getYiqiToken(config, forceRefresh = false) {
  const now = Date.now();

  if (!forceRefresh && cachedToken && cachedToken.expiresAt > now + 60000) {
    return cachedToken.token;
  }

  const response = await fetch(config.authUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      username: config.user,
      password: config.password,
      grant_type: "password",
    }).toString(),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`Auth failed (${response.status}): ${details || "No details"}`);
  }

  const payload = await response.json();
  const expiresIn = Number(payload?.expires_in);
  const ttlMs = Number.isFinite(expiresIn) && expiresIn > 0 ? expiresIn * 1000 : 300000;

  cachedToken = {
    token: payload.access_token,
    expiresAt: now + ttlMs - 60000,
  };

  return payload.access_token;
}

function buildNovedadesPayload(page) {
  return {
    page,
    pageSize: DEFAULT_PAGE_SIZE,
    search: "",
    columns: [
      { field: "NOVE_TITULO", title: "NOVE_TITULO" },
      { field: "NOVE_FECHA", title: "NOVE_FECHA", sortDirection: "DESC", sortOrder: 1 },
      { field: "NOVE_DESCRIPCION", title: "NOVE_DESCRIPCION" },
      { field: "NOVE_MODULO", title: "NOVE_MODULO" },
      { field: "NOVE_PRODUCTO", title: "NOVE_PRODUCTO" },
      { field: "NOVE_TIPO", title: "NOVE_TIPO" },
      { field: "NOVE_LINK_WIKI", title: "NOVE_LINK_WIKI" },
      { field: "NOVE_INTERNA", title: "NOVE_INTERNA" },
      { field: "NOVE_IMPORTANTE", title: "NOVE_IMPORTANTE" },
      { field: "NOVE_ESQUEMA", title: "NOVE_ESQUEMA" },
      { field: "NOVE_MENSAJE_PROCESADO", title: "NOVE_MENSAJE_PROCESADO" },
      { field: "DESC_ESTADO", title: "DESC_ESTADO" },
    ],
    filters: [
      {
        columnName: "DESC_ESTADO",
        operator: "=",
        value: "Publicada",
      },
    ],
  };
}

function toSafeText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeNovedad(record, index) {
  const titulo = toSafeText(record?.NOVE_TITULO) || "Sin titulo";
  const fecha = toSafeText(record?.NOVE_FECHA);
  const modulo = toSafeText(record?.NOVE_MODULO);
  const tipo = toSafeText(record?.NOVE_TIPO);
  const descripcion = toSafeText(record?.NOVE_DESCRIPCION);
  const linkWiki = toSafeText(record?.NOVE_LINK_WIKI);
  const estado = toSafeText(record?.DESC_ESTADO);
  const fallbackId = `${titulo.toLowerCase().replace(/\s+/g, "-") || "novedad"}-${index}`;

  return {
    id: fallbackId,
    titulo,
    descripcion,
    fecha,
    modulo,
    tipo,
    linkWiki,
    estado,
  };
}

async function fetchNovedadesPage(config, page, token) {
  const url = `${config.publicBaseUrl}/NOVEDADES/query?schemaId=${config.schemaId}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(buildNovedadesPayload(page)),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`NOVEDADES query failed on page ${page} (${response.status}): ${details || "No details"}`);
  }

  return response.json();
}

async function getNovedades() {
  const config = getYiqiConfig();
  const missing = getMissingYiqiAuthEnv(config);
  if (missing.length > 0) {
    throw new Error(`Missing YiQi API auth env: ${missing.join(", ")}`);
  }

  let token = await getYiqiToken(config);
  const collected = [];

  for (let page = 1; page <= MAX_PAGES; page += 1) {
    let response;
    try {
      response = await fetchNovedadesPage(config, page, token);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const unauthorized = message.includes("(401)") || message.includes("(403)");
      if (!unauthorized) throw error;
      cachedToken = null;
      token = await getYiqiToken(config, true);
      response = await fetchNovedadesPage(config, page, token);
    }

    const pageData = Array.isArray(response?.data) ? response.data : [];
    collected.push(...pageData);

    if (pageData.length < DEFAULT_PAGE_SIZE) {
      break;
    }
  }

  return collected.map((record, index) => normalizeNovedad(record, index));
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(body);
}

/* ─────────────────────────────────────────────────────────────
   /api/contact — recibe el formulario y lo persiste
   1) Siempre guarda a contact-submissions.jsonl (no se pierde data)
   2) Mejor esfuerzo: crear ON en CRM YiQi via API
   ───────────────────────────────────────────────────────────── */

const CONTACT_LOG_FILE = path.join(ROOT, "contact-submissions.jsonl");
const CONTACT_ENTITY = process.env.YIQI_CONTACT_ENTITY || "ONS"; // ajustar si la entidad real es otra
const CONTACT_MAX_BODY_BYTES = 32 * 1024; // 32 KB

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let bytes = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      bytes += chunk.length;
      if (bytes > CONTACT_MAX_BODY_BYTES) {
        req.destroy();
        reject(new Error("Body too large"));
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      try {
        const text = Buffer.concat(chunks).toString("utf8");
        resolve(text ? JSON.parse(text) : {});
      } catch (e) {
        reject(new Error("Invalid JSON: " + e.message));
      }
    });
    req.on("error", reject);
  });
}

function validateContactPayload(p) {
  if (!p || typeof p !== "object") return "Payload vacío o inválido";
  const reqFields = ["nombre", "apellido", "email", "empresa", "mensaje"];
  for (const k of reqFields) {
    if (!p[k] || typeof p[k] !== "string" || !p[k].trim()) {
      return `Campo requerido: ${k}`;
    }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(p.email.trim())) {
    return "Email con formato inválido";
  }
  return null;
}

function appendContactSubmission(payload, extra = {}) {
  const line = JSON.stringify({ ...payload, _server: { receivedAt: new Date().toISOString(), ...extra } });
  return new Promise((resolve) => {
    fs.appendFile(CONTACT_LOG_FILE, line + "\n", (err) => {
      if (err) console.error("[contact] could not write log:", err.message);
      resolve();
    });
  });
}

function buildOnPayloadFromContact(p) {
  // Mapeo provisorio del payload del form a un registro de ON.
  // Ajustar nombres de campos según la entidad real en YiQi ERP.
  const rubros = Array.isArray(p.rubros) ? p.rubros.join(", ") : "";
  const modulos = Array.isArray(p.modulos) ? p.modulos.join(", ") : "";
  const origenFmt = (p?.meta?.form === "hero-index")
    ? "Web yiqi.com.ar (hero)"
    : "Web yiqi.com.ar (contacto)";

  return {
    record: {
      EMPRESA: (p.empresa || "").trim(),
      CONTACTO_NOMBRE: `${p.nombre} ${p.apellido}`.trim(),
      CONTACTO_EMAIL: (p.email || "").trim(),
      CONTACTO_TELEFONO: (p.celular || "").trim(),
      ORIGEN: origenFmt,
      PAIS: (p.pais || "").trim(),
      TITULO: `Contacto web — ${p.empresa || "sin empresa"}`,
      DESCRIPCION: [
        p.mensaje || "",
        "",
        rubros  ? `Rubros: ${rubros}`   : "",
        modulos ? `Módulos: ${modulos}` : "",
        p.empleados ? `Empleados: ${p.empleados}` : "",
        p.source    ? `¿Cómo nos conoció?: ${p.source}` : "",
      ].filter(Boolean).join("\n").trim(),
    },
  };
}

async function tryCreateOnInYiqi(payload) {
  const config = getYiqiConfig();
  const missing = getMissingYiqiAuthEnv(config);
  if (missing.length > 0) {
    throw new Error(`Missing YiQi API auth env: ${missing.join(", ")}`);
  }

  let token = await getYiqiToken(config);
  const body = buildOnPayloadFromContact(payload);
  const url = `${config.publicBaseUrl}/${CONTACT_ENTITY}/insert?schemaId=${config.schemaId}`;

  const doFetch = async (tk) => fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tk}`,
    },
    body: JSON.stringify(body),
  });

  let response = await doFetch(token);

  // Refresh de token si expiró
  if (response.status === 401 || response.status === 403) {
    cachedToken = null;
    token = await getYiqiToken(config, true);
    response = await doFetch(token);
  }

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`Insert ${CONTACT_ENTITY} failed (${response.status}): ${details || "No details"}`);
  }

  const result = await response.json().catch(() => ({}));
  return result?.id || result?.data?.id || null;
}

async function handleContactSubmission(req, res) {
  let payload;
  try {
    payload = await readJsonBody(req);
  } catch (e) {
    sendJson(res, 400, { ok: false, error: e.message });
    return;
  }

  const err = validateContactPayload(payload);
  if (err) {
    sendJson(res, 400, { ok: false, error: err });
    return;
  }

  // 1) Siempre persistir local — red de seguridad, no se pierde data nunca
  await appendContactSubmission(payload);

  // 2) Mejor esfuerzo: crear ON en CRM
  let onId = null;
  let onError = null;
  try {
    onId = await tryCreateOnInYiqi(payload);
  } catch (e) {
    onError = e instanceof Error ? e.message : String(e);
    console.error("[contact] could not create ON:", onError);
    await appendContactSubmission(payload, { onError });
  }

  // Siempre 200 al cliente si el payload era válido — la data ya está a salvo
  sendJson(res, 200, { ok: true, id: onId, crm: onError ? "deferred" : "synced" });
}

function safePathFromUrl(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split("?")[0]);
  const normalized = path.normalize(cleanPath).replace(/^([.][.][/\\])+/, "");
  return path.join(ROOT, normalized);
}

function sendFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not Found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  if (req.url === "/api/novedades" && req.method === "GET") {
    getNovedades()
      .then((items) => {
        sendJson(res, 200, { items });
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : "Unknown error";
        sendJson(res, 500, { error: "No se pudieron cargar las novedades", details: message });
      });
    return;
  }

  if (req.url === "/api/contact" && req.method === "POST") {
    handleContactSubmission(req, res).catch((error) => {
      const message = error instanceof Error ? error.message : "Unknown error";
      console.error("[contact] handler crashed:", message);
      sendJson(res, 500, { ok: false, error: "Internal error" });
    });
    return;
  }

  const requestPath = req.url === "/" ? "/index.html" : req.url;
  let filePath = safePathFromUrl(requestPath);

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }

    fs.access(filePath, fs.constants.F_OK, (accessErr) => {
      if (accessErr) {
        // Servir 404.html con status 404 (correcto para SEO)
        fs.readFile(path.join(ROOT, "404.html"), (err, data) => {
          if (err) {
            res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("Not Found");
            return;
          }
          res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
          res.end(data);
        });
        return;
      }
      sendFile(res, filePath);
    });
  });
});

server.listen(PORT, () => {
  console.log(`Static server listening on port ${PORT}`);
});

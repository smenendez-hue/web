const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 8080;
const ROOT = __dirname;
const DEFAULT_AUTH_URL = "https://api.yiqi.com.ar/token";
const DEFAULT_PUBLIC_BASE_URL = "https://api.yiqi.com.ar/api/public";
const DEFAULT_SCHEMA_ID = 1387;
const DEFAULT_CONTACT_SCHEMA_ID = 23;
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
  const contactSchemaRaw = process.env.YIQI_API_CONTACT_SCHEMA_ID;
  const contactSchemaId = Number.isFinite(Number(contactSchemaRaw)) && Number(contactSchemaRaw) > 0
    ? Number(contactSchemaRaw)
    : DEFAULT_CONTACT_SCHEMA_ID;

  return {
    authUrl,
    publicBaseUrl,
    schemaId,
    contactSchemaId,
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

async function postConsultaComercial(config, token, payload) {
  const url = `${config.publicBaseUrl}/CONSULTA_COMERCIAL`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`CONSULTA_COMERCIAL failed (${response.status}): ${details || "No details"}`);
  }

  const rawBody = await response.text().catch(() => "");
  if (!rawBody) return {};

  try {
    return JSON.parse(rawBody);
  } catch {
    return { raw: rawBody };
  }
}

async function sendConsultaComercial(payload) {
  const config = getYiqiConfig();
  const missing = getMissingYiqiAuthEnv(config);
  if (missing.length > 0) {
    throw new Error(`Missing YiQi API auth env: ${missing.join(", ")}`);
  }

  let token = await getYiqiToken(config);
  try {
    return await postConsultaComercial(config, token, payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const unauthorized = message.includes("(401)") || message.includes("(403)");
    if (!unauthorized) throw error;

    cachedToken = null;
    token = await getYiqiToken(config, true);
    return postConsultaComercial(config, token, payload);
  }
}

async function queryEntity(config, token, entityName, schemaId, queryBody) {
  const url = `${config.publicBaseUrl}/${entityName}/query?schemaId=${schemaId}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(queryBody),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`${entityName} query failed (${response.status}): ${details || "No details"}`);
  }

  return response.json();
}

function buildPaisLookupPayload(countryName) {
  return {
    page: 1,
    pageSize: 50,
    search: "",
    columns: [
      { field: "PAIS_PAIS", title: "PAIS_PAIS" },
    ],
    filters: [
      {
        columnName: "PAIS_PAIS",
        operator: "=",
        value: countryName,
      },
    ],
  };
}

async function resolvePaisIdByName(schemaId, countryName) {
  const config = getYiqiConfig();
  const missing = getMissingYiqiAuthEnv(config);
  if (missing.length > 0) {
    throw new Error(`Missing YiQi API auth env: ${missing.join(", ")}`);
  }

  let token = await getYiqiToken(config);
  let response;

  try {
    response = await queryEntity(config, token, "PAIS", schemaId, buildPaisLookupPayload(countryName));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const unauthorized = message.includes("(401)") || message.includes("(403)");
    if (!unauthorized) throw error;

    cachedToken = null;
    token = await getYiqiToken(config, true);
    response = await queryEntity(config, token, "PAIS", schemaId, buildPaisLookupPayload(countryName));
  }

  const rows = Array.isArray(response?.data) ? response.data : [];
  const first = rows[0];
  const id = Number(first?.id);

  if (!Number.isFinite(id) || id <= 0) {
    throw new Error(`No se encontro PAIS_ID_PAIS para '${countryName}'`);
  }

  return id;
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateContactoPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return "Payload invalido";
  }

  if (!Number.isFinite(payload.schemaId) || payload.schemaId <= 0) {
    return "schemaId invalido";
  }

  if (!payload.data || typeof payload.data !== "object") {
    return "data invalido";
  }

  const data = payload.data;
  const requiredStringFields = [
    "COCO_CONTACTO",
    "COCO_CLIENTE",
    "COCO_CONSULTA",
    "COCO_MAIL",
    "COCO_CANT_EMPLEADOS",
  ];

  for (const field of requiredStringFields) {
    if (!isNonEmptyString(data[field])) {
      return `${field} es requerido`;
    }
  }

  return null;
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        reject(new Error("Request body demasiado grande"));
        req.destroy();
      }
    });

    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(body);
}

function inferHttpStatusFromErrorMessage(message) {
  const match = /\((\d{3})\)/.exec(message);
  const status = Number(match?.[1]);
  if (!Number.isInteger(status)) return null;
  if (status < 100 || status > 599) return null;
  return status;
}

function isDuplicateContactoError(message) {
  if (!isNonEmptyString(message)) return false;
  return /duplicate key row/i.test(message)
    && (/ENT_CONTACTO/i.test(message) || /UQ_CONTACTO/i.test(message));
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
  const reqFields = ["nombre", "apellido", "email"]; // empresa/mensaje opcionales (la home no los exige)
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

function buildConsultaPayloadFromContact(p) {
  const rubros  = Array.isArray(p.rubros)  ? p.rubros.join(", ")  : "";
  const modulos = Array.isArray(p.modulos) ? p.modulos.join(", ") : "";
  const config  = getYiqiConfig();
  return {
    schemaId: config.contactSchemaId,
    data: {
      COCO_CONTACTO:           `${p.nombre || ""} ${p.apellido || ""}`.trim(),
      COCO_CLIENTE:            (p.empresa  || "").trim(),
      COCO_CONSULTA:           [
        p.mensaje || "",
        rubros  ? `Rubros: ${rubros}`    : "",
        modulos ? `Módulos: ${modulos}`  : "",
        p.empleados ? `Empleados: ${p.empleados}` : "",
      ].filter(Boolean).join("\n").trim(),
      COCO_TELEFONO:           (p.celular  || "").trim(),
      COCO_MAIL:               (p.email    || "").trim(),
      COCO_CANT_EMPLEADOS:     (p.empleados || "").trim(),
      COCO_RUBRO_PRINCIPAL:    rubros,
      COCO_MODULOS_DE_INTERES: modulos,
      COCO_CANAL_DE_CONTACTO:  (p.source   || "").trim(),
      ORCO_ID_ORCO:            109574,
    },
    countryName: (p.pais || "").trim(),
  };
}

async function tryCreateOnInYiqi(payload) {
  const consultaPayload = buildConsultaPayloadFromContact(payload);

  // Resolver PAIS_ID_PAIS si hay país
  if (consultaPayload.countryName && !Number.isFinite(Number(consultaPayload.data.PAIS_ID_PAIS))) {
    try {
      const paisId = await resolvePaisIdByName(consultaPayload.schemaId, consultaPayload.countryName);
      consultaPayload.data.PAIS_ID_PAIS = paisId;
    } catch (e) {
      console.warn("[contact] PAIS_ID_PAIS no resuelto:", e.message);
    }
  }

  const result = await sendConsultaComercial(consultaPayload);

  const apiError = result && typeof result === "object"
    ? (result.ok === false || isNonEmptyString(result.error))
    : false;
  if (apiError) throw new Error(result?.error || "CONSULTA_COMERCIAL devolvió error");

  const id = Number(result?.newId ?? result?.id ?? result?.data?.id);
  return Number.isFinite(id) && id > 0 ? id : null;
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
  if (req.url === "/api/contacto" && req.method === "POST") {
    readRequestBody(req)
      .then((rawBody) => {
        let parsed;
        try {
          parsed = JSON.parse(rawBody || "{}");
        } catch {
          sendJson(res, 400, { error: "JSON invalido" });
          return;
        }

        const config = getYiqiConfig();
        const schemaId = Number.isFinite(Number(parsed?.schemaId)) && Number(parsed.schemaId) > 0
          ? Number(parsed.schemaId)
          : config.contactSchemaId;

        const payload = {
          schemaId,
          data: parsed?.data || {},
        };
        const countryName = isNonEmptyString(parsed?.countryName) ? parsed.countryName.trim() : "";

        const validationError = validateContactoPayload(payload);
        if (validationError) {
          sendJson(res, 400, { error: validationError });
          return;
        }

        const sendRequest = async () => {
          if (countryName && !Number.isFinite(Number(payload.data.PAIS_ID_PAIS))) {
            try {
              const paisId = await resolvePaisIdByName(payload.schemaId, countryName);
              payload.data.PAIS_ID_PAIS = paisId;
            } catch (error) {
              const message = error instanceof Error ? error.message : String(error);
              // El pais en el formulario es opcional; no bloquear el envio si el lookup no encuentra coincidencia exacta.
              console.warn("[contacto] PAIS_ID_PAIS no resuelto:", message);
            }
          }

          return sendConsultaComercial(payload);
        };

        sendRequest()
          .then((result) => {
            const apiError = result && typeof result === "object"
              ? (result.ok === false || isNonEmptyString(result.error))
              : false;

            if (apiError) {
              sendJson(res, 502, {
                ok: false,
                error: "La API devolvio error al crear la consulta comercial",
                details: isNonEmptyString(result?.error) ? result.error : "Unknown error",
                result,
              });
              return;
            }

            const candidateId = Number(result?.newId ?? result?.id ?? result?.data?.id);
            if (!Number.isFinite(candidateId) || candidateId <= 0) {
              sendJson(res, 502, {
                ok: false,
                error: "La API no devolvio un id de alta para la consulta comercial",
                result,
              });
              return;
            }

            sendJson(res, 200, { ok: true, id: candidateId, result });
          })
          .catch((error) => {
            const message = error instanceof Error ? error.message : "Unknown error";

            if (isDuplicateContactoError(message)) {
              sendJson(res, 409, {
                code: "DUPLICATE_CONTACT",
                error: "El contacto ya existe en la base de datos",
                details: "Ya existe un contacto con ese nombre y email. Usa otro email o actualiza el contacto existente.",
              });
              return;
            }

            const inferredStatus = inferHttpStatusFromErrorMessage(message);
            const statusCode = inferredStatus && inferredStatus >= 400 && inferredStatus < 500 ? 400 : 500;

            sendJson(res, statusCode, {
              error: "No se pudo enviar la consulta comercial",
              details: message,
            });
          });
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : "Unknown error";
        sendJson(res, 500, { error: "Error leyendo request", details: message });
      });
    return;
  }

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

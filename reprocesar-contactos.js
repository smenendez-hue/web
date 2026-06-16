/*
  Reproceso de leads que quedaron sin entrar al CRM
  --------------------------------------------------
  Lee contact-submissions.jsonl y reenvía al CRM SOLO los leads que fallaron
  (los que tienen _server.onError). Reutiliza la lógica real de server.js
  (auth, payload, alta de ON), así no hay duplicación ni drift.

  Uso (parado en la carpeta www.yiqi, en el server):

    node reprocesar-contactos.js          # DRY-RUN: lista qué se enviaría, no envía nada
    node reprocesar-contactos.js --send   # Envía de verdad al CRM

  Idempotente: lleva un registro en contact-reprocess-done.jsonl y no reenvía
  lo ya procesado. Los duplicados (contacto ya existente en el CRM) se marcan
  como hechos para no reintentarlos en loop.

  NOTA de seguridad: este script y los .jsonl viven en la carpeta del sitio.
  Conviene que NO sean accesibles por web (ver fix pendiente en server.js).
*/

const fs = require("fs");
const path = require("path");
const { tryCreateOnInYiqi } = require("./server.js");

const ROOT = __dirname;
const LOG_FILE  = path.join(ROOT, "contact-submissions.jsonl");
const DONE_FILE = path.join(ROOT, "contact-reprocess-done.jsonl");
const SEND = process.argv.includes("--send");

// Clave única por lead: email + timestamp de recepción
function keyOf(entry) {
  const email = (entry.email || "").trim().toLowerCase();
  const ts = (entry && entry._server && entry._server.receivedAt)
    || (entry && entry.meta && entry.meta.timestamp)
    || "";
  return email + "|" + ts;
}

function loadDoneKeys() {
  const set = new Set();
  if (!fs.existsSync(DONE_FILE)) return set;
  for (const line of fs.readFileSync(DONE_FILE, "utf8").split("\n")) {
    if (!line.trim()) continue;
    try { set.add(JSON.parse(line).key); } catch { /* línea corrupta: ignorar */ }
  }
  return set;
}

// Mensaje de "ya existe en CRM" (no confundir con el error de FK de integridad)
function isDuplicate(msg) {
  return /ya existe|DUPLICATE_CONTACT|UQ_CONTACTO/i.test(msg);
}

async function main() {
  if (!fs.existsSync(LOG_FILE)) {
    console.error("No existe el log:", LOG_FILE);
    process.exit(1);
  }

  const lines = fs.readFileSync(LOG_FILE, "utf8").split("\n").filter((l) => l.trim());
  const done = loadDoneKeys();

  // Tomar SOLO las fallas (tienen onError), deduplicadas, no reprocesadas antes.
  const pending = [];
  const seen = new Set();
  for (const line of lines) {
    let e;
    try { e = JSON.parse(line); } catch { continue; }
    if (!e || !e._server || !e._server.onError) continue; // solo fallas de CRM
    const k = keyOf(e);
    if (seen.has(k)) continue;
    seen.add(k);
    if (done.has(k)) continue; // ya reprocesada en una corrida anterior
    pending.push({ entry: e, key: k });
  }

  console.log(`Lineas en log: ${lines.length}  -  fallas pendientes: ${pending.length}`);

  if (!SEND) {
    console.log("\n[DRY-RUN] No se envio nada. Pendientes:");
    pending.forEach((p, i) => {
      const e = p.entry;
      const err = (e._server.onError || "").slice(0, 90);
      console.log(`  ${i + 1}. ${e.nombre || ""} ${e.apellido || ""} <${e.email || ""}>  - ${err}`);
    });
    console.log("\nPara enviar de verdad:  node reprocesar-contactos.js --send");
    return;
  }

  let ok = 0, dup = 0, fail = 0;
  const doneOut = fs.createWriteStream(DONE_FILE, { flags: "a" });

  for (const { entry, key } of pending) {
    try {
      const id = await tryCreateOnInYiqi(entry);
      ok++;
      doneOut.write(JSON.stringify({ key, status: "ok", id: id || null, at: new Date().toISOString() }) + "\n");
      console.log(`OK   ${entry.email}  ->  ON ${id || "(sin id confirmado)"}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (isDuplicate(msg)) {
        dup++;
        doneOut.write(JSON.stringify({ key, status: "duplicate", error: msg, at: new Date().toISOString() }) + "\n");
        console.log(`DUP  ${entry.email}  (ya existe en el CRM)`);
      } else {
        fail++;
        console.log(`FAIL ${entry.email}: ${msg}`);
      }
    }
  }

  await new Promise((r) => doneOut.end(r));
  console.log(`\nResumen:  ${ok} creados  -  ${dup} duplicados (ya estaban)  -  ${fail} con error (quedan para reintentar)`);
}

main().catch((e) => { console.error(e); process.exit(1); });

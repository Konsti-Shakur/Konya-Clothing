const path = require("path");
const express = require("express");
const { Pool } = require("pg");

const app = express();
const PORT = Number(process.env.PORT || 3000);

if (!process.env.DATABASE_URL) {
  console.warn("[Konya Clothing] DATABASE_URL fehlt. Die Webseite startet, Datenbank-Endpunkte liefern jedoch 503.");
}

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.PGSSLMODE === "require" ? { rejectUnauthorized: false } : undefined,
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    })
  : null;

app.disable("x-powered-by");
app.use(express.json({ limit: "75mb" }));
app.use(express.urlencoded({ extended: false, limit: "75mb" }));

async function ensureSchema() {
  if (!pool) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS konya_app_state (
      id TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

app.get("/api/health", async (_req, res) => {
  if (!pool) {
    return res.status(503).json({ ok: false, database: false, reason: "DATABASE_URL missing" });
  }
  try {
    await pool.query("SELECT 1");
    return res.json({ ok: true, database: true });
  } catch (error) {
    console.error("Healthcheck database error:", error);
    return res.status(503).json({ ok: false, database: false });
  }
});

app.get("/api/state", async (_req, res) => {
  if (!pool) return res.status(503).json({ error: "DATABASE_URL missing" });
  try {
    await ensureSchema();
    const result = await pool.query(
      "SELECT data, updated_at FROM konya_app_state WHERE id = $1",
      ["main"]
    );
    if (!result.rowCount) return res.json({ state: null, updatedAt: null });
    return res.json({
      state: result.rows[0].data,
      updatedAt: result.rows[0].updated_at,
    });
  } catch (error) {
    console.error("GET /api/state failed:", error);
    return res.status(500).json({ error: "database_read_failed" });
  }
});

app.put("/api/state", async (req, res) => {
  if (!pool) return res.status(503).json({ error: "DATABASE_URL missing" });
  const state = req.body && req.body.state;
  if (!state || typeof state !== "object" || Array.isArray(state)) {
    return res.status(400).json({ error: "invalid_state" });
  }

  try {
    await ensureSchema();
    const result = await pool.query(
      `INSERT INTO konya_app_state (id, data, updated_at)
       VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (id)
       DO UPDATE SET data = EXCLUDED.data, updated_at = NOW()
       RETURNING updated_at`,
      ["main", JSON.stringify(state)]
    );
    return res.json({ ok: true, updatedAt: result.rows[0].updated_at });
  } catch (error) {
    console.error("PUT /api/state failed:", error);
    return res.status(500).json({ error: "database_write_failed" });
  }
});

app.use(express.static(__dirname, {
  extensions: ["html"],
  etag: true,
  maxAge: process.env.NODE_ENV === "production" ? "5m" : 0,
}));

["/","/showcase","/preise","/auftrag","/kundenbereich","/admin"].forEach(route=>{
  app.get(route, (_req,res)=>res.sendFile(path.join(__dirname,"index.html")));
});

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

async function start() {
  try {
    await ensureSchema();
    if (pool) console.log("[Konya Clothing] PostgreSQL verbunden / Schema bereit.");
  } catch (error) {
    console.error("[Konya Clothing] PostgreSQL konnte beim Start nicht initialisiert werden:", error);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Konya Clothing] Server läuft auf Port ${PORT}`);
  });
}

start();

async function shutdown(signal) {
  console.log(`[Konya Clothing] ${signal} empfangen, Server wird beendet.`);
  try { if (pool) await pool.end(); } catch {}
  process.exit(0);
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

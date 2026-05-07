import { promises as fs } from "fs";
import path from "path";
import { createHash, randomUUID } from "crypto";

const dataDir = path.join(process.cwd(), "data");
const analyticsFile = path.join(dataDir, "visitor-analytics.json");

const EMPTY_STORE = {
  visitors: [],
  leads: []
};

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(analyticsFile);
  } catch {
    await fs.writeFile(analyticsFile, JSON.stringify(EMPTY_STORE, null, 2), "utf8");
  }
}

async function readStore() {
  await ensureStore();
  const raw = await fs.readFile(analyticsFile, "utf8");
  const parsed = JSON.parse(raw);
  return {
    visitors: Array.isArray(parsed.visitors) ? parsed.visitors : [],
    leads: Array.isArray(parsed.leads) ? parsed.leads : []
  };
}

async function writeStore(store) {
  await fs.writeFile(analyticsFile, JSON.stringify(store, null, 2), "utf8");
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date, offset) {
  return new Date(date.getFullYear(), date.getMonth() + offset, 1);
}

function inRange(value, start, end) {
  const t = new Date(value).getTime();
  return Number.isFinite(t) && t >= start.getTime() && t < end.getTime();
}

function normalizePath(pathname) {
  const p = String(pathname || "/").trim();
  if (!p.startsWith("/")) return `/${p}`;
  return p || "/";
}

function hashIp(ip) {
  const clean = String(ip || "").trim();
  if (!clean) return "";
  return createHash("sha256").update(clean).digest("hex").slice(0, 24);
}

function getClientIp(req) {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "";
}

export async function recordVisit(req, payload = {}) {
  const store = await readStore();
  const nowIso = new Date().toISOString();
  const sessionId = String(payload.sessionId || "").slice(0, 120);
  const pathname = normalizePath(payload.path || "/");

  const sixHoursMs = 6 * 60 * 60 * 1000;
  const nowMs = Date.now();
  const duplicate = store.visitors.find((v) => {
    if (!sessionId || !v.sessionId) return false;
    if (v.sessionId !== sessionId || v.path !== pathname) return false;
    const t = new Date(v.at).getTime();
    return Number.isFinite(t) && nowMs - t < sixHoursMs;
  });
  if (duplicate) return { recorded: false };

  const referrer = String(payload.referrer || "").slice(0, 300);
  const userAgent = String(req.headers.get("user-agent") || "").slice(0, 300);
  const ipHash = hashIp(getClientIp(req));

  store.visitors.unshift({
    id: randomUUID(),
    at: nowIso,
    path: pathname,
    sessionId,
    referrer,
    userAgent,
    ipHash
  });
  if (store.visitors.length > 10000) {
    store.visitors = store.visitors.slice(0, 10000);
  }
  await writeStore(store);
  return { recorded: true };
}

export async function recordLead(payload = {}) {
  const store = await readStore();
  const name = String(payload.name || "").trim().slice(0, 120);
  const email = String(payload.email || "").trim().slice(0, 180);
  if (!name || !email) return { recorded: false };

  const services = Array.isArray(payload.services)
    ? payload.services.map((x) => String(x || "").trim()).filter(Boolean).slice(0, 20)
    : [];
  const source = String(payload.source || "contact-form").slice(0, 80);

  store.leads.unshift({
    id: randomUUID(),
    at: new Date().toISOString(),
    name,
    email,
    source,
    services
  });
  if (store.leads.length > 5000) {
    store.leads = store.leads.slice(0, 5000);
  }
  await writeStore(store);
  return { recorded: true };
}

export async function deleteLeadById(id) {
  const store = await readStore();
  const before = store.leads.length;
  store.leads = store.leads.filter((l) => l.id !== id);
  if (store.leads.length === before) return false;
  await writeStore(store);
  return true;
}

export async function clearAllLeads() {
  const store = await readStore();
  store.leads = [];
  await writeStore(store);
  return true;
}

export async function clearAllVisitors() {
  const store = await readStore();
  store.visitors = [];
  await writeStore(store);
  return true;
}

export async function getInsightsSummary() {
  const store = await readStore();
  const now = new Date();
  const thisMonthStart = startOfMonth(now);
  const nextMonthStart = addMonths(thisMonthStart, 1);
  const lastMonthStart = addMonths(thisMonthStart, -1);

  const visitors = store.visitors;
  const leads = store.leads;

  const monthBuckets = [];
  for (let i = 5; i >= 0; i -= 1) {
    const bucketStart = addMonths(thisMonthStart, -i);
    const bucketEnd = addMonths(bucketStart, 1);
    monthBuckets.push({
      label: bucketStart.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      visitors: visitors.filter((v) => inRange(v.at, bucketStart, bucketEnd)).length
    });
  }

  return {
    totals: {
      visitors: visitors.length,
      leads: leads.length
    },
    thisMonth: {
      visitors: visitors.filter((v) => inRange(v.at, thisMonthStart, nextMonthStart)).length,
      leads: leads.filter((l) => inRange(l.at, thisMonthStart, nextMonthStart)).length
    },
    lastMonth: {
      visitors: visitors.filter((v) => inRange(v.at, lastMonthStart, thisMonthStart)).length,
      leads: leads.filter((l) => inRange(l.at, lastMonthStart, thisMonthStart)).length
    },
    monthlyVisitors: monthBuckets,
    recentVisitors: visitors.slice(0, 12),
    recentLeads: leads.slice(0, 12)
  };
}

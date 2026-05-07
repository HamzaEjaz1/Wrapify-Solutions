import { promises as fs } from "fs";
import path from "path";
import { DEFAULT_SITE_CONTENT } from "./siteContentDefaults";

const dataDir = path.join(process.cwd(), "data");
const siteContentFile = path.join(dataDir, "site-content.json");

function cloneDefaults() {
  return JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT));
}

async function ensureDir() {
  await fs.mkdir(dataDir, { recursive: true });
}

export async function getSiteContent() {
  await ensureDir();
  try {
    const raw = await fs.readFile(siteContentFile, "utf8");
    return JSON.parse(raw);
  } catch {
    return cloneDefaults();
  }
}

export async function saveSiteContent(next) {
  await ensureDir();
  const payload = JSON.stringify(next, null, 2);
  await fs.writeFile(siteContentFile, payload, "utf8");
  return next;
}

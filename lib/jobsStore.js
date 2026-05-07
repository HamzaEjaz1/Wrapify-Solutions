import { promises as fs } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const jobsFile = path.join(dataDir, "jobs.json");

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(jobsFile);
  } catch {
    const seed = [
      {
        id: "j1",
        title: "Senior Full-Stack Engineer (React + Node)",
        description:
          "Lead end-to-end product development for SaaS and AI-powered web applications used by clients in Dubai, Qatar, and the wider MENA region. You will work closely with founders, product, and design to ship production-grade features.",
        lastDate: "2026-06-30",
        formUrl: "",
        email: "wrapifysolutions@gmail.com"
      },
      {
        id: "j2",
        title: "Mobile App Developer (Flutter)",
        description:
          "Build high-quality Flutter apps for iOS and Android with a focus on performance, reliability, and delightful UX. Experience with Firebase, REST APIs, and app store releases is a strong plus.",
        lastDate: "2026-06-15",
        formUrl: "",
        email: "wrapifysolutions@gmail.com"
      },
      {
        id: "j3",
        title: "AI Engineer / LLM Specialist",
        description:
          "Design and implement AI agents, retrieval-augmented systems (RAG), and automation workflows for clients across industries. You should be comfortable with prompt engineering, vector databases, and integrating LLMs into real products.",
        lastDate: "2026-07-05",
        formUrl: "https://forms.gle/example-wrapify-ai-role",
        email: "wrapifysolutions@gmail.com"
      }
    ];
    await fs.writeFile(jobsFile, JSON.stringify(seed, null, 2), "utf8");
  }
}

export async function getAllJobs() {
  await ensureStore();
  const raw = await fs.readFile(jobsFile, "utf8");
  const jobs = JSON.parse(raw);
  return jobs.sort((a, b) => new Date(a.lastDate) - new Date(b.lastDate));
}

export async function getJobById(id) {
  const jobs = await getAllJobs();
  return jobs.find((j) => j.id === id) || null;
}

export async function createJob(input) {
  const jobs = await getAllJobs();
  const now = new Date();
  const id = globalThis.crypto?.randomUUID?.() || `job-${now.getTime()}`;
  const title = String(input.title || "").trim();
  const description = String(input.description || "").trim();
  const lastDate = String(input.lastDate || "").trim();
  const formUrl = String(input.formUrl || "").trim();

  const job = {
    id,
    title,
    description,
    lastDate,
    formUrl,
    email: "wrapifysolutions@gmail.com"
  };

  const next = [job, ...jobs];
  await fs.writeFile(jobsFile, JSON.stringify(next, null, 2), "utf8");
  return job;
}

export async function updateJob(id, input) {
  const jobs = await getAllJobs();
  const index = jobs.findIndex((j) => j.id === id);
  if (index === -1) return null;
  const current = jobs[index];

  const updated = {
    ...current,
    title: input.title != null ? String(input.title).trim() : current.title,
    description: input.description != null ? String(input.description).trim() : current.description,
    lastDate: input.lastDate != null ? String(input.lastDate).trim() : current.lastDate,
    formUrl: input.formUrl != null ? String(input.formUrl).trim() : current.formUrl
  };

  jobs[index] = updated;
  await fs.writeFile(jobsFile, JSON.stringify(jobs, null, 2), "utf8");
  return updated;
}

export async function deleteJob(id) {
  const jobs = await getAllJobs();
  const next = jobs.filter((j) => j.id !== id);
  if (next.length === jobs.length) return false;
  await fs.writeFile(jobsFile, JSON.stringify(next, null, 2), "utf8");
  return true;
}


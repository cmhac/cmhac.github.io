import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

export type ProjectKind = "Reporting and analysis" | "Tools and infrastructure";

export interface Project {
  slug: string;
  title: string;
  description: string;
  kind: ProjectKind;
  url?: string;
  image?: string;
  date?: string;
  content: string;
}

const KIND_ORDER: ProjectKind[] = [
  "Reporting and analysis",
  "Tools and infrastructure",
];

/** Pages CMS's default filename pattern date-stamps new entries; keep that out of the URL. */
const DATE_PREFIX = /^\d{4}-\d{2}-\d{2}-/;

export function slugFromFilename(file: string): string {
  return file.replace(/\.md$/, "").replace(DATE_PREFIX, "");
}

async function readProjectFile(
  file: string,
  projectsDir: string,
): Promise<Project> {
  const raw = await fs.readFile(path.join(projectsDir, file), "utf8");
  const { data, content } = matter(raw);
  return {
    slug: slugFromFilename(file),
    title: data.title,
    description: data.description,
    kind: data.kind,
    url: data.url || undefined,
    image: data.image || undefined,
    date: data.date ? String(data.date) : undefined,
    content: content.trim(),
  };
}

/** All projects, ordered as one ring: analysis items first, then tools, each newest first. */
export async function getAllProjects(): Promise<Project[]> {
  const projectsDir = path.join(process.cwd(), "src/content/projects");
  const files = (await fs.readdir(projectsDir)).filter((f) =>
    f.endsWith(".md"),
  );
  const projects = await Promise.all(
    files.map((f) => readProjectFile(f, projectsDir)),
  );

  return projects.sort((a, b) => {
    const kindDiff = KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind);
    if (kindDiff !== 0) return kindDiff;
    // Undated entries sort to the end rather than the top.
    const aDate = a.date ? new Date(a.date).getTime() : -Infinity;
    const bDate = b.date ? new Date(b.date).getTime() : -Infinity;
    if (aDate !== bDate) return bDate - aDate;
    return a.title.localeCompare(b.title);
  });
}

export async function getProjectsByKind(kind: ProjectKind): Promise<Project[]> {
  const all = await getAllProjects();
  return all.filter((p) => p.kind === kind);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const all = await getAllProjects();
  return all.find((p) => p.slug === slug) ?? null;
}

import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

export type ProjectKind = "Reporting and analysis" | "Tools and infrastructure";

export interface Project {
  slug: string;
  title: string;
  note: string;
  kind: ProjectKind;
  order: number;
  url?: string;
  cover?: string;
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
    note: data.note,
    kind: data.kind,
    // An entry saved without an order sorts to the end of its section, not the top.
    order:
      typeof data.order === "number" ? data.order : Number.MAX_SAFE_INTEGER,
    url: data.url || undefined,
    cover: data.cover || undefined,
    content: content.trim(),
  };
}

/** All projects, ordered as one ring: analysis items first (by `order`), then tools items (by `order`). */
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
    if (a.order !== b.order) return a.order - b.order;
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

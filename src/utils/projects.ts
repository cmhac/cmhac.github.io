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

async function readProjectFile(
  file: string,
  projectsDir: string,
): Promise<Project> {
  const raw = await fs.readFile(path.join(projectsDir, file), "utf8");
  const { data, content } = matter(raw);
  return {
    slug: file.replace(/\.md$/, ""),
    title: data.title,
    note: data.note,
    kind: data.kind,
    order: data.order ?? 0,
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
    return a.order - b.order;
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

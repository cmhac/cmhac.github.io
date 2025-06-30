import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

export interface Project {
  title: string;
  description: string;
  technologies: Record<string, string>;
  url?: string;
  image?: string;
  featured: boolean;
  featureRank?: number;
  date?: string;
  content?: string;
  slug: string;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projectsDir = path.join(process.cwd(), "src/content/projects");
  const files = await fs.readdir(projectsDir);

  for (const file of files) {
    if (!file.endsWith(".md")) continue;

    const content = await fs.readFile(path.join(projectsDir, file), "utf8");
    const { data, content: markdownContent } = matter(content);
    const projectSlug = generateSlug(data.title);

    if (projectSlug === slug) {
      return {
        ...data,
        title: data.title,
        description: data.description,
        technologies: data.technologies || {},
        url: data.url || "",
        image: data.image || "",
        featured: data.featured || false,
        featureRank: data.featureRank || null,
        date: data.date || new Date().toISOString(),
        content: markdownContent,
        slug: projectSlug,
      } as Project;
    }
  }

  return null;
}

export async function getAllProjects(): Promise<Project[]> {
  const projectsDir = path.join(process.cwd(), "src/content/projects");
  const files = await fs.readdir(projectsDir);

  const projects = await Promise.all(
    files
      .filter((file) => file.endsWith(".md"))
      .map(async (file) => {
        try {
          const content = await fs.readFile(
            path.join(projectsDir, file),
            "utf8",
          );
          const { data, content: markdownContent } = matter(content);
          return {
            ...data,
            title: data.title,
            description: data.description,
            technologies: data.technologies || {},
            url: data.url || "",
            image: data.image || "",
            featured: data.featured || false,
            featureRank: data.featureRank || null,
            date: data.date || new Date().toISOString(),
            content: markdownContent,
            slug: generateSlug(data.title),
          } as Project;
        } catch (error) {
          console.error(`Error reading project file ${file}:`, error);
          return null;
        }
      }),
  );

  return projects
    .filter((project): project is Project => project !== null)
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime());
}

export async function getHomePageProjects() {
  const projects = await getAllProjects();
  const featured = projects
    .filter((project) => project.featured)
    .sort((a, b) => {
      // Sort by featureRank (ascending), then by date (descending) for projects without rank
      const aRank = a.featureRank ?? null;
      const bRank = b.featureRank ?? null;

      if (aRank !== null && bRank !== null) {
        return aRank - bRank;
      }
      if (aRank !== null && bRank === null) {
        return -1; // a comes first (has rank)
      }
      if (aRank === null && bRank !== null) {
        return 1; // b comes first (has rank)
      }
      // Both have no rank, sort by date
      return new Date(b.date!).getTime() - new Date(a.date!).getTime();
    });
  const recent = projects.filter((project) => !project.featured).slice(0, 3);

  return { featured, recent };
}

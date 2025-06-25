import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

export interface Project {
  title: string;
  description: string;
  technologies: string[];
  url: string;
  image: string;
  featured: boolean;
  date?: string;
  content?: string;
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
          const { data } = matter(content);
          return {
            ...data,
            title: data.title,
            description: data.description,
            technologies: data.technologies || [],
            url: data.url || "",
            image: data.image || "",
            featured: data.featured || false,
            date: data.date || new Date().toISOString(),
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
  const featured = projects.filter((project) => project.featured);
  const recent = projects.filter((project) => !project.featured).slice(0, 3);

  return { featured, recent };
}

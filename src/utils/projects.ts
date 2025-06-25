import { promises as fs } from "fs";
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
  try {
    const files = await fs.readdir(projectsDir);
    const projects = await Promise.all(
      files
        .filter((file) => file.endsWith(".md") || file.endsWith(".json"))
        .map(async (file) => {
          const content = await fs.readFile(
            path.join(projectsDir, file),
            "utf8",
          );
          try {
            if (file.endsWith(".md")) {
              // Parse markdown with frontmatter
              const { data, content: markdownContent } = matter(content);
              return {
                ...data,
                content: markdownContent.trim(),
              } as Project;
            } else {
              // Parse JSON file
              const jsonData = JSON.parse(content);
              return jsonData as Project;
            }
          } catch (error) {
            console.error(`Error parsing project file ${file}:`, error);
            return null;
          }
        }),
    );

    // Filter out any null projects from parsing errors and sort by date
    const validProjects = projects.filter((p): p is Project => p !== null);

    // Sort projects by date (most recent first)
    return validProjects.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });
  } catch (error) {
    console.error("Error reading projects:", error);
    return [];
  }
}

export async function getHomePageProjects(): Promise<{
  featured: Project[];
  recent: Project[];
}> {
  const allProjects = await getAllProjects();

  return {
    featured: allProjects.filter((project) => project.featured),
    recent: allProjects.slice(0, 3), // Get 3 most recent projects
  };
}

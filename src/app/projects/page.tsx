import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import ProjectCard from "@/components/ProjectCard";

interface Project {
  title: string;
  description: string;
  technologies: string[];
  url: string;
  image: string;
  featured: boolean;
  date?: string;
  content?: string;
}

async function getAllProjects(): Promise<Project[]> {
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

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">All Projects</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </div>
    </div>
  );
}

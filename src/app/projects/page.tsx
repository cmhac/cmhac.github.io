import { promises as fs } from "fs";
import path from "path";
import Image from "next/image";

interface Project {
  title: string;
  description: string;
  technologies: string[];
  url: string;
  image: string;
  featured: boolean;
  date?: string;
}

async function getAllProjects(): Promise<Project[]> {
  const projectsDir = path.join(process.cwd(), "src/content/projects");
  try {
    const files = await fs.readdir(projectsDir);
    const projects = await Promise.all(
      files.map(async (file) => {
        const content = await fs.readFile(path.join(projectsDir, file), "utf8");
        // Basic frontmatter parsing
        const project = JSON.parse(content);
        return project;
      })
    );

    // Sort projects by date (newest first)
    return projects.sort((a, b) => {
      return (
        new Date(b.date || "").getTime() - new Date(a.date || "").getTime()
      );
    });
  } catch (error) {
    return [];
  }
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
      {project.image && (
        <div className="relative w-full h-48 mb-4">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover rounded"
          />
        </div>
      )}
      <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
      <p className="text-gray-600 mb-4">{project.description}</p>
      {project.technologies && (
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="bg-gray-100 px-3 py-1 rounded-full text-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
      <div className="flex justify-between items-center">
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800"
        >
          View Project →
        </a>
        {project.date && (
          <span className="text-sm text-gray-500">
            {new Date(project.date).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <main className="min-h-screen p-8 md:p-16 bg-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">All Projects</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.title} project={project} />
          ))}
        </div>
      </div>
    </main>
  );
}

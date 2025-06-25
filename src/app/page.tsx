import { promises as fs } from "fs";
import path from "path";
import Image from "next/image";
import Link from "next/link";
import { getAllProjects } from "@/utils/projects";
import type { Project } from "@/utils/projects";
import ProjectImage from "@/components/ProjectImage";

// Types for our CMS content
interface SiteSettings {
  title: string;
  description: string;
  author: string;
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
  };
}

async function getSiteSettings(): Promise<SiteSettings> {
  const filePath = path.join(process.cwd(), "src/config/site.json");
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    // Return default settings if file doesn't exist yet
    return {
      title: "My Portfolio",
      description: "Welcome to my portfolio",
      author: "Your Name",
      socialLinks: {
        github: "#",
        linkedin: "#",
        twitter: "#",
      },
    };
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
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
      <Link
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800"
      >
        View Project →
      </Link>
    </div>
  );
}

export default async function Home() {
  const projects = await getAllProjects();
  const featuredProjects = projects.filter((project) => project.featured);

  return (
    <main className="container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">My Portfolio</h1>
        <p className="text-xl text-gray-600">
          Welcome to my portfolio website showcasing my projects and skills
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.map((project) => (
            <div
              key={project.title}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {project.image && (
                <ProjectImage
                  src={project.image}
                  alt={project.title}
                  className="rounded"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <Link
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  View Project →
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/projects"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View All Projects →
          </Link>
        </div>
      </section>
    </main>
  );
}

import { promises as fs } from "fs";
import path from "path";
import Link from "next/link";
import Image from "next/image";

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

interface Project {
  title: string;
  description: string;
  technologies: string[];
  url: string;
  image: string;
  featured: boolean;
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

async function getFeaturedProjects(): Promise<Project[]> {
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
    return projects.filter((project) => project.featured);
  } catch (error) {
    return [];
  }
}

export default async function Home() {
  const siteSettings = await getSiteSettings();
  const featuredProjects = await getFeaturedProjects();

  return (
    <main className="min-h-screen p-8 md:p-16 bg-white">
      {/* Hero Section */}
      <section className="max-w-4xl mx-auto mb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          {siteSettings.title}
        </h1>
        <p className="text-xl text-gray-600 mb-8">{siteSettings.description}</p>
        <div className="flex justify-center gap-4">
          {Object.entries(siteSettings.socialLinks).map(([platform, url]) => (
            <a
              key={platform}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900"
            >
              {platform.charAt(0).toUpperCase() + platform.slice(1)}
            </a>
          ))}
        </div>
      </section>

      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <section className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Featured Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredProjects.map((project) => (
              <div
                key={project.title}
                className="border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
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
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800"
                >
                  View Project →
                </a>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

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
      title: "Chris Hacker",
      description: "Investigative Data Journalist & Engineer",
      author: "Chris Hacker",
      socialLinks: {
        github: "https://github.com/cmhac",
        linkedin: "#",
        twitter: "#",
      },
    };
  }
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="bg-terminal-selection/30 backdrop-blur-sm rounded-lg p-6 card-hover border border-terminal-selection/50">
      {project.image && (
        <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 hover:scale-110"
          />
        </div>
      )}
      <h3 className="text-xl font-mono font-bold mb-2 text-terminal-purple">
        {project.title}
      </h3>
      <p className="text-terminal-text/80 mb-4 font-light">
        {project.description}
      </p>
      {project.technologies && (
        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="bg-terminal-selection/50 text-terminal-cyan px-3 py-1 rounded-full text-sm font-mono"
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
        className="inline-flex items-center text-terminal-green hover:text-terminal-cyan transition-colors font-mono"
      >
        $ explore_project<span className="terminal-text ml-1"></span>
      </Link>
    </div>
  );
}

export default async function Home() {
  const projects = await getAllProjects();
  const featuredProjects = projects.filter((project) => project.featured);
  const siteSettings = await getSiteSettings();

  return (
    <div className="min-h-screen pt-16">
      <main className="container mx-auto px-4 py-16">
        <section className="text-center mb-16 animate-text-reveal">
          <h1 className="text-5xl font-bold mb-6 font-mono">
            <span className="text-terminal-purple">{siteSettings.author}</span>
            <span className="text-terminal-text"> | </span>
            <span className="text-terminal-cyan">
              {siteSettings.description}
            </span>
          </h1>
          <p className="text-xl text-terminal-text/80 max-w-3xl mx-auto leading-relaxed">
            I build tools and analyze data to uncover stories that matter.
            Specializing in investigative data journalism and custom software
            development for complex reporting challenges.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/projects"
              className="px-6 py-3 bg-terminal-purple/20 text-terminal-purple border border-terminal-purple rounded-lg hover:bg-terminal-purple hover:text-terminal-text transition-all duration-300 font-mono"
            >
              View Projects
            </Link>
            <Link
              href="/about"
              className="px-6 py-3 bg-terminal-cyan/20 text-terminal-cyan border border-terminal-cyan rounded-lg hover:bg-terminal-cyan hover:text-terminal transition-all duration-300 font-mono"
            >
              About Me
            </Link>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-mono font-bold mb-8 flex items-center">
            <span className="text-terminal-green">$</span>
            <span className="text-terminal-purple ml-2">featured_projects</span>
            <span className="text-terminal-text terminal-text ml-2"></span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/projects"
              className="inline-flex items-center px-6 py-3 bg-terminal-selection/30 text-terminal-text border border-terminal-selection rounded-lg hover:bg-terminal-selection transition-all duration-300 font-mono"
            >
              $ explore_all_projects<span className="terminal-text ml-1"></span>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

import { promises as fs } from "fs";
import path from "path";
import Link from "next/link";
import { getAllProjects } from "@/utils/projects";
import type { Project } from "@/utils/projects";
import ProjectCard from "@/components/ProjectCard";

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
            <span className="text-terminal-green">➜</span>
            <span className="text-terminal-purple ml-2">featured_projects</span>
            <span className="text-terminal-text terminal-text ml-2"></span>
          </h2>
          <div className="flex flex-col space-y-8">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/projects"
              className="inline-flex items-center px-6 py-3 bg-terminal-selection/30 text-terminal-text border border-terminal-selection rounded-lg hover:bg-terminal-selection transition-all duration-300 font-mono"
            >
              ➜ explore_all_projects
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

import { getAllProjects } from "@/utils/projects";
import type { Project } from "@/utils/projects";
import ProjectCard from "@/components/ProjectCard";

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div className="min-h-screen pt-16">
      <main className="container mx-auto px-4 py-16">
        <section className="mb-16">
          <h1 className="text-3xl font-mono font-bold mb-8 flex items-center">
            <span className="text-terminal-green">➜</span>
            <span className="text-terminal-purple ml-2">ls</span>
            <span className="text-terminal-text ml-2">~/projects</span>
          </h1>
          <div className="flex flex-col space-y-8">
            {projects.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

import { getAllProjects } from "@/utils/projects";
import ProjectsList from "@/components/ProjectsList";

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div className="min-h-screen pt-16">
      <main className="container mx-auto px-4 py-16">
        <section className="mb-16">
          <h1 className="text-3xl font-mono font-bold mb-8 flex items-center">
            <span className="text-terminal-green">➜</span>
            <span className="text-terminal-purple ml-2">projects</span>
            <span className="text-terminal-text terminal-text ml-2"></span>
          </h1>
          <ProjectsList projects={projects} />
        </section>
      </main>
    </div>
  );
}

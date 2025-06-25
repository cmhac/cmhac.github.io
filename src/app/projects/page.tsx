import { getAllProjects } from "@/utils/projects";
import type { Project } from "@/utils/projects";
import ProjectCard from "@/components/ProjectCard";

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

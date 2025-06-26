import Link from "next/link";
import ProjectImage from "./ProjectImage";
import type { Project } from "@/utils/projects";

export default function ProjectCard({ project }: { project: Project }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Link href={`/projects/${project.slug}`} className="block">
      <div className="bg-terminal-selection/30 backdrop-blur-sm rounded-lg p-6 card-hover border border-terminal-selection/50 transition-all duration-300 hover:bg-terminal-selection/50 hover:border-terminal-purple/50">
        <div className="flex flex-col md:flex-row md:space-x-8">
          {project.image && (
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                <ProjectImage
                  src={project.image}
                  alt={project.title}
                  className="object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
            </div>
          )}
          <div className={`flex-1 ${!project.image ? "pt-4" : ""}`}>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
              <h3 className="text-xl font-mono font-bold text-terminal-purple group-hover:text-terminal-cyan transition-colors">
                {project.title}
              </h3>
              {project.date && (
                <p className="text-sm text-terminal-comment font-mono mt-2 md:mt-0">
                  {formatDate(project.date)}
                </p>
              )}
            </div>

            <p className="text-terminal-text/80 mb-4 font-light">
              {project.description}
            </p>

            {project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
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
          </div>
        </div>
      </div>
    </Link>
  );
}

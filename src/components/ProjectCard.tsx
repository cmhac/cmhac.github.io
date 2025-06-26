import Link from "next/link";
import ProjectImage from "./ProjectImage";

interface Project {
  title: string;
  description: string;
  technologies: string[];
  url: string;
  image?: string;
  featured: boolean;
  date?: string;
  content?: string;
}

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
    <div className="bg-terminal-selection/30 backdrop-blur-sm rounded-lg p-6 card-hover border border-terminal-selection/50">
      {project.image && (
        <div className="relative w-full h-48 mb-4 overflow-hidden rounded-lg">
          <ProjectImage
            src={project.image}
            alt={project.title}
            className="object-cover transition-transform duration-500 hover:scale-110"
          />
        </div>
      )}
      <div className={`${!project.image ? "pt-4" : ""}`}>
        <h3 className="text-xl font-mono font-bold mb-2 text-terminal-purple">
          {project.title}
        </h3>
        <p className="text-terminal-text/80 mb-4 font-light">
          {project.description}
        </p>

        {project.technologies.length > 0 && (
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

        {project.date && (
          <p className="text-sm text-terminal-comment mb-4 font-mono">
            {formatDate(project.date)}
          </p>
        )}

        {project.content && (
          <div className="prose prose-invert max-w-none mb-4 text-terminal-text/90">
            {project.content}
          </div>
        )}

        <Link
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-terminal-green hover:text-terminal-cyan transition-colors font-mono"
        >
          $ explore_project
        </Link>
      </div>
    </div>
  );
}

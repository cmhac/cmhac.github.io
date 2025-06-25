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
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {project.image && (
        <ProjectImage src={project.image} alt={project.title} />
      )}
      <div className={`p-6 ${!project.image ? "pt-4" : ""}`}>
        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
        <p className="text-gray-600 mb-4">{project.description}</p>

        {project.technologies.length > 0 && (
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
        )}

        {project.date && (
          <p className="text-sm text-gray-500 mb-4">
            {formatDate(project.date)}
          </p>
        )}

        {project.content && (
          <div className="prose prose-sm max-w-none mb-4">
            {project.content}
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
    </div>
  );
}

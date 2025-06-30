import { getProjectBySlug, getAllProjects } from "@/utils/projects";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProjectImage from "@/components/ProjectImage";
import { Metadata } from "next";
import ReactMarkdown from "react-markdown";

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} | Chris Hacker`,
    description: project.description,
  };
}

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export default async function ProjectPage({ params }: Props) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    return notFound();
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen pt-16">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link
              href="/projects"
              className="text-terminal-green hover:text-terminal-cyan transition-colors font-mono inline-flex items-center"
            >
              ← back to projects
            </Link>
          </div>

          <article className="bg-terminal-selection/30 backdrop-blur-sm rounded-lg p-8 border border-terminal-selection/50">
            <header className="mb-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <h1 className="text-3xl font-mono font-bold text-terminal-purple mb-2 md:mb-0">
                  {project.title}
                </h1>
                {project.date && (
                  <p className="text-sm text-terminal-comment font-mono">
                    {formatDate(project.date)}
                  </p>
                )}
              </div>

              <p className="text-xl text-terminal-text/80 mb-6">
                {project.description}
              </p>

              {Object.keys(project.technologies).length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-mono font-bold text-terminal-green mb-4">
                    Tools and techniques used
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(project.technologies).map(
                      ([tech, description]) => (
                        <div
                          key={tech}
                          className="bg-terminal-selection/30 border border-terminal-selection rounded-lg p-3"
                        >
                          <div className="text-terminal-cyan font-mono font-bold text-sm mb-1">
                            {tech}
                          </div>
                          <div className="text-terminal-text/80 text-sm">
                            {description}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {project.url && (
                <Link
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-terminal-green hover:text-terminal-cyan transition-colors font-mono"
                >
                  ➜ view live project
                </Link>
              )}
            </header>

            {project.image && (
              <div className="mb-8">
                <div className="relative aspect-video overflow-hidden rounded-lg">
                  {project.url ? (
                    <Link
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full h-full"
                    >
                      <ProjectImage
                        src={project.image}
                        alt={project.title}
                        className="hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                  ) : (
                    <ProjectImage src={project.image} alt={project.title} />
                  )}
                </div>
              </div>
            )}

            {project.content && (
              <div className="prose prose-invert max-w-none [&>*]:mb-8 [&>p]:mb-8 [&>p]:leading-relaxed [&>ul]:mb-8 [&>ol]:mb-8 [&>h1]:mt-16 [&>h2]:mt-16 [&>h3]:mt-16 [&_a]:text-terminal-green [&_a]:underline [&_a]:decoration-terminal-green/50 [&_a]:underline-offset-4 [&_a]:transition-colors hover:[&_a]:text-terminal-cyan hover:[&_a]:decoration-terminal-cyan">
                <ReactMarkdown>{project.content}</ReactMarkdown>
              </div>
            )}
          </article>
        </div>
      </main>
    </div>
  );
}

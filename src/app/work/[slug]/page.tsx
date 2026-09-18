import { getProjectBySlug, getAllProjects } from "@/utils/projects";
import { getSiteSettings } from "@/utils/site";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import ReactMarkdown from "react-markdown";

interface Props {
  params: {
    slug: string;
  };
}

function hostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return { title: "Project not found" };

  return {
    title: `${project.title} | Chris Hacker`,
    description: project.description,
  };
}

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({ params }: Props) {
  const [project, all, site] = await Promise.all([
    getProjectBySlug(params.slug),
    getAllProjects(),
    getSiteSettings(),
  ]);

  if (!project) {
    return notFound();
  }

  const idx = all.findIndex((p) => p.slug === project.slug);
  const prev = all[(idx - 1 + all.length) % all.length];
  const next = all[(idx + 1) % all.length];

  return (
    <div className="max-w-[660px] mx-auto px-[28px] pt-[96px] pb-[160px] flex flex-col gap-[56px]">
      <div className="flex items-baseline justify-between gap-[24px]">
        <Link href="/" className="text-[13px] opacity-[0.55] hover:opacity-100">
          {site.author}
        </Link>
      </div>

      <header className="flex flex-col gap-[16px]">
        <p className="m-0 text-[13px] tracking-[0.08em] uppercase opacity-[0.55]">
          {project.kind}
        </p>
        <h1 className="m-0 text-[30px] font-medium leading-[1.2] tracking-[-0.01em] [text-wrap:pretty]">
          {project.title}
        </h1>
        <p className="m-0 max-w-[50ch] opacity-[0.55] [text-wrap:pretty]">
          {project.description}
        </p>
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] opacity-[0.55] hover:opacity-100 underline underline-offset-[3px] self-start"
          >
            {hostname(project.url)} ↗
          </a>
        )}
      </header>

      {project.image && (
        <div className="relative w-full aspect-video">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="flex flex-col gap-[20px] max-w-[50ch] [&>p]:m-0 [&_p]:[text-wrap:pretty]">
        <ReactMarkdown
          components={{
            p: ({ children }) => <p>{children}</p>,
          }}
        >
          {project.content}
        </ReactMarkdown>
      </div>

      <div className="flex justify-between gap-[24px] text-[13px] border-t border-[color:var(--hairline)] pt-[14px]">
        <Link
          href={`/work/${prev.slug}`}
          className="opacity-[0.55] hover:opacity-100"
        >
          ← {prev.title}
        </Link>
        <Link
          href={`/work/${next.slug}`}
          className="opacity-[0.55] hover:opacity-100 text-right"
        >
          {next.title} →
        </Link>
      </div>
    </div>
  );
}

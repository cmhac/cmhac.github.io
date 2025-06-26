import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import Link from "next/link";

interface AboutContent {
  title: string;
  description: string;
  content: string;
}

async function getAboutContent(): Promise<AboutContent> {
  const filePath = path.join(process.cwd(), "src/content/about.md");
  const fileContent = await fs.readFile(filePath, "utf8");
  const { data, content } = matter(fileContent);

  return {
    title: data.title,
    description: data.description,
    content: content.trim(),
  };
}

export default async function AboutPage() {
  const { title, content } = await getAboutContent();

  return (
    <div className="min-h-screen pt-16">
      <main className="container mx-auto px-4 py-16">
        <section className="mb-16">
          <h1 className="text-3xl font-mono font-bold mb-8 flex items-center">
            <span className="text-terminal-green">➜</span>
            <span className="text-terminal-purple ml-2">about</span>
            <span className="text-terminal-text terminal-text ml-2"></span>
          </h1>
          <div className="prose prose-invert max-w-none">
            {content.split("\n\n").map((paragraph, index) => (
              <p
                key={index}
                className="text-terminal-text/80 text-lg leading-relaxed mb-6"
              >
                {paragraph}
              </p>
            ))}
          </div>
          <div className="mt-12 flex gap-4">
            <Link
              href="https://github.com/cmhac"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-terminal-green hover:text-terminal-cyan transition-colors font-mono"
            >
              ➜ github
            </Link>
            <Link
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-terminal-green hover:text-terminal-cyan transition-colors font-mono"
            >
              ➜ linkedin
            </Link>
            <Link
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-terminal-green hover:text-terminal-cyan transition-colors font-mono"
            >
              ➜ twitter
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}

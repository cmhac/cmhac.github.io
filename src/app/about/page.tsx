import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">{title}</h1>
      <div className="prose prose-lg max-w-none">
        {content.split("\n\n").map((paragraph, index) => (
          <p key={index} className={index > 0 ? "mt-4" : ""}>
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}

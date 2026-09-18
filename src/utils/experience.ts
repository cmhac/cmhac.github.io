import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

export interface ExperienceRole {
  title: string;
  dates: string;
}

export interface Experience {
  order: number;
  title: string;
  org: string;
  dates: string;
  roles: ExperienceRole[];
}

export async function getExperience(): Promise<Experience[]> {
  const dir = path.join(process.cwd(), "src/content/experience");
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith(".md"));

  const items = await Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(path.join(dir, file), "utf8");
      const { data } = matter(raw);
      return {
        // An entry saved without an order sorts to the end, not the top.
        order:
          typeof data.order === "number" ? data.order : Number.MAX_SAFE_INTEGER,
        title: data.title,
        org: data.org,
        dates: data.dates,
        roles: data.roles ?? [],
      } as Experience;
    }),
  );

  return items.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.title.localeCompare(b.title);
  });
}

import fs from "fs/promises";
import path from "path";

export interface SiteSettings {
  title: string;
  description: string;
  author: string;
  bio: string;
  location: string;
  updatedLabel: string;
  socialLinks: {
    washingtonPost: string;
    github: string;
    linkedin: string;
    bluesky: string;
  };
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const filePath = path.join(process.cwd(), "src/config/site.json");
  const data = await fs.readFile(filePath, "utf8");
  return JSON.parse(data);
}

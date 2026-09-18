import type { Project } from "@/utils/projects";
import type { Experience } from "@/utils/experience";
import type { SiteSettings } from "@/utils/site";

export const mockProject: Project = {
  slug: "test-project",
  title: "Test Project",
  note: "A test project description",
  kind: "Reporting and analysis",
  order: 1,
  url: "https://example.com",
  cover: undefined,
  content: "This is the project content.",
};

export const mockExperience: Experience = {
  order: 1,
  title: "Test Role",
  org: "Test Org",
  dates: "Jan 2020 – Present",
  roles: [],
};

export const mockSiteSettings: SiteSettings = {
  title: "Chris Hacker",
  description: "Data journalist on the data team at The Washington Post.",
  author: "Chris Hacker",
  bio: "Test bio paragraph.",
  location: "Washington, DC",
  updatedLabel: "Updated September 2026",
  socialLinks: {
    washingtonPost: "",
    github: "https://github.com/cmhac",
    linkedin: "",
    bluesky: "",
  },
};

import { promises as fsPromises } from "fs";
import path from "path";
import {
  getAllProjects,
  getProjectBySlug,
  getProjectsByKind,
} from "../projects";

interface MockProject {
  slug: string;
  title: string;
  description: string;
  kind: "Reporting and analysis" | "Tools and infrastructure";
  date?: string;
  url?: string;
  image?: string;
  content: string;
}

const mockProjects: MockProject[] = [
  {
    slug: "analysis-older",
    title: "Analysis Older",
    description: "Older analysis item",
    kind: "Reporting and analysis",
    date: "2022-01-01",
    content: "Body older",
  },
  {
    slug: "analysis-newer",
    title: "Analysis Newer",
    description: "Newer analysis item",
    kind: "Reporting and analysis",
    date: "2024-05-16",
    url: "https://www.cbsnews.com/example/",
    content: "Body newer",
  },
  {
    slug: "tool-a",
    title: "Tool A",
    description: "A tool",
    kind: "Tools and infrastructure",
    date: "2023-05-30",
    content: "Tool body",
  },
];

const generateMockFileContent = (project: MockProject) => `---
title: ${project.title}
description: ${project.description}
kind: ${project.kind}
${project.date ? `date: ${project.date}` : ""}
${project.url ? `url: ${project.url}` : ""}
---

${project.content}`;

describe("project utils", () => {
  let mockReaddir: jest.SpyInstance;
  let mockReadFile: jest.SpyInstance;

  beforeEach(() => {
    mockReaddir = jest
      .spyOn(fsPromises, "readdir")
      .mockImplementation(() =>
        Promise.resolve(mockProjects.map((p) => `${p.slug}.md`) as any),
      );
    mockReadFile = jest
      .spyOn(fsPromises, "readFile")
      .mockImplementation(async (filePath) => {
        const fileName = path.basename(filePath as string);
        const slug = fileName.replace(".md", "");
        const project = mockProjects.find((p) => p.slug === slug);
        if (!project) throw new Error("File not found");
        return generateMockFileContent(project);
      });
  });

  afterEach(() => {
    mockReaddir.mockRestore();
    mockReadFile.mockRestore();
  });

  describe("getAllProjects", () => {
    it("orders as one ring: analysis first, then tools, each newest first", async () => {
      const projects = await getAllProjects();
      expect(projects.map((p) => p.slug)).toEqual([
        "analysis-newer",
        "analysis-older",
        "tool-a",
      ]);
    });

    it("derives the slug from the filename", async () => {
      const projects = await getAllProjects();
      expect(projects[0].slug).toBe("analysis-newer");
    });

    it("strips a Pages CMS date prefix out of the slug", async () => {
      mockReaddir.mockResolvedValueOnce([
        "2026-09-18-analysis-newer.md",
      ] as any);
      mockReadFile.mockResolvedValueOnce(
        generateMockFileContent(mockProjects[1]),
      );

      const projects = await getAllProjects();
      expect(projects[0].slug).toBe("analysis-newer");
    });

    it("keeps the real published url and image from the entry", async () => {
      const projects = await getAllProjects();
      expect(projects[0].url).toBe("https://www.cbsnews.com/example/");
      expect(projects[1].url).toBeUndefined();
    });

    it("parses the markdown body as content", async () => {
      const projects = await getAllProjects();
      expect(projects[0].content).toBe("Body newer");
    });

    it("sorts an undated entry to the end of its section", async () => {
      mockReaddir.mockResolvedValueOnce([
        "analysis-newer.md",
        "no-date.md",
      ] as any);
      mockReadFile.mockImplementation(async (filePath) => {
        if (String(filePath).endsWith("no-date.md")) {
          return `---\ntitle: No Date\ndescription: Added via the CMS\nkind: Reporting and analysis\n---\n\nBody`;
        }
        return generateMockFileContent(mockProjects[1]);
      });

      const projects = await getAllProjects();
      expect(projects.map((p) => p.slug)).toEqual([
        "analysis-newer",
        "no-date",
      ]);
    });
  });

  describe("getProjectsByKind", () => {
    it("filters to a single kind", async () => {
      const tools = await getProjectsByKind("Tools and infrastructure");
      expect(tools).toHaveLength(1);
      expect(tools[0].slug).toBe("tool-a");
    });
  });

  describe("getProjectBySlug", () => {
    it("returns the project when the slug exists", async () => {
      const project = await getProjectBySlug("analysis-newer");
      expect(project?.title).toBe("Analysis Newer");
      expect(project?.description).toBe("Newer analysis item");
    });

    it("returns null when the slug doesn't exist", async () => {
      const project = await getProjectBySlug("non-existent");
      expect(project).toBeNull();
    });
  });
});

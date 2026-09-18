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
  note: string;
  kind: "Reporting and analysis" | "Tools and infrastructure";
  order: number;
  url?: string;
  cover?: string;
  content: string;
}

const mockProjects: MockProject[] = [
  {
    slug: "analysis-b",
    title: "Analysis B",
    note: "Second analysis item",
    kind: "Reporting and analysis",
    order: 2,
    content: "Body B",
  },
  {
    slug: "analysis-a",
    title: "Analysis A",
    note: "First analysis item",
    kind: "Reporting and analysis",
    order: 1,
    url: "https://example.com/a",
    content: "Body A",
  },
  {
    slug: "tool-a",
    title: "Tool A",
    note: "A tool",
    kind: "Tools and infrastructure",
    order: 1,
    content: "Tool body",
  },
];

const generateMockFileContent = (project: MockProject) => `---
title: ${project.title}
note: ${project.note}
kind: ${project.kind}
order: ${project.order}
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
    it("orders as one ring: analysis by `order`, then tools by `order`", async () => {
      const projects = await getAllProjects();
      expect(projects.map((p) => p.slug)).toEqual([
        "analysis-a",
        "analysis-b",
        "tool-a",
      ]);
    });

    it("derives the slug from the filename", async () => {
      const projects = await getAllProjects();
      expect(projects[0].slug).toBe("analysis-a");
    });

    it("parses the markdown body as content", async () => {
      const projects = await getAllProjects();
      expect(projects[0].content).toBe("Body A");
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
      const project = await getProjectBySlug("analysis-a");
      expect(project?.title).toBe("Analysis A");
      expect(project?.url).toBe("https://example.com/a");
    });

    it("returns null when the slug doesn't exist", async () => {
      const project = await getProjectBySlug("non-existent");
      expect(project).toBeNull();
    });

    it("leaves url undefined when not set", async () => {
      const project = await getProjectBySlug("analysis-b");
      expect(project?.url).toBeUndefined();
    });
  });
});

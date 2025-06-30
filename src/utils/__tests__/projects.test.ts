import { promises as fsPromises } from "fs";
import path from "path";
import {
  getAllProjects,
  getProjectBySlug,
  getHomePageProjects,
  Project,
} from "../projects";

// Mock project data
const mockProjects: Project[] = [
  {
    title: "Featured Project 1",
    description: "A featured project",
    technologies: {
      React: "Frontend framework",
      TypeScript: "Type safety",
    },
    url: "https://example.com/1",
    image: "/image1.jpg",
    featured: true,
    featureRank: 1,
    date: "2024-03-15T00:00:00.000Z",
    content: "# Featured Project 1\n\nContent here",
    slug: "featured-project-1",
  },
  {
    title: "Recent Project 1",
    description: "A recent project",
    technologies: {
      "Node.js": "Backend runtime",
    },
    url: "https://example.com/2",
    image: "/image2.jpg",
    featured: false,
    date: "2024-03-14T00:00:00.000Z",
    content: "# Recent Project 1\n\nContent here",
    slug: "recent-project-1",
  },
  {
    title: "Recent Project 2",
    description: "Another recent project",
    technologies: {
      Python: "Programming language",
    },
    url: "https://example.com/3",
    image: "/image3.jpg",
    featured: false,
    date: "2024-03-13T00:00:00.000Z",
    content: "# Recent Project 2\n\nContent here",
    slug: "recent-project-2",
  },
  {
    title: "Recent Project 3",
    description: "Yet another recent project",
    technologies: {
      Java: "Programming language",
    },
    url: "https://example.com/4",
    image: "/image4.jpg",
    featured: false,
    date: "2024-03-12T00:00:00.000Z",
    content: "# Recent Project 3\n\nContent here",
    slug: "recent-project-3",
  },
];

// Mock file content generator
const generateMockFileContent = (project: Project) => `---
title: ${project.title}
description: ${project.description}
technologies: ${JSON.stringify(project.technologies)}
url: ${project.url}
image: ${project.image}
featured: ${project.featured}
${project.featureRank !== undefined ? `featureRank: ${project.featureRank}` : ""}
date: ${project.date}
---

${project.content}`;

describe("Project Utils", () => {
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
    it("returns all projects sorted by date", async () => {
      const projects = await getAllProjects();
      expect(projects).toHaveLength(mockProjects.length);
      expect(projects[0].title).toBe("Featured Project 1");
      expect(projects[1].title).toBe("Recent Project 1");
    });

    it("handles missing optional fields", async () => {
      // Mock a project file with minimal fields
      mockReadFile.mockResolvedValueOnce(`---
title: Minimal Project
description: A minimal project
---
Content here`);
      mockReaddir.mockResolvedValueOnce(["minimal-project.md"] as any);

      const projects = await getAllProjects();
      expect(projects[0]).toEqual(
        expect.objectContaining({
          title: "Minimal Project",
          description: "A minimal project",
          technologies: {},
          url: "",
          image: "",
          featured: false,
          slug: "minimal-project",
        }),
      );
    });

    it("filters out invalid project files", async () => {
      // Mock an error for one file
      mockReadFile.mockRejectedValueOnce(new Error("Invalid file"));
      const projects = await getAllProjects();
      expect(projects.length).toBeLessThan(mockProjects.length);
    });
  });

  describe("getProjectBySlug", () => {
    it("returns project when slug exists", async () => {
      const project = await getProjectBySlug("featured-project-1");
      expect(project).toEqual(
        expect.objectContaining({
          title: "Featured Project 1",
          slug: "featured-project-1",
        }),
      );
    });

    it("returns null when slug doesn't exist", async () => {
      const project = await getProjectBySlug("non-existent");
      expect(project).toBeNull();
    });

    it("ignores non-markdown files", async () => {
      mockReaddir.mockResolvedValueOnce([
        "featured-project-1.md",
        "not-a-markdown.txt",
      ] as any);

      const project = await getProjectBySlug("not-a-markdown");
      expect(project).toBeNull();
    });
  });

  describe("getHomePageProjects", () => {
    it("returns featured and recent projects", async () => {
      const { featured, recent } = await getHomePageProjects();

      expect(featured).toHaveLength(1);
      expect(featured[0].title).toBe("Featured Project 1");

      expect(recent).toHaveLength(3);
      expect(recent[0].title).toBe("Recent Project 1");
      expect(recent[1].title).toBe("Recent Project 2");
      expect(recent[2].title).toBe("Recent Project 3");
    });

    it("limits recent projects to 3", async () => {
      // Add more non-featured projects to mock data
      const extraProjects: Project[] = Array.from({ length: 5 }, (_, i) => ({
        ...mockProjects[1],
        title: `Extra Project ${i}`,
        slug: `extra-project-${i}`,
        technologies: {
          JavaScript: "Programming language",
        },
        date: new Date(2024, 2, 10 - i).toISOString(),
      }));

      mockReaddir.mockResolvedValueOnce([
        ...mockProjects.map((p) => `${p.slug}.md`),
        ...extraProjects.map((p) => `${p.slug}.md`),
      ] as any);

      const { recent } = await getHomePageProjects();
      expect(recent).toHaveLength(3);
    });

    it("sorts featured projects by featureRank", async () => {
      // Create mock projects with different feature ranks
      const featuredProjects: Project[] = [
        {
          title: "Featured Project A",
          description: "Description A",
          technologies: {
            React: "Frontend framework",
          },
          url: "https://example.com/a",
          image: "/imageA.jpg",
          featured: true,
          featureRank: 3,
          date: "2024-03-15T00:00:00.000Z",
          content: "Content A",
          slug: "featured-project-a",
        },
        {
          title: "Featured Project B",
          description: "Description B",
          technologies: {
            Vue: "Frontend framework",
          },
          url: "https://example.com/b",
          image: "/imageB.jpg",
          featured: true,
          featureRank: 1,
          date: "2024-03-14T00:00:00.000Z",
          content: "Content B",
          slug: "featured-project-b",
        },
        {
          title: "Featured Project C",
          description: "Description C",
          technologies: {
            Angular: "Frontend framework",
          },
          url: "https://example.com/c",
          image: "/imageC.jpg",
          featured: true,
          featureRank: 2,
          date: "2024-03-13T00:00:00.000Z",
          content: "Content C",
          slug: "featured-project-c",
        },
      ];

      mockReaddir.mockResolvedValueOnce(
        featuredProjects.map((p) => `${p.slug}.md`) as any,
      );

      // Mock file reading for featured projects
      mockReadFile.mockImplementation(async (filePath) => {
        const fileName = path.basename(filePath as string);
        const slug = fileName.replace(".md", "");
        const project = featuredProjects.find((p) => p.slug === slug);
        if (!project) throw new Error("File not found");
        return generateMockFileContent(project);
      });

      const { featured } = await getHomePageProjects();
      expect(featured).toHaveLength(3);
      expect(featured[0].title).toBe("Featured Project B"); // featureRank: 1
      expect(featured[1].title).toBe("Featured Project C"); // featureRank: 2
      expect(featured[2].title).toBe("Featured Project A"); // featureRank: 3
    });

    it("handles mixed featured and non-featured projects", async () => {
      const mixedProjects: Project[] = [
        {
          title: "Featured 1",
          description: "Featured project 1",
          technologies: {
            React: "Frontend framework",
          },
          url: "https://example.com/f1",
          image: "/imagef1.jpg",
          featured: true,
          featureRank: 1,
          date: "2024-03-15T00:00:00.000Z",
          content: "Featured content 1",
          slug: "featured-1",
        },
        {
          title: "Regular 1",
          description: "Regular project 1",
          technologies: {
            "Node.js": "Backend runtime",
          },
          url: "https://example.com/r1",
          image: "/imager1.jpg",
          featured: false,
          date: "2024-03-14T00:00:00.000Z",
          content: "Regular content 1",
          slug: "regular-1",
        },
        {
          title: "Featured 2",
          description: "Featured project 2",
          technologies: {
            Python: "Programming language",
          },
          url: "https://example.com/f2",
          image: "/imagef2.jpg",
          featured: true,
          featureRank: 2,
          date: "2024-03-13T00:00:00.000Z",
          content: "Featured content 2",
          slug: "featured-2",
        },
        {
          title: "Regular 2",
          description: "Regular project 2",
          technologies: {
            Java: "Programming language",
          },
          url: "https://example.com/r2",
          image: "/imager2.jpg",
          featured: false,
          date: "2024-03-12T00:00:00.000Z",
          content: "Regular content 2",
          slug: "regular-2",
        },
      ];

      mockReaddir.mockResolvedValueOnce(
        mixedProjects.map((p) => `${p.slug}.md`) as any,
      );

      // Mock file reading for mixed projects
      mockReadFile.mockImplementation(async (filePath) => {
        const fileName = path.basename(filePath as string);
        const slug = fileName.replace(".md", "");
        const project = mixedProjects.find((p) => p.slug === slug);
        if (!project) throw new Error("File not found");
        return generateMockFileContent(project);
      });

      const { featured, recent } = await getHomePageProjects();

      expect(featured).toHaveLength(2);
      expect(featured[0].title).toBe("Featured 1");
      expect(featured[1].title).toBe("Featured 2");

      expect(recent).toHaveLength(2);
      expect(recent[0].title).toBe("Regular 1");
      expect(recent[1].title).toBe("Regular 2");
    });
  });
});

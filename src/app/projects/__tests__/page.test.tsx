import { render, screen } from "@testing-library/react";
import ProjectsPage from "../page";
import { mockProjects } from "@/app/__tests__/test-utils";
import matter from "gray-matter";
import * as fs from "fs/promises";

// Mock fs/promises module
jest.mock("fs/promises", () => ({
  readdir: jest.fn(),
  readFile: jest.fn(),
}));

// Mock gray-matter
jest.mock("gray-matter");

// Mock the projects utility
jest.mock("@/utils/projects", () => ({
  getAllProjects: jest.fn().mockImplementation(async () => mockProjects),
}));

describe("ProjectsPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock fs.readdir to return test files
    (fs.readdir as jest.Mock).mockResolvedValue([
      "test-project.md",
      "second-project.md",
      "third-project.md",
    ]);

    // Mock fs.readFile to return markdown content
    (fs.readFile as jest.Mock).mockImplementation((filePath) => {
      const fileName = filePath.toString().split("/").pop();
      let project;

      switch (fileName) {
        case "test-project.md":
          project = mockProjects[0];
          break;
        case "second-project.md":
          project = mockProjects[1];
          break;
        case "third-project.md":
          project = mockProjects[2];
          break;
        default:
          throw new Error(`Unknown test file: ${fileName}`);
      }

      // Create YAML frontmatter
      const frontmatter = [
        "---",
        `title: ${project.title}`,
        `description: ${project.description}`,
        "technologies:",
        ...project.technologies.map((tech) => `  - ${tech}`),
        `url: ${project.url}`,
        `image: ${project.image}`,
        `featured: ${project.featured}`,
        `date: ${project.date}`,
        "---",
        "",
        project.content,
      ].join("\n");

      return Promise.resolve(frontmatter);
    });

    // Mock gray-matter to properly parse YAML frontmatter
    (matter as unknown as jest.Mock).mockImplementation((content: string) => {
      const parts = content.split("---");
      if (parts.length < 3) {
        throw new Error("Invalid frontmatter format");
      }

      const yamlContent = parts[1].trim();
      const markdownContent = parts[2].trim();

      const data: Record<string, any> = {};
      let currentKey = "";
      let currentArray: string[] = [];

      yamlContent.split("\n").forEach((line) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return;

        if (trimmedLine.startsWith("- ")) {
          currentArray.push(trimmedLine.substring(2));
        } else if (line.startsWith("  - ")) {
          currentArray.push(line.substring(4));
        } else if (line.includes(":")) {
          if (currentKey && currentArray.length > 0) {
            data[currentKey] = currentArray;
            currentArray = [];
          }

          const [key, ...valueParts] = line.split(":");
          const value = valueParts.join(":").trim();
          currentKey = key.trim();

          if (value) {
            if (value === "true") {
              data[currentKey] = true;
            } else if (value === "false") {
              data[currentKey] = false;
            } else {
              data[currentKey] = value;
            }
          }
        }
      });

      // Handle the last array if any
      if (currentKey && currentArray.length > 0) {
        data[currentKey] = currentArray;
      }

      return {
        data,
        content: markdownContent,
      };
    });
  });

  it("renders the page title", async () => {
    render(await ProjectsPage());
    expect(screen.getByText("All Projects")).toBeInTheDocument();
  });

  it("renders project cards for each project", async () => {
    render(await ProjectsPage());

    // Check if all project titles are rendered
    const titles = screen.getAllByRole("heading", { level: 3 });
    expect(titles[0]).toHaveTextContent("Test Project");
    expect(titles[1]).toHaveTextContent("Second Project");
    expect(titles[2]).toHaveTextContent("Third Project");
  });

  it("renders project details correctly", async () => {
    render(await ProjectsPage());

    // Check if project details are rendered
    const descriptions = screen.getAllByText("A test project description");
    expect(descriptions.length).toBeGreaterThan(0);

    // Check if technology tags are rendered
    const reactTags = screen.getAllByText("React");
    const typescriptTags = screen.getAllByText("TypeScript");
    expect(reactTags.length).toBeGreaterThan(0);
    expect(typescriptTags.length).toBeGreaterThan(0);

    // Check if "View Project" links are present
    const links = screen.getAllByText("View Project →");
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute("href", "https://example.com");
  });
});

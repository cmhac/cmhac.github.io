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
  getAllProjects: jest.fn(() => mockProjects),
}));

describe("Projects Page", () => {
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

  it("renders projects page header with terminal styling", async () => {
    render(await ProjectsPage());

    const prompt = screen.getByText("➜");
    expect(prompt).toHaveClass("text-terminal-green");

    const command = screen.getByText("ls");
    expect(command).toHaveClass("text-terminal-purple");

    const path = screen.getByText("~/projects");
    expect(path).toHaveClass("text-terminal-text");
  });

  it("renders all projects in a vertical stack", async () => {
    render(await ProjectsPage());

    const projectCards = screen.getAllByRole("heading", { level: 3 });
    expect(projectCards).toHaveLength(mockProjects.length);

    // Check if projects are rendered in the correct order
    mockProjects.forEach((project, index) => {
      expect(projectCards[index]).toHaveTextContent(project.title);
    });
  });

  it("renders project cards with correct layout", async () => {
    render(await ProjectsPage());

    // Check if project cards have the correct layout classes
    const projectCards = screen
      .getAllByRole("heading", { level: 3 })
      .map((heading) => heading.closest("div.bg-terminal-selection\\/30"));

    projectCards.forEach((card) => {
      expect(card).toHaveClass(
        "bg-terminal-selection/30",
        "backdrop-blur-sm",
        "rounded-lg",
        "p-6",
      );
    });

    // Check if there's proper spacing between cards
    const cardContainer = screen
      .getAllByRole("heading", { level: 3 })[0]
      .closest("section")
      ?.querySelector("div.flex");
    expect(cardContainer).toHaveClass("flex", "flex-col", "space-y-8");
  });

  it("renders project links with terminal styling", async () => {
    render(await ProjectsPage());

    // Check if terminal-style project links are present
    const links = screen.getAllByText("➜ explore_project");
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute("href", "https://example.com");
  });

  it("renders project dates with terminal styling", async () => {
    render(await ProjectsPage());

    const dates = screen.getAllByText(/\d{1,2}\/\d{1,2}\/\d{4}/);
    expect(dates).toHaveLength(3);
    dates.forEach((date) => {
      expect(date).toHaveClass("text-terminal-comment", "font-mono");
    });
  });
});

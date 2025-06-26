import { render, screen } from "@testing-library/react";
import ProjectsPage from "../page";
import { mockProject } from "@/app/__tests__/mockData";

// Mock the project utilities
const mockProjects = [
  {
    ...mockProject,
    title: "Project 1",
    description: "First test project description",
    slug: "project-1",
  },
  {
    ...mockProject,
    title: "Project 2",
    description: "Second test project description",
    slug: "project-2",
  },
  {
    ...mockProject,
    title: "Project 3",
    description: "Third test project description",
    slug: "project-3",
  },
];

jest.mock("@/utils/projects", () => {
  return {
    getAllProjects: () => Promise.resolve(mockProjects),
  };
});

describe("Projects Page", () => {
  it("renders page title with terminal styling", async () => {
    render(await ProjectsPage());

    const title = screen.getByText("projects");
    expect(title).toHaveClass("text-terminal-purple");

    const prompt = screen.getByText("➜");
    expect(prompt).toHaveClass("text-terminal-green");
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
    const links = screen.getAllByText("➜ explore project");
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute("href", "/projects/project-1");
  });

  it("renders project dates with terminal styling", async () => {
    render(await ProjectsPage());

    const dates = screen.getAllByText(/\d{1,2}\/\d{1,2}\/\d{4}/);
    expect(dates).toHaveLength(3);
    dates.forEach((date) => {
      expect(date).toHaveClass("text-terminal-comment", "font-mono");
    });
  });

  it("renders project technologies with terminal styling", async () => {
    render(await ProjectsPage());

    mockProjects.forEach((project) => {
      project.technologies.forEach((tech) => {
        const techTags = screen.getAllByText(tech);
        techTags.forEach((tag) => {
          expect(tag).toHaveClass(
            "bg-terminal-selection/50",
            "text-terminal-cyan",
            "font-mono",
          );
        });
      });
    });
  });

  it("renders project descriptions with correct styling", async () => {
    render(await ProjectsPage());

    mockProjects.forEach((project) => {
      const description = screen.getByText(project.description);
      expect(description).toHaveClass("text-terminal-text/80");
    });
  });

  it("renders project images with correct layout", async () => {
    render(await ProjectsPage());

    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(mockProjects.length);

    images.forEach((image) => {
      expect(image).toHaveClass(
        "object-cover",
        "transition-transform",
        "duration-500",
        "hover:scale-110",
      );
    });
  });
});

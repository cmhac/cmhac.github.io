import { render, screen } from "@testing-library/react";
import ProjectsPage from "../page";
import { mockProject } from "@/app/__tests__/test-utils";

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

  it("renders search box with correct placeholder and styling", async () => {
    render(await ProjectsPage());

    const searchInput = screen.getByPlaceholderText("search projects...");
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveClass(
      "w-full",
      "px-3",
      "py-2",
      "bg-terminal-selection/30",
      "border",
      "border-terminal-selection",
      "rounded-lg",
      "text-terminal-text",
      "font-mono",
      "text-sm",
      "focus:outline-none",
      "focus:border-terminal-purple",
      "focus:bg-terminal-selection/50",
      "transition-colors",
    );
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

  it("renders project cards with correct layout and interaction states", async () => {
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
        "transition-all",
        "duration-300",
        "hover:bg-terminal-selection/50",
        "hover:border-terminal-purple/50",
      );
    });

    // Check if there's proper spacing between cards
    const cardContainer = screen.getByTestId("projects-list");
    expect(cardContainer).toHaveClass("flex", "flex-col", "space-y-8");
  });

  it("renders clickable project cards with correct links", async () => {
    render(await ProjectsPage());

    // Check if project cards are wrapped in links
    const projectLinks = screen.getAllByRole("link");
    expect(projectLinks).toHaveLength(mockProjects.length);

    projectLinks.forEach((link, index) => {
      expect(link).toHaveAttribute(
        "href",
        `/projects/${mockProjects[index].slug}`,
      );
      expect(link).toHaveClass("block");
    });
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
          if (tag.tagName === "BUTTON") {
            expect(tag).toHaveClass(
              "bg-terminal-selection/50",
              "text-terminal-text/80",
              "font-mono",
            );
          } else {
            expect(tag).toHaveClass(
              "bg-terminal-selection/50",
              "text-terminal-cyan",
              "font-mono",
            );
          }
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

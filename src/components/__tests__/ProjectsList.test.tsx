import { render, screen, fireEvent } from "@testing-library/react";
import ProjectsList from "../ProjectsList";
import { mockProjects } from "@/app/__tests__/test-utils";

describe("ProjectsList", () => {
  it("renders all projects initially", () => {
    render(<ProjectsList projects={mockProjects} />);

    mockProjects.forEach((project) => {
      expect(screen.getByText(project.title)).toBeInTheDocument();
    });
  });

  it("filters projects by technology", () => {
    render(<ProjectsList projects={mockProjects} />);

    // Click on a technology filter
    const filterButtons = screen.getAllByRole("button");
    const reactButton = filterButtons.find(
      (button) => button.textContent === "React",
    );
    if (!reactButton) throw new Error("React button not found");
    fireEvent.click(reactButton);

    // Should only show projects with React
    mockProjects.forEach((project) => {
      if (project.technologies.includes("React")) {
        expect(screen.getByText(project.title)).toBeInTheDocument();
      } else {
        expect(screen.queryByText(project.title)).not.toBeInTheDocument();
      }
    });
  });

  it("shows all projects when 'all' is clicked", () => {
    render(<ProjectsList projects={mockProjects} />);

    // First filter by technology
    const filterButtons = screen.getAllByRole("button");
    const reactButton = filterButtons.find(
      (button) => button.textContent === "React",
    );
    if (!reactButton) throw new Error("React button not found");
    fireEvent.click(reactButton);

    // Then click 'all'
    const allButton = filterButtons.find(
      (button) => button.textContent === "all",
    );
    if (!allButton) throw new Error("All button not found");
    fireEvent.click(allButton);

    // Should show all projects again
    mockProjects.forEach((project) => {
      expect(screen.getByText(project.title)).toBeInTheDocument();
    });
  });

  it("displays unique technologies in filter", () => {
    const projectsWithDuplicateTech = [
      ...mockProjects,
      {
        ...mockProjects[0],
        title: "Another React Project",
      },
    ];

    render(<ProjectsList projects={projectsWithDuplicateTech} />);

    // Each technology should appear only once in the filter
    const filterButtons = screen.getAllByRole("button");
    const reactButtons = filterButtons.filter(
      (button) => button.textContent === "React",
    );
    expect(reactButtons).toHaveLength(1);
  });

  it("sorts technologies by frequency then alphabetically", () => {
    const projectsWithVaryingTechFrequency = [
      {
        ...mockProjects[0],
        title: "Project 1",
        technologies: ["React", "TypeScript", "Node.js"],
      },
      {
        ...mockProjects[0],
        title: "Project 2",
        technologies: ["React", "TypeScript", "Angular"],
      },
      {
        ...mockProjects[0],
        title: "Project 3",
        technologies: ["React", "Vue", "Angular"],
      },
    ];

    render(<ProjectsList projects={projectsWithVaryingTechFrequency} />);

    // Get all technology buttons (excluding 'all')
    const techButtons = screen
      .getAllByRole("button")
      .filter((button) => button.textContent !== "all")
      .map((button) => button.textContent);

    // Expected order:
    // React (3 occurrences)
    // Angular, TypeScript (2 occurrences each, alphabetical)
    // Node.js, Vue (1 occurrence each, alphabetical)
    expect(techButtons).toEqual([
      "React",
      "Angular",
      "TypeScript",
      "Node.js",
      "Vue",
    ]);
  });
});

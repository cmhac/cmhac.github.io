import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
    const reactButton = filterButtons.find((button) =>
      button.textContent?.includes("React"),
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
    const reactButton = filterButtons.find((button) =>
      button.textContent?.includes("React"),
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
    const reactButtons = filterButtons.filter((button) =>
      button.textContent?.includes("React"),
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
      "React (3)",
      "Angular (2)",
      "TypeScript (2)",
      "Node.js (1)",
      "Vue (1)",
    ]);
  });

  it("filters projects by search query in title", async () => {
    const user = userEvent.setup();
    const searchableProjects = [
      {
        ...mockProjects[0],
        title: "React Dashboard",
        description: "A dashboard app",
        technologies: ["React", "TypeScript"],
      },
      {
        ...mockProjects[0],
        title: "Vue Components",
        description: "Component library",
        technologies: ["Vue", "JavaScript"],
      },
      {
        ...mockProjects[0],
        title: "Angular Forms",
        description: "Form validation",
        technologies: ["Angular", "TypeScript"],
      },
    ];

    render(<ProjectsList projects={searchableProjects} />);

    const searchInput = screen.getByPlaceholderText("search projects...");

    await act(async () => {
      await user.type(searchInput, "React");
    });

    // Should only show projects with "React" in title
    expect(screen.getByText("React Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Vue Components")).not.toBeInTheDocument();
    expect(screen.queryByText("Angular Forms")).not.toBeInTheDocument();
  });

  it("filters projects by search query in description", async () => {
    const user = userEvent.setup();
    const searchableProjects = [
      {
        ...mockProjects[0],
        title: "Project A",
        description: "A React dashboard application",
        technologies: ["React", "TypeScript"],
      },
      {
        ...mockProjects[0],
        title: "Project B",
        description: "Vue component library",
        technologies: ["Vue", "JavaScript"],
      },
      {
        ...mockProjects[0],
        title: "Project C",
        description: "Angular form builder",
        technologies: ["Angular", "TypeScript"],
      },
    ];

    render(<ProjectsList projects={searchableProjects} />);

    const searchInput = screen.getByPlaceholderText("search projects...");

    await act(async () => {
      await user.type(searchInput, "dashboard");
    });

    // Should only show projects with "dashboard" in description
    expect(screen.getByText("Project A")).toBeInTheDocument();
    expect(screen.queryByText("Project B")).not.toBeInTheDocument();
    expect(screen.queryByText("Project C")).not.toBeInTheDocument();
  });

  it("filters projects by search query in technologies", async () => {
    const user = userEvent.setup();
    const searchableProjects = [
      {
        ...mockProjects[0],
        title: "Project A",
        technologies: ["React", "TypeScript"],
      },
      {
        ...mockProjects[0],
        title: "Project B",
        technologies: ["Vue", "JavaScript"],
      },
      {
        ...mockProjects[0],
        title: "Project C",
        technologies: ["Angular", "TypeScript"],
      },
    ];

    render(<ProjectsList projects={searchableProjects} />);

    const searchInput = screen.getByPlaceholderText("search projects...");

    await act(async () => {
      await user.type(searchInput, "Vue");
    });

    // Should only show projects with "Vue" in technologies
    expect(screen.queryByText("Project A")).not.toBeInTheDocument();
    expect(screen.getByText("Project B")).toBeInTheDocument();
    expect(screen.queryByText("Project C")).not.toBeInTheDocument();
  });

  it("shows all projects when search query is cleared", async () => {
    const user = userEvent.setup();
    const searchableProjects = [
      {
        ...mockProjects[0],
        title: "React Dashboard",
        technologies: ["React", "TypeScript"],
      },
      {
        ...mockProjects[0],
        title: "Vue Components",
        technologies: ["Vue", "JavaScript"],
      },
    ];

    render(<ProjectsList projects={searchableProjects} />);

    const searchInput = screen.getByPlaceholderText("search projects...");

    // Type search query
    await act(async () => {
      await user.type(searchInput, "React");
    });
    expect(screen.getByText("React Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Vue Components")).not.toBeInTheDocument();

    // Clear search query
    await act(async () => {
      await user.clear(searchInput);
    });

    // Should show all projects again
    expect(screen.getByText("React Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Vue Components")).toBeInTheDocument();
  });

  it("search is case insensitive", async () => {
    const user = userEvent.setup();
    const searchableProjects = [
      {
        ...mockProjects[0],
        title: "React Dashboard",
        technologies: ["React", "TypeScript"],
      },
      {
        ...mockProjects[0],
        title: "Vue Components",
        technologies: ["Vue", "JavaScript"],
      },
    ];

    render(<ProjectsList projects={searchableProjects} />);

    const searchInput = screen.getByPlaceholderText("search projects...");

    await act(async () => {
      await user.type(searchInput, "react");
    });

    // Should match "React" even though search is lowercase
    expect(screen.getByText("React Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Vue Components")).not.toBeInTheDocument();
  });

  it("combines search and technology filters", async () => {
    const user = userEvent.setup();
    const searchableProjects = [
      {
        ...mockProjects[0],
        title: "React Dashboard",
        technologies: ["React", "TypeScript"],
      },
      {
        ...mockProjects[0],
        title: "React App",
        technologies: ["React", "JavaScript"],
      },
      {
        ...mockProjects[0],
        title: "Vue Dashboard",
        technologies: ["Vue", "TypeScript"],
      },
    ];

    render(<ProjectsList projects={searchableProjects} />);

    // First apply search filter
    const searchInput = screen.getByPlaceholderText("search projects...");

    await act(async () => {
      await user.type(searchInput, "Dashboard");
    });

    // Should show both dashboard projects
    expect(screen.getByText("React Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("React App")).not.toBeInTheDocument();
    expect(screen.getByText("Vue Dashboard")).toBeInTheDocument();

    // Then apply technology filter
    const filterButtons = screen.getAllByRole("button");
    const reactButton = filterButtons.find((button) =>
      button.textContent?.includes("React"),
    );
    if (!reactButton) throw new Error("React button not found");
    fireEvent.click(reactButton);

    // Should only show React Dashboard (both filters applied)
    expect(screen.getByText("React Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Vue Dashboard")).not.toBeInTheDocument();
  });
});

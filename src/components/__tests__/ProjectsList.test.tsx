import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProjectsList from "../ProjectsList";
import { Project } from "@/utils/projects";

describe("ProjectsList", () => {
  const mockProjects: Project[] = [
    {
      title: "Project 1",
      description: "Description 1",
      technologies: {
        React: "Frontend framework",
        TypeScript: "Type safety",
      },
      url: "https://example.com/1",
      image: "/image1.jpg",
      featured: true,
      date: "2024-01-01",
      content: "Content 1",
      slug: "project-1",
    },
    {
      title: "Project 2",
      description: "Description 2",
      technologies: {
        Vue: "Frontend framework",
        JavaScript: "Programming language",
      },
      url: "https://example.com/2",
      image: "/image2.jpg",
      featured: false,
      date: "2024-01-02",
      content: "Content 2",
      slug: "project-2",
    },
    {
      title: "Project 3",
      description: "Description 3",
      technologies: {
        Angular: "Frontend framework",
        TypeScript: "Type safety",
      },
      url: "https://example.com/3",
      image: "/image3.jpg",
      featured: false,
      date: "2024-01-03",
      content: "Content 3",
      slug: "project-3",
    },
  ];

  beforeEach(() => {
    // Reset any state between tests
    jest.clearAllMocks();
  });

  it("renders all projects initially", () => {
    render(<ProjectsList projects={mockProjects} />);

    mockProjects.forEach((project) => {
      expect(screen.getByText(project.title)).toBeInTheDocument();
    });
  });

  it("displays unique technologies in filter", () => {
    render(<ProjectsList projects={mockProjects} />);

    // Check that the technology filter displays the correct unique technologies
    expect(screen.getByText("React (1)")).toBeInTheDocument();
    expect(screen.getByText("TypeScript (2)")).toBeInTheDocument();
    expect(screen.getByText("Vue (1)")).toBeInTheDocument();
    expect(screen.getByText("Angular (1)")).toBeInTheDocument();
    expect(screen.getByText("JavaScript (1)")).toBeInTheDocument();
  });

  it("sorts technologies by frequency then alphabetically", () => {
    const projectsWithVaryingTechFrequency: Project[] = [
      {
        title: "Project 1",
        description: "Description 1",
        technologies: {
          React: "Frontend framework",
          TypeScript: "Type safety",
          "Node.js": "Backend runtime",
        },
        url: "https://example.com/1",
        image: "/image1.jpg",
        featured: true,
        date: "2024-01-01",
        content: "Content 1",
        slug: "project-1",
      },
      {
        title: "Project 2",
        description: "Description 2",
        technologies: {
          React: "Frontend framework",
          TypeScript: "Type safety",
          Angular: "Frontend framework",
        },
        url: "https://example.com/2",
        image: "/image2.jpg",
        featured: false,
        date: "2024-01-02",
        content: "Content 2",
        slug: "project-2",
      },
      {
        title: "Project 3",
        description: "Description 3",
        technologies: {
          React: "Frontend framework",
          Vue: "Frontend framework",
          Angular: "Frontend framework",
        },
        url: "https://example.com/3",
        image: "/image3.jpg",
        featured: false,
        date: "2024-01-03",
        content: "Content 3",
        slug: "project-3",
      },
    ];

    render(<ProjectsList projects={projectsWithVaryingTechFrequency} />);

    const techButtons = Array.from(
      screen
        .getAllByRole("button")
        .filter((button) => button.textContent?.includes("("))
        .map((button) => button.textContent || ""),
    );

    // Expected order: React (3), Angular (2), TypeScript (2), Node.js (1), Vue (1)
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
    const searchableProjects: Project[] = [
      {
        title: "React Dashboard",
        description: "A dashboard app",
        technologies: {
          React: "Frontend framework",
          TypeScript: "Type safety",
        },
        url: "https://example.com/1",
        image: "/image1.jpg",
        featured: true,
        date: "2024-01-01",
        content: "Content 1",
        slug: "react-dashboard",
      },
      {
        title: "Vue Components",
        description: "Component library",
        technologies: {
          Vue: "Frontend framework",
          JavaScript: "Programming language",
        },
        url: "https://example.com/2",
        image: "/image2.jpg",
        featured: false,
        date: "2024-01-02",
        content: "Content 2",
        slug: "vue-components",
      },
      {
        title: "Angular Forms",
        description: "Form validation",
        technologies: {
          Angular: "Frontend framework",
          TypeScript: "Type safety",
        },
        url: "https://example.com/3",
        image: "/image3.jpg",
        featured: false,
        date: "2024-01-03",
        content: "Content 3",
        slug: "angular-forms",
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
    const searchableProjects: Project[] = [
      {
        title: "Project A",
        description: "A React dashboard application",
        technologies: {
          React: "Frontend framework",
          TypeScript: "Type safety",
        },
        url: "https://example.com/1",
        image: "/image1.jpg",
        featured: true,
        date: "2024-01-01",
        content: "Content 1",
        slug: "project-a",
      },
      {
        title: "Project B",
        description: "Vue component library",
        technologies: {
          Vue: "Frontend framework",
          JavaScript: "Programming language",
        },
        url: "https://example.com/2",
        image: "/image2.jpg",
        featured: false,
        date: "2024-01-02",
        content: "Content 2",
        slug: "project-b",
      },
      {
        title: "Project C",
        description: "Angular form builder",
        technologies: {
          Angular: "Frontend framework",
          TypeScript: "Type safety",
        },
        url: "https://example.com/3",
        image: "/image3.jpg",
        featured: false,
        date: "2024-01-03",
        content: "Content 3",
        slug: "project-c",
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
    const searchableProjects: Project[] = [
      {
        title: "Project A",
        description: "Description A",
        technologies: {
          React: "Frontend framework",
          TypeScript: "Type safety",
        },
        url: "https://example.com/1",
        image: "/image1.jpg",
        featured: true,
        date: "2024-01-01",
        content: "Content 1",
        slug: "project-a",
      },
      {
        title: "Project B",
        description: "Description B",
        technologies: {
          Vue: "Frontend framework",
          JavaScript: "Programming language",
        },
        url: "https://example.com/2",
        image: "/image2.jpg",
        featured: false,
        date: "2024-01-02",
        content: "Content 2",
        slug: "project-b",
      },
      {
        title: "Project C",
        description: "Description C",
        technologies: {
          Angular: "Frontend framework",
          TypeScript: "Type safety",
        },
        url: "https://example.com/3",
        image: "/image3.jpg",
        featured: false,
        date: "2024-01-03",
        content: "Content 3",
        slug: "project-c",
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
    const searchableProjects: Project[] = [
      {
        title: "React Dashboard",
        description: "Description 1",
        technologies: {
          React: "Frontend framework",
          TypeScript: "Type safety",
        },
        url: "https://example.com/1",
        image: "/image1.jpg",
        featured: true,
        date: "2024-01-01",
        content: "Content 1",
        slug: "react-dashboard",
      },
      {
        title: "Vue Components",
        description: "Description 2",
        technologies: {
          Vue: "Frontend framework",
          JavaScript: "Programming language",
        },
        url: "https://example.com/2",
        image: "/image2.jpg",
        featured: false,
        date: "2024-01-02",
        content: "Content 2",
        slug: "vue-components",
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
    const searchableProjects: Project[] = [
      {
        title: "React Dashboard",
        description: "Description 1",
        technologies: {
          React: "Frontend framework",
          TypeScript: "Type safety",
        },
        url: "https://example.com/1",
        image: "/image1.jpg",
        featured: true,
        date: "2024-01-01",
        content: "Content 1",
        slug: "react-dashboard",
      },
      {
        title: "Vue Components",
        description: "Description 2",
        technologies: {
          Vue: "Frontend framework",
          JavaScript: "Programming language",
        },
        url: "https://example.com/2",
        image: "/image2.jpg",
        featured: false,
        date: "2024-01-02",
        content: "Content 2",
        slug: "vue-components",
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
    const searchableProjects: Project[] = [
      {
        title: "React Dashboard",
        description: "Description 1",
        technologies: {
          React: "Frontend framework",
          TypeScript: "Type safety",
        },
        url: "https://example.com/1",
        image: "/image1.jpg",
        featured: true,
        date: "2024-01-01",
        content: "Content 1",
        slug: "react-dashboard",
      },
      {
        title: "React App",
        description: "Description 2",
        technologies: {
          React: "Frontend framework",
          JavaScript: "Programming language",
        },
        url: "https://example.com/2",
        image: "/image2.jpg",
        featured: false,
        date: "2024-01-02",
        content: "Content 2",
        slug: "react-app",
      },
      {
        title: "Vue Dashboard",
        description: "Description 3",
        technologies: {
          Vue: "Frontend framework",
          TypeScript: "Type safety",
        },
        url: "https://example.com/3",
        image: "/image3.jpg",
        featured: false,
        date: "2024-01-03",
        content: "Content 3",
        slug: "vue-dashboard",
      },
    ];

    render(<ProjectsList projects={searchableProjects} />);

    // First filter by technology
    const techButtons = screen.getAllByRole("button");
    const reactButton = techButtons.find((button) =>
      button.textContent?.includes("React"),
    );
    if (!reactButton) throw new Error("React button not found");

    await act(async () => {
      await user.click(reactButton);
    });

    // Should show both React projects
    expect(screen.getByText("React Dashboard")).toBeInTheDocument();
    expect(screen.getByText("React App")).toBeInTheDocument();
    expect(screen.queryByText("Vue Dashboard")).not.toBeInTheDocument();

    // Then add search filter
    const searchInput = screen.getByPlaceholderText("search projects...");
    await act(async () => {
      await user.type(searchInput, "Dashboard");
    });

    // Should only show React Dashboard (matches both React tech and Dashboard search)
    expect(screen.getByText("React Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("React App")).not.toBeInTheDocument();
    expect(screen.queryByText("Vue Dashboard")).not.toBeInTheDocument();
  });

  it("filters by selected technology correctly", async () => {
    const user = userEvent.setup();
    render(<ProjectsList projects={mockProjects} />);

    const filterButtons = screen.getAllByRole("button");
    const reactButton = filterButtons.find((button) =>
      button.textContent?.includes("React"),
    );
    if (!reactButton) throw new Error("React button not found");

    await act(async () => {
      await user.click(reactButton);
    });

    // Should only show projects with React
    mockProjects.forEach((project) => {
      if ("React" in project.technologies) {
        expect(screen.getByText(project.title)).toBeInTheDocument();
      } else {
        expect(screen.queryByText(project.title)).not.toBeInTheDocument();
      }
    });
  });

  it("shows all projects when 'all' filter is selected", async () => {
    const user = userEvent.setup();
    render(<ProjectsList projects={mockProjects} />);

    const filterButtons = screen.getAllByRole("button");
    const reactButton = filterButtons.find((button) =>
      button.textContent?.includes("React"),
    );
    if (!reactButton) throw new Error("React button not found");

    await act(async () => {
      await user.click(reactButton);
    });

    // Then click 'all'
    const allButton = filterButtons.find(
      (button) => button.textContent === "all",
    );
    if (!allButton) throw new Error("All button not found");

    await act(async () => {
      await user.click(allButton);
    });

    // Should show all projects
    mockProjects.forEach((project) => {
      expect(screen.getByText(project.title)).toBeInTheDocument();
    });
  });

  it("displays correct technology count", () => {
    render(<ProjectsList projects={mockProjects} />);

    const filterButtons = screen.getAllByRole("button");
    const reactButtons = filterButtons.filter((button) =>
      button.textContent?.includes("React"),
    );
    expect(reactButtons).toHaveLength(1);

    const reactButton = reactButtons[0];
    expect(reactButton.textContent).toBe("React (1)");
  });
});

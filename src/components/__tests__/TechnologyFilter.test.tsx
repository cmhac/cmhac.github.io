import { render, screen, fireEvent } from "@testing-library/react";
import TechnologyFilter from "../TechnologyFilter";

describe("TechnologyFilter", () => {
  type MockTechnology =
    | "React"
    | "TypeScript"
    | "Node.js"
    | "Vue"
    | "Angular"
    | "Python"
    | "JavaScript"
    | "Next.js"
    | "Express"
    | "MongoDB"
    | "PostgreSQL"
    | "GraphQL";
  const mockTechnologies: MockTechnology[] = [
    "React",
    "TypeScript",
    "Node.js",
    "Vue",
    "Angular",
    "Python",
    "JavaScript",
    "Next.js",
    "Express",
    "MongoDB",
    "PostgreSQL",
    "GraphQL",
  ];
  const mockTechnologyCounts: Record<MockTechnology, number> = {
    React: 12,
    TypeScript: 11,
    "Node.js": 10,
    Vue: 9,
    Angular: 8,
    Python: 7,
    JavaScript: 6,
    "Next.js": 5,
    Express: 4,
    MongoDB: 3,
    PostgreSQL: 2,
    GraphQL: 1,
  };
  const mockOnTechnologySelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders header and filter buttons with correct layout", () => {
    render(
      <TechnologyFilter
        technologies={mockTechnologies}
        technologyCounts={mockTechnologyCounts}
        selectedTechnology={null}
        onTechnologySelect={mockOnTechnologySelect}
      />,
    );

    // Check header
    const header = screen.getByText("filter by tool or technique");
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass("text-sm", "font-mono", "text-terminal-comment");

    // Check filter container
    const filterContainer = screen.getByRole("button", {
      name: "all",
    }).parentElement;
    expect(filterContainer).toHaveClass("flex", "flex-wrap", "gap-2");

    // Check buttons with counts - should show all button + first 10 technologies + show more button
    expect(screen.getByText("all")).toBeInTheDocument();

    // Should show first 10 technologies when there are more than 10
    const visibleTechnologies = mockTechnologies.slice(0, 10);
    visibleTechnologies.forEach((tech) => {
      expect(
        screen.getByText(`${tech} (${mockTechnologyCounts[tech]})`),
      ).toBeInTheDocument();
    });

    // Should not show technologies beyond the first 10
    const hiddenTechnologies = mockTechnologies.slice(10);
    hiddenTechnologies.forEach((tech) => {
      expect(
        screen.queryByText(`${tech} (${mockTechnologyCounts[tech]})`),
      ).not.toBeInTheDocument();
    });

    // Should show the "show more" button
    expect(screen.getByText("show more")).toBeInTheDocument();
  });

  it("highlights selected technology", () => {
    render(
      <TechnologyFilter
        technologies={mockTechnologies}
        technologyCounts={mockTechnologyCounts}
        selectedTechnology="React"
        onTechnologySelect={mockOnTechnologySelect}
      />,
    );

    const selectedButton = screen.getByText("React (12)");
    expect(selectedButton).toHaveClass(
      "bg-terminal-purple",
      "text-terminal-text",
    );

    const unselectedButton = screen.getByText("TypeScript (11)");
    expect(unselectedButton).toHaveClass(
      "bg-terminal-selection/50",
      "text-terminal-text/80",
    );
  });

  it("calls onTechnologySelect when a technology is clicked", () => {
    render(
      <TechnologyFilter
        technologies={mockTechnologies}
        technologyCounts={mockTechnologyCounts}
        selectedTechnology={null}
        onTechnologySelect={mockOnTechnologySelect}
      />,
    );

    fireEvent.click(screen.getByText("React (12)"));
    expect(mockOnTechnologySelect).toHaveBeenCalledWith("React");
  });

  it("calls onTechnologySelect with null when 'all' is clicked", () => {
    render(
      <TechnologyFilter
        technologies={mockTechnologies}
        technologyCounts={mockTechnologyCounts}
        selectedTechnology="React"
        onTechnologySelect={mockOnTechnologySelect}
      />,
    );

    fireEvent.click(screen.getByText("all"));
    expect(mockOnTechnologySelect).toHaveBeenCalledWith(null);
  });

  it("shows only 10 technologies initially when there are more than 10", () => {
    render(
      <TechnologyFilter
        technologies={mockTechnologies}
        technologyCounts={mockTechnologyCounts}
        selectedTechnology={null}
        onTechnologySelect={mockOnTechnologySelect}
      />,
    );

    // Should show 'all' button + first 10 technologies + 'show more' button
    const buttons = screen.getAllByRole("button");
    const techButtons = buttons.filter(
      (button) =>
        button.textContent !== "all" &&
        button.textContent !== "show more" &&
        button.textContent !== "show less",
    );

    expect(techButtons).toHaveLength(10);
    expect(screen.getByText("show more")).toBeInTheDocument();
    expect(screen.queryByText("show less")).not.toBeInTheDocument();
  });

  it("shows all technologies when 'show more' is clicked", () => {
    render(
      <TechnologyFilter
        technologies={mockTechnologies}
        technologyCounts={mockTechnologyCounts}
        selectedTechnology={null}
        onTechnologySelect={mockOnTechnologySelect}
      />,
    );

    fireEvent.click(screen.getByText("show more"));

    // Should now show all technologies + 'show less' button
    const buttons = screen.getAllByRole("button");
    const techButtons = buttons.filter(
      (button) =>
        button.textContent !== "all" &&
        button.textContent !== "show more" &&
        button.textContent !== "show less",
    );

    expect(techButtons).toHaveLength(mockTechnologies.length);
    expect(screen.getByText("show less")).toBeInTheDocument();
    expect(screen.queryByText("show more")).not.toBeInTheDocument();
  });

  it("shows only 10 technologies when 'show less' is clicked", () => {
    render(
      <TechnologyFilter
        technologies={mockTechnologies}
        technologyCounts={mockTechnologyCounts}
        selectedTechnology={null}
        onTechnologySelect={mockOnTechnologySelect}
      />,
    );

    // First expand to show all
    fireEvent.click(screen.getByText("show more"));

    // Then collapse back to 10
    fireEvent.click(screen.getByText("show less"));

    const buttons = screen.getAllByRole("button");
    const techButtons = buttons.filter(
      (button) =>
        button.textContent !== "all" &&
        button.textContent !== "show more" &&
        button.textContent !== "show less",
    );

    expect(techButtons).toHaveLength(10);
    expect(screen.getByText("show more")).toBeInTheDocument();
    expect(screen.queryByText("show less")).not.toBeInTheDocument();
  });

  it("does not show toggle button when there are 10 or fewer technologies", () => {
    const fewTechnologies = mockTechnologies.slice(0, 8);
    const fewTechnologyCounts = Object.fromEntries(
      fewTechnologies.map((tech) => [tech, mockTechnologyCounts[tech]]),
    ) as Record<MockTechnology, number>;

    render(
      <TechnologyFilter
        technologies={fewTechnologies}
        technologyCounts={fewTechnologyCounts}
        selectedTechnology={null}
        onTechnologySelect={mockOnTechnologySelect}
      />,
    );

    expect(screen.queryByText("show more")).not.toBeInTheDocument();
    expect(screen.queryByText("show less")).not.toBeInTheDocument();
  });
});

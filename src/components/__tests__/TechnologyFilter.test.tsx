import { render, screen, fireEvent } from "@testing-library/react";
import TechnologyFilter from "../TechnologyFilter";

describe("TechnologyFilter", () => {
  type MockTechnology = "React" | "TypeScript" | "Node.js";
  const mockTechnologies: MockTechnology[] = ["React", "TypeScript", "Node.js"];
  const mockTechnologyCounts: Record<MockTechnology, number> = {
    React: 3,
    TypeScript: 2,
    "Node.js": 1,
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

    // Check buttons with counts
    expect(screen.getByText("all")).toBeInTheDocument();
    mockTechnologies.forEach((tech) => {
      expect(
        screen.getByText(`${tech} (${mockTechnologyCounts[tech]})`),
      ).toBeInTheDocument();
    });
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

    const selectedButton = screen.getByText("React (3)");
    expect(selectedButton).toHaveClass(
      "bg-terminal-purple",
      "text-terminal-text",
    );

    const unselectedButton = screen.getByText("TypeScript (2)");
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

    fireEvent.click(screen.getByText("React (3)"));
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
});

import { render, screen, fireEvent } from "@testing-library/react";
import TechnologyFilter from "../TechnologyFilter";

describe("TechnologyFilter", () => {
  const mockTechnologies = ["React", "TypeScript", "Node.js"];
  const mockOnTechnologySelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all technologies and 'all' button", () => {
    render(
      <TechnologyFilter
        technologies={mockTechnologies}
        selectedTechnology={null}
        onTechnologySelect={mockOnTechnologySelect}
      />,
    );

    expect(screen.getByText("all")).toBeInTheDocument();
    mockTechnologies.forEach((tech) => {
      expect(screen.getByText(tech)).toBeInTheDocument();
    });
  });

  it("highlights selected technology", () => {
    render(
      <TechnologyFilter
        technologies={mockTechnologies}
        selectedTechnology="React"
        onTechnologySelect={mockOnTechnologySelect}
      />,
    );

    const selectedButton = screen.getByText("React");
    expect(selectedButton).toHaveClass(
      "bg-terminal-purple",
      "text-terminal-text",
    );

    const unselectedButton = screen.getByText("TypeScript");
    expect(unselectedButton).toHaveClass(
      "bg-terminal-selection/50",
      "text-terminal-text/80",
    );
  });

  it("calls onTechnologySelect when a technology is clicked", () => {
    render(
      <TechnologyFilter
        technologies={mockTechnologies}
        selectedTechnology={null}
        onTechnologySelect={mockOnTechnologySelect}
      />,
    );

    fireEvent.click(screen.getByText("React"));
    expect(mockOnTechnologySelect).toHaveBeenCalledWith("React");
  });

  it("calls onTechnologySelect with null when 'all' is clicked", () => {
    render(
      <TechnologyFilter
        technologies={mockTechnologies}
        selectedTechnology="React"
        onTechnologySelect={mockOnTechnologySelect}
      />,
    );

    fireEvent.click(screen.getByText("all"));
    expect(mockOnTechnologySelect).toHaveBeenCalledWith(null);
  });
});

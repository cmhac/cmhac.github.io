import { render, screen } from "@testing-library/react";
import ProjectCard from "../ProjectCard";
import { mockProject } from "@/app/__tests__/test-utils";

describe("ProjectCard", () => {
  it("renders project title and description", () => {
    render(<ProjectCard project={mockProject} />);

    const title = screen.getByText(mockProject.title);
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass("text-terminal-purple");

    const description = screen.getByText(mockProject.description);
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass("text-terminal-text/80");
  });

  it("renders project image when provided", () => {
    render(<ProjectCard project={mockProject} />);

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("alt", mockProject.title);
    expect(image).toHaveAttribute(
      "class",
      expect.stringContaining(
        "transition-transform duration-500 hover:scale-110",
      ),
    );
  });

  it("renders technologies as terminal-style tags", () => {
    render(<ProjectCard project={mockProject} />);

    mockProject.technologies.forEach((tech) => {
      const tag = screen.getByText(tech);
      expect(tag).toBeInTheDocument();
      expect(tag).toHaveClass(
        "bg-terminal-selection/50",
        "text-terminal-cyan",
        "font-mono",
      );
    });
  });

  it("renders terminal-style project link", () => {
    render(<ProjectCard project={mockProject} />);

    const link = screen.getByText("$ explore_project");
    expect(link).toHaveAttribute("href", mockProject.url);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveClass("text-terminal-green", "font-mono");
  });

  it("renders project content with terminal styling", () => {
    render(<ProjectCard project={mockProject} />);

    const content = screen.getByText(mockProject.content!);
    expect(content).toBeInTheDocument();
    const contentWrapper = content.closest(".prose");
    expect(contentWrapper).toHaveClass("prose-invert", "text-terminal-text/90");
  });

  it("renders date with terminal styling", () => {
    const projectWithDate = {
      ...mockProject,
      date: "2024-03-14",
    };

    render(<ProjectCard project={projectWithDate} />);

    const dateElement = screen.getByText((content) => {
      const dateRegex = /\d{1,2}[/.]\d{1,2}[/.]\d{2,4}/;
      return dateRegex.test(content);
    });
    expect(dateElement).toBeInTheDocument();
    expect(dateElement).toHaveClass("text-terminal-comment", "font-mono");
  });

  it("handles missing optional fields gracefully", () => {
    const minimalProject = {
      title: "Minimal Project",
      description: "Basic description",
      technologies: [],
      url: "https://example.com",
      image: "",
      featured: false,
    };

    render(<ProjectCard project={minimalProject} />);

    expect(screen.getByText("Minimal Project")).toBeInTheDocument();
    expect(screen.getByText("Basic description")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(
      screen.queryByText(/\d{1,2}[/.]\d{1,2}[/.]\d{2,4}/),
    ).not.toBeInTheDocument();
  });

  it("does not render image section when image is not provided", () => {
    const projectWithoutImage = { ...mockProject, image: undefined };
    render(<ProjectCard project={projectWithoutImage} />);

    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});

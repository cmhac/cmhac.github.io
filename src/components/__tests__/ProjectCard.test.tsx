import { render, screen } from "@testing-library/react";
import ProjectCard from "../ProjectCard";
import { mockProject } from "@/app/__tests__/test-utils";

describe("ProjectCard", () => {
  it("renders project title and description", () => {
    render(<ProjectCard project={mockProject} />);

    expect(screen.getByText(mockProject.title)).toBeInTheDocument();
    expect(screen.getByText(mockProject.description)).toBeInTheDocument();
  });

  it("renders project image when provided", () => {
    render(<ProjectCard project={mockProject} />);

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("alt", mockProject.title);
    expect(image).toHaveAttribute(
      "class",
      expect.stringContaining("object-cover"),
    );
  });

  it("renders technologies as tags", () => {
    render(<ProjectCard project={mockProject} />);

    mockProject.technologies.forEach((tech) => {
      expect(screen.getByText(tech)).toBeInTheDocument();
    });
  });

  it("renders project URL as a link", () => {
    render(<ProjectCard project={mockProject} />);

    const link = screen.getByText("View Project →");
    expect(link).toHaveAttribute("href", mockProject.url);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders project content when provided", () => {
    render(<ProjectCard project={mockProject} />);

    expect(screen.getByText(mockProject.content!)).toBeInTheDocument();
  });

  it("renders date when provided", () => {
    const projectWithDate = {
      ...mockProject,
      date: "2024-03-14",
    };

    render(<ProjectCard project={projectWithDate} />);

    // Use a more flexible date check that works across locales
    const dateElement = screen.getByText((content) => {
      const dateRegex = /\d{1,2}[/.]\d{1,2}[/.]\d{2,4}/;
      return dateRegex.test(content);
    });
    expect(dateElement).toBeInTheDocument();
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

  it("adjusts padding when no image is present", () => {
    const projectWithoutImage = { ...mockProject, image: undefined };
    const { container } = render(<ProjectCard project={projectWithoutImage} />);

    const contentDiv = container.querySelector(".p-6");
    expect(contentDiv).toHaveClass("pt-4");
  });
});

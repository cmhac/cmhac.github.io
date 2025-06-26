import { render, screen } from "@testing-library/react";
import ProjectCard from "../ProjectCard";
import { mockProject } from "@/app/__tests__/test-utils";

describe("ProjectCard", () => {
  const projectWithSlug = {
    ...mockProject,
    slug: "test-project",
  };

  it("renders project title and description", () => {
    render(<ProjectCard project={projectWithSlug} />);

    const title = screen.getByText(projectWithSlug.title);
    expect(title).toBeInTheDocument();
    expect(title).toHaveClass("text-terminal-purple");

    const description = screen.getByText(projectWithSlug.description);
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass("text-terminal-text/80");
  });

  it("renders project image when provided", () => {
    render(<ProjectCard project={projectWithSlug} />);

    const imageWrapper = screen
      .getByRole("img")
      .closest("div.w-full.md\\:w-1\\/3");
    expect(imageWrapper).toHaveClass("w-full", "md:w-1/3", "mb-6", "md:mb-0");

    const imageContainer = screen
      .getByRole("img")
      .closest("div.relative.w-full");
    expect(imageContainer).toHaveClass(
      "relative",
      "w-full",
      "h-48",
      "md:h-full",
      "overflow-hidden",
      "rounded-lg",
    );

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("alt", projectWithSlug.title);
    expect(image).toHaveClass(
      "object-cover",
      "transition-transform",
      "duration-500",
      "hover:scale-110",
    );
  });

  it("renders technologies as terminal-style tags", () => {
    render(<ProjectCard project={projectWithSlug} />);

    projectWithSlug.technologies.forEach((tech) => {
      const tag = screen.getByText(tech);
      expect(tag).toBeInTheDocument();
      expect(tag).toHaveClass(
        "bg-terminal-selection/50",
        "text-terminal-cyan",
        "font-mono",
      );
    });
  });

  it("renders date with terminal styling", () => {
    const projectWithDate = {
      ...projectWithSlug,
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
      slug: "minimal-project",
    };

    render(<ProjectCard project={minimalProject} />);

    expect(screen.getByText("Minimal Project")).toBeInTheDocument();
    expect(screen.getByText("Basic description")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(
      screen.queryByText(/\d{1,2}[/.]\d{1,2}[/.]\d{2,4}/),
    ).not.toBeInTheDocument();
  });

  it("has correct layout structure and hover states", () => {
    render(<ProjectCard project={projectWithSlug} />);

    // Check main container
    const mainContainer = screen
      .getByText(projectWithSlug.title)
      .closest("div.bg-terminal-selection\\/30");
    expect(mainContainer).toHaveClass(
      "bg-terminal-selection/30",
      "backdrop-blur-sm",
      "rounded-lg",
      "p-6",
      "card-hover",
      "transition-all",
      "duration-300",
      "hover:bg-terminal-selection/50",
      "hover:border-terminal-purple/50",
    );

    // Check flex container
    const flexContainer = screen
      .getByText(projectWithSlug.title)
      .closest("div.flex");
    expect(flexContainer).toHaveClass("flex", "flex-col", "md:flex-row");

    // Check content container
    const contentContainer = screen
      .getByText(projectWithSlug.description)
      .closest("div.flex-1");
    expect(contentContainer).toHaveClass("flex-1");
  });

  it("makes entire card clickable with correct project link", () => {
    render(<ProjectCard project={projectWithSlug} />);

    const cardLink = screen.getByRole("link");
    expect(cardLink).toHaveAttribute(
      "href",
      `/projects/${projectWithSlug.slug}`,
    );
    expect(cardLink).toHaveClass("block");
  });
});

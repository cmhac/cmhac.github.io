import { render, screen } from "@testing-library/react";
import ProjectPage from "../page";
import { mockProject } from "@/app/__tests__/mockData";
import { notFound } from "next/navigation";

// Mock react-markdown
jest.mock("react-markdown", () => {
  return function MockReactMarkdown({ children }: { children: string }) {
    return <div data-testid="markdown-content">{children}</div>;
  };
});

// Mock the project utilities
jest.mock("@/utils/projects", () => ({
  getProjectBySlug: jest.fn((slug) =>
    slug === "test-project"
      ? {
          ...mockProject,
          slug: "test-project",
          content: "# Project Content\n\nThis is the project content.",
        }
      : null,
  ),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  notFound: jest.fn(() => null),
}));

describe("Project Detail Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders project details correctly", async () => {
    render(await ProjectPage({ params: { slug: "test-project" } }));

    // Check title and metadata
    expect(screen.getByText(mockProject.title)).toBeInTheDocument();
    expect(screen.getByText(mockProject.description)).toBeInTheDocument();

    // Check date formatting
    expect(screen.getByText("3/13/2024")).toBeInTheDocument();

    // Check technologies
    mockProject.technologies.forEach((tech) => {
      expect(screen.getByText(tech)).toBeInTheDocument();
    });

    // Check links
    expect(screen.getByText("← back to projects")).toHaveAttribute(
      "href",
      "/projects",
    );
    expect(screen.getByText("➜ view live project")).toHaveAttribute(
      "href",
      mockProject.url,
    );

    // Check image
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("alt", mockProject.title);

    // Check markdown content
    const markdownContent = screen.getByTestId("markdown-content");
    expect(markdownContent).toHaveTextContent(
      "# Project Content This is the project content.",
    );
  });

  it("calls notFound for non-existent project", async () => {
    await ProjectPage({ params: { slug: "non-existent" } });
    expect(notFound).toHaveBeenCalled();
  });

  it("renders project without optional fields", async () => {
    const minimalProject = {
      ...mockProject,
      date: undefined,
      image: undefined,
      content: undefined,
      technologies: [],
      slug: "minimal-project",
    };

    jest
      .spyOn(require("@/utils/projects"), "getProjectBySlug")
      .mockResolvedValueOnce(minimalProject);

    render(await ProjectPage({ params: { slug: "minimal-project" } }));

    // Check that optional elements are not rendered
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(
      screen.queryByText(/\d{1,2}\/\d{1,2}\/\d{4}/),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Technologies:")).not.toBeInTheDocument();
    expect(screen.queryByTestId("markdown-content")).not.toBeInTheDocument();
  });
});

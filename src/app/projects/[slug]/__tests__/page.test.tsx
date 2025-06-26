import { render, screen } from "@testing-library/react";
import ProjectPage from "../page";
import { mockProject } from "@/app/__tests__/test-utils";
import { getProjectBySlug, getAllProjects } from "@/utils/projects";
import { notFound } from "next/navigation";

jest.mock("@/utils/projects");
jest.mock("next/navigation", () => ({
  notFound: jest.fn(),
}));
jest.mock("react-markdown", () => {
  return function MockReactMarkdown({ children }: { children: string }) {
    return <div data-testid="markdown-content">{children}</div>;
  };
});

const mockGetProjectBySlug = getProjectBySlug as jest.MockedFunction<
  typeof getProjectBySlug
>;
const mockGetAllProjects = getAllProjects as jest.MockedFunction<
  typeof getAllProjects
>;
const mockNotFound = notFound as jest.MockedFunction<typeof notFound>;

beforeEach(() => {
  jest.clearAllMocks();
  mockGetProjectBySlug.mockImplementation((slug) =>
    Promise.resolve(
      slug === "test-project"
        ? {
            ...mockProject,
            content: "# Project Content\n\nThis is the project content.",
          }
        : null,
    ),
  );
  mockGetAllProjects.mockResolvedValue([mockProject]);
});

describe("ProjectPage", () => {
  it("renders project details correctly", async () => {
    render(await ProjectPage({ params: { slug: "test-project" } }));

    expect(screen.getByText(mockProject.title)).toBeInTheDocument();
    expect(screen.getByText(mockProject.description)).toBeInTheDocument();
    expect(screen.getByText("← back to projects")).toHaveAttribute(
      "href",
      "/projects",
    );
    expect(screen.getByText("➜ view live project")).toHaveAttribute(
      "href",
      mockProject.url,
    );

    mockProject.technologies.forEach((tech) => {
      expect(screen.getByText(tech)).toBeInTheDocument();
    });

    const markdownContent = screen.getByTestId("markdown-content");
    expect(markdownContent.textContent).toBe(
      "# Project Content\n\nThis is the project content.",
    );
  });

  it("renders project image when provided", async () => {
    render(await ProjectPage({ params: { slug: "test-project" } }));

    const image = screen.getByRole("img");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("alt", mockProject.title);

    const imageLink = image.closest("a");
    expect(imageLink).toHaveAttribute("href", mockProject.url);
    expect(imageLink).toHaveAttribute("target", "_blank");
    expect(imageLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(image).toHaveClass(
      "hover:scale-105",
      "transition-transform",
      "duration-500",
    );
  });

  it("calls notFound for non-existent project", async () => {
    await ProjectPage({ params: { slug: "non-existent" } });
    expect(mockNotFound).toHaveBeenCalled();
  });
});

import { render, screen } from "@testing-library/react";
import ProjectPage, { generateMetadata, generateStaticParams } from "../page";
import { mockProject } from "@/app/__tests__/test-utils";
import { getProjectBySlug, getAllProjects, Project } from "@/utils/projects";
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

const minimalProject: Project = {
  ...mockProject,
  url: "",
  image: "",
  content: undefined,
  technologies: {},
  date: undefined,
};

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

    // Check for the "Tools and techniques used" section at the bottom
    expect(screen.getByText("Tools and techniques used")).toBeInTheDocument();

    // Check that each technology appears twice - once in chips and once in detailed section
    Object.entries(mockProject.technologies).forEach(([tech, description]) => {
      const techElements = screen.getAllByText(tech);
      expect(techElements).toHaveLength(2); // Once in chip, once in detailed section
      expect(screen.getByText(description)).toBeInTheDocument();
    });

    // Check that the technology chips (with tooltips) are present
    Object.entries(mockProject.technologies).forEach(([tech, description]) => {
      const chipElement = screen
        .getAllByText(tech)
        .find(
          (el) =>
            el.getAttribute("title") === description &&
            el.classList.contains("cursor-help"),
        );
      expect(chipElement).toBeInTheDocument();
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

  it("renders project with minimal fields correctly", async () => {
    mockGetProjectBySlug.mockResolvedValueOnce(minimalProject);
    render(await ProjectPage({ params: { slug: "minimal-project" } }));

    // Basic fields should be present
    expect(screen.getByText(minimalProject.title)).toBeInTheDocument();
    expect(screen.getByText(minimalProject.description)).toBeInTheDocument();

    // Optional elements should not be present
    expect(screen.queryByText("➜ view live project")).not.toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.queryByTestId("markdown-content")).not.toBeInTheDocument();
    expect(
      screen.queryByText(/\d{1,2}\/\d{1,2}\/\d{4}/),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Tools and techniques used"),
    ).not.toBeInTheDocument();
  });

  it("formats date correctly", async () => {
    const projectWithDate: Project = {
      ...mockProject,
      date: "2024-03-14T12:00:00Z", // Using UTC time to avoid timezone issues
    };
    mockGetProjectBySlug.mockResolvedValueOnce(projectWithDate);
    render(await ProjectPage({ params: { slug: "dated-project" } }));

    // Use a regex pattern to match the date format (M/D/YYYY)
    expect(screen.getByText(/^\d{1,2}\/\d{1,2}\/\d{4}$/)).toBeInTheDocument();
  });

  it("renders image without link when url is not provided", async () => {
    const projectWithoutUrl: Project = {
      ...mockProject,
      url: "",
    };
    mockGetProjectBySlug.mockResolvedValueOnce(projectWithoutUrl);
    render(await ProjectPage({ params: { slug: "no-url-project" } }));

    const image = screen.getByRole("img");
    expect(image).toBeInTheDocument();
    expect(image.closest("a")).toBeNull();
    expect(image).not.toHaveClass("hover:scale-105");
  });
});

describe("generateMetadata", () => {
  it("returns correct metadata for existing project", async () => {
    const metadata = await generateMetadata({
      params: { slug: "test-project" },
    });
    expect(metadata).toEqual({
      title: `${mockProject.title} | Chris Hacker`,
      description: mockProject.description,
    });
  });

  it("returns not found metadata for non-existent project", async () => {
    const metadata = await generateMetadata({
      params: { slug: "non-existent" },
    });
    expect(metadata).toEqual({ title: "Project Not Found" });
  });
});

describe("generateStaticParams", () => {
  it("returns correct params for all projects", async () => {
    const params = await generateStaticParams();
    expect(params).toEqual([{ slug: mockProject.slug }]);
    expect(mockGetAllProjects).toHaveBeenCalled();
  });
});

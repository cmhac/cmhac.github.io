import { render, screen } from "@testing-library/react";
import Home from "../page";

// Mock the getAllProjects function
jest.mock("@/utils/projects", () => ({
  getAllProjects: jest.fn().mockResolvedValue([
    {
      title: "Featured Project",
      description: "A featured project description",
      technologies: ["React", "TypeScript"],
      url: "https://example.com",
      image: "/media/test.png",
      featured: true,
      date: "2024-03-14",
      content: "This is the project content.",
    },
    {
      title: "Featured Project Without Image",
      description: "A featured project without an image",
      technologies: ["React", "TypeScript"],
      url: "https://example.com",
      image: "",
      featured: true,
      date: "2024-03-14",
      content: "This is the project content.",
    },
    {
      title: "Regular Project",
      description: "A regular project description",
      technologies: ["React", "TypeScript"],
      url: "https://example.com",
      image: "/media/test.png",
      featured: false,
      date: "2024-03-14",
      content: "This is the project content.",
    },
  ]),
}));

// Mock fs for site settings
jest.mock("fs/promises", () => ({
  readFile: jest.fn().mockResolvedValue(
    JSON.stringify({
      title: "Chris Hacker",
      description: "Investigative Data Journalist & Engineer",
      author: "Chris Hacker",
      socialLinks: {
        github: "https://github.com/cmhac",
        linkedin: "#",
        twitter: "#",
      },
    }),
  ),
}));

// Mock the ProjectCard component
jest.mock("@/components/ProjectCard", () => {
  return function MockProjectCard({ project }: { project: any }) {
    return (
      <div data-testid="project-card">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        {project.image && <img src={project.image} alt={project.title} />}
        <a href={project.url}>$ explore_project</a>
      </div>
    );
  };
});

describe("Home Page", () => {
  it("renders hero section with author and description", async () => {
    render(await Home());
    expect(screen.getByText("Chris Hacker")).toBeInTheDocument();
    expect(
      screen.getByText("Investigative Data Journalist & Engineer"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /I build tools and analyze data to uncover stories that matter/,
      ),
    ).toBeInTheDocument();
  });

  it("renders featured projects section with terminal style", async () => {
    render(await Home());
    expect(screen.getByText("$")).toBeInTheDocument();
    expect(screen.getByText("featured_projects")).toBeInTheDocument();

    // Check that only featured projects are rendered
    const projectCards = screen.getAllByTestId("project-card");
    expect(projectCards).toHaveLength(2); // Only featured projects
    expect(screen.getByText("Featured Project")).toBeInTheDocument();
    expect(
      screen.getByText("Featured Project Without Image"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Regular Project")).not.toBeInTheDocument();
  });

  it("renders navigation buttons", async () => {
    render(await Home());
    expect(screen.getByText("View Projects")).toHaveAttribute(
      "href",
      "/projects",
    );
    expect(screen.getByText("About Me")).toHaveAttribute("href", "/about");
  });

  it("renders project cards with terminal-style links", async () => {
    render(await Home());
    const projectLinks = screen.getAllByText("$ explore_project");
    expect(projectLinks[0]).toHaveAttribute("href", "https://example.com");
    expect(projectLinks[1]).toHaveAttribute("href", "https://example.com");

    expect(screen.getByText("$ explore_all_projects")).toHaveAttribute(
      "href",
      "/projects",
    );
  });

  it("handles project images correctly", async () => {
    render(await Home());

    // Project with image
    const projectWithImage = screen.getByAltText("Featured Project");
    expect(projectWithImage).toBeInTheDocument();
    expect(projectWithImage).toHaveAttribute("src", "/media/test.png");

    // Project without image
    expect(
      screen.queryByAltText("Featured Project Without Image"),
    ).not.toBeInTheDocument();
  });
});

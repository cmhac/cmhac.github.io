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
  readFile: jest.fn().mockRejectedValue(new Error("File not found")), // Force default settings
}));

describe("Home Page", () => {
  it("renders hero section", async () => {
    render(await Home());
    expect(screen.getByText("My Portfolio")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Welcome to my portfolio website showcasing my projects and skills",
      ),
    ).toBeInTheDocument();
  });

  it("renders featured projects section", async () => {
    render(await Home());
    expect(screen.getByText("Featured Projects")).toBeInTheDocument();
    expect(screen.getByText("Featured Project")).toBeInTheDocument();
  });

  it("renders view all projects link", async () => {
    render(await Home());
    expect(screen.getByText("View All Projects →")).toHaveAttribute(
      "href",
      "/projects",
    );
  });
});

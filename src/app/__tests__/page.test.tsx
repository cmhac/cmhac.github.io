import { render, screen } from "@testing-library/react";
import Home from "../page";
import { mockProjects } from "./test-utils";

// Mock the projects utility
jest.mock("@/utils/projects", () => ({
  getHomePageProjects: jest.fn().mockImplementation(async () => ({
    featured: mockProjects.filter((p) => p.featured),
    recent: mockProjects.slice(0, 3),
  })),
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

  it("renders social links", async () => {
    render(await Home());
    expect(screen.getByText("Github")).toBeInTheDocument();
    expect(screen.getByText("Linkedin")).toBeInTheDocument();
    expect(screen.getByText("Twitter")).toBeInTheDocument();
  });

  it("renders featured projects section", async () => {
    render(await Home());
    expect(screen.getByText("Featured Projects")).toBeInTheDocument();

    // All mock projects are featured
    const titles = screen.getAllByRole("heading", { level: 3 });
    expect(titles.length).toBeGreaterThanOrEqual(3);
    expect(titles[0]).toHaveTextContent("Test Project");
    expect(titles[1]).toHaveTextContent("Second Project");
    expect(titles[2]).toHaveTextContent("Third Project");
  });

  it("renders recent projects section", async () => {
    render(await Home());
    expect(screen.getByText("Recent Projects")).toBeInTheDocument();
    expect(screen.getByText("View All Projects →")).toHaveAttribute(
      "href",
      "/projects",
    );
  });
});

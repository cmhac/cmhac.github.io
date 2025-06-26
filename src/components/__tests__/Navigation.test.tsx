import { render, screen } from "@testing-library/react";
import Navigation from "../Navigation";
import { usePathname } from "next/navigation";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

describe("Navigation", () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReset();
  });

  it("renders correctly on home page", () => {
    (usePathname as jest.Mock).mockReturnValue("/");
    render(<Navigation />);

    expect(screen.getByText("chris_hacker")).toBeInTheDocument();
    expect(screen.queryByText("data")).not.toBeInTheDocument();
    expect(screen.queryByText("projects")).not.toBeInTheDocument();
    expect(screen.queryByText("about")).not.toBeInTheDocument();
  });

  it("renders correctly on projects page", () => {
    (usePathname as jest.Mock).mockReturnValue("/projects");
    render(<Navigation />);

    expect(screen.getByText("chris_hacker")).toBeInTheDocument();
    expect(screen.getByText("projects")).toBeInTheDocument();
    expect(screen.queryByText("data")).not.toBeInTheDocument();
    expect(screen.queryByText("about")).not.toBeInTheDocument();
  });

  it("renders correctly on about page", () => {
    (usePathname as jest.Mock).mockReturnValue("/about");
    render(<Navigation />);

    expect(screen.getByText("chris_hacker")).toBeInTheDocument();
    expect(screen.getByText("about")).toBeInTheDocument();
    expect(screen.queryByText("data")).not.toBeInTheDocument();
    expect(screen.queryByText("projects")).not.toBeInTheDocument();
  });

  it("highlights active navigation link", () => {
    (usePathname as jest.Mock).mockReturnValue("/projects");
    render(<Navigation />);

    const projectsLink = screen.getAllByText("~/projects")[0];
    expect(projectsLink).toHaveClass("text-terminal-cyan");

    const homeLink = screen.getAllByText("~/home")[0];
    expect(homeLink).toHaveClass("text-terminal-text");
  });

  it("renders mobile menu button", () => {
    (usePathname as jest.Mock).mockReturnValue("/");
    render(<Navigation />);

    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByText("Open main menu")).toBeInTheDocument();
  });
});

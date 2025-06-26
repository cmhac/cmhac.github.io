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
    const projectsText = screen.getByText("projects");
    expect(projectsText).toBeInTheDocument();
    expect(projectsText).toHaveClass(
      "text-terminal-green",
      "group-hover:text-terminal-text/50",
    );
    expect(screen.queryByText("data")).not.toBeInTheDocument();
    expect(screen.queryByText("about")).not.toBeInTheDocument();
  });

  it("renders correctly on about page", () => {
    (usePathname as jest.Mock).mockReturnValue("/about");
    render(<Navigation />);

    expect(screen.getByText("chris_hacker")).toBeInTheDocument();
    const aboutText = screen.getByText("about");
    expect(aboutText).toBeInTheDocument();
    expect(aboutText).toHaveClass(
      "text-terminal-green",
      "group-hover:text-terminal-text/50",
    );
    expect(screen.queryByText("data")).not.toBeInTheDocument();
    expect(screen.queryByText("projects")).not.toBeInTheDocument();
  });

  it("applies hover effect classes to logo", () => {
    (usePathname as jest.Mock).mockReturnValue("/projects");
    render(<Navigation />);

    const logoText = screen.getByText("chris_hacker");
    expect(logoText).toHaveClass(
      "text-terminal-purple",
      "hover:text-terminal-cyan",
    );
    expect(logoText.parentElement).toHaveClass("group");
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

  it("has correct layout structure", () => {
    (usePathname as jest.Mock).mockReturnValue("/");
    render(<Navigation />);

    // Check main navigation container
    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass("fixed", "w-full");

    // Check logo container
    const logo = screen.getByText("chris_hacker").parentElement;
    expect(logo).toHaveClass("flex", "items-center");

    // Check navigation links container
    const desktopNav = screen.getAllByText("~/home")[0].closest("div.hidden");
    expect(desktopNav).toHaveClass(
      "hidden",
      "sm:flex",
      "sm:items-center",
      "sm:space-x-8",
    );

    // Verify the flex layout
    const mainFlexContainer = screen
      .getByText("chris_hacker")
      .closest("div.flex");
    expect(mainFlexContainer).toHaveClass("flex", "justify-between", "h-16");
  });
});

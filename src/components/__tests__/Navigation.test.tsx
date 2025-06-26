import { render, screen, fireEvent } from "@testing-library/react";
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
    // Get the navigation links specifically
    const projectsLinks = screen.getAllByText("projects");
    const aboutLinks = screen.getAllByText("about");
    // Check that they are in the navigation section
    expect(projectsLinks[0].closest("div.hidden")).toHaveClass("sm:flex");
    expect(aboutLinks[0].closest("div.hidden")).toHaveClass("sm:flex");
  });

  it("renders correctly on projects page", () => {
    (usePathname as jest.Mock).mockReturnValue("/projects");
    render(<Navigation />);

    expect(screen.getByText("chris_hacker")).toBeInTheDocument();
    // Get the path display text specifically
    const projectsText = screen.getByText("projects", {
      selector: "span.text-terminal-green",
    });
    expect(projectsText).toBeInTheDocument();
    expect(projectsText).toHaveClass(
      "text-terminal-green",
      "group-hover:text-terminal-text/50",
    );
    expect(screen.queryByText("data")).not.toBeInTheDocument();
  });

  it("renders correctly on about page", () => {
    (usePathname as jest.Mock).mockReturnValue("/about");
    render(<Navigation />);

    expect(screen.getByText("chris_hacker")).toBeInTheDocument();
    // Get the path display text specifically
    const aboutText = screen.getByText("about", {
      selector: "span.text-terminal-green",
    });
    expect(aboutText).toBeInTheDocument();
    expect(aboutText).toHaveClass(
      "text-terminal-green",
      "group-hover:text-terminal-text/50",
    );
    expect(screen.queryByText("data")).not.toBeInTheDocument();
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

    // Get the navigation links specifically
    const projectsLinks = screen.getAllByRole("link", { name: "projects" });
    // Find the desktop navigation link (the first one)
    const projectsLink = projectsLinks[0];
    expect(projectsLink).toHaveClass("text-terminal-cyan");

    const homeLinks = screen.getAllByRole("link", { name: "home" });
    // Find the desktop navigation link (the first one)
    const homeLink = homeLinks[0];
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
    const homeLinks = screen.getAllByRole("link", { name: "home" });
    // Find the desktop navigation link (the first one)
    const desktopNav = homeLinks[0].closest("div.hidden");
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

  describe("Mobile Menu", () => {
    it("starts with mobile menu hidden", () => {
      (usePathname as jest.Mock).mockReturnValue("/");
      render(<Navigation />);

      const mobileMenu = screen.getByTestId("mobile-menu");
      expect(mobileMenu).toHaveClass("hidden");
    });

    it("toggles mobile menu visibility when button is clicked", () => {
      (usePathname as jest.Mock).mockReturnValue("/");
      render(<Navigation />);

      const menuButton = screen.getByRole("button", {
        name: /open main menu/i,
      });
      const mobileMenu = screen.getByTestId("mobile-menu");
      expect(mobileMenu).toHaveClass("hidden");

      // Open menu
      fireEvent.click(menuButton);
      expect(mobileMenu).toHaveClass("block");
      expect(menuButton).toHaveAttribute("aria-expanded", "true");

      // Close menu
      fireEvent.click(menuButton);
      expect(mobileMenu).toHaveClass("hidden");
      expect(menuButton).toHaveAttribute("aria-expanded", "false");
    });

    it("closes mobile menu when a link is clicked", () => {
      (usePathname as jest.Mock).mockReturnValue("/");
      render(<Navigation />);

      // Open menu
      const menuButton = screen.getByRole("button", {
        name: /open main menu/i,
      });
      fireEvent.click(menuButton);

      // Click a link in the mobile menu
      const projectsLinks = screen.getAllByRole("link", { name: "projects" });
      // Get the mobile menu link (the second one)
      const mobileLink = projectsLinks[1];
      fireEvent.click(mobileLink);

      // Check if menu is closed
      const mobileMenu = screen.getByTestId("mobile-menu");
      expect(mobileMenu).toHaveClass("hidden");
    });

    it("shows different icons for menu open/closed states", () => {
      (usePathname as jest.Mock).mockReturnValue("/");
      render(<Navigation />);

      const menuButton = screen.getByRole("button", {
        name: /open main menu/i,
      });

      // Initial state (hamburger icon)
      const initialPath = menuButton.querySelector("path");
      expect(initialPath).toHaveAttribute("d", "M4 6h16M4 12h16M4 18h16");

      // Click to open (X icon)
      fireEvent.click(menuButton);
      const openPath = menuButton.querySelector("path");
      expect(openPath).toHaveAttribute("d", "M6 18L18 6M6 6l12 12");

      // Click to close (back to hamburger)
      fireEvent.click(menuButton);
      const closedPath = menuButton.querySelector("path");
      expect(closedPath).toHaveAttribute("d", "M4 6h16M4 12h16M4 18h16");
    });
  });
});

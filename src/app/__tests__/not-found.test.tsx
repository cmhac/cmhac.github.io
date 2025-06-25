import { render, screen } from "@testing-library/react";
import NotFound from "../not-found";

describe("NotFound Page", () => {
  it("renders error message", () => {
    render(<NotFound />);
    expect(screen.getByText(/page not found/i)).toBeInTheDocument();
  });

  it("has a link back to home", () => {
    render(<NotFound />);
    const homeLink = screen.getByTestId("home-link");
    expect(homeLink).toHaveAttribute("href", "/");
  });

  it("meets accessibility standards", () => {
    render(<NotFound />);
    // Check for heading hierarchy
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    // Check for link accessibility
    const link = screen.getByRole("link", { name: /return home/i });
    expect(link).toBeInTheDocument();
  });
});

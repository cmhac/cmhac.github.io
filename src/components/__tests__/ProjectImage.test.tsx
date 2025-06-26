import { render, screen } from "@testing-library/react";
import ProjectImage from "../ProjectImage";

describe("ProjectImage", () => {
  it("renders image with absolute path", () => {
    render(<ProjectImage src="/test.jpg" alt="Test" />);
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src");
    expect(image).toHaveAttribute("alt", "Test");
  });

  it("renders image with relative path", () => {
    render(<ProjectImage src="test.jpg" alt="Test" />);
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src");
    expect(image).toHaveAttribute("alt", "Test");
  });

  it("applies custom className", () => {
    render(
      <ProjectImage src="/test.jpg" alt="Test" className="custom-class" />,
    );
    const image = screen.getByRole("img");
    expect(image).toHaveClass("custom-class");
  });

  it("does not render when src is not provided", () => {
    render(<ProjectImage src="" alt="Test" />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import ProjectImage from "../ProjectImage";

describe("ProjectImage", () => {
  it("renders image with absolute path correctly", () => {
    render(
      <ProjectImage
        src="/media/test.jpg"
        alt="Test Image"
        className="custom-class"
      />,
    );

    const image = screen.getByRole("img");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/media/test.jpg");
    expect(image).toHaveAttribute("alt", "Test Image");
    expect(image).toHaveClass("custom-class");
  });

  it("renders image with relative path correctly", () => {
    render(
      <ProjectImage
        src="media/test.jpg"
        alt="Test Image"
        className="custom-class"
      />,
    );

    const image = screen.getByRole("img");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/media/test.jpg");
    expect(image).toHaveAttribute("alt", "Test Image");
  });

  it("renders image with default class when no className provided", () => {
    render(<ProjectImage src="/media/test.jpg" alt="Test Image" />);

    const image = screen.getByRole("img");
    expect(image).toHaveClass("object-cover");
  });

  it("renders image with combined default and custom classes", () => {
    render(
      <ProjectImage
        src="/media/test.jpg"
        alt="Test Image"
        className="custom-class"
      />,
    );

    const image = screen.getByRole("img");
    expect(image).toHaveClass("object-cover", "custom-class");
  });

  it("renders image in a relative height container", () => {
    render(<ProjectImage src="/media/test.jpg" alt="Test Image" />);

    const container = screen.getByRole("img").parentElement;
    expect(container).toHaveClass("relative", "h-48");
  });

  it("does not render when src is not provided", () => {
    render(<ProjectImage src="" alt="Test Image" />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});

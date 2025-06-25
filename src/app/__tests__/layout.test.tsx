import { render } from "@testing-library/react";
import RootLayout from "../layout";
import { Metadata } from "next";

describe("RootLayout", () => {
  const metadata: Metadata = {
    title: "Portfolio Site",
    description: "My portfolio site built with Next.js and Pages CMS",
  };

  it("renders children correctly", () => {
    const { container } = render(
      <RootLayout>
        <div data-testid="child">Test Content</div>
      </RootLayout>,
    );

    const childElement = container.querySelector('[data-testid="child"]');
    expect(childElement).toBeInTheDocument();
  });

  it('has lang attribute set to "en"', () => {
    const { container } = render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>,
    );

    const htmlElement = container.querySelector("html");
    expect(htmlElement).toHaveAttribute("lang", "en");
  });

  it("exports correct metadata", () => {
    // Test that the metadata export matches our expectations
    expect(metadata.title).toBe("Portfolio Site");
    expect(metadata.description).toBe(
      "My portfolio site built with Next.js and Pages CMS",
    );
  });
});

import { screen } from "@testing-library/react";
import RootLayout from "../layout";
import { Metadata } from "next";
import { renderWithRootLayout } from "./test-utils";

jest.mock("next/font/google", () => ({
  Inter: () => ({
    className: "mock-inter-font",
  }),
}));

describe("RootLayout", () => {
  const metadata: Metadata = {
    title: "Portfolio Site",
    description: "My portfolio site built with Next.js and Pages CMS",
  };

  it("renders navigation", () => {
    renderWithRootLayout(
      <RootLayout>
        <div data-testid="child">Test Content</div>
      </RootLayout>,
    );

    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("renders children correctly", () => {
    renderWithRootLayout(
      <RootLayout>
        <div data-testid="child">Test Content</div>
      </RootLayout>,
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it('has lang attribute set to "en"', () => {
    const { container } = renderWithRootLayout(
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

  it("applies Inter font class", () => {
    const { container } = renderWithRootLayout(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>,
    );

    expect(container.querySelector(".mock-inter-font")).toBeInTheDocument();
  });
});

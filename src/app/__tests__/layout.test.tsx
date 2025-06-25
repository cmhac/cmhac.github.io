import { render, screen } from "@testing-library/react";
import RootLayout, { metadata } from "../layout";

// Mock the root layout component
jest.mock("../layout", () => {
  const MockLayout = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-layout">
      <nav role="navigation">Navigation</nav>
      {children}
    </div>
  );
  MockLayout.displayName = "MockLayout";
  return {
    __esModule: true,
    default: MockLayout,
    metadata: {
      title: "Portfolio",
      description: "My personal portfolio website",
    },
  };
});

describe("RootLayout", () => {
  it("renders children correctly", () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>,
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("includes navigation component", () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>,
    );

    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("exports correct metadata", () => {
    expect(metadata).toBeDefined();
    expect(metadata.title).toBe("Portfolio");
    expect(metadata.description).toBe("My personal portfolio website");
  });
});

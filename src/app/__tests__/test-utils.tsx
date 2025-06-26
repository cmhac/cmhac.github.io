/* eslint-disable @next/next/no-img-element */
import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import { ReactElement } from "react";

// Mock project data
export const mockProject = {
  title: "Test Project",
  description: "A test project description",
  technologies: ["React", "TypeScript"],
  url: "https://example.com",
  image: "/media/test.png",
  featured: true,
  date: "2024-03-14",
  content: "This is the project content.",
  slug: "test-project",
};

export const mockProjects = [
  mockProject,
  {
    ...mockProject,
    title: "Second Project",
    date: "2024-03-15",
  },
  {
    ...mockProject,
    title: "Third Project",
    date: "2024-03-10",
  },
];

// Mock Inter font
const mockInter = () => {
  return {
    className: "mock-inter-font",
    style: {
      fontFamily: "Inter",
    },
  };
};

// Mock next/font/google
jest.mock("next/font/google", () => ({
  Inter: () => mockInter(),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    className,
    width = 100,
    height = 100,
    priority,
    ...props
  }: {
    src: string;
    alt: string;
    className?: string;
    width?: number;
    height?: number;
    priority?: boolean;
    [key: string]: any;
  }) => (
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      {...props}
    />
  ),
}));

// Custom render function for components that don't need the root layout
export function renderWithoutLayout(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return render(ui, {
    ...options,
    wrapper: ({ children }) => (
      <div data-testid="test-wrapper" className="mock-inter-font">
        {children}
      </div>
    ),
  });
}

// Custom render function for components that need the root layout
export function renderWithRootLayout(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return render(ui, {
    ...options,
  });
}

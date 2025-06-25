import { render, RenderOptions } from "@testing-library/react";
import { ReactElement } from "react";

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: function Image({ src, alt, fill, className, ...props }: any) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={fill ? { objectFit: "cover" } : undefined}
        {...props}
      />
    );
  },
}));

// Mock fs promises
jest.mock("fs/promises", () => ({
  readdir: jest.fn(),
  readFile: jest.fn(),
}));

// Mock gray-matter
jest.mock("gray-matter", () => ({
  __esModule: true,
  default: jest.fn(),
}));

// Mock next/font
jest.mock("next/font/google", () => ({
  Inter: () => ({
    className: "mock-inter-font",
  }),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

// Custom render function for root layout
export function renderWithRootLayout(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) {
  return render(ui, {
    ...options,
    wrapper: ({ children }) => (
      <div className="mock-inter-font">{children}</div>
    ),
  });
}

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

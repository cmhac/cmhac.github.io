import { render, screen } from "@testing-library/react";
import ProjectPage from "../page";
import { mockSiteSettings } from "@/app/__tests__/test-utils";

const projects = [
  {
    slug: "first",
    title: "First Project",
    note: "First note",
    kind: "Reporting and analysis" as const,
    order: 1,
    content: "First body.",
  },
  {
    slug: "second",
    title: "Second Project",
    note: "Second note",
    kind: "Reporting and analysis" as const,
    order: 2,
    content: "Second body.",
  },
  {
    slug: "third",
    title: "Third Project",
    note: "Third note",
    kind: "Tools and infrastructure" as const,
    order: 1,
    content: "Third body.",
  },
];

jest.mock("@/utils/projects", () => ({
  getProjectBySlug: jest.fn((slug: string) =>
    Promise.resolve(projects.find((p) => p.slug === slug) ?? null),
  ),
  getAllProjects: jest.fn(() => Promise.resolve(projects)),
}));

jest.mock("react-markdown", () => ({
  __esModule: true,
  default: ({ children }: { children: string }) => <p>{children}</p>,
}));

jest.mock("@/utils/site", () => ({
  getSiteSettings: jest.fn(() =>
    Promise.resolve({
      ...require("@/app/__tests__/test-utils").mockSiteSettings,
    }),
  ),
}));

describe("Project detail page", () => {
  it("renders the title, kind and note", async () => {
    render(await ProjectPage({ params: { slug: "second" } }));

    expect(
      screen.getByRole("heading", { level: 1, name: "Second Project" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Reporting and analysis")).toBeInTheDocument();
    expect(screen.getByText("Second note")).toBeInTheDocument();
  });

  it("wraps prev/next around the combined ring of all projects", async () => {
    render(await ProjectPage({ params: { slug: "third" } }));

    // third is last overall, so next should wrap to first
    expect(screen.getByText(/First Project/)).toHaveAttribute(
      "href",
      "/work/first",
    );
    expect(screen.getByText(/Second Project/)).toHaveAttribute(
      "href",
      "/work/second",
    );
  });

  it("links back to the homepage via the author name", async () => {
    render(await ProjectPage({ params: { slug: "first" } }));

    const backLink = screen.getByText(mockSiteSettings.author);
    expect(backLink).toHaveAttribute("href", "/");
  });
});

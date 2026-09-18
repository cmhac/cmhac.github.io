import { render, screen } from "@testing-library/react";
import Home from "../page";
import { mockSiteSettings } from "./test-utils";

const analysisProjects = Array.from({ length: 6 }, (_, i) => ({
  slug: `analysis-${i}`,
  title: `Analysis project ${i}`,
  note: `Analysis note ${i}`,
  kind: "Reporting and analysis" as const,
  order: i,
}));

const toolsProjects = [
  {
    slug: "tool-0",
    title: "Tool project 0",
    note: "Tool note 0",
    kind: "Tools and infrastructure" as const,
    order: 0,
  },
];

jest.mock("@/utils/projects", () => ({
  getProjectsByKind: jest.fn((kind: string) =>
    Promise.resolve(
      kind === "Reporting and analysis" ? analysisProjects : toolsProjects,
    ),
  ),
}));

jest.mock("@/utils/experience", () => ({
  getExperience: jest.fn(() =>
    Promise.resolve([
      {
        order: 1,
        title: "Computational Journalist",
        org: "The Washington Post · Washington, DC",
        dates: "Nov 2025 – Present",
        roles: [],
      },
      {
        order: 2,
        title: "WBBM | CBS Chicago",
        org: "Chicago, IL",
        dates: "Jan 2019 – Apr 2022",
        roles: [
          { title: "Data Journalist", dates: "Aug 2019 – Apr 2022" },
          { title: "Desk Assistant", dates: "Jan 2019 – Aug 2019" },
        ],
      },
    ]),
  ),
}));

jest.mock("@/utils/site", () => ({
  getSiteSettings: jest.fn(() => Promise.resolve(mockSiteSettings)),
}));

describe("Home Page", () => {
  it("renders the header with name and bio", async () => {
    render(await Home());

    expect(
      screen.getByRole("heading", { level: 1, name: "Chris Hacker" }),
    ).toBeInTheDocument();
    expect(screen.getByText(mockSiteSettings.bio)).toBeInTheDocument();
  });

  it("shows only 5 reporting and analysis items with a show more button", async () => {
    render(await Home());

    expect(screen.getByText("Analysis project 0")).toBeInTheDocument();
    expect(screen.getByText("Analysis project 4")).toBeInTheDocument();
    expect(screen.queryByText("Analysis project 5")).not.toBeInTheDocument();
    expect(screen.getAllByText("Show more").length).toBeGreaterThan(0);
  });

  it("does not show a show more button for a section under the page size", async () => {
    render(await Home());

    expect(screen.getByText("Tool project 0")).toBeInTheDocument();
  });

  it("renders experience with nested roles", async () => {
    render(await Home());

    expect(screen.getByText("Computational Journalist")).toBeInTheDocument();
    expect(screen.getByText("WBBM | CBS Chicago")).toBeInTheDocument();
    expect(screen.getByText("Data Journalist")).toBeInTheDocument();
    expect(screen.getByText("Desk Assistant")).toBeInTheDocument();
  });

  it("renders contact links", async () => {
    render(await Home());

    const githubLink = screen.getByText("GitHub").closest("a");
    expect(githubLink).toHaveAttribute("href", "https://github.com/cmhac");

    const linkedinLink = screen.getByText("LinkedIn").closest("a");
    expect(linkedinLink).toHaveAttribute("href", "#");
  });

  it("renders the footer", async () => {
    render(await Home());

    expect(screen.getByText(mockSiteSettings.location)).toBeInTheDocument();
    expect(screen.getByText(mockSiteSettings.updatedLabel)).toBeInTheDocument();
  });
});

import { metadata } from "../layout";

describe("RootLayout", () => {
  it("exports correct metadata", () => {
    expect(metadata).toBeDefined();
    expect(metadata.title).toBe("Chris Hacker");
    expect(metadata.description).toContain("Washington Post");
  });
});

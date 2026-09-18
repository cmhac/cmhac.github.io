import { render, screen, fireEvent } from "@testing-library/react";
import ShowMoreList from "../ShowMoreList";

const items = Array.from({ length: 12 }, (_, i) => ({
  slug: `item-${i}`,
  title: `Item ${i}`,
  note: `Note ${i}`,
}));

describe("ShowMoreList", () => {
  it("shows only the first 5 items initially", () => {
    render(<ShowMoreList items={items} />);
    expect(screen.getByText("Item 0")).toBeInTheDocument();
    expect(screen.getByText("Item 4")).toBeInTheDocument();
    expect(screen.queryByText("Item 5")).not.toBeInTheDocument();
  });

  it("reveals 5 more items per click and hides the button when exhausted", () => {
    render(<ShowMoreList items={items} />);

    fireEvent.click(screen.getByText("Show more"));
    expect(screen.getByText("Item 9")).toBeInTheDocument();
    expect(screen.queryByText("Item 10")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Show more"));
    expect(screen.getByText("Item 11")).toBeInTheDocument();
    expect(screen.queryByText("Show more")).not.toBeInTheDocument();
  });

  it("does not render a show more button when the list fits on one page", () => {
    render(<ShowMoreList items={items.slice(0, 3)} />);
    expect(screen.queryByText("Show more")).not.toBeInTheDocument();
  });

  it("links each row to its work page", () => {
    render(<ShowMoreList items={items.slice(0, 1)} />);
    expect(screen.getByText("Item 0").closest("a")).toHaveAttribute(
      "href",
      "/work/item-0",
    );
  });
});

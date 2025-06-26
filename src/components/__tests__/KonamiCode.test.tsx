import { render, fireEvent } from "@testing-library/react";
import KonamiCode from "../KonamiCode";

describe("KonamiCode", () => {
  let originalOpen: typeof window.open;

  beforeEach(() => {
    // Store the original window.open
    originalOpen = window.open;
    // Mock window.open
    window.open = jest.fn();
  });

  afterEach(() => {
    // Restore original window.open
    window.open = originalOpen;
  });

  it("should open CMS in new tab when Konami code is entered correctly", () => {
    render(<KonamiCode />);

    // Simulate Konami code sequence
    const sequence = [
      "ArrowUp",
      "ArrowUp",
      "ArrowDown",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "ArrowLeft",
      "ArrowRight",
      "b",
      "a",
    ];

    sequence.forEach((key) => {
      fireEvent.keyDown(window, { key });
    });

    expect(window.open).toHaveBeenCalledWith(
      "https://portfolio-site-cms.vercel.app/cmhac/portfolio-site/main/file/site",
      "_blank",
    );
  });

  it("should not open new tab for incorrect sequence", () => {
    render(<KonamiCode />);

    // Simulate wrong sequence
    const wrongSequence = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    wrongSequence.forEach((key) => {
      fireEvent.keyDown(window, { key });
    });

    expect(window.open).not.toHaveBeenCalled();
  });
});

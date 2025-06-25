import { render } from "@testing-library/react";
import { ReactElement } from "react";

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

// Custom render function for root layout
export function renderRootLayout(ui: ReactElement) {
  return render(ui, {
    container: document.documentElement,
  });
}

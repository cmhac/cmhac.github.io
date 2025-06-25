import "@testing-library/jest-dom";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

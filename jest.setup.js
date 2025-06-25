import "@testing-library/jest-dom";

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, className }) => (
    <img src={src} alt={alt} className={className} />
  ),
}));

// Mock next/font/google
jest.mock("next/font/google", () => ({
  Inter: () => ({
    className: "mock-inter-font",
  }),
}));

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

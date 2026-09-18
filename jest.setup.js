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
  Instrument_Sans: () => ({
    className: "mock-instrument-sans-font",
  }),
}));

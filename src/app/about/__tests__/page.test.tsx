import { render, screen } from "@testing-library/react";
import AboutPage from "../page";

// Mock the fs/promises module
jest.mock("fs/promises", () => ({
  readFile: jest.fn().mockResolvedValue(`---
title: About Me
description: Learn more about my background and skills in web development
---

Welcome to my portfolio! I am a passionate developer who loves building modern web applications using cutting-edge technologies.

This portfolio is built with Next.js, TypeScript, Tailwind CSS, and Pages CMS, showcasing my projects and skills in web development.`),
}));

describe("About Page", () => {
  it("renders the about page content", async () => {
    render(await AboutPage());

    // Check title
    expect(screen.getByText("About Me")).toBeInTheDocument();

    // Check paragraphs
    expect(
      screen.getByText(
        "Welcome to my portfolio! I am a passionate developer who loves building modern web applications using cutting-edge technologies.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "This portfolio is built with Next.js, TypeScript, Tailwind CSS, and Pages CMS, showcasing my projects and skills in web development.",
      ),
    ).toBeInTheDocument();
  });
});

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
  it("renders the about page with terminal styling", async () => {
    render(await AboutPage());

    // Check terminal-style header
    const prompt = screen.getByText("➜");
    expect(prompt).toHaveClass("text-terminal-green");

    const command = screen.getByText("about");
    expect(command).toHaveClass("text-terminal-purple");

    // Check content
    const paragraphs = screen.getAllByText(/./);
    paragraphs.forEach((paragraph) => {
      if (paragraph.tagName.toLowerCase() === "p") {
        expect(paragraph).toHaveClass(
          "text-terminal-text/80",
          "text-lg",
          "leading-relaxed",
        );
      }
    });

    // Check social links
    const socialLinks = ["github", "linkedin", "twitter"].map((platform) =>
      screen.getByText(`➜ ${platform}`),
    );
    socialLinks.forEach((link) => {
      expect(link).toHaveClass(
        "text-terminal-green",
        "hover:text-terminal-cyan",
        "font-mono",
      );
    });
  });
});

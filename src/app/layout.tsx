import "./globals.css";
import "@fontsource/fira-code";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chris Hacker | Data Journalist & Engineer",
  description:
    "Investigative data reporter and engineer specializing in data analysis and custom tools for complex reporting challenges.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} grid-bg min-h-screen`}>
        <Navigation />
        <main className="container mx-auto px-4 py-8 relative z-10 animate-text-reveal">
          {children}
        </main>
      </body>
    </html>
  );
}

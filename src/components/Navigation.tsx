"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const getPathDisplay = () => {
    switch (pathname) {
      case "/projects":
        return "projects";
      case "/about":
        return "about";
      default:
        return "";
    }
  };

  return (
    <nav className="bg-terminal/50 backdrop-blur-sm fixed w-full z-50 border-b border-terminal-selection">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo/Home link */}
          <Link
            href="/"
            className="flex items-center text-xl font-mono font-bold group"
          >
            <span className="text-terminal-purple hover:text-terminal-cyan transition-colors">
              chris_hacker
            </span>
            {getPathDisplay() && (
              <>
                <span className="text-terminal-text">/</span>
                <span className="text-terminal-green transition-colors group-hover:text-terminal-text/50">
                  {getPathDisplay()}
                </span>
              </>
            )}
          </Link>

          {/* Navigation Links - Now a separate flex container */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <Link
              href="/"
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium link-underline ${
                isActive("/")
                  ? "text-terminal-cyan"
                  : "text-terminal-text hover:text-terminal-purple"
              }`}
            >
              ~/home
            </Link>
            <Link
              href="/projects"
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium link-underline ${
                isActive("/projects")
                  ? "text-terminal-cyan"
                  : "text-terminal-text hover:text-terminal-purple"
              }`}
            >
              ~/projects
            </Link>
            <Link
              href="/about"
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium link-underline ${
                isActive("/about")
                  ? "text-terminal-cyan"
                  : "text-terminal-text hover:text-terminal-purple"
              }`}
            >
              ~/about
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-terminal-text hover:text-terminal-purple focus:outline-none focus:ring-2 focus:ring-terminal-purple"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden" id="mobile-menu">
        <div className="pt-2 pb-3 space-y-1 bg-terminal-selection/50 backdrop-blur-sm">
          <Link
            href="/"
            className={`block px-3 py-2 text-base font-medium border-l-2 ${
              isActive("/")
                ? "border-terminal-purple bg-terminal-selection text-terminal-cyan"
                : "border-transparent text-terminal-text hover:border-terminal-purple hover:text-terminal-purple"
            }`}
          >
            ~/home
          </Link>
          <Link
            href="/projects"
            className={`block px-3 py-2 text-base font-medium border-l-2 ${
              isActive("/projects")
                ? "border-terminal-purple bg-terminal-selection text-terminal-cyan"
                : "border-transparent text-terminal-text hover:border-terminal-purple hover:text-terminal-purple"
            }`}
          >
            ~/projects
          </Link>
          <Link
            href="/about"
            className={`block px-3 py-2 text-base font-medium border-l-2 ${
              isActive("/about")
                ? "border-terminal-purple bg-terminal-selection text-terminal-cyan"
                : "border-transparent text-terminal-text hover:border-terminal-purple hover:text-terminal-purple"
            }`}
          >
            ~/about
          </Link>
        </div>
      </div>
    </nav>
  );
}

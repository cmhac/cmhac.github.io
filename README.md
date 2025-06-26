# Portfolio Website

[![Deploy to GitHub Pages](https://github.com/cmhac/portfolio-site/actions/workflows/deploy.yml/badge.svg)](https://github.com/cmhac/portfolio-site/actions/workflows/deploy.yml)

Source code and deployment configuration for my professional portfolio website.

## About this site

### Tech Stack

This site is built with with TypeScript, React, Next.js, and Tailwind CSS. Site is hosted on GitHub Pages, and the content is managed via [Pages CMS](https://pagescms.org) deployed with [Vercel](https://vercel.com) and using [Turso](https://turso.tech) for the database.

- [TypeScript](https://www.typescriptlang.org) for type safety
- [Next.js](https://nextjs.org) for server-side rendering and routing
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Gray Matter](https://github.com/jonschlinkert/gray-matter) for parsing Markdown files
- [Pages CMS](https://pagescms.org) for content management
- [Turso](https://turso.tech) for the database
- [Vercel](https://vercel.com) for deployment
- [GitHub Pages](https://pages.github.com) for hosting

### Development tools

Development workflow is streamlined with modern tooling:

- ESLint and Prettier for code quality
- Husky for Git hooks
- lint-staged for pre-commit checks
- pnpm for fast, efficient package management

### Testing

Comprehensive testing setup using:

- Jest for unit and integration tests
- React Testing Library for component testing
- High test coverage for core components
- Automated test runs on every commit

### Cursor

Built using [Cursor](https://cursor.sh). [Context7](https://context7.com) MCP server is used to provide documentation for key tools and libraries, and agents are given [custom instructions](.cursor/rules/test-driven-development.mdc) to guide their development.

### Continuous Integration/Deployment

Tests/builds/deployments are handled by a [GitHub Actions workflow](.github/workflows/deploy.yml).

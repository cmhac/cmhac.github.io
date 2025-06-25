# Portfolio Website

Source code and deployment configuration for my professional portfolio website. The site is built with modern web technologies and uses a decoupled CMS for content management.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Content Management**: [Pages CMS](https://pagescms.org)
- **Testing**: Jest + React Testing Library
- **Deployment**: GitHub Pages (Static Export)

## Content Management

Content (projects, about page, etc.) is managed through a separate repository using Pages CMS: [portfolio-site-cms](https://github.com/cmhac/portfolio-site-cms).

The CMS setup allows for:

- Managing project entries with images and descriptions
- Editing the about page content
- Updating site metadata
- Managing media assets

Changes made through the CMS trigger a rebuild and redeploy of the site automatically.

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

## Deployment

The site is automatically built and deployed to GitHub Pages on every push to the main branch. The deployment process includes:

1. Running all tests
2. Type checking
3. Building a static export
4. Deploying to GitHub Pages

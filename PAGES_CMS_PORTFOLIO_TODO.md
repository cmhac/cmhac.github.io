# Portfolio Site with Pages CMS: TODO List

This checklist will guide you through building a static portfolio website integrated with [Pages CMS](https://pagescms.org/). It is based on official and community documentation, and assumes you have already connected your repo to Pages CMS.

---

## 1. Project Setup

- [ ] **Choose a Static Site Generator** (Astro, Next.js, Eleventy, Hugo, etc.)
  - Recommended: [Astro](https://astro.build/) for easy Markdown content integration.
- [ ] **Initialize the Project**
  - Example (Astro): `npm create astro@latest`
  - Example (Next.js): `npx create-next-app --example with-static-export my-portfolio`
- [ ] **Set up GitHub repository** (if not already done)
- [ ] **Install dependencies** for your chosen generator

## 2. Content Structure & Pages CMS Configuration

- [ ] **Plan your content types** (e.g., Projects, Blog, About, Contact, Site Settings)
- [ ] **Create a `.pages.config.yml` file** in the repo root
  - Define collections (e.g., `projects`, `blog`)
  - Define editable files (e.g., `site-settings`)
  - Example structure:
    ```yaml
    content:
      - name: projects
        label: Projects
        path: src/content/projects
        filename: "{fields.title}.md"
        type: collection
        fields:
          - name: title
            label: Title
            type: string
          - name: description
            label: Description
            type: text
          - name: url
            label: Project URL
            type: string
          - name: image
            label: Project Image
            type: image
          - name: body
            label: Details
            type: rich-text
      - name: site-settings
        label: Site Settings
        path: src/config/site.json
        type: file
        fields:
          - name: title
            label: Website title
            type: string
          - name: description
            label: Website description
            type: string
          - name: url
            label: Website URL
            type: string
    media:
      input: public/media
      output: /media
    ```
- [ ] **Push the config to GitHub** and verify Pages CMS recognizes it

## 3. Content Creation (via Pages CMS)

- [ ] **Log in to [Pages CMS](https://app.pagescms.org/)**
- [ ] **Create entries** for each collection (e.g., add projects, blog posts)
- [ ] **Edit site settings** as needed
- [ ] **Upload media** (images, etc.)

## 4. Integrate Content with Static Site Generator

- [ ] **Configure your generator to read content** from the directories specified in `.pages.config.yml`
  - For Astro: use [Content Collections](https://docs.astro.build/en/guides/content-collections/)
  - For Next.js: use `fs` or a content layer to read Markdown/JSON
- [ ] **Create page templates** for:
  - Home
  - Projects listing & detail
  - Blog listing & posts
  - About/Contact
  - 404 page
- [ ] **Render content fields** (frontmatter, body, images, etc.) in your templates
- [ ] **Use site settings** (title, description, etc.) for SEO and layout
- [ ] **Handle media paths** (ensure `/media/...` works in your build)

## 5. Styling & UX

- [ ] **Choose or create a theme** (custom CSS, Tailwind, etc.)
- [ ] **Add navigation** (header, footer, menus)
- [ ] **Optimize for mobile and accessibility**

## 6. Deployment

- [ ] **Set up deployment** (Netlify, Vercel, Cloudflare Pages, GitHub Pages, etc.)
  - Example (Astro): Connect repo to Vercel/Netlify and set build command/output dir
  - Example (Next.js): Use static export and deploy `out` directory
- [ ] **Test automatic redeploys** when content changes via Pages CMS

## 7. (Optional) Enhancements

- [ ] **Add analytics** (Google Analytics, Plausible, etc.)
- [ ] **Add contact form** (use a static form service)
- [ ] **Add custom domains and SSL**
- [ ] **Set up SEO and social sharing metadata**

---

**References:**

- [Pages CMS Docs](https://pagescms.org/docs)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [CSS-Tricks: Using Pages CMS for Static Site Content Management](https://css-tricks.com/using-pages-cms-for-static-site-content-management/)
- [Astro Blog Starter Example](https://github.com/withastro/astro/tree/latest/examples/blog)

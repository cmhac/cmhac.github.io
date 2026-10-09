---
title: CBS News graphics rig
description:
  A graphics monorepo, an automated CI pipeline and a Svelte component
  library I built so the CBS News data team could publish interactive features
  on its own.
technologies:
  Svelte: "Component library for the team's interactives"
  GitHub Actions: "Automated CI pipeline for building and deploying projects"
  JavaScript: "Core language for the component library and build tooling"
  Monorepo: "Single repository holding every graphics project"
url: ""
image: ""
featured: false
featureRank: null
date: 2025-01-01
kind: Tools and infrastructure
---

I built the graphics rig that CBS News used to publish interactive stories. The data team had big stories it wanted to highlight and the frontend skills to build them, but no means of actually getting an interactive onto the site — so ambitious ideas either shipped as flat images or didn't ship at all.

The rig pairs a large graphics monorepo with an automated CI pipeline built on GitHub Actions. A journalist develops a new interactive inside the monorepo, and the pipeline takes care of building and deploying it, which turns publishing a feature into part of the normal git workflow rather than a separate engineering project. I also wrote the team a Svelte component library to use in those interactives, so the pieces every story needs didn't have to be rebuilt from scratch each time.

Every story published to `cbsnews.com/projects` went out through this rig.

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
date: 2026-10-09
kind: Tools and infrastructure
---

I built the graphics rig that CBS News used to publish interactive stories. The data team had big stories it wanted to highlight and the frontend skills to build them, but no means of actually getting an interactive onto the site. I built a simple solution that fit into existing git workflows and enabled the team to publish dozens of ambitious stories.

The "rig" is simple: a GitHub Actions pipeline that runs on a single graphics monorepo. A journalist develops a new interactive in the monorepo, and the pipeline takes care of building and deploying it. Users can deploy internal-only previews off of git branches before merging, allowing iterative development that can be shared with non-technical staff for review. I also wrote a Svelte component library to use in projects published on the rig, so components don't need to be rebuilt from scratch each time, and site-wide design changes can be easily applied to previously-published stories. 

Every story published to `cbsnews.com/projects` was created with this rig; here are a few recent examples:

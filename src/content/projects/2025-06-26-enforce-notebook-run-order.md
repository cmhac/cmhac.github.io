---
title: enforce-notebook-run-order
description: A Python-based pre-commit hook to force Jupyter notebooks to be run
  in the correct order
technologies:
  Python: "Programming language for building the validation tool"
  Pre-commit: "Git hook framework for automated code quality checks"
url: https://github.com/cmhac/enforce-notebook-run-order
image: /media/Screenshot 2025-06-26 at 5.26.02 PM.png
featured: false
featureRank: null
date: 2023-05-30
---

I built `enforce-notebook-run-order` because Jupyter encourages running cells out of order, which undermines reproducibility. The package walks through the notebook’s JSON, checks that each cell’s execution is linear and throws a clear exception if it doesn't, stopping bad notebooks from ever reaching version control. 

The tool ships as both a lightweight CLI (nbcheck) and a pre-commit hook: you can point it at individual files or entire directories, or drop a three-line snippet into a `.pre-commit-config.yaml` so every push is automatically vetted.

The hook forces collaborators to rerun notebooks before commit, guaranteeing that anyone who clones the repo gets results identical to the author’s. Since I created it, it's become a staple of my team's workflows and is also used by other researchers in the US and UK.

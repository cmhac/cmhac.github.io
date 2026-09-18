---
title: State data center legislation
note: LLM classification of state bills using a YAML codebook.
kind: Reporting and analysis
order: 1
---

Data centers have become a live political question in statehouses, but the bills that govern them are scattered across fifty legislatures and rarely say "data center" in the title.

I built a codebook-driven classifier to find and categorize them: the codebook lives in YAML, the model applies it to bill text, and a separate relevance classifier screens out the noise. Evaluated against a hand-labeled gold dataset, the relevance classifier ran at 96% accuracy.

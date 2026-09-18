---
title: Document ingestion and analysis platform
note: Scrapes and analyzes local government meeting records, architected to expand to courts, financial filings and nonprofits.
kind: Tools and infrastructure
order: 1
---

This is the central piece of infrastructure I own. It started as a system for scraping and analyzing local government meeting records — agendas, minutes, packets — and was architected from the start to expand to courts, financial filings, nonprofits and other document sources.

Ingestion runs on Dagster and AWS ECS. Documents are parsed, stored in Postgres and exposed to reporters through a PostgREST API. Topic modeling with BERTopic surfaces what local bodies are actually spending time on, and trend analysis flags when a subject starts appearing in places it didn't before.

I'm rebuilding it now as a v2 organized around a list of target cities and counties and the dozen or so meeting platforms most of them run on, so adding a new jurisdiction is configuration rather than a new scraper.

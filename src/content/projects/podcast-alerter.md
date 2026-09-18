---
title: Podcast alerter
note: Monitors podcasts and alerts reporters to relevant mentions.
kind: Tools and infrastructure
order: 4
---

Podcasts are a real source of newsworthy quotes and almost nobody has time to listen to them. This tool monitors podcast transcripts and alerts reporters when a subject they care about gets mentioned.

It's built with n8n for orchestration, the Podscan API for transcripts and OpenAI for relevance judgments. It has three parts: discovery of shows worth watching, delivery of alerts, and a sign-up flow so reporters can subscribe to their own topics.

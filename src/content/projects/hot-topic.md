---
title: Hot Topic
note: Searchable trending-terms tool for the newsroom.
kind: Tools and infrastructure
order: 2
---

Hot Topic is a searchable trending-terms tool owned by my team. It lets reporters see which words and phrases are spiking across a corpus and go straight to the documents behind the spike.

I've been architecting a multi-pipeline version built on n-gram frequency anomaly detection, so the same detection logic can run over several different corpora at once and report into one interface.

---
title: Trump keeps targeting late-night TV. The hosts keep pushing back.
description: I used machine learning to analyze more than 400 hours of late-night
  comedy clips, showing the share of jokes aimed at Trump kept climbing despite
  FCC threats and his repeated calls to get the hosts fired.
technologies:
  Python: "Data analysis programming language"
  NLP: "Named-entity recognition over show transcripts"
  LLM: "Identifying jokes and the target of each one"
  Topic modeling: "Surfacing themes recurring across many jokes"
url: https://www.washingtonpost.com/entertainment/tv/2026/05/21/trump-keeps-targeting-late-night-tv-hosts-keep-pushing-back/
image: ""
featured: false
featureRank: null
date: 2026-05-21
kind: Reporting and analysis
---

With Elahe Izadi and Emily Yahr, I analyzed more than 400 hours of video clips from six late-night comedy shows posted to YouTube since the 2024 election: "The Late Show With Stephen Colbert," "Jimmy Kimmel Live," "The Tonight Show Starring Jimmy Fallon," "Late Night With Seth Meyers," "The Daily Show" and "Real Time With Bill Maher."

The analysis ran in three steps. First I scanned the transcripts to identify every individual mentioned in a clip. Then I used a model to find the jokes and determine who was the target of each one — a distinction that matters, because being named in a joke is not the same as being its subject. Finally, I applied topic modeling to surface the themes that recurred across many jokes at once.

That produced a database linking every joke to the people it named, the topics it covered and the date it posted, which let us track how the shows responded to the administration over time. Trump remained the most frequently mentioned individual, and the proportion of material with him as the target of the joke climbed steadily — even as the FCC chair leaned on the four shows carried by broadcast networks, whose use of the public airwaves falls more directly under the agency's purview.

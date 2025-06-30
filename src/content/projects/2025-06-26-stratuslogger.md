---
title: stratuslogger
description: A Chrome extension that added integrated transcription features
  into the web UI for the Stratus content management system.
technologies:
  Javascript: "Core programming language for the extension"
  React: "Frontend framework for building the UI components"
  Chrome extension: "Browser extension platform for integration with web pages"
url: https://github.com/cmhac/StratusLogger
image: /media/Screenshot 2025-06-26 at 5.46.37 PM.png
featured: false
featureRank: null
date: 2010-12-10
---

I built `stratuslogger` to speed up the mind-numbing task of logging raw video inside Grass Valley’s STRATUS newsroom CMS. The Chrome extension injects a floating transcription panel and listens to the STRATUS HTML5 player, so every time you tap a hotkey it grabs the live time-code, drops an interactive timestamp into a Draft.js note field, and lets you jump straight back to that moment with a single click — no more scribbling times on paper and scrubbing back manually. 

Under the hood it’s a lightweight React build bundled with Webpack; content scripts load only on newsroom domains, the background worker handles keyboard-shortcut state, and everything persists to [chrome.storage](http://chrome.storage) so notes survive page refreshes. A GitHub Actions pipeline lints, tests and auto-packages each tag, then pushes a signed ZIP to the Chrome Web Store — meaning producers always pull the latest version.

By turning the logging step into a one-keystroke workflow, the extension cut clip-annotation time in our control room from minutes to seconds and made the process consistent across shows.

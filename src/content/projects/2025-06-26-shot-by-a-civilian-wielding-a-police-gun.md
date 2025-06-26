---
title: Shot by a civilian wielding a police gun
description: "This multi-year investigation uncovered a hidden economy where
  used police guns are sold to members of the public. "
technologies:
  - FOIA
  - FOIA automation
  - Python
  - ETL
  - LLM
url: https://www.cbsnews.com/police-selling-guns/
image: /media/Screenshot 2025-06-26 at 3.34.08 PM.png
featured: true
date: 2024-05-16
---
I led a team of journalists from CBS News, The Trace, and Reveal from the Center for Investigative Reporting to report this this two-year investigation into the sale of used police duty weapons to members of the public.

I built a system to automate hundreds of public records requests to law enforcement agencies across the country, seeking contracts and receipts related to departmental weapon sales. The system automatically reviewed requests to a shared inbox and used a combination of traditional methods and large language models to summarize tagged messages, helping reduce the typically-heavy workload of a mass-FOIA campaign.

I then built an ETL pipeline to process millions of rows of data on both sold guns and guns used in crimes, which allowed us to trace firearms from the departments that sold them to the departments that recovered them at crime scenes.

After we published our investigation, the ATF [officially recommended law enforcement agencies stop selling guns to the public](https://www.cbsnews.com/news/atf-recommends-police-reevaluate-selling-guns-public/), and [over a dozen](https://www.thetrace.org/newsletter/police-agencies-are-rethinking-policies-on-reselling-their-used-guns/) major police departments [committed to stop selling their used guns](https://www.cbsnews.com/news/law-enforcement-agencies-stop-reselling-guns-crimes/). [This story was also a finalist for a 2024 IRE Freedom of Information Award.](https://www.ire.org/announcing-the-2024-ire-award-winners-and-finalists/)
---
title: 'A "coin flip": Nearly half of U.S. murders go unsolved'
description: I decoded and analyzed FBI homicide data to reveal that nearly half
  of U.S. murders go unsolved and that clearance rates are even worse for Black
  and Hispanic victims.
technologies:
  - Python
  - ETL
  - Django
  - FOIA
url: https://www.cbsnews.com/news/unsolved-murders-crime-without-punishment/
image: /media/Screenshot 2025-06-26 at 5.19.26 PM.png
featured: false
featureRank: null
date: 2022-12-29
---

I began by decoding the FBI’s archaic “Return A” homicide tallies and 2020 Supplemental Homicide Report, whose column positions are explained only in typewritten manuals from the 1960s. I translated those manuals into Python parsers, turning every record into a clean, machine-readable table and open-sourcing the code so anyone can replicate or audit the work.

With the data normalized, I applied a straightforward rule: when the SHR listed offender demographics, I counted the murder as solved; when those fields were blank, I treated it as open. That let me calculate clearance rates for every reporting agency and, by pairing the rule with victim race, reveal that cases involving Black or Hispanic victims stall far more often than those involving White victims.

To put the findings in local context, I shipped the cleaned tables and notebooks to 14 CBS stations for follow-up reporting. Because Chicago and a few other large cities no longer submit clearance numbers to the FBI, filed FOIAS with those police departments, ensuring the national picture was truly complete and highlighting that nearly half of U.S. homicides still go unpunished.

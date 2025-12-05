---
title: "Star History Monthly Pick | February 2023"
author: "Mila"
featured: true
featureImage: "/assets/blog/star-history-monthly-pick-202302/banner.webp"
publishedDate: "2023-03-16T09:50:06.000Z"
description: "Some of the most fascinating open-source projects and the stories behind these projects we discovered throughout February."
---

🌸 Spring has sprung (read: whaaat how is it already March) and it’s time to take a closer look at Star History’s picks for February!

In case you didn’t know, each month Star History picks out some of the most fascinating open-source projects that we share over [@StarHistoryHQ](https://twitter.com/StarHistoryHQ), and also tries to explore the stories behind these projects.

## Kruise

![kruise](/assets/blog/star-history-monthly-pick-202302/kruise.webp)

[OpenKruise](https://github.com/openkruise/kruise) automates operations like deployment, upgrade, ops and maintanance for your applications. It is developed based on Alibaba's accumulated best practices in large-scale application management. A brief summary of OpenKruise's history: it was [announced](https://www.alibabacloud.com/blog/595071) at KubeCon 2019 and was donated to CNCF at the end of 2020. Just this last month, they became a [CNCF incubation project](https://www.cncf.io/blog/2023/03/02/openkruise-becomes-a-cncf-incubating-project/)! 🎉🎉🎉 What a whirlwind of a journey.

Kruise already has [40+ users](https://github.com/openkruise/kruise/issues/289), as per their "wanted" board, it's certainly a smart way to collect user info (and gather user requests)!

## tbls

![tbls](/assets/blog/star-history-monthly-pick-202302/tbls.webp)

[tbls](https://github.com/k1LoW/tbls) presents a full range of database structure information. Supported databases include PostgreSQL, MySQL, MariaDB, SQLite, BigQuery, etc. Another handy feature is checking differences between databases.

![tbls-diff](/assets/blog/star-history-monthly-pick-202302/tbls-diff.webp)

The project has been open-sourced for 5+ years, but the number of stars had a spike earlier this year. Anyone has any idea what happened in between?

## Telegraf

![telegraf](/assets/blog/star-history-monthly-pick-202302/telegraf.webp)

[Telegraf](https://github.com/influxdata/telegraf) is a plugin-driven server agent that collects and sends metrics and events from databases, systems and IoT sensors and outputs them to data storage systems, and makes it possible for real-time monitoring and analysis.

It was open-sourced in 2015 by InfluxData, which closed a whopping $81 million in [Series E](https://www.influxdata.com/blog/influxdata-closes-series-e-round-and-raises-81-million/) funding this February 💰. Back then, Telegraf was first developed to meet the needs of InfluxDB, a time-based database, to collect and process different types of data and send it to InfluxDB for storage and analysis. Telegraf has since evolved into a standalone software. Despite it not being InfluxData's star product, it doesn't stop its ecosystem from thriving, they now have 200+ input and 50+ output plugins that can integrate with a variety of data storage and processing systems.

![telegraf-architecture](/assets/blog/star-history-monthly-pick-202302/telegraf-architecture.webp)

## Trigger.dev

![triggerdotdev](/assets/blog/star-history-monthly-pick-202302/triggerdotdev.webp)

[Trigger.dev](https://github.com/triggerdotdev/trigger.dev) is a developer-first open-source Zapier alternative that allows developers to create workflows directly in code. Developers often have to help non-tech people build workflows in no/low-code tools, which rely on sacrificing customization for convenience. For developers, however, it's not _that_ complicated to build, test, and run workflows on their own.

Of course, you can also go straight to the other extreme: create notifications directly from GitHub to Slack via Slack's webhook system, though you have no control over how this alert appears on your Slack or interacts between the two applications. Trigger.dev already integrates with GitHub and Slack, which means you can create a customizable workflow directly in code that you can later customize and extend to meet your needs. trigger.dev now supports GitHub, Notion, WhatsApp, Resend, Airtable, and Sendgrid integration, which isn't much, but is well enough for basic needs.

Going through their Twitter feed, it looks like the Trigger.dev team was researching API-related things last August. The site with the highest number of votes, apihero.run, now redirects to trigger.dev 😆.

![triggerdotdev-api](/assets/blog/star-history-monthly-pick-202302/triggerdotdev-api.webp)

But it looks like they eventually went after SDK, and officially released earlier this year (which [landed](https://news.ycombinator.com/item?id=34610686) on the HN front page).

![triggerdotdev-hn](/assets/blog/star-history-monthly-pick-202302/triggerdotdev-hn.webp)

## Trustfall

![trustfall](/assets/blog/star-history-monthly-pick-202302/trustfall.webp)

[Trustfall](https://github.com/obi1kenobi/trustfall) can query any data source: websites, text files or databases. It was actually open-sourced last year, but it was posted by someone to [HN](https://news.ycombinator.com/item?id=34705246) and then caught fire.

![trustfall-hn](/assets/blog/star-history-monthly-pick-202302/trustfall-hn.webp)

Here's an intro by the author himself: GraphQL, OpenAPI, JSON (with JSON schema or not), SQL, RDF/SPARQL–and none of them can natively talk to each other. Sure, you can stick JSON into Postgres, or compile GraphQL to SQL -- I've done both in production and it's always ultimately a poor fit because you're cramming one system into another when it was never originally designed to support that.

Say you want to query the GitHub or Twitter accounts of HN users that have commented on HN submissions about OpenAI. This data is available from Firebase and Algolia's HN APIs, but you will need to write a script to look it up – but would anyone really bother to do so? Or is it just not really worth it? This is exactly what Trustfall is trying to solve.

## Last but not least

🍾 Star History is happy to welcome [Ockam](/blog/ockam) as our first [GitHub Sponsor](https://github.com/sponsors/star-history).

Rest assured, Star History's monthly recaps will remain neutral: we will continue to explore the most interesting open-source projects, and there's no sponsored content in this section.

And - make sure to check out our previous round-ups:

1. [Star History Monthly Pick | January 2023](/blog/star-history-monthly-pick-202301)
2. [Open Source Best of 2022 - Front-end](/blog/star-history-yearly-pick-2022-frontend)
3. [Open Source Best of 2022 - Data, Infra & DevTools](/blog/star-history-yearly-pick-2022-data-infra-devtools)
4. [Open Source Best of 2022 - Platform Engineering](/blog/star-history-open-source-2022-platform-engineering)
5. [Open Source Best of 2022 - Open-source Alternatives](/blog/star-history-open-source-2022-open-source-alternatives)

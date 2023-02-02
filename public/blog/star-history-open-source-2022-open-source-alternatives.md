# Star History open-source Best of 2022 | open-source Alternatives

When choosing which tools to use, do you prefer open or closed-source? What are the differences? In this post, let’s take a look at some of the most famous open-source alternatives on the market.

BTW: open-source =! free, while closed source =! paid. While some of the open-source tools are completely free, some tools offer commercial versions and support, while their non-open-source counterparts are instead, free.

## Airbyte - Fivetran alternative

![airbyte](/blog/assets/yearly-pick-open-source-alternatives-2022/airbyte.webp)

[Airbyte](https://github.com/airbytehq/airbyte) is an open-source data integration (ELT) tool created in July 2020. It raised 3 consecutive funding rounds within 2021, from Seed ($5.2M) -> Series A ($26M) -> Series B ($150M).

An enterprise’s data is usually scattered across multiple data sources. The traditional solution is through ETL (Extract, Transform, Load), which is to extract and process data, before transferring it to a data warehouse for easy use when needed. dbt and Fivetran are already serious contenders on this track. With the rise of cloud data warehouses led by Snowflake, the industry paradigm has shifted from ETL to ELT. Airbyte believes that to take ELT a step further ([Fivetran's philosophy](https://www.fivetran.com/blog/what-is-elt): data collected from multiple sources is extracted, sent to a data warehouse, and then transformed into data that is actually useful to analysts), [EL and T will gradually decouple](https://airbyte.com/blog/why-the-future-of-etl-is-not-elt-but-el): instead of ELT, EL completely decouples any transformations that may occur during L - T, and makes it easier to meet the specific needs of different companies and different businesses (some of which may not even need any transformations).

![airbyte-elt](/blog/assets/yearly-pick-open-source-alternatives-2022/airbyte-elt.webp)

## Gogs - GitHub alternative

![gogs](/blog/assets/yearly-pick-open-source-alternatives-2022/gogs.webp)

[Gogs](https://github.com/gogs/gogs) is a long-established self-service Git service. While GitHub is an online, closed-source (yes you read that right) code hosting platform, Gogs can be thought of as GitHub on your own server and was featured in Hacker News 8 years ago.

![gogs-hn](/blog/assets/yearly-pick-open-source-alternatives-2022/gogs-hn.webp)

In fact, Gogs is [defined by the author](https://blog.gopheracademy.com/birthday-bash-2014/gogs-gitlab-alternative-in-go/) as a replacement for GitLab (which is actually open-source) written in Golang. But what's the point of anything else, when you can't install and run the service on your own machine, despite the huge ecosystem, powerful features and integrations?

![gogs-gitlab](/blog/assets/yearly-pick-open-source-alternatives-2022/gogs-gitlab.webp)

## Hydra - Snowflake alternative

![hydra](/blog/assets/yearly-pick-open-source-alternatives-2022/hydra.webp)

[Hydra](https://github.com/hydradatabase/hydra) wanted to build a low-cost open data warehouse solution, as opposed to Snowflake, so they built one on top of Postgres. They snatched a $3.1M seed round in early 2022 and are a member of Y Combinator’s Winter 2022 class. Founder Joseph Sciarrino believes that an organization's data shouldn't be locked up in a vendor's proprietary software. As a heavy Postgres user, he solved this problem by decoupling Postgres' query, compute, and storage layers and building Hydra on top of it. This way, users can continue to use all existing Postgres ecosystems and tools.

![hydra-architecture](/blog/assets/yearly-pick-open-source-alternatives-2022/hydra-architecture.webp)

## Metabase - Tableau alternative

![metabase](/blog/assets/yearly-pick-open-source-alternatives-2022/metabase.webp)

[Metabase](https://github.com/metabase/metabase) is an open-source BI tool for data visualization, data analysis and report generation, and more.

Metabase is very thorough, and you can tell they pay a lot of attention to non-technical users (product managers, marketers, and operations). Even if you don’t know SQL syntax, you can use its visual query builder to answer your own questions and explore freely, no longer limited by the Dashboards already built.

![metabase-view](/blog/assets/yearly-pick-open-source-alternatives-2022/metabase-view.webp)

## NocoDB - Airtable alternative

![nocodb](/blog/assets/yearly-pick-open-source-alternatives-2022/nocodb.webp)

[NocoDB](https://github.com/nocodb/nocodb) is a low-code database platform that closed a $10.5M seed round in late 2022. It supports converting different types of databases and file formats into online spreadsheets. While NocoDB has database capabilities, it's really more of a spreadsheet.

![nocodb-view](/blog/assets/yearly-pick-open-source-alternatives-2022/nocodb-view.webp)

Spreadsheets are so common and intuitive for most people, NocoDB's idea is to make spreadsheets exist in SQL databases, it can transfer any data source in an organization into a spreadsheet interface. As a low-code tool, it lowers the user barrier so that even if you have zero development experience, you can still participate in real collaborative work, which requires real business data.

According to its founder, NocoDB received more than 1M downloads in the first 10 weeks of open-source. It looks like their guess is correct: operating a database is daunting, but operating a spreadsheet is much more grounded.

## Plausible Analytics - Google Analytics alternative

![plausible](/blog/assets/yearly-pick-open-source-alternatives-2022/plausible.webp)

Although Google Analytics is free, if you don’t want to indulge in Google's attempts to collect and analyze users’ personal information, try [Plausible Analytics](https://github.com/plausible/analytics). It’s not free, but now has [nearly 10,000 paying customers](https://twitter.com/PlausibleHQ/status/1617443230920101889) and an ARR (Annual Recurring Revenue) of [$1M](https://plausible.io/blog/open-source-saas).

As a lightweight (<1 KB) and privacy-focused open-source alternative to Google Analytics, Plausible focuses on user privacy (no cookies, full compliance with GDPR, CCPA, and PECR) and you can still have 100% say over your website data. Plausible's [demo page](https://plausible.io/plausible.io) lets you see their official website traffic data in real time, which is so cool!

![plausible-demo](/blog/assets/yearly-pick-open-source-alternatives-2022/plausible-demo.webp)

## Rocket.Chat - Slack alternative

![rocketchat](/blog/assets/yearly-pick-open-source-alternatives-2022/rocketchat.webp)

[Rocket.Chat](https://github.com/RocketChat/Rocket.Chat) was founded in 2015, with the last funding round worth $19M in 2021. [Originally created](https://www.synopsys.com/blogs/software-security/rocket-chat-privately-hosted-chat-services/) as a live chat extension for an internal CRM, it was then open-sourced and commercialized. It is intended for organizations that need more control over their communications because it supports local deployment.

In addition to the aforementioned better security and control, Rocket.Chat's additional feature over Slack is quite lovely: “Omnichannel”, which integrates messages from other platforms (WhatsApp, SMS, Facebook, Twitter, Telegram, and Email) into one single platform.

![rocketchat-slack](/blog/assets/yearly-pick-open-source-alternatives-2022/rocketchat-slack.webp)

## SigNoz - Datadog alternative

![signoz](/blog/assets/yearly-pick-open-source-alternatives-2022/signoz.webp)

[SigNoz](https://github.com/SigNoz/signoz) is an open-source APM tool that focuses on the observability of microservice applications. When you have distributed systems based on microservices, distributed tracing becomes necessary. This can locate and identify your problems quickly instead of wasting time checking multiple logs and dashboards.

![signoz-view](/blog/assets/yearly-pick-open-source-alternatives-2022/signoz-view.webp)

SigNoz’s recent [blogs](https://signoz.io/blog/) might not be the most neutral pieces, but if you want to learn more about monitoring, logging, and tracking topics, it is a good read.

- 7 Open-Source Log Management Tools that you may consider in 2023
- Top 9 observability tools in 2023 perfect for microservices
- Top 11 Splunk Alternatives that you may consider in 2023
- Top 13 open-source APM tools in 2023

## Snowplow - Segment alternative

![snowplow](/blog/assets/yearly-pick-open-source-alternatives-2022/snowplow.webp)

[Snowplow](https://github.com/snowplow/snowplow) is a behavioral data platform that closed a $40M Series B round in 2022. Snowplow enables the collection of behavioral data from mobile apps and websites (how users interact with products, including impressions, clicks, video playback or even custom events of your choosing) to better understand users and determine business strategy.

Snowplow is a vehicle to collect snow, which also reflects Snowplow's intention to collect data. It’s a rather unique name amongst the byte, meta, bases, dbs!

![snowplow-real](/blog/assets/yearly-pick-open-source-alternatives-2022/snowplow-real.webp)

## Supabase - Firebase alternative

![supabase](/blog/assets/yearly-pick-open-source-alternatives-2022/supabase.webp)

[Supabase](https://github.com/supabase/supabase) is an open-source Firebase alternative that provides a Backend-as-a-Service for building applications but it uses Postgres instead of NoSQL.

The first thing I noticed about Supabase is their tagline: “Build in a weekend. Scale to millions”. The messaging, storytelling, and positioning are in such harmony.

![supabase](/blog/assets/yearly-pick-open-source-alternatives-2022/supabase-website.webp)

CEO Paul Copplestone [mentioned](https://open.spotify.com/episode/25C64y5kcKtPMz0UzE0ury) that Supabase was first positioned as "real-time Postgres", and after failing to find users, he found that although everyone loved Postgres, everyone was using Firebase, so Supabase became the "open-source Firebase alternative". We all know the story after: their GitHub now has 45k stars and completed $80M in Series B funding in 2022.

## To round it all up

When comparing similar open or closed-source tools, since most open-source products are advertised as "XXX open-source alternative", the difference between them is mostly:

- Open-source usually means self-deployment, that way you have more control your own data.
- The community is freer and more open: you can choose your own configuration and request features.
- In addition, even if the open-source product is no longer maintained, you can still use it (maybe even better it).

And last but not least, this concludes Star History’s 2022 open-source picks. We had fun browsing through the projects and learning about the different background stories, hope you enjoy it just as much as we did.

See y’all next year. 👋

---

This is part of Star History Open Source 2022 series, you can continue with:

1. [Open Source Best of 2022 - Front-end](/blog/star-history-yearly-pick-2022-frontend).
2. [Open Source Best of 2022 - Data, Infra & DevTools](/blog/star-history-yearly-pick-2022-data-infra-devtools).
3. [Open Source Best of 2022 - Platform Engineering](/blog/star-history-open-source-2022-platform-engineering).
4. and this one, the open-source alternatives.
# Star History Open Source Best of 2022 | Data, Infra & DevTools

Following up on our previous roundup of [Top Front-end open-source projects in 2022](/blog/star-history-yearly-pick-2022-frontend), Star History will round up the open-source projects that stood out in the **Data, Infra, and DevTools** section in 2022.

If you didn’t know,  [star-history.com](http://star-history.com) is a place to view and compare the star history of GitHub repos. We are proud to say that it is the de facto place people turn to for GitHub stars: it is, after all, the first (and second) result on Google. 😆

![google-result](/blog/assets/yearly-pick-data-infra-devtools-2022/google-result.webp)

*Note: the list is in alphabetical order.

## Buf

![buf](/blog/assets/yearly-pick-data-infra-devtools-2022/buf.webp)

[Buf](https://github.com/bufbuild/buf) is a very low-profile company based in Toronto that focuses on improving the developer experience with Protocol Buffers. Their mission is to deprecate REST/JSON and move the industry towards a schema-driven development model with Protobuf. Their products the Buf CLI and Buf Schema Registry help engineers shift most of their time and effort from managing Protobuf files to implementing features and working on their infrastructure.

Buf closed a $68M Series B at the end of 2021 and has kept a low profile for all four rounds of funding, with [the only official statement](https://buf.build/blog/an-update-on-our-fundraising) says that they want people to focus on the API and Protobuf ecosystem, rather than how the company is financing the journey (alas, funding is still a big part of the journey).

![buf-site](/blog/assets/yearly-pick-data-infra-devtools-2022/buf-site.webp)

## Bytebase

![bytebase](/blog/assets/yearly-pick-data-infra-devtools-2022/bytebase.webp)

While the aforementioned Buf targets the API schema, [Bytebase](https://github.com/bytebase/bytebase) targets the database schema hidden behind the API. While there are a number of commercial/open-source database engines on the market, there are only a few tools around to ensure reliable database schema changes. To this day, many engineering teams continue to connect directly to production databases to change data. 💥

- Like how GitHub/GitLab manages code changes, Bytebase provides a GUI to manage database changes.
- Like Figma for designer team collaboration, Bytebase helps DevOps teams collaborate on database management.
- Like how Terraform defines Infrastructure-as-Code, Bytebase aims to build Database-as-Code.

![bytebase-site](/blog/assets/yearly-pick-data-infra-devtools-2022/bytebase-site.webp)

Bytebase is a Database CI/CD tool (Database-as-Code) for DevOps teams, built for developers and DBAs, and the first (and at the time of this post, only) [Database CI/CD solution to be included in the CNCF Landscape](https://www.bytebase.com/blog/cncf-landscape).

The mascots Byte and Base (originated from Bytebase's B, and the shape of a database, respectively) are also adorable.

![byte-base](/blog/assets/yearly-pick-data-infra-devtools-2022/byte-base.gif)

## Casdoor

![casdoor](/blog/assets/yearly-pick-data-infra-devtools-2022/casdoor.webp)

[Casdoor](https://github.com/casdoor/casdoor) is a centralized authentication / SSO platform based on OAuth 2.0 / OIDC. Casdoor is responsible for authentication, but it can also be integrated with [Casbin](https://github.com/casbin/casbin), which is responsible for authorization.

![casdoor-authentication](/blog/assets/yearly-pick-data-infra-devtools-2022/casdoor-authentication.webp)

## Dagger

![dagger](/blog/assets/yearly-pick-data-infra-devtools-2022/dagger.webp)

[Dagger](https://github.com/dagger/dagger) is a new offering from Docker founder Solomon Hykes: a portable devkit for CI/CD pipelines. Along with the [public launch announcement](https://dagger.io/blog/public-launch-announcement), Solomon also announced that Dagger has received $20M in [Series A](https://dagger.io/blog/series-a) funding.

With pipelines configured differently across platforms, engineering teams struggle to cobble together all the pipelines that are difficult to scale or migrate to other cloud platforms, which not only doesn't save labor or time, but makes the deployment painful. DevOps engineers using Dagger can define their pipeline, put together the pieces (think Lego), and implement them all in code that will work on any cloud.

![dagger-architecture](/blog/assets/yearly-pick-data-infra-devtools-2022/dagger-architecture.webp)

BTW: loving the western + docker vibe here. 🤠⚓️

## DuckDB

![duckdb](/blog/assets/yearly-pick-data-infra-devtools-2022/duckdb.webp)

[DuckDB](https://github.com/duckdb/duckdb) is similar in architecture to SQLite in that it is also an embeddable database. The difference is that SQLite focuses on OLTP transactions, while DuckDB aims to be its counterpart for OLAP transactions.

![duckdb-dbms](/blog/assets/yearly-pick-data-infra-devtools-2022/duckdb-dbms.webp)

MotherDuck, which recently announced [$47.5M Series A funding](https://motherduck.com/blog/announcing-series-seed-and-a/), is based on DuckDB.

## Meltano

![meltano](/blog/assets/yearly-pick-data-infra-devtools-2022/meltano.webp)

Created at GitLab in 2018, [Meltano](https://github.com/meltano/meltano) was initially built for GitLab's data and analytics teams. It is a data platform for the DataOps era, designed to help data teams assemble various products on the data platform and manage the entire lifecycle, allowing for version control, code review, continuous integration and deployment (CI/CD), and containerization.

It became [a separate startup](https://about.gitlab.com/press/releases/2021-06-30-meltano-spins-out-of-gitlab-raises-seed-funding-led-by-gv.html) from GitLab in 2021. The source code was initially hosted in GitLab, but [migrated from GitLab to GitHub](https://meltano.com/blog/why-meltano-is-moving-to-github/) in mid-2022, and soon after, it also raised a $12.4M seed round and launched Meltano 2.0 (2022 was a big year for them).

![meltano-workflow](/blog/assets/yearly-pick-data-infra-devtools-2022/meltano-workflow.webp)

## Neon

![neon](/blog/assets/yearly-pick-data-infra-devtools-2022/neon.webp)

[Neon](https://github.com/neondatabase/neon) is a startup that offers serverless Postgres databases for developers and has received $30M in [Series A-1](https://neon.tech/blog/funding-a1/) funding. Besides their product, the visuals the team has come up with is really eye-catching: the cute Postgres elephant becomes a real elephant.

![neon-visuals](/blog/assets/yearly-pick-data-infra-devtools-2022/neon-visuals.webp)

Neon CEO Nikita Shamgunov was an engineer at Microsoft SQL Server and Meta before founding SingleStore. In 2021, he founded Neon with Heikki Linnakangas (previously a Postgres hacker) and Stas Kelvich (previously on the Yandex database team).

They realized that Postgres could be cheaper and more efficient in the cloud by separating storage and compute. As their tagline suggests, Neon is a serverless Postgres built for the cloud. Compute nodes are activated only when a connection comes in and are automatically shut down during periods of inactivity. Regarding storage, cold data can be offloaded to S3 to save costs.

![neon-architecture](/blog/assets/yearly-pick-data-infra-devtools-2022/neon-architecture.webp)

In addition to serverless, another big part of Neon is its focus on the developer workflow. They recently introduced [Branching](https://neon.tech/docs/introduction/branching/), and you can branch your data in the same way you branch your code.

## Opa

![opa](/blog/assets/yearly-pick-data-infra-devtools-2022/opa.webp)

[Open Policy Agent (OPA)](https://github.com/open-policy-agent/opa) is a full-featured policy engine designed to separate policy decisions from software and unify policy enforcement across different platforms and systems. Notably, it is a CNCF incubated ([graduated in 2021](https://www.cncf.io/announcements/2021/02/04/cloud-native-computing-foundation-announces-open-policy-agent-graduation/)) project.

OPA's policies are expressed using Rego, a high-level declarative language. Rego makes it easy to define policies and configure policies (Policy-as-Code) as if you were writing code. For example, questions like: Is Bob allowed to make GET requests to `/api/v1/products`? What records does he have permission to view?

![opa-workflow](/blog/assets/yearly-pick-data-infra-devtools-2022/opa-workflow.webp)

OPA's [Adopter.md](https://github.com/open-policy-agent/opa/blob/main/ADOPTERS.md) includes a number of big names using OPA in prod: Netflix, Pinterest, T-Mobile, etc. The syntax for policies has yet to be standardized, leading to everyone having to build the same wheels repeatedly, and OPA has the potential to change that.

## Steampipe

![steampipe](/blog/assets/yearly-pick-data-infra-devtools-2022/steampipe.webp)

With [Steampipe](https://github.com/turbot/steampipe), you can use SQL to instantly query your cloud services (AWS, Azure, GCP, and more). [Steampipe Cloud](https://steampipe.io/docs/cloud/overview), a fully managed SaaS platform for hosting Steampipe instances, was released January, 2022.

Steampipe's star skyrocketed in October, 2022, thanks to landing on the [Hacker News](https://news.ycombinator.com/item?id=33034351) front page.

![steampipe-hn](/blog/assets/yearly-pick-data-infra-devtools-2022/steampipe-hn.webp)

## Tier

![tier](/blog/assets/yearly-pick-data-infra-devtools-2022/tier.webp)

[Tier](https://github.com/tierrun/tier) is a tool to manage pricing and billing workflow for your SaaS offering

Tier landed on [Hacker News front page](https://news.ycombinator.com/item?id=33429972), and their stars skyrocketed, just like Steampipe.

![tier-hn](/blog/assets/yearly-pick-data-infra-devtools-2022/tier-hn.webp)

Pricing SaaS products is a constant WIP, but it is a complex task and is often tied up in complex workflows and hidden cross-organizational dependencies. Many startups choose a pricing strategy for their product once, which stays the same forever.

Tier has a top-level design for how to implement pricing that allows for changes to pricing models without changing application code or business processes (Pricing as Code). The founding team thoroughly thought about pricing and built a website explaining t[he 5 Pillars of PriceOps](https://priceops.org/).

![tier-priceops](/blog/assets/yearly-pick-data-infra-devtools-2022/tier-priceops.webp)

For Star History, our goal is to discover interesting and inspiring projects. The aforementioned projects are not household names in the open-source community (yet), but each has great potential since they are tackling genuine issues with novel ideas. We see that the **Data & Infra & DevTools** section can be divided into two main categories:

- Vertical innovation: database engines being the most popular segment, such as DuckDB and Neon.
- Horizontal unification and standardization:
  - Buf for API development.
  - Bytebase for database development.
  - Casdoor for authentication sources.
  - Dagger for pipeline deployments.
  - Meltano for data platforms.
  - Opa for policy configurations.
  - Steampipe for accessing cloud resources across different cloud providers.
  - Tier for SaaS pricing infrastructure.

We are sure these projects will perform in the coming years and we can’t wait to see what’s next for them.

---

This is part of Star History Open Source 2022 series, you can continue with:

1. [Open Source Best of 2022 - Front-end](/blog/star-history-yearly-pick-2022-frontend).
1. [Open Source Best of 2022 - Platform Engineering](/blog/star-history-open-source-2022-platform-engineering).
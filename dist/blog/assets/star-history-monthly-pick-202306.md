# Star History Monthly Pick | June 2023

Last month's [post](/blog/star-history-monthly-pick-202305) was for marketers and analysts, but this issue returns to the DevTools category. In June, we discovered quite a few great tools for you devs!

## AI Getting Started

![ai-getting-started](/blog/assets/star-history-monthly-pick-202306/ai-getting-started.webp)

Remember Supabase's "Build in a weekend" tagline? In a sense, [AI Getting Started](http://github.com/a16z-infra/ai-getting-started) is something similar: an AI starter toolkit perfect for your weekend projects. With AI being so popular now, lots of developers are using it to build their own tools. This toolkit provides a ready-made infrastructure for you to save time on tooling research and selection.

![ai-getting-started-ui](/blog/assets/star-history-monthly-pick-202306/ai-getting-started-ui.webp)

The current stack is:

-   Auth: [Clerk](https://clerk.com/)
-   App logic: [Next.js](https://nextjs.org/)
-   VectorDB: [Pinecone](https://www.pinecone.io/) / [Supabase pgvector](https://supabase.com/docs/guides/database/extensions/pgvector)
-   LLM Orchestration: [Langchain.js](https://js.langchain.com/docs/)
-   Image Model: [Replicate](https://replicate.com/)
-   Text Model: [OpenAI](https://platform.openai.com/docs/models)
-   Text streaming: [Vercel AI SDK](https://github.com/vercel-labs/ai)
-   Deployment: [Fly.io](https://fly.io/)

## Copycat

![copycat](/blog/assets/star-history-monthly-pick-202306/copycat.webp)

[Copycat](http://github.com/snaplet/copycat) can generate deterministic fake values: the same input will always produce the same (fake) output. It is open-sourced by Snaplet.dev.

![copycat-cat](/blog/assets/star-history-monthly-pick-202306/copycat-cat.webp)

When developing apps, it is difficult to get real and accurate data. Snaplet is a CLI tool that provides devs with PostgreSQL data consistent with the production environment. (Sidenote: they recently collaborated with Neon to introduce **Preview Databases**, which allow for the direct restoration of a database snapshot that can be used in the development environment.)

When using Snaplet, there are sensitive information that needs to be anonymized. Initially, they used Faker to generate fake data. However, Faker doesn't guarantee that the same original data would always have the same generated value, they designed Copycat to handle this: given an input value, it will always map to the same output value.

## Hurl

![hurl](/blog/assets/star-history-monthly-pick-202306/hurl.webp)

[Hurl](https://github.com/Orange-OpenSource/hurl) is a CLI tool for HTTP testing through simple plain-text configurations.

The name "Hurl" is a tribute to "curl", as it utilizes `libcurl` from curl to provide HTTP testing capabilities. It can be seen as a CLI-based alternative to Postman. So if you're a hardcore CLI fan, give Hurl a try.

The news of the Hurl 4.0.0 release a few weeks ago was ontop of Hacker News, making their website traffic spike. WOW. The magic of HN.

![hurl-hn](/blog/assets/star-history-monthly-pick-202306/hurl-hn.webp)

## Inngest

![inngest](/blog/assets/star-history-monthly-pick-202306/inngest.webp)

[Inngest](https://github.com/inngest/inngest) is a developer platform and you can use Inngest SDK to build everything from simple tasks, background services to long-term workflows, without the need to build your own infrastructure. In their own words, it's like putting GitHub Actions, Lambda, Segment, and Zapier into a blender and mix mix.

Coincidentally, Snaplet uses Inngest to manage the lifecycle of their Preview Database on their developer platform. 😅

![inngest-flow](/blog/assets/star-history-monthly-pick-202306/inngest-flow.webp)

Inngest just [announced](https://techcrunch.com/2023/07/12/inngest-helps-developers-build-their-backend-workflows-raises-3m/) a $3M seed funding round a few days ago, and it's quite a breath of fresh air, as we've seen more AI-related startup funding news than ever before.

## **SQLPad**

![sqlpad](/blog/assets/star-history-monthly-pick-202306/sqlpad.webp)

[SQLPad](https://github.com/sqlpad/sqlpad) is a web-based SQL editor - you can write SQL queries and visualize the results. It supports a number of databases, including Postgres, MySQL, SQL Server, ClickHouse, Crate, Vertica, Trino, Presto, Pinot, Drill, SAP HANA, BigQuery, SQLite, TiDB, and many more.

![sqlpad-editor](/blog/assets/star-history-monthly-pick-202306/sqlpad-editor.webp)

From the star history of this project, you can tell that it is a few years old. The author mentioned in the README that SQLPad is currently in maintenance mode and will provide security updates and critical bug fixes as needed. Interestingly though, the stars continue to grow at almost the same speed as before, what does this say about SQLPad? 🤔

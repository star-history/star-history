# Star History Monthly | Open-source AI Extensions for Postgres

Postgres was named the most popular database by the [2023 Stack Overflow Developer Survey](https://survey.stackoverflow.co/2023/#technology), taking over the crown from MySQL. Why, you ask? We believe that a major factor comes down to Postgres [extensions](https://www.postgresql.org/docs/current/sql-createextension.html). Thanks to the extensible architecture and the fact that it's still a community-owned project, the Postgres ecosystem has been nothing but thriving lately.

Postgres extensions add extra functionality to your database just like built-in features. Several extensions for AI use cases have appeared over the years. A handful of them came out this year, but surprisingly, there are a few first appeared a few years back and remain to be the frontrunners of the pcak.

In this post, we'll share five Postgres extensions that just might boost your AI experience.

## pgvector

![pgvector](/blog/assets/ai-for-postgres/pgvector.webp)

[pgvector](https://github.com/pgvector/pgvector) is an open-source vector similarity search specifically designed for Postgres (supports Postgres 11+). It can also be used for storing embeddings. It's been around since 2021, way before AI became part of our daily routine. The spike in popularity came around 2023.2, when vector similarity search became a hot topic.

If you're looking for a vector database, Postgres got you covered, you can continue using your Postgres with benefits including:

- store your vectors with the rest of your data
- exact and approximate nearest neighbor search
- L2 distance, inner product, and cosine distance
- any language with a Postgres client

If you use plain Postgres, simply compile and install the extension; if you are using Postgres services or apps, some of them already have pgvector included, e.g. Aiven, Neon, Supabase, Postgres.app, etc.

## PostgresML

![postgresml](/blog/assets/ai-for-postgres/postgresml.webp)

[PostgresML](https://github.com/postgresml/postgresml) is an extension that allows developers to integrate machine learning (ML) models into Postgres that scored a [$4.7M seed funding round](https://postgresml.org/blog/postgresml-raises-4.7M-to-launch-serverless-ai-application-databases-based-on-postgres) this May. It enables training and inference on text and data using SQL queries, greatly reducing the complexity of application development.

If you don't have fancy ML workloads (because not all of us are AI giants) in your company, but would like to build your own machine learning model that can learn from fresh data, this would be a good way to get started.

![postgresml-textgen](/blog/assets/ai-for-postgres/postgresml-textgen.webp)

*Side note #1: They got another open-source project under the organization: [PgCat](https://github.com/postgresml/pgcat), a Postgres pooler, which was first released back in February, 2022. Interesting to see them pivot to the more sexy topic of AI.*

*Side note #2: PostgresML was actually* [*featured on the starlet issue*](https://star-history.com/blog/postgresml) *a while back, and that kinda gave me the inspo for this issue.*

## MADlib

![madlib](/blog/assets/ai-for-postgres/madlib.webp)

Apache [MADlib](https://github.com/apache/madlib) is a tool for big data Machine Learning in SQL. It started out way back before ChatGPT brought the heat to AI, the repo was released on GitHub somewhere in 2016, but the initial release was as early as in 2011 (and continues to evolve).

![madlib-alpha](/blog/assets/ai-for-postgres/madlib-alpha.webp)

The perception that SQL doesn't work well enough for inferential, predictive or causal analysis on larger or unstructured data sets is no longer true. MADlib basically an in-database machine learning library, where you get to perform advanced machine learning within your database where your data resides. Once installed, you can use SQL to perform various data analysis tasks, including regression and classification easily.

Interesting fact: MAD in MADlib actually stands for Magnetic, Agile, and Deep.

![madlib-mad](/blog/assets/ai-for-postgres/madlib-mad.webp)

## pg_embedding

![pg-embedding](/blog/assets/ai-for-postgres/pg-embedding.webp)

Now we are onto a few wildcards, they are riveting projects for sure, but use them at your own risk.

[pg_embedding](https://github.com/neondatabase/pg_embedding) is an offering by Neon that was released this July.

It uses Hierarchical Navigable Small Worlds (HNSW) index to for high-dimensional similarity search, which was before pgvector added support for HNSW (Hard to understand why it was [20x faster than pgvector](https://neon.tech/blog/pg-embedding-extension-for-vector-search) when it first came out).

![pg-embedding-faster](/blog/assets/ai-for-postgres/pg-embedding-faster.webp)

But a few months later in September, they added [a note](https://github.com/neondatabase/pg_embedding#pg_embedding) mentioning that they are no longer committing to pg_embedding. looks like there really is no Buy or Build dilemma: if there's a decent service out there, it's the obvious choice.

## pg_gpt

![pg-gpt](/blog/assets/ai-for-postgres/pg-gpt.webp)

[pg_gpt](https://github.com/cloudquery/pg_gpt) is an experimental Postgres extension uses the OpenAI GPT API inside Postgres, so you can ask your database questions using natural language. And it's actually built by CloudQuery, an open-source ELT platform.

This plugin works by sending parts of your database schema (although without the data) to OpenAI GPT API, so would not recommended to use it on production databases, but if you'd like to know something about a public schema, it's a fun tool to use. For example, if you were to look for top submissions on Hacker News this past month that mentions Sam Altman, this is a way to go (or, you know, [Search Hacker News](https://hn.algolia.com/?dateRange=all&page=0&prefix=false&query=&sort=byPopularity&type=story) also works).

## Conclusion

We've seen a lot this year: the tech world shifting towards AI and looking for a way to navigate their way to find their standing ground. Good thing that Postgres is open to support extensions, and we are blessed with these extensions to add AI-capabilities to our good-ol Postgres, without having to turn to a new database.

---

## Star History Monthly Previous Editions

- [Coding AI](/blog/coding-ai)
- [CLI Tools for Working with LLMs](/blog/cli-tool-for-llm)
- [Llama 2 and Ecosystem](/blog/llama2)
- [ChatGPT Special](/blog/star-history-monthly-pick-202303)

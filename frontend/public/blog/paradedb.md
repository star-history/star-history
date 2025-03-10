*This is the 20th issue of The Starlet List. If you want to prompt your open source project on star-history.com for free, please check out our [announcement](/blog/list-your-open-source-project).*

---

## What is ParadeDB?

[**ParadeDB**](https://paradedb.com) is an Elasticsearch alternative built on Postgres. Our two extensions, `pg_search` and `pg_analytics`, are drop-in solutions for full-text search and analytics inside Postgres.

![paradedb](/assets/blog/paradedb/paradedb.webp)

## Problem

Today, developers implementing search and analytics over Postgres face one of two options: adopt an external search or analytical database, which is painful to learn, manage, and sync, or use Postgres’ native search and aggregations, which lack functionality and perform poorly over large datasets.

ParadeDB aims to be the best of both worlds, giving Postgres users the performance of a dedicated search and analytical database with zero new infrastructure or data movement into another system.

## Solution

ParadeDB has built two extensions, `pg_search` and `pg_analytics`, for the Postgres ecosystem.

`pg_analytics` uses Apache Arrow and DataFusion to transform any Postgres instance into a state-of-the-art analytical (i.e. OLAP) database. These libraries add column-oriented storage and vectorized query execution to Postgres.

You can get started by creating a `parquet` table, which is our custom [table access method](https://www.postgresql.org/docs/current/tableam.html) optimized for analytical queries.

```sql
-- Install the extension
CREATE EXTENSION pg_analytics;

-- Use the custom parquet access method
CREATE TABLE movies (name text, rating int) USING parquet;

-- That’s it! parquet tables accept any Postgres query
INSERT INTO movies VALUES ('Star Wars', 9), ('Indiana Jones', 8);
SELECT AVG(rating) FROM movies;
```

Our second extension,`pg_search`, introduces Elastic-quality full-text search to Postgres tables. It comes with advanced search features like BM25 scoring, multi-language tokenizers, fuzzy search, and relevance tuning.

You can get started by creating a BM25 index, which is our custom [index access method](https://www.postgresql.org/docs/current/indexam.html), and running a search query.

```sql
-- Install the extension
CREATE EXTENSION pg_search;

-- Helpful process to create mock data
CALL paradedb.create_bm25_test_table(
  schema_name => 'public',
  table_name => 'mock_items'
);

-- Create BM25 index
CALL paradedb.create_bm25(
        index_name => 'search_idx',
        schema_name => 'public',
        table_name => 'mock_items',
        key_field => 'id',
        text_fields => '{description: {tokenizer: {type: "en_stem"}}, category: {}}',
        numeric_fields => '{rating: {}}'
);

-- Run full-text search
SELECT description, rating, category
FROM search_idx.search(
  '(description:keyboard OR category:electronics) AND rating:>2',
  limit_rows => 5
);
```

## Benchmarks

With `pg_analytics` installed, Postgres outperforms many specialized OLAP systems. On ClickBench, parquet tables are 94x faster than regular Postgres tables, 8x faster than Elasticsearch, and almost ties ClickHouse.

![paradedb-benchmark](/assets/blog/paradedb/paradedb-benchmark.webp)

For search, we benchmarked Postgres with `pg_search` installed and Elasticsearch on the same corpus of 100 million Wikipedia documents. Indexing was 2.5X faster than Elasticsearch. With one active connection, Postgres’ throughput (measured in queries per second) was 3X higher than ElasticSearch and query times were 3X lower. With 40 active connections, Postgres’ throughput was 5X higher and query latency was 5X lower.

## Get Started

The best way to get started is to follow our [search](https://docs.paradedb.com/search/quickstart) or [analytics](https://docs.paradedb.com/analytics/quickstart) quickstart guides. These guides assume that you’ve either [run the ParadeDB Docker image](https://docs.paradedb.com/introduction#get-started) or i[nstalled our extensions](https://github.com/paradedb/paradedb) into an existing Postgres instance.

We’re open source and built in 100% Rust — you can show your support by [giving our repo a star](https://github.com/paradedb/paradedb). We welcome community contributions and are active on [**Slack**](https://join.slack.com/t/paradedbcommunity/shared_invite/zt-217mordsh-ielS6BiZf7VW3rqKBFgAlQ) for questions.
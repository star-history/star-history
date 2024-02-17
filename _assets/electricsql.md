_This is the ninth issue of The Starlet List. If you want to prompt your open source project on star-history.com for free, please check out our [announcement](/blog/list-your-open-source-project)._

---

# Electric SQL - Build reactive, realtime, local-first apps directly on Postgres.

[ElectricSQL](https://electric-sql.com/) is an open source local-first software platform. Use it to build super fast, collaborative, offline-capable apps directly on Postgres by syncing to a local SQLite database.

Electric comprises a sync layer (built with Elixir) placed in front of your Postgres database, and a type-safe client allowing you to bidirectionally sync data from your Postgres to local SQLite databases. This sync is CRDT-based, resilient to conflicting edits from multiple nodes at the same time, and works after being offline for extended periods.

![electric-graphic](/blog/assets/electricsql/electric-graphic.webp)

In some ways Electric is similar to Hasura or PostgREST in that it can provide a plug-and-play API to your Postgres database. However, there are three key differences:

-   SQL throughout - it’s SQL on the server _and_ SQL on the client.
-   Offline support - you get offline _for free_, you don’t have to build any complex syncing logic.
-   Reactive queries - build a UI declaratively that updates as the underlying database changes.

There are a number of additional advantages to this architecture. First, with users’ data being on their devices, this naturally results in fast interaction; no more loading spinners, and your apps can _just work_ offline. Additionally, multi-user Electric apps are inherently realtime multiplayer experiences - your UI will update in realtime based on any and all changes from any user of the app.

After six moths of intensive development we have just released v0.6 of Electric, which has received an overwhelmingly positive response. This version makes it possible to easily host the sync layer yourself, and to start building apps today.

## What is Local-first?

Local-first, both as a term and a movement, grew out of the [Ink and Stitch Local-first software paper](https://www.inkandswitch.com/local-first/). It covers numerous concepts aimed at improving user experience, data ownership and collaboration, and brings them together under one umbrella.

The core concept of this movement is that by co-locating the users’ data with the UI, you allow the user to work offline and have instant interactions. In order to make this work these systems are designed to automatically resolve any conflicting edits that occur while offline. These same conflict resolution systems are also the building blocks that enable realtime multiplayer.

The main algorithmic invention that underpins this is CRDTs - _conflict free replicated datatypes_. These are data structures that can be forked (in the git sense), mutate over time, and then “merge” back together again to reach a combined state that is agreed upon by all actors in the system.

The Electric team includes two of the inventors of CRDTs - Marc Shapiro and Nuno Preguiça - alongside a number of their collaborators who've pioneered much of the technology underpinning Local-first software. We are privileged to be building on their research, and delighted to be surfacing so much work in a product you can now try out.

## Key features of ElectricSQL

-   Local first sync from Postgres to SQLite on the user’s device.
-   Works with existing data models in your Postgres database.
-   Query your data with real SQL on the client device.
-   Advanced privileges system designed to work offline.
-   Dynamic partial replication based on “shapes”, enabling you to sync only the - data you need.
-   Type-safe auto-generated client.
-   Live reactive queries enabling true one-way dataflow.

## Find out more about ElectricSQL

Some great links to get started:

-   Website: https://electric-sql.com
-   Docs: https://electric-sql.com/docs
-   Code: https://github.com/electric-sql/electric
-   Introducing post: https://electric-sql.com/blog/2023/09/20/introducing-electricsql-v0.6

Some demo applications:

-   Linear clone: https://linear-lite.electric-sql.com
-   Realtime demo: https://electric-sql.com/docs/intro/multi-user
-   Conflict-free offline: https://electric-sql.com/docs/intro/offline

[![Star History Chart](https://api.star-history.com/svg?repos=electric-sql/electric&type=Date)](https://star-history.com/#electric-sql/electric&Date)

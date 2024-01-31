# Star History Monthly | Open-source Text2SQL Tools

Text2SQL, or Chat2SQL tools convert natural language or questions into SQL queries. Imagine having ChatGPT write beautiful, correct and useful SQL queries for you!

![gpt](/blog/assets/text2sql/gpt.webp)

These tools started out to bridge the gap between non-tech users and databases, by allowing them to interact with databases using natural language and reduce the barrier to accessing and analyzing data. But with the advance of AI models, these tools now support more advanced features such as handling complex queries, joining multiple tables, or even supporting natural language conversations.

They can also help improve productivity by automating the process of generating SQL queries, thereby saving time and effort.

In this edition of Star History monthly, we have compiled a collection of open-source Text2SQL tools.

- [Star History Monthly | Open-source Text2SQL Tools](#star-history-monthly--open-source-text2sql-tools)
  - [Chat2DB](#chat2db)
  - [SQL Chat](#sql-chat)
  - [Vanna](#vanna)
  - [DuckDB-NSQL](#duckdb-nsql)
  - [Langchain](#langchain)
  - [Awesome Text2SQL](#awesome-text2sql)
  - [To Wrap up](#to-wrap-up)
  - [Lastly](#lastly)

## Chat2DB

[Chat2DB](https://github.com/chat2db/chat2db) aims to be a general-purpose SQL client and reporting tool that incorporates AI capabilities from the start. It supports connection to a handful of databases including MySQL, Postgres, Oracle, SQL Server, SQLite, ClickHouse and more.

![chat2db](/blog/assets/text2sql/chat2db.webp)

There was a bit of [drama](https://www.linkedin.com/feed/update/urn:li:activity:7153040091454611456/) involving Chat2DB a while ago, we won't get into details here but curious to know what you think.

## SQL Chat

[SQL Chat](https://github.com/sqlchat/sqlchat) is a chat-based SQL client, and you can use natural language to communicate with your database to implement operations, such as query, modification, addition, and deletion (!) of the database.

It currently supports MySQL, Postgres, SQL Server and TiDB serverless.

![sqlchat](/blog/assets/text2sql/sqlchat.webp)

It's [open-sourced by Bytebase](https://www.bytebase.com/blog/sql-chat/), a database migration tool for teams.

## Vanna

[Vanna](https://github.com/vanna-ai/vanna) is a Python library that allows the training of an RAG model with queries, DDL, and documentation from a database.

![vanna](/blog/assets/text2sql/vanna.webp)

You can use Vanna as is, or build your own custom UI with an existing tool (e.g. Streamlit, Slack).

It was open-sourced July, 2023, but [got really popular](https://star-history.com/#vanna-ai/vanna&Date) this January.

## DuckDB-NSQL

[DuckDB-NSQL](https://github.com/NumbersStationAI/DuckDB-NSQL) is a Text2SQL LLM built for local DuckDB SQL analytics tasks, built by DuckDB and Numbers Station. This can certainly help users leverage the full power of DuckDB and its analytic potential, without having to go forth-and-back between the DuckDB documentation and the SQL shell.

![duckdb](/blog/assets/text2sql/duckdb.webp)

## Langchain

[https://python.langchain.com/docs/use_cases/sql/](https://python.langchain.com/docs/use_cases/sql/)

With Langchain, you can basically build a Q&A chain and agent over a SQL database yourself.

![langchain](/blog/assets/text2sql/langchain.webp)

LangChain also has an SQL Agent that you can add onto the chain. It can not only answer questions based on the databases’ schema and content, but also recover from errors by running a generated query, catching the traceback and regenerating it correctly.

## Awesome Text2SQL

[Awesome Text2SQL](https://github.com/eosphoros-ai/Awesome-Text2SQL) is a suite of curated tutorials and resources for LLMs, Text2SQL, Text2DSL, Text2API, Text2Vis and more. Most of the models are LLM+Text2SQL, and for each model, there are links for papers, code, dataset. If you want to dive deep into Text2SQL, take a look.

![awesome-text2sql](/blog/assets/text2sql/awesome-text2sql.webp)

## To Wrap up

LLM or not, you should still be extra careful when it comes to executing model-generated SQL queries. Some [ways](https://blog.langchain.dev/llms-and-sql/) to minimize risks includes describing your database schema, data; constraining the size of the output; validating and reviewing the generated SQL queries before executing them.

## Lastly

If you want more AI content, check out earlier editions of the star history open-source monthly:

- [GPT Wrappers](/blog/gpt-wrappers)
- [TTS (Text-to-Speech) Tools](/blog/tts)
- [AI Extensions for Postgres](/blog/ai-for-postgres)
- [GitHub Copilot alternatives](/blog/coding-ai)
- [CLI Tools for Working with LLMs](/blog/cli-tool-for-llm)
- [Llama 2 and Ecosystem](/blog/llama2)
- [ChatGPT Special](/blog/star-history-monthly-pick-202303)
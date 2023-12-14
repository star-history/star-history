*This is the fourteenth issue of The Starlet List. If you want to prompt your open source project on star-history.com for free, please check out our [announcement](/blog/list-your-open-source-project).*

---

# Proton: A streaming SQL analytical engine which connects to historical data processing in one single binary

> Thinking, Fast and Slow is a 2011 popular science book by psychologist Daniel Kahneman. The book's main thesis is a differentiation between two modes of thought: "System 1" is fast, instinctive and emotional; "System 2" is slower, more deliberative, and more logical.
>
> – https://en.wikipedia.org/wiki/Thinking,_Fast_and_Slow 

For a long time, data engineers and analysts have been focusing on the “System 2”: OLAP, Data Warehouse, and Data Lake. Those systems and applications improve decision making by processing massive amounts of historical data. With the rise of Apache Kafka, Debezium, Apache Flink, and Apache Spark, more “System 1” frameworks and tools have grown in popularity in the last 10 years to process data in motion and trigger real-time alerts.

We believe data analytics work best when you can use it like a human brain: consider historical context, process real-time information, and take action immediately. So that’s what we’ve built. 

Introducing Proton, a new open-source streaming SQL analytical engine that functions as intuitively as a human brain: in a single binary, you can combine the power of OLAP processing with responsive real-time streaming analytics. 

![proton-logo-for-whitebg](/blog/assets/proton/proton-logo-for-whitebg.webp)

[Proton](https://github.com/timeplus-io/proton) is a SQL database for both historical and streaming data, with a strong focus on simplicity, performance, and openness.

- **Simplicity.** In the era of the Modern Data Stack, it’s common for data teams to adopt either the Lambda or the Kappa architecture to handle real-time and batch processing separately, which require multiple systems (such as Apache Kafka, Apache Flink, Apache Spark, ClickHouse, or Snowflake) with high cost and maintenance effort. [Proton](https://github.com/timeplus-io/proton) **can be deployed as simply as a single binary, without JVM or any other external services dependency**, to replace the complex stacks (such as Kafka->Flink->Druid). [Proton](https://github.com/timeplus-io/proton) also provides a smooth developer experience, primarily with SQL, to query both historical and streaming data.

- **Performance.** [Proton](https://github.com/timeplus-io/proton) is implemented in C++, and leverages the code from ClickHouse for historical data storage and computing ([clickhouse.com](http://clickhouse.com): Query billions of in milliseconds). In order to further improve performance for streaming data ingestion and stateful processing, Proton implements:

  - its own WAL-based streaming storage

  - column-based data format for SIMD fast serialization and deserialization

  - a streaming query processor, like Apache Flink, but in C++. 

  Even in a single commodity machine, Proton can achieve 4 milli-seconds end-to-end latency and 10 million events per second.

- **Openness**. [Proton](https://github.com/timeplus-io/proton) was open-sourced by [Timeplus Inc.](http://timeplus.com) on September 21, 2023, after 18 months of development. It follows the ClickHouse licensing model with Apache License 2.0, which is a permissive license that allows for most uses without restriction. Proton leverages ClickHouse for historical OLAP analytics. We chose ClickHouse's unparalleled columnar database engine, as we highly respect ClickHouse’s engineering perfection and the simplicity, performance, and efficiency of the project. 

## How does Proton work?

Here is the high-level architecture diagram of Proton:

![](/blog/assets/proton/proton-architecture.webp)

Please check [this blog](https://www.timeplus.com/post/unify-streaming-and-historical-data-processing) for details.

## Why use Proton?

### If you want to get started with data streaming...

Proton is the best option to help you quickly understand key concepts and best practices  without steep learning curves as with Apache Flink. You can install Proton with Homebrew or Docker within 1 minute and use SQL to query real-time data or historical data. We provide many [sample datasets](https://github.com/timeplus-io/proton/tree/develop/examples) with IoT, e-commerce, or FinTech data for you to try, without the need to set up Apache Kafka or Kafka Connect. 

### If you want to simplify your Lambda or Kappa data architecture...

Proton is powered by ClickHouse. You can use Proton as the high-performance OLAP, without having to send data to downstream systems for dashboarding or reporting. Proton provides JDBC/ODBC drivers and integrations with popular visualization tools, such as [Metabase](https://github.com/timeplus-io/metabase-proton-driver) and [Grafana](https://github.com/timeplus-io/proton-grafana-source).

This will significantly reduce the complexity and maintenance costs associated with traditional stream processors, such as Apache Flink or Spark.

With Proton’s support for streaming ingestion via REST API, you can send real-time data to Proton directly, without having to set up a message platform, such as Apache Kafka, or MQTT.

### If you want to achieve ultra-low latency or better performance...

From day-1, Proton is designed for performance, fully leveraging C++ and latest operating systems API, such as io_uring, SIMD, etc. There is no overhead for Java/JVM, or the expensive Garbage-Collection. 

Members of our Proton community and Timeplus customers have experienced remarkable performance enhancements after switching to Proton: end-to-end latency dramatically reduces from minutes to single-digit milliseconds, and hardware resources are used more efficiently with Proton using only 10-20% of the CPU/memory used by traditional Java stacks.

### If you need to make any data-driven decisions...

Essentially, Proton is an incremental-aware multimodal analytics database. You can save any data in Proton, no matter structured data as tabular data or metrics, or semi-structured as JSON/CSV, or unstructured data as logs. Just like a human brain, you can ask anything or think anything, by combining the System 1 and System 2 modes together. (Check out https://docs.timeplus.com/showcases for known use cases.)  

## Who uses Proton?

Proton is used by developers and users within organizations of all sizes and degrees of streaming maturity. One example of latency-sensitive use cases for our top financial services customers is for algorithm-based trading and post-trade processing. To learn more, see our [case study](https://www.timeplus.com/post/unlocking-real-time-post-trade-analytics-with-streaming-sql).

Although Proton is used broadly by many roles, the primary users of Proton are Data Engineers, Software Engineers, DevOps Engineers, Platform Engineers, Machine Learning Engineers, and their corresponding teams. 

## Getting started

### Single Binary

If you’re an Apache Kafka or Redpanda user, you can install Proton as a single binary via:

```shell
curl -sSf https://raw.githubusercontent.com/timeplus-io/proton/develop/install.sh | sh
```

This will install the Proton binary in the current folder, then you can start the server via `proton server start` and start a new terminal window with `proton client` to start the SQL shell.

For Mac users, you can also use Homebrew to manage the install/upgrade/uninstall:

```shell
brew tap timeplus-io/timeplus
brew install proton
```

Next, create an external stream in Proton with SQL to consume data from your Kafka or Redpanda. Follow this [tutorial](https://docs.timeplus.com/proton-kafka#tutorial) for SQL snippets.

### Docker

If you don’t want to setup Kafka or Redpanda, you can use [the docker-compose.yml file](https://github.com/timeplus-io/proton/blob/develop/examples/carsharing/docker-compose.yml) in proton/examples/carsharing. Download the file to a local folder. Make sure you have Docker Engine and Desktop installed. Use `docker compose up` to start the demonstration stack.

Next, you can open the shell of the Proton container and run your first streaming SQL. To print out the new data being generated, you can run the following sample SQL:

```sql
select * from car_live_data
```

To get the total number of events in the historical store, you can run the following SQL:

```sql
select count() from table(car_live_data)
```

To show the number of event events, at certain intervals (2 seconds, by default), you can run: 

```sql
select count() from car_live_data
```

Congratulations! You have successfully installed Proton and run queries for both historical and streaming analytics.

See our [Proton GitHub repo](https://github.com/timeplus-io/proton) for guides on setting up other tools to connect with Proton, such as Grafana, DBeaver, dbt, and Metabase.

## Learn more about Proton

If you'd like to learn more about Proton, check out our resources below:

- GitHub (give us a star!): https://github.com/timeplus-io/proton 
- Docs: https://docs.timeplus.com/proton 
- Official website with Cloud offering (30-day free trial): https://timeplus.com 
- Community Slack: https://timeplus.com/slack 
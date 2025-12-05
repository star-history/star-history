---
title: "Starlet #23 Tea-tasting: a Package for Statistical Analysis of A/B Tests"
author: "Evgeny Ivanov"
featured: true
featureImage: "/assets/blog/tea-tasting/banner.webp"
publishedDate: "2024-08-20T00:00:00.000Z"
description: "Tea-tasting is a Python package for statistical analysis supporting a wide range of data backends."
---

*This is the twenty-third issue of The Starlet List. If you want to prompt your open source project on star-history.com for free, please check out our [announcement](/blog/list-your-open-source-project).*

---

[**tea-tasting**](https://github.com/e10v/tea-tasting) is a Python package for the statistical analysis of A/B tests featuring:

- Student's t-test, Bootstrap, variance reduction with CUPED, power analysis, and other statistical methods and approaches out of the box.
- Support for a wide range of data backends, such as BigQuery, ClickHouse, PostgreSQL/GreenPlum, Snowflake, Spark, Pandas, Polars, and many other backends.
- Extensible API: define custom metrics and use statistical tests of your choice.
- Detailed documentation.

There are a variety of statistical methods that can be applied in the analysis of an experiment. But only a handful of them are actually used in most cases. On the other hand, there are methods specific to the analysis of A/B tests that are not included in the general purpose statistical packages like SciPy. **tea-tasting** functionality includes the most important statistical tests, as well as methods specific to the analysis of A/B tests.

The purpose of the package is to:

- Optimize computational efficiency by calculating aggregated statistics in the user's data backend.
- Reduce time spent on analysis and minimize the probability of error by providing a convenient API and framework.

## Statistical methods

Here is a brief overview of the statistical methods available in **tea-tasting**:

- Analyze metric averages and proportions with the Student's t-test and the Z-test.
- Use Bootstrap for the analysis of any other statistic of your choice; with a predefined method available for the analysis of quantiles.
- Detect mismatches in sample ratios between different variants of an A/B test.
- Apply [delta method](https://alexdeng.github.io/public/files/kdd2018-dm.pdf) for the analysis of ratios of averages.
- Utilize pre-experiment data, metric forecasts, or other covariates to reduce variance and enhance experiment sensitivity. This approach, also known as [CUPED](https://exp-platform.com/Documents/2013-02-CUPED-ImprovingSensitivityOfControlledExperiments.pdf) or [CUPAC](https://doordash.engineering/2020/06/08/improving-experimental-power-through-control-using-predictions-as-covariate-cupac/), can also be combined with the delta method for ratio metrics.
- Calculate confidence intervals for both *absolute* and *percentage* change.
- Analyze statistical power.

You can also define a custom metric with a statistical test of your choice.

Roadmap includes:

- Multiple hypotheses testing: family-wise error rate, false discovery rate.
- A/A tests and simulations to analyze power of any statistical test.
- More statistical tests: tests for frequency data, Mann–Whitney U test.
- Sequential testing.

## Data backends

There are many different databases and engines for storing and processing experimental data. And in most cases it's not efficient to pull the detailed experimental data into a Python environment. Many statistical tests, such as the Student's t-test or the Z-test, require only aggregated data for analysis.

For example, if the raw experimental data are stored in ClickHouse, it's faster and more efficient to calculate counts, averages, variances, and covariances directly in ClickHouse rather than fetching granular data and performing aggregations in a Python environment.

Querying all the required statistics manually can be a daunting and error-prone task. For example, analysis of ratio metrics and variance reduction with CUPED require not only number of rows and variance, but also covariances. But don't worry — **tea-tasting** does all this work for you.

**tea-tasting** accepts data either as a Pandas DataFrame or an Ibis Table. [Ibis](https://ibis-project.org/) is a Python package which serves as a DataFrame API to various data backends. It supports 20+ backends including BigQuery, ClickHouse, PostgreSQL/GreenPlum, Snowflake, Spark, and Polars. You can write an SQL query, [wrap](https://ibis-project.org/how-to/extending/sql#backend.sql) it as an Ibis Table, and pass it to **tea-tasting**.

## Convenient API and a detailed documentation

You can perform all the tasks listed above using just SciPy and Ibis. In fact, **tea-tasting** uses these packages under the hood. What **tea-tasting** offers on top is a convenient higher-level API.

It's easier to show than to describe. Here is the basic example:

```python
import tea_tasting as tt


data = tt.make_users_data(seed=42)

experiment = tt.Experiment(
    sessions_per_user=tt.Mean("sessions"),
    orders_per_session=tt.RatioOfMeans("orders", "sessions"),
    orders_per_user=tt.Mean("orders"),
    revenue_per_user=tt.Mean("revenue"),
)

result = experiment.analyze(data)
print(result)
#>             metric control treatment rel_effect_size rel_effect_size_ci pvalue
#>  sessions_per_user    2.00      1.98          -0.66%      [-3.7%, 2.5%]  0.674
#> orders_per_session   0.266     0.289            8.8%      [-0.89%, 19%] 0.0762
#>    orders_per_user   0.530     0.573            8.0%       [-2.0%, 19%]  0.118
#>   revenue_per_user    5.24      5.73            9.3%       [-2.4%, 22%]  0.123
```

**tea-tasting** performs calculations that can be tricky and error-prone. It also provides a framework for representing experimental data to avoid errors. Grouping the data by randomization units and including all units in the dataset is important for correct analysis.

In addition, **tea-tasting** provides some convenience methods and functions, such as pretty formatting of the result and a context manager for metric parameters.

Last but not least: documentation. I believe that good documentation is crucial for tool adoption. That's why I wrote several user guides and an API reference. See the links below.

## Links

- Source: https://github.com/e10v/tea-tasting
- Homepage: https://tea-tasting.e10v.me/
- Documentation:
	- User guide: https://tea-tasting.e10v.me/user-guide/
	- Data backends: https://tea-tasting.e10v.me/data-backends/
	- Power analysis: https://tea-tasting.e10v.me/power-analysis/
	- Custom metrics: https://tea-tasting.e10v.me/custom-metrics/
	- API reference: https://tea-tasting.e10v.me/api/

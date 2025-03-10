_This is the third issue of The Starlet List. If you want to prompt your open source project on star-history.com for free, please check out our [announcement](/blog/list-your-open-source-project)._

---

## What is Mockoon?

[Mockoon](https://mockoon.com) is an open-source API tool. It allows developers to quickly create realistic mock APIs and deploy them anywhere.

> 💡 What is API mocking? It's simulating an API to make your work easier. It is useful when the API is still under development, is not reachable (i.e. production only), or requires an account creation or token provisioning. API mocking allows developers to work with an API without dealing with all these constraints.

Mockoon is a versatile API mocking tool with a desktop application and a CLI. It is simple and easy to use, yet powerful and heavily customizable.
It allows developers to design their mock APIs during the development phase with the desktop application and run them in headless server/CI environments with the CLI.

It answers most API mocking use cases, from quick prototyping or teaching to complex automation testing with rules and dynamic data.

![Mockoon's desktop application and CLI screenshots](/assets/blog/mockoon/screenshot.webp)

## Why Mockoon?

Many tools on the market are focused on API design or API testing but not on API mocking. One consequence is that the API mocking experience is subpar, and scenarios are constrained by the tool's first purpose (designing, testing, etc.).

Another approach of some tools is to let you write code to create API mocks. It has some undeniable advantages but lacks the flexibility of having a quick way to prototype or experiment.

At Mockoon, we believe API mocking is one of the first needs of developers. We need it to experiment before the API contract is defined, to test complex scenarios, to run automated tests without having to deploy and maintain a test API, or to simply mock an annoying proxy at work.

Mockoon has a "sandbox" approach where it's possible to mock anything anywhere. API mocking is a first-class citizen.

Mockoon is also privacy-friendly and requires no account or cloud deployment.

## Awesome features

Among the many features of Mockoon, here are some of the most notable ones:

-   ♾️ Fast and easy mocking: quickly prototype your mock APIs with our ready-to-use templates and AI assistant.
-   ⚙️ Fully configurable: create realistic endpoints with dynamic data, custom headers and status codes, templating, rules, regexes, latency, etc.
-   🗂️ Automated CRUD endpoints: manipulate data as if you had a development database (similar to json-server).
-   🧩 Partial mocking: mock only the endpoints you need and forward the rest to the actual API.
-   🐋 Run your mock anywhere: use the CLI to run your mock APIs in any headless or automated environment: CI, GitHub Actions, Docker containers, etc.
-   ☁️ Serverless compatibility: run your mock APIs in serverless environments: AWS Lambda, GCP/Firebase Functions, etc.
-   ⏺️ Logging and recording: log requests and responses and record them to create mocks automatically.
-   📥 Import/export: don't start from a blank canvas by importing an OpenAPI specification file.

## A little bit of history

My name is [Guillaume](https://twitter.com/255kb), and I launched Mockoon at the end of 2017. I started working on this application because we needed an API mocking tool where I worked.

Some alternatives already existed but felt a bit cumbersome (especially Postman mocking) and were cloud-based. Being in a regulated environment (finance), we couldn't use cloud services.

I also wanted to create and publish a side project from scratch and see where it would take me.

I created the MVP in 3 months and released it on Hacker News and Reddit. I had no real expectations, but the feedback was good, which motivated me to keep working on it.

In March 2021, I quit my job to focus full-time on the project. I'm now working on a [Saas platform](https://mockoon.com/pro/) for Mockoon, which offers complementary features around the open-source core.

Fast forward six years, dozens of articles and tutorials written, tens of thousands of active users, and more than 400k downloads Mockoon is still there and growing!

[![Star History Chart](https://api.star-history.com/svg?repos=mockoon/mockoon&type=Date)](https://star-history.com/#mockoon/mockoon&Date)

## Roadmap

We have a [public roadmap](https://mockoon.com/public-roadmap/) on which we list all the features we are working on or plan to work on. We have a lot of ideas and are working hard to make them happen!

If you want to stay up-to-date with our progress or contribute to the project (all kinds of contributions are welcome!), you can follow us on [Twitter](https://twitter.com/GetMockoon) or join our [Discord server](https://discord.gg/9WmZq5U).

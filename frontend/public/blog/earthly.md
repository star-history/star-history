---
title: "Starlet #13 Earthly: Fast, consistent builds with an instantly familiar syntax - like Dockerfile and Makefile had a baby"
author: "Gavin Johnson"
featured: true
featureImage: "/assets/blog/earthly/banner.webp"
publishedDate: "2023-12-01T00:00:00.000Z"
description: "Earthly is like a combination of Docker and Make, running build scripts in Docker containers for consistent results in any environment."
---

_This is the thirteenth issue of The Starlet List. If you want to prompt your open source project on star-history.com for free, please check out our [announcement](/blog/list-your-open-source-project)._

---

![earthly-logo](/assets/blog/earthly/earthly-logo.webp)

[Earthly](https://earthly.dev/) is like a combination of Docker and Make, running build scripts in Docker containers for consistent results in any environment - local, remote, and CI. It even blends Dockerfile and Makefile syntaxes for ease of use. It has advanced caching, like Docker layer caching on steroids, that speeds up builds significantly, especially in CI. Additionally, Earthly is designed for easy integration with any CI, helping you ensure fast, consistent builds everywhere.

Build tools and CI systems frequently struggle with monorepos. One major reason for this is that monorepos often involve intricate and interconnected build structures and share dependencies across projects. Even small changes in one part of the monorepo can cause significant build impacts in others. Earthly's utilization of build graphs and automatic caching reduce this impact, reusing everything that wasn't changed and only executing the most minimal rebuild scope. Earthly's import system also facilitates use in monorepos, because it can be used to reference and build targets from other directories in a monorepo or even other repositories. This helps foster effective reuse of common build logic, ensure uniformity, and minimize redundancy across projects, especially in a monorepo.

## Fast builds, especially in CI

Earthly's advanced caching makes CI builds very fast when used with a remote build runner. A remoter build runner is a VM that runs Earthly, that your CI sends builds to be executed on (or you can send builds directly from your computer too). The cache persists between builds on the remote build runner and is as fast as a local cache on your computer (e.g. no multi-GB cache upload and download is necessary unlike almost every CI caching solution on the market). NOCD is a great example of the build speed improvements teams get with Earthly. Switching to Earthly reduced their CI builds from 45 minutes to 20 minutes. Then, implementing remote build runners took their CI builds from 20 minutes to 4-5 minutes.

Remote build runners can be [self-hosted](https://docs.earthly.dev/docs/remote-runners) and are also offered as [a SaaS hosted and managed SaaS by the Earthly team](https://docs.earthly.dev/earthly-cloud/satellites).

## Who uses Earthly?

More than 1,000,000 builds are run on Earthly every month, and [its repo](https://github.com/earthly/earthly) has just under 10,000 stars on GitHub at the time of this writing.

[![Earthly's Star History Chart](https://api.star-history.com/svg?repos=earthly/earthly&type=Date)](https://api.star-history.com/svg?repos=earthly/earthly&type=Date)

As such Earthly is used broadly by many different roles. That said, the primary users of Earthly are Software Engineers, DevOps Engineers, Platform Engineers, Machine Learning Engineers, and their corresponding teams. Some of Earthly's most well-known users are [Zapier](https://zapier.com/), [Roche](https://www.roche.com/), [ExpressVPN](https://www.expressvpn.com/), [Namely](https://www.namely.com/), and [IOHK](https://iohk.io/).

## Getting started with Earthly

-   **Sign up for Earthly Cloud**, [https://cloud.earthly.dev/login](https://cloud.earthly.dev/login). This will give you a free Earthly Cloud account including 6,000 build minutes on our hosted and managed remote build runners, Earthly Satellites. It also walks you through the process of installing Earthly and familiarizing yourself with how it works.
-   **_(Alternative)_ Install Earthly without logging in**, [https://earthly.dev/get-earthly](https://earthly.dev/get-earthly). This gives you instructions to install Earthly without signing up for Earthly Cloud.

## Learn more about Earthly

If you'd like to learn more about Earthly, try it out, or even just give us a star, go check out our links below.

-   Website: [https://earthly.dev/](https://earthly.dev/)
-   GitHub: [https://github.com/earthly/earthly](https://github.com/earthly/earthly)
-   Docs: [https://docs.earthly.dev/](https://docs.earthly.dev/)
-   Community Slack: [https://earthly.dev/slack](https://earthly.dev/slack)

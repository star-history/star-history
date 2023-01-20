# Star History Open Source Best of 2022 | Platform Engineering

From [What is platform engineering](https://platformengineering.org/blog/what-is-platform-engineering):
> Platform engineering is the discipline of designing and building toolchains and workflows that enable self-service capabilities for software engineering organizations in the cloud-native era

Platform Engineering continues to rise in popularity in 2022 and is also featured in the [Gartner Hype Cycle for Software Engineering 2022](https://www.gartner.com/en/articles/what-s-new-in-the-2022-gartner-hype-cycle-for-emerging-technologies) report.

![gartner-report](/blog/assets/yearly-pick-platform-engineering-2022/gartner-report.webp)

In this post, Star History picks out 10 open-source projects that served as the building blocks for Platform Engineering.

## Backstage

![backstage](/blog/assets/yearly-pick-platform-engineering-2022/backstage.webp)

[Backstage](https://github.com/backstage/backstage), a Software Catalog and Developer Platform created by Spotify, is a developer portal that unifies an organization's tools, services, applications, data and documentation into a single, consistent user interface, enabling developers to easily create, manage and explore software so that developers can focus on building applications rather than reinventing the button over and over again.

Spotify developed Backstage to help engineering organizations to manage the complexity of growing systems, and it was open sourced in 2020 and became a CNCF incubation project in early 2022.

![backstage-dashboard](/blog/assets/yearly-pick-platform-engineering-2022/backstage-dashboard.webp)

In 2020, 280+ Spotify engineering teams were [already using Backstage](https://backstage.io/blog/2020/03/16/announcing-backstage) to manage 2000+ backend services, 300+ websites, and 200+ mobile features.

[Backstage Wrapped 2022](https://backstage.io/blog/2022/12/19/backstage-wrapped-2022) (is the title a homage to Spotify's annual Wrapped tho) mentioned that they gained 75 public users in the past year and now have 600+ users, proving that there really is a strong need for Backstage.

## Elasticsearch

![elastic](/blog/assets/yearly-pick-platform-engineering-2022/elastic.webp)

[Elasticsearch](https://github.com/elastic/elasticsearch) is a real-time distributed storage, search, and analytics engine, the first version was released in 2010 and based on [Apache Lucene](https://github.com/apache/lucene). In 2022, Elastic announced [Elastic 8.0](https://www.elastic.co/blog/whats-new-elastic-8-0-0), and it has gotten faster, simpler, and more scalable. They are also not slow in expanding the product: they are gradually enhancing the performance of [Elastic Cloud](https://www.elastic.co/blog/looking-back-at-2022-elastic-year-in-review) and adding the hottest keyword in their Roadmap: [Stateless Elasticsearch](https://www.elastic.co/blog/stateless-your-new-state-of-find-with-elasticsearch), which makes the service stateless and enables the elastic cloud platform.

![elastic-architecture](/blog/assets/yearly-pick-platform-engineering-2022/elastic-architecture.webp)

But of course, we can't forget the [controversy](https://www.elastic.co/blog/why-license-change-aws) between Elastic and AWS: AWS forked and commercialized (someone else's) OS project, while Elastic changed their open-source protocol to restrict users from using the client. Although they eventually [reached a settlement](https://www.elastic.co/blog/elastic-and-amazon-reach-agreement-on-trademark-infringement-lawsuit), it begs the question: in the world of open-source, are the users the ones paying the price (literally AND figuratively)?

## GitLab

![gitlab](/blog/assets/yearly-pick-platform-engineering-2022/gitlab.webp)

[GitLab](https://github.com/gitlabhq/gitlabhq) was born as a code hosting project to facilitate team development and collaboration, but has now expanded into a DevSecOps Platform. DevSecOps is DevOps with Security on top: normally, security awaits at the end of the development lifecycle, but when code is returned to developers for fixing, it adds extra cost. DevSecOps uses the shift-left approach to embrace security early in the DevOps lifecycle, by using tools to protect and monitor live applications, infusing security practices into every phase of software development till deployment.

![gitlab-devsecops](/blog/assets/yearly-pick-platform-engineering-2022/gitlab-devsecops.webp)

In addition, GitLab is well known for their public [Handbook](https://about.gitlab.com/handbook/) (think of it as their employee handbook). This 2,000+ page-properly-categorized document gives a pretty specific and informative glimpse into the processes/collaboration/use of tools and even the culture of GitLab - this is extra handy for a startup that is just starting out and looking to establish SOPs and processes.

## Grafana

![grafana](/blog/assets/yearly-pick-platform-engineering-2022/grafana.webp)

[Grafana](https://github.com/grafana/grafana) is an observability and data visualization platform. It simplifies the complexity of monitoring: provide the data and Grafana will take care of the visualization. It was first released in 2014 by Torkel Ödegaard (Grafana Labs Co-Founder) as an offshoot project by Orbitz. We all know the story later: Grafana Labs went on a roll in 2019 after raising a $24M Series A round, most recently a $240M Series D in April, 2022.

At ObservabilityCON 2022, Grafana Labs announced two new projects: [Phlare](https://grafana.com/blog/2022/11/02/announcing-grafana-phlare-oss-continuous-profiling-database/), a database for continuous profiling, and [Faro](https://grafana.com/blog/2022/11/02/introducing-grafana-faro-oss-application-observability/), a front-end application observability service. It is worth noting that Phlare was inspired by a Hackathon project that demonstrated the value of continuous analytics when connected to metrics, logs, and traces, and they decided to create a database for continuous analytics telemetry.

![grafana-workflow](/blog/assets/yearly-pick-platform-engineering-2022/grafana-workflow.webp)

## Kong

![kong](/blog/assets/yearly-pick-platform-engineering-2022/kong.webp)

[Kong](https://github.com/Kong/kong) is a cloud-native API gateway that allows users to analyze traffic and manage developers, consumers, partners, customers, etc. associated with different APIs. Since 2010, Kong has raised $169.1M in 6 rounds of funding. In 2022, they released [Kong Gateway 3.0](https://konghq.com/blog/kong-gateway-3-0) and launched a SaaS API platform in the AWS Marketplace: [Kong Konnect](https://konghq.com/products/cloud-api-platform).

Kong started out as an API aggregation platform/marketplace, the company and product name back then was Mashape. Kong's API gateway project was incubated later and soon took over to become the core business, while Mashape’s original aggregation platform/marketplace businesses were sold to [RapidAPI](https://rapidapi.com/). It is a classic open-source pivoting in recent years.

## Kubernetes

![kubernetes](/blog/assets/yearly-pick-platform-engineering-2022/kubernetes.webp)

We know, we know, but we can’t leave [Kubernetes](https://github.com/kubernetes/kubernetes) out in this category. It is one of the most popular container orchestration systems for automating software deployment, scaling and management. Originally designed by Google, it is now maintained by the Cloud Native Computing Foundation (CNCF). In fact, CNCF started with Kubernetes.

![kubernetes-terraform](/blog/assets/yearly-pick-platform-engineering-2022/kubernetes-terraform.webp)

Kubernetes has a widespread ecosystem and is the platform within platform engineering. Kubernetes is the primary runtime platform for all of the projects listed in this post except Terraform. Terraform also supports interaction with Kubernetes through the [Terraform Kubernetes Provider](https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs), which is maintained by HashiCorp, and listed together with the three major cloud vendors.

Trivia #1: Kubernetes’ name comes from the ancient Greek word for "helmsman", which explains its logo☸️. It also has a connection with the concept of container, and of course may be more or less aimed at the competitor Docker Swarm back then.

![kubernetes-container](/blog/assets/yearly-pick-platform-engineering-2022/kubernetes-container.webp)

Trivia #2: K8s is the middle 8 letters of Kubernetes "ubernete" replaced by the number "8", the same can be internationalizaiton into i18n.

To learn more about Kubernetes’ story, check out [this documentary](https://youtu.be/BE77h7dmoQU) by Honeypot!

## Prometheus

![prometheus](/blog/assets/yearly-pick-platform-engineering-2022/prometheus.webp)

[Prometheus](https://github.com/prometheus/prometheus) is a time-series database based system monitoring and alerting system. 2022 was its 10th birthday and it’s also a member of CNCF. It was open-sourced by SoundCloud back in 2012, but after watching [The History of Prometheus at SoundCloud](https://promcon.io/2016-berlin/talks/the-history-of-prometheus-at-soundcloud/), it seems one of their engineers wrote a monitoring tool that was used at SoundCloud, which was deemed quite handy. It was then open-sourced by the company, and the community grew along the way.

![prometheus-soundcloud](/blog/assets/yearly-pick-platform-engineering-2022/prometheus-soundcloud.webp)

“Prometheus” is one of the gods of the Titans in ancient Greek mythology, and the name means "foresight", which is probably the source of the project name. Prometheus is also the second CNCF project after Kubernetes, which seems to be quite foresighted. There is also [a documentary](https://www.youtube.com/watch?v=rT4fJNbfe14) by Honeypot about Prometheus.

## Sourcegraph

![sourcegraph](/blog/assets/yearly-pick-platform-engineering-2022/sourcegraph.webp)

[Sourcegraph’s home page](https://sourcegraph.com/search) is a code search page, not the usual product introduction page, which is probably the smartest product demo, no?

![sourcegraph-search](/blog/assets/yearly-pick-platform-engineering-2022/sourcegraph-search.webp)

[Sourcegraph](https://github.com/sourcegraph/sourcegraph) is a code search platform. Imagine a developer fixing a bug, but needs to jump to another part of the code, so he has to open another file in his IDE, which breaks his current working state. Sourcegraph's web-based code search interface allows developers to keep their current state while exploring other parts of the code, which greatly reduces the cost of switching. Advanced features such as code navigation, code insight help developers onboard new projects faster, understand their projects better (how code changes over time and its current state), as well as the ability to apply code changes in different repositories like Batch Changes.

In addition, the [Sourcegraph Podcast](https://about.sourcegraph.com/podcast), featuring co-founder/CTO Beyang and authors/engineers/DevRel folks of other startups, is an insightful podcast about projects' origin stories, these folks' worldviews, experiences, favourite tools and techs, and more.

## Temporal

![temporal](/blog/assets/yearly-pick-platform-engineering-2022/temporal.webp)

[Temporal](https://github.com/temporalio/temporal) is another rising star and serves as a core piece in platform engineering. It is a microservice task scheduling execution platform that executes application logic units, workflows in a resilient way, automatically handles intermittent failures, and retries failed operations. Although the first release only came in 2020.2, the founders built Cadence workflow (uber/cadence) back in Uber to solve Uber's workflow/orchestration problems, and Temporal is a commercialized fork version of Cadence.

Sidenote: Temporal annual conference Relay merch looks so damn good 😍.

![temporal-swag](/blog/assets/yearly-pick-platform-engineering-2022/temporal-swag.webp)

## Terraform

![terraform](/blog/assets/yearly-pick-platform-engineering-2022/terraform.webp)

[Terraform](https://github.com/hashicorp/terraform) is a tool for managing infrastructure (infrastructure-as-code) under HashiCorp. Terraform v0.1 was released back in 2014, but only became the industry leader 8 years later, revolutionizing the entire workflow, and was almost shut down in the early days because of the slow adoption.

Terraform Provider started out as a way to smooth out the differences in managing the services of several large public cloud vendors, and has now become the de facto standard for managing all cloud/SaaS resources.

## Platform Engineering is the Future

Well, this is it for platform engineering projects, from big names to the starlets, let's review them again:

- **The underlying runtime platform** - Kubernetes
- **The service catalog and developer portal** - Backstage
- **API gateway** - Kong
- **Universal Search** - Elasticsearch
- **Code hosting**, CI/CD, and DevSecOps - GitLab
- **Code Search** - Sourcegraph
- **Monitoring/Alerting** - Prometheus
- **Dashboard** - Grafana
- **Task Scheduling and Execution** - Temporal
- **Codify Infrastructure and Cloud Resources** - Terraform

The above projects will constitute a pretty solid platform engineering backbone, while there are a couple of other core components worth mentioning:

- **Security and Access Control** (network access, software supply chain, intrusion detection, Audit Log) - [Snyk](https://snyk.io/), [tailscale](https://tailscale.com/), [Vault](https://www.hashicorp.com/products/vault), [Boundary](https://www.boundaryproject.io/).
- **Resource Allocation** (auto-scaling, scheduling, FinOps) - [OpenCost](http://opencost.io/).
- **Configuration** (application configurations, feature flags) - [Apollo](https://github.com/apolloconfig/apollo), [Flagsmith](https://flagsmith.com/).
- **Database Development** (database change, query, admin, security) - [Bytebase](https://bytebase.com).

---

This is part of Star History Open Source 2022 series, you can continue with:

1. [Open Source Best of 2022 - Data, Infra & DevTools](/blog/star-history-yearly-pick-2022-data-infra-devtools).
1. [Open Source Best of 2022 - Platform Engineering](/blog/star-history-open-source-2022-platform-engineering).
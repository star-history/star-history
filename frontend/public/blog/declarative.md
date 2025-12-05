---
title: "Star History Monthly October 2025 | Declarative"
author: "Adela"
featured: true
featureImage: "/assets/blog/declarative/banner.webp"
publishedDate: "2025-10-16T12:00:00.000Z"
description: "The declarative programming paradigm, which focuses on describing what you want to achieve rather than how to achieve it, is rapidly becoming the standard for managing complex systems. From infrastructure and databases to even diagramming, the declarative approach offers a more predictable, maintainable, and automated way to work. This shift is empowering developers to manage complexity with greater confidence and ease."
---

The declarative programming paradigm, which focuses on describing *what* you want to achieve rather than *how* to achieve it, is rapidly becoming the standard for managing complex systems. From infrastructure and databases to even diagramming, the declarative approach offers a more predictable, maintainable, and automated way to work. This shift is empowering developers to manage complexity with greater confidence and ease.

This month, we highlight five projects that exemplify the power and versatility of the declarative approach:

| |  |
|---|---|
| **D2** | Declarative diagramming as code |
| **pgschema** | Terraform-style schema migration for Postgres |
| **Terraform** | The original declarative infrastructure as code |
| **OpenTofu** | The community's open-source Terraform |
| **Pulumi** | Infrastructure as real code |

## [D2](https://github.com/terrastruct/d2)

#### → Declarative Diagramming

[![Star History Chart](https://api.star-history.com/svg?repos=terrastruct/d2&type=Date)](https://star-history.com/#terrastruct/d2&Date)

D2 is a modern diagram scripting language that turns text into diagrams. It allows you to create complex, high-quality diagrams using a simple, declarative syntax. Instead of manually drawing boxes and lines, you describe the components of your system and their relationships, and D2 handles the layout and rendering.

![D2](/assets/blog/declarative/d2.webp)

- **Strengths**: Clean and modern output, extensible with plugins, and supports native rendering on GitHub.
- **Limitations**: As a newer tool, it has a smaller community and fewer integrations than established tools like Mermaid or Graphviz.

👉 D2 is making "diagrams as code" a practical reality, enabling developers to version, review, and share diagrams alongside their code.

## [pgschema](https://github.com/pgschema/pgschema)

#### → Declarative Schema Migration

[![Star History Chart](https://api.star-history.com/svg?repos=pgschema/pgschema&type=Date)](https://star-history.com/#pgschema/pgschema&Date)

pgschema brings the popular Terraform-style declarative workflow to PostgreSQL schema management. Instead of writing imperative migration scripts (e.g., `ALTER TABLE ...`), you declare the desired state of your schema in a file. pgschema then generates and applies the necessary changes to get your database to that state.

![pgschema](/assets/blog/declarative/pgschema.webp)

- **Strengths**: State-based approach eliminates the need for a migration history table, works without a shadow database, and supports a wide range of Postgres objects.
- **Limitations**: It's a new project, so the community is still growing, and it currently only supports PostgreSQL.

👉 pgschema simplifies database schema management by making it as easy and reliable as managing infrastructure with Terraform.

## [Terraform](https://github.com/hashicorp/terraform)

#### → The Original Declarative Infra

[![Star History Chart](https://api.star-history.com/svg?repos=hashicorp/terraform&type=Date)](https://star-history.com/#hashicorp/terraform&Date)

![Terraform](/assets/blog/declarative/terraform.webp)

Terraform is the tool that popularized the concept of declarative infrastructure as code (IaC). It allows you to define and provision infrastructure across a wide range of cloud providers using a high-level configuration language called HCL. For years, it has been the de facto standard for IaC.

- **Strengths**: Mature, extensive ecosystem of providers, and a large, experienced community.
- **Controversy**: In August 2023, HashiCorp switched Terraform's license from the open-source MPL-2.0 to the source-available Business Source License (BSL), raising concerns about its open-source future.

👉 Terraform remains the established giant in the IaC space, but its license change has opened the door for new challengers.

## [OpenTofu](https://github.com/opentofu/opentofu)

#### → The Community's Terraform

[![Star History Chart](https://api.star-history.com/svg?repos=opentofu/opentofu&type=Date)](https://star-history.com/#opentofu/opentofu&Date)

OpenTofu is a community-driven, open-source fork of Terraform created in response to HashiCorp's license change. Hosted by the Linux Foundation, it aims to keep Terraform truly open source (under the MPL-2.0 license) and is managed by a community of developers and organizations. It serves as a drop-in replacement for Terraform.

![OpenTofu](/assets/blog/declarative/opentofu.webp)

- **Strengths**: Truly open source, community-governed, and maintains compatibility with Terraform, including its vast ecosystem of providers and modules.
- **Challenges**: As a fork, it needs to continue to innovate and grow its community to compete with the original.

👉 OpenTofu is a powerful testament to the open-source community's ability to rally and preserve access to critical tools.

## [Pulumi](https://github.com/pulumi/pulumi)

#### → Infrastructure as Real Code

[![Star History Chart](https://api.star-history.com/svg?repos=pulumi/pulumi&type=Date)](https://star-history.com/#pulumi/pulumi&Date)

Pulumi offers a unique take on declarative infrastructure by allowing you to use general-purpose programming languages like Python, TypeScript, Go, and C# to define your infrastructure. This means you can leverage familiar tools, concepts, and libraries—like loops, functions, and classes—to build and manage your cloud resources.

![Pulumi](/assets/blog/declarative/pulumi.webp)

- **Strengths**: Extreme flexibility, the ability to use existing language ecosystems, and a more natural fit for developers who are already comfortable with programming.
- **Limitations**: Can have a steeper learning curve for those not familiar with the supported programming languages, and it requires managing both the Pulumi and language-specific dependencies.

👉 Pulumi bridges the gap between infrastructure and software development, empowering teams to manage infrastructure with the same tools and practices they use for their applications.

---

✨ That's October: five projects that showcase the power and breadth of the declarative revolution. By focusing on the "what" instead of the "how," these tools are making it easier than ever to build, manage, and scale complex systems with confidence.
---
title: "star-history.com in 2025"
author: "Tianzhou"
featured: true
featureImage: "/assets/blog/star-history-2025/banner.webp"
publishedDate: "2026-01-01T09:00:00.000Z"
description: "A look back at star-history.com in 2025"
---


2025 has been a more eventful year for star-history.com. Our website visitors grew 45% compared to 2024.

![traffic](/assets/blog/star-history-2025/traffic.webp)

This is our biggest YoY growth ever—as a comparison, we grew a modest 10% in 2024.

The accelerated growth is likely driven by the expanding open source ecosystem on GitHub. We're also seeing more hockey stick charts.

![hockey-stick](/assets/blog/star-history-2025/hockey-stick.webp)

This year, more repos are embedding our live star history chart in their READMEs. As traffic grew, our API serving backend encountered some scaling challenges. Around the end of March, users began experiencing more failures when rendering charts. 

![outage1](/assets/blog/star-history-2025/outage1.webp)

This was caused by GitHub API rate limiting, as rendering the chart requires calling the GitHub API—and we make a lot of API calls. 

We ultimately resolved it by employing several techniques. While the issue hasn't completely disappeared, it's much better than before.

Generating and serving images in real-time also consumes considerable bandwidth. To avoid breaking the bank, we migrated our backend from a PaaS vendor to GKE. This not only saves money, but also improves our service reliability.

Besides those hidden improvements under the hood, this year we also implemented log scale—a feature that was requested almost 8 years ago.

![log-scale](/assets/blog/star-history-2025/log-scale.webp)

A growing number of repos have outgrown linear scale, and we wanted to support them.

Later, we enhanced the feature to allow users to adjust the legend placement.

![legend](/assets/blog/star-history-2025/legend.webp)

Beyond the technical improvements, we also kept creating content. Throughout the year, we issued 12 monthly picks, each covering a different topic.

- Jan - [Knowledge Management](/blog/knowledge-management)
- Feb - [DeepSeek](/blog/deepseek)
- Mar - [MCP Server](/blog/mcp-server)
- Apr - [AI Verse](/blog/ai-verse)
- May - [Agent Protocol](/blog/agent-protocol)
- Jun - [Agent Browser](/blog/browser-ai-agent)
- Jul - [IDE for Vibe Coding](/blog/ide-vibe-coding)
- Aug - [Vertical LLM](/blog/vertical-llm)
- Sep - [Proprietary AI Alternatives](/blog/proprietary-ai-alternatives)
- Oct - [Declarative](/blog/declarative)
- Nov - [Agent SDK/Framework](/blog/agent-sdk-framework)
- Dec - [React](/blog/react)

This year, we also decided to pause the Starlet program, which we launched in 2023 to promote less well-known open source projects. After publishing 30 issues, we found that coordinating content creation with external contributors posed significant challenges. Moving forward, we'll focus more on our own original content while staying true to our mission of highlighting noteworthy projects in the open source ecosystem.

Finally, we'd like to highlight our annual sponsor [Dify](https://dify.ai/) and our very own editorial team from [Bytebase](https://bytebase.com/). Maintaining star-history.com gives us a platform to stay connected with the open source community, even when that means firefighting scaling issues through the end of 2025.

![outage2](/assets/blog/star-history-2025/outage2.webp)

Happy coding in 2026. Here's to more hockey stick charts—just hopefully not for our API rate limits.
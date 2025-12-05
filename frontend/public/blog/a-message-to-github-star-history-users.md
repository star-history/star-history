---
title: "A Message to GitHub Star History Users about Ongoing Broken Live Chart"
author: "tianzhou"
featured: true
featureImage: "/assets/blog/a-message-to-github-star-history-users/banner.webp"
publishedDate: "2025-03-28T00:00:00.000Z"
description: "Explain the current situation about broken GitHub Star History live chart image."
---

> Update: We have restored the API service on Mar 29, 2025.

We enable users to embed a live GitHub star history chart directly into their repositories, with many maintainers already incorporating it into their READMEs to showcase project growth.

![live-chart](/assets/blog/a-message-to-github-star-history-users/live-chart.webp)

Under the hood, it calls the Star History API, which in turn calls the GitHub API to fetch star history data.

This feature has been well received and has grown tremendously. The problem is that calling the GitHub API requires a token, and each token has an API rate limit per account. Previously, we relied on our team and [external contributors](https://github.com/star-history/star-history?tab=readme-ov-file#-token-contributor) for tokens, but this approach still can’t keep up with the increasing usage.

Below is a typical log entry from a single second:

![api-rate-limit](/assets/blog/a-message-to-github-star-history-users/api-rate-limit.webp)

As maintainers, we attempted to circumvent the system by using [a plus ("+") sign](https://gmail.googleblog.com/2008/03/2-hidden-ways-to-get-more-from-your.html) to register multiple GitHub accounts, generating additional tokens to bypass API rate limits.

After implementing this workaround, GitHub swiftly flagged it as abusive behavior. Not only did they invalidate all newly created tokens, but they also revoked existing tokens in good standing and blacklisted the associated GitHub accounts from generating valid tokens. Once we recognized GitHub’s response, we halted all efforts to avoid further escalation—continuing would have risked blacklisting our entire team’s accounts (while we can still log in to GitHub, tools like Copilot in VSCode no longer work, as they rely on GitHub API access for OAuth).

We acknowledge GitHub’s systems rightly detected and addressed this misuse. Unfortunately, we couldn’t prevent the cascading consequences, forcing us to suspend the Star History API service.

This outage only affects the API—you can still use this website to view and download charts (though you may need to provide your own token).

There are several lessons to learn here, but our immediate priority is to contact GitHub’s team, resolve the blacklisting, and restore service.

Thank you for being a star history user.

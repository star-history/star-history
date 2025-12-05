---
title: "Star History Monthly October 2024 | Homelab"
author: "dec"
featured: true
featureImage: "/assets/blog/homelab/banner.webp"
publishedDate: "2024-10-12T00:00:00.000Z"
description: "Homelab provides you with extra space of good privacy to experiment and develop with little cost."
---

Homelab is a server that resides locally in one's home to host several applications and virtualized systems for testing, developing, home or functional usage.

Homelab isn't a necessity. However, it provides you with extra space of good privacy to experiment and develop with little cost.

-   [Vaultwarden](#vaultwarden)
-   [AdGuardHome](#adguard)
-   [immich](#immich)
-   [SilverBullet](#silverbullet)
-   [Bytebase](#bytebase)
-   [homepage](#homepage)

## Vaultwarden

![Vaultwarden-star](/assets/blog/homelab/vaultwarden-star.webp)

[Vaultwarden](https://github.com/dani-garcia/vaultwarden) is an unofficial Bitwarden server implementation that implements many of the Bitwarden APIs required for most functionality, ideal for self-hosted deployments where running the official resource-heavy service is undesirable.

Since the server only hosts encrypted data, it is quite secure. Resource consumption is low and works very well in teams and concurrent connections with docker.

## AdGuard

![AdGuardHome-star](/assets/blog/homelab/adguardhome-star.webp)

[AdGuard](https://adguard.com/en/welcome.html) is a network-wide software for blocking ads and tracking, covering ALL your home devices. It operates as a DNS server that re-routes tracking domains to a “black hole”, thus preventing your devices from connecting to those servers.

![AdGuardHome](/assets/blog/homelab/adguardhome.webp)

To build AdGuard, you will need Go v1.23 or later, Node.js v18.18 or later, and npm v8 or later. You can build AdGuard Home for any OS/ARCH that Go supports. Once it's installed, the service is already started with no need to launch anything explicitly.

## immich

![immich-star](/assets/blog/homelab/immich-star.webp)

[Immich](https://immich.app/) is a high performance self-hosted photo and video management solution. It [features](https://immich.app/docs/features/automatic-backup) Automatic Backup, Facial Recognition, Partner Sharing and many other useful functions.

![immich](/assets/blog/homelab/immich.webp)

Immich uses a traditional client-server design, with a dedicated database for data persistence. The frontend clients communicate with backend services over HTTP using REST APIs. You can deploy and upgrade immich via Docker. Be aware that the project is under Very Active development, so expect bugs and breaking changes.

## SilverBullet

![silverbullet-star](/assets/blog/homelab/silverbullet-star.webp)

[SilverBullet](https://silverbullet.md/) is a note-taking application optimized for people with a hacker mindset, supporting wiki-style page linking. Its synced mode enables 100% offline operation, keeping a copy of the content in the browser’s local [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) database, syncing back to the server when a network connection is available.

SilverBullet is a platform for [End-User Programming](https://silverbullet.md/End-User%20Programming) through its support for [Objects](https://silverbullet.md/Objects), [Live Queries](https://silverbullet.md/Live%20Queries), [Live Templates](https://silverbullet.md/Live%20Templates) and [Live Template Widgets](https://silverbullet.md/Live%20Template%20Widgets), allowing to make parts of your pages and UI dynamic.

## Bytebase

![Bytebase-star](/assets/blog/homelab/bytebase-star.webp)

[Bytebase](https://www.bytebase.com/) provides a web-based SQL client to manage all your different databases. It
supports 20+ mainstream databases.

![Bytebase-instance](/assets/blog/homelab/bytebase-instance.webp)

It also provides AI Assistant features to allow you to query with natural language (Text2SQL), explain and optimize
SQL statements.

![Bytebase-instance](/assets/blog/homelab/bytebase-sql-editor.webp)

You can try the online demo at [https://sql-editor.com/](https://sql-editor.com/sql-editor/projects/project-sample/sheets/101).

## Homepage

![homepage-star](/assets/blog/homelab/homepage-star.webp)

Well, after you have installed so many awesome tools, would it be annoying if you need to access them from different places?

[Homepage](https://gethomepage.dev/) is a highly customizable homepage (or startpage / application dashboard) with Docker and service API integrations. It features quick search, bookmarks, weather support, a wide range of integrations and widgets, an elegant and modern design, and a focus on performance.

![homepage](/assets/blog/homelab/homepage.webp)

Homepage has built-in support for Docker, and can automatically discover and add services to the homepage based on labels.

Homepage is highly customizable, with support for custom themes, custom CSS & JS, custom layouts, formatting, localization and more.

So, it's time to upgrade your homelab and put them all under Homepage.

## Lastly

With a homelab, you can build various functional and fun project. Just try developing your homelab as you like it!

📧 _Subscribe to our [weekly newsletter here](https://star-history.beehiiv.com/subscribe)._

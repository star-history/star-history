# Star History Open Source Best of 2022 | Front-end

As a proper goodbye to 2022, Star History looks at some of the most interesting open-source projects in the year that passed. Some projects came out of nowhere and made a big bang; some released new versions, while some renovated their websites.

In today’s post, we are covering front-end projects.

*Note: The following ranking is in alphabetical order.

## Bun

https://github.com/oven-sh/bun

![bun](/blog/assets/yearly-pick-frontend-2022/bun.webp)

Bun is a JavaScript runtime that [came out of nowhere](https://twitter.com/jarredsumner/status/1544850464302194688) in the middle of this year and claims to perform better than Node and Deno.

![bun tweet](/blog/assets/yearly-pick-frontend-2022/bun-github-trending.webp)

People can’t help but analyze how Bun can be this fast. The conclusion mostly boiled down to:

- Bun is still an early-stage project (there are still many issues, and features to consume the performance advantage 😂)
- Bun is very purposeful, with optimizations designed for specific scenarios.

Half a year later, we wonder, is Bun faster?

## Fresh

https://github.com/denoland/fresh

![fresh](/blog/assets/yearly-pick-frontend-2022/fresh.webp)

Fresh is a full-stack web framework based on [Deno](https://github.com/denoland/deno), designed to improve the developer experience by eliminating build steps and reducing the amount of JavaScript shipped to the client. [Fresh 1.0](https://deno.com/blog/fresh-is-stable) was announced at the end of June and has gained much attention.

Fresh is authored by Luca Casonato, one of the core developers of Deno, who says that client-side rendering is costly, slows down the user experience, drastically increases power consumption on mobile devices, and is often not very robust. Fresh uses a different model: the majority of rendering is done on a server, and the client is only responsible for re-rendering small islands of interactivity.

## Remix

https://github.com/remix-run/remix

![remix](/blog/assets/yearly-pick-frontend-2022/remix.webp)

Remix, a full-stack web framework based on TypeScript and React, was officially released in late 2021 and has gained a lot of attention since then. The team behind it, Michael Jackson and Ryan Florence, are both React veterans.

![remix-spin](/blog/assets/yearly-pick-frontend-2022/remix-spin.webp)

The use of the slogan “Say goodbye to Spinnageddon” on [their official website](https://remix.run/) is genuinely awe-inspiring. 👋

![remix-spin](/blog/assets/yearly-pick-frontend-2022/spinning-cat.webp)

## Markdoc

https://github.com/markdoc/markdoc

![markdoc](/blog/assets/yearly-pick-frontend-2022/markdoc.webp)

Online payment platform Stripe open-sourced their docs framework, Markdoc, earlier this year. Markdoc is a powerful, flexible, Markdown-based content creation system that allows users to create custom docs sites.

![markdoc-demo](/blog/assets/yearly-pick-frontend-2022/markdoc-demo.webp)

The [Stripe docs site](http://stripe.com/docs) is supported by Markdoc, which is the most straightforward (and free) use case, right? You can make just as complex and beautiful docs!

## Next.js

https://github.com/vercel/next.js

![nextjs](/blog/assets/yearly-pick-frontend-2022/nextjs.webp)

Next.js is a lightweight React server-side rendering application framework that has officially [surpassed Kubernetes in GitHub stars](https://twitter.com/leeerob/status/1564017079665180672?lang=en) this year.

![nextjs-k8s](/blog/assets/yearly-pick-frontend-2022/nextjs-k8s.webp)

I’m sure no one can resist generating a ticket of their own to this year's Next.js Conf. 😍 Next.js 13 was also announced at the conference.

![nextjs-conf](/blog/assets/yearly-pick-frontend-2022/nextjs-conf.webp)


## SolidJS

https://github.com/solidjs/solid

![solidjs](/blog/assets/yearly-pick-frontend-2022/solidjs.webp)

Solid.js won the Breakthrough of the year award at JS Nation 2022. It is a JavaScript library for building user interfaces, and the official “Why Solid?” mentions that they are very proud of their: 

- indistinguishable performance (second only to native JS).
   ![solidjs-performance](/blog/assets/yearly-pick-frontend-2022/solidjs-performance.webp)
- full-featured with everything you can expect from a modern framework.
- simple, composable primitives without hidden rules and gotchas.
- growing ecosystem.

## Tailwind CSS

https://github.com/tailwindlabs/tailwindcss

![tailwind](/blog/assets/yearly-pick-frontend-2022/tailwind.webp)

Tailwind CSS is a CSS framework toolset. Whether it's colors or spacing, proportions, or fonts, Tailwind comes with defaults that are ready to use out of the box, but they can also be customized.

![tailwind-colors](/blog/assets/yearly-pick-frontend-2022/tailwind-colors.webp)

## Tauri

https://github.com/tauri-apps/tauri

![tauri](/blog/assets/yearly-pick-frontend-2022/tauri.webp)

Tauri is a desktop application development framework, that released [Tauri 1.0](https://tauri.app/blog/2022/06/19/tauri-1-0) this year. Because of its similarity to Electron, yet it solves the former’s pain points: large, high resource consumption, plus the fact that Tauri is written using Rust, it is easy to imagine why the attention.

## Turbopack

https://github.com/vercel/turbo

![turbo](/blog/assets/yearly-pick-frontend-2022/turbo.webp)

Turbopack was announced at Next.js Conf 22 by Vercel. It is an incremental packaging tool optimized for JavaScript and TypeScript, and claims to be 700 times faster than Webpack.

Since there weren’t any Rust-based JavaScript packaging tools and after evaluating the available packaging tools, Vercel decided to get Tobias Koppers, author of Webpack, and the Next.js team to write one together.

![turbopack-performance](/blog/assets/yearly-pick-frontend-2022/turbopack-performance.webp)

## Vite

https://github.com/vitejs/vite

![vite](/blog/assets/yearly-pick-frontend-2022/vite.webp)

Vite is a front-end development and building tool by Evan You. [Vite 3](https://vitejs.dev/blog/announcing-vite3.html) was announced in 2022, and the main site uses the new VitePress default theme.

![vite-new](/blog/assets/yearly-pick-frontend-2022/vite-new.webp)

Their previous site is pretty. The new site is fire.

![vite-old](/blog/assets/yearly-pick-frontend-2022/vite-old.webp)

That’s it for the top front-end projects. Stay tuned for the next round-up, where we will be looking at data & infrastructure tools that shone bright in 2022. DM us [@StarHistoryHQ](https://twitter.com/StarHistoryHQ) if you have any good project suggestions! 🤓

---

This is part of Star History Open Source 2022 series, you can continue with:

1. [Open Source Best of 2022 - Data, Infra & DevTools](/blog/star-history-yearly-pick-2022-data-infra-devtools).
1. [Open Source Best of 2022 - Platform Engineering](/blog/star-history-open-source-2022-platform-engineering).
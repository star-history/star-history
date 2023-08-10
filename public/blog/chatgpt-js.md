*This is the fourth issue of The Starlet List. If you want to prompt your open source project on star-history.com for free, please check out our [announcement](/blog/list-your-open-source-project).*

---

# chatgpt.js - A powerful, open source client-side JavaScript library for ChatGPT

<div>

![chatgpt.js landing page](/blog/assets/chatgpt-js/chatgpt-js-landing-page.webp)

</div>

Since ChatGPT launched on November 20, 2022, it has captured the imagination of humankind, becoming the [fastest-growing app in the history of the universe](https://www.zdnet.com/article/chatgpt-just-became-the-fastest-growing-app-of-all-time/) (outpacing even TikTok/Douyin) and never letting go.

Unsurprisingly, an ecosystem of tools that either utilize or enhance the AI's astounding power has blossomed.

**[chatgpt.js](https://chatgpt.js.org)** is a JavaScript library that supports this ecosystem by allowing for super-easy interaction w/ the ChatGPT DOM.

For example:

```js
chatgpt.getLastResponse();
chatgpt.getLastReply();
chatgpt.response.getLast();
chatgpt.get('reply', 'last');
```

Each call equally fetches the last response (from either DOM or API, dependent on script environment.)

<div align="center">

![Chrome extension made with chatgpt.js](/blog/assets/chatgpt-js/chatgpt-extension-loaded.webp)

</div>

Importing the library is equally simplistic:

```js
(async () => {
     await import('https://code.chatgptjs.org/chatgpt-latest.min.js');
    // Your code here...
})();
```

## Made with chatgpt.js

Some popular & award-winning apps made w/ **chatgpt.js** include:

- **[Autoclear ChatGPT History](https://autoclearchatgpt.com)** - <ins>Featured by Futurepedia</ins> - Auto-clears your ChatGPT query history for maximum privacy
- **[Automatic ChatGPT DAN](https://github.com/madkarmaa/automatic-chatgpt-dan)** - Automatically send DAN prompts to ChatGPT
- **[BraveGPT](https://bravegpt.com)** - <ins>Featured by Product Hunt</ins> - Display ChatGPT answers in Brave Search sidebar (powered by GPT-4!)
- **[ChatGPT Auto-Continue](https://chatgptautocontinue.com)** - <ins>Mentioned in Awesome</ins> - Automatically continue generating multiple ChatGPT responses
- **[ChatGPT Auto Refresh](https://chatgptautorefresh.com)** - <ins>Featured by Futurepedia</ins> - Keeps ChatGPT sessions fresh to eliminate network errors + Cloudflare checks
- **[ChatGPT Infinity](https://chatgptinfinity.com)** - <ins>Featured by Google</ins> - Generate endless answers from all-knowing ChatGPT (in any language!)
- **[ChatGPT Widescreen](https://chatgptwidescreen.com)** - <ins>Awarded #2 Product of the Week (in UX) by Product Hunt</ins> - Adds Widescreen/Full-Window/Fullscreen toggles/modes to ChatGPT + Poe
- **[DuckDuckGPT](https://duckduckgpt.com)** - <ins>Featured by Product Hunt</ins> - Display ChatGPT answers in DuckDuckGo sidebar (powered by GPT-4!)

## Star growth

**chatgpt.js** is still a very young lib, but as shown by the Star History chart, it had a stunning growth period during a span of mere weeks:

<div align="center">

<a href="https://star-history.com/#kudoai/chatgpt.js&Timeline">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=kudoai/chatgpt.js&type=Timeline&theme=dark" />
    <img width=665 src="https://api.star-history.com/svg?repos=kudoai/chatgpt.js&type=Timeline" />
  </picture>
</a>

</div>

Two main events can be attributed with causing this astonishing growth spurt:

- In June 2023, editors at Product Hunt [featured](https://www.producthunt.com/products/chatgpt-js#chatgpt-js) **chatgpt.js** on its front page, resulting in 100+ upvotes & thousands of unique visitors in the following days

<div align="center">

![GitHub growth spike after Product Hunt launch](/blog/assets/chatgpt-js/github-traffic-spike-after-product-hunt-launch.webp)

</div>

- Within that same week, TLDR — a tech & programming newsletter w/ over 1,000,000 readers — featured the repo near the bottom of e-mail (where readers commonly anchor to)

<div align="center">

![image](/blog/assets/chatgpt-js/tldr-newslettere-featuring-chatgpt-js.webp)

</div>

## Future development

**chatgpt.js** is continuously maintained, with new features added based on user demand in the [GitHub repo](https://github.com/kudoai/chatgpt.js).

The project is open to sponsorships: if you are a company or individual and believe in the project, you can consider [pioneering chatgpt.js growth](https://github.com/sponsors/kudoai)!

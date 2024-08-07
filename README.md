<div align="center">

🧩 [**Also available as a Chrome extension**](https://chrome.google.com/webstore/detail/star-history/iijibbcdddbhokfepbblglfgdglnccfn)

# :sparkles: Star History :sparkles:

[**star-history.com**](https://star-history.com), **the missing GitHub star history graph of GitHub repos.**

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=star-history/star-history&type=Date&theme=dark" />
  <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=star-history/star-history&type=Date" />
  <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=star-history/star-history&type=Date" />
</picture>

👆 **THIS** is a **`live`** chart created with the following html: 👇

<div align="left">

```html
<picture>
  <source
    media="(prefers-color-scheme: dark)"
    srcset="
      https://api.star-history.com/svg?repos=star-history/star-history&type=Date&theme=dark
    "
  />
  <source
    media="(prefers-color-scheme: light)"
    srcset="
      https://api.star-history.com/svg?repos=star-history/star-history&type=Date
    "
  />
  <img
    alt="Star History Chart"
    src="https://api.star-history.com/svg?repos=star-history/star-history&type=Date"
  />
</picture>
```

</div>

</div>

---

## 💜 Sponsors

### Bytebase

[Bytebase](https://bytebase.com?source=star-history) is an open source, web-based database schema change and version control tool for teams. Supporting MySQL, PostgreSQL, Oracle, MongoDB, Redis, Snowflake, ClickHouse, TiDB, Google Spanner.

<a href="https://bytebase.com?source=star-history"><img src="https://raw.githubusercontent.com/star-history/star-history/main/public/sponsors/bytebase/landing.webp" /></a>

### Dify

[Dify](https://dify.ai/?utm_source=star-history) is an open source LLMOps platform that helps developers build AI applications more simply and quickly. Its core idea is to define various aspects of AI applications, including Prompts, Contexts, and Plugins, through declarative YAML files.

<a href="https://dify.ai/?utm_source=star-history"><img src="https://raw.githubusercontent.com/star-history/star-history/main/public/sponsors/dify/landing.webp" /></a>

## ✨ Features

- **Unique** **`sketch xkcd`** feeling **chart**;
- **One-click** generation of **high-quality** image for chart;
- Support **multiple chart view** mode **`based on date or timeline`**;
- **Embed** the **real-time chart** into **`GitHub readme or other websites`** **(like the one we embed here on the top)**
- And **various** useful **functions**:
  - toggle **repo visibility**;
  - **shortcut** to input repo;
  - **share** on **`Twitter`** **quickly**;
  - **support** input **multiple repos**;
  - ...waiting **for you** to **find out!**

## 🌠 Screenshots

<a href="https://star-history.com"><img width="800px" src="https://user-images.githubusercontent.com/24653555/154391264-312b448b-f851-41bf-bb8d-4c21ec6795b6.gif" />
</a>

### 🧩 [Free chrome extension](https://chrome.google.com/webstore/detail/star-history/iijibbcdddbhokfepbblglfgdglnccfn)

<a href="https://chrome.google.com/webstore/detail/star-history/iijibbcdddbhokfepbblglfgdglnccfn"><img width="800px" src="https://user-images.githubusercontent.com/24653555/154391326-61b65d8f-3f9f-4432-b773-5988be75b0ea.png" /></a>

## 🏗 Development

**`Star-history`** is built using a **modern tech stack**: **`Vue`** + **`Vite`** + **`TailwindCSS`**.

### Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [pnpm](https://pnpm.io/)

### Install dependencies

```shell
pnpm i
```

### Start with your interest

- **Main website** is the homepage of star-history with most of **useful features and blogs** about **`open source`**.

  ```shell
  pnpm dev
  ```

  The website will be served at http://localhost:3000.

- **Chrome extension** supports the **basic chart viewer** as a **free** additional product.

  ```shell
  pnpm build:extension
  ```

  Load the built `./dist` folder as **unpacked project** to chrome extensions page.

- **API server** is an **`experimental feature`**. It's mainly used to **generate chart `SVG`** image file that can be embeded into **`GitHub readme`**.

  ```shell
  cd server
  pnpm i && pnpm dev
  ```

  The API server will be running on http://localhost:8080.

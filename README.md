# Star History

[https://star-history.com](https://star-history.com) the missing GitHub star history graph of GitHub repos.

[![Star History Chart](https://api.star-history.com/svg?repos=bytebase/star-history&type=Date)](https://star-history.com/#bytebase/star-history&Date)

**Sponsor**

<a href="https://bytebase.com/"> <img height="80px" src="https://i.v2ex.co/3VSATzOl.png" /> </a>

[Bytebase.com](https://bytebase.com) is an open source, web-based database schema change and version control tool for teams.

## ✨ Features

- Unique sketch xkcd feeling chart;
- One-click generation of high-quality image for chart;
- Support multiple chart view mode based on date or timeline;
- Embed the real-time chart into GitHub readme or other websites;
- And various useful functions:
  - toggle repo visibility;
  - shortcut to input repo;
  - share on twitter quickly;
  - support input multiple repos;
  - ...wait for you finding out

## 🌠 Screenshots

<a href="https://star-history.com"><img width="800px" src="https://user-images.githubusercontent.com/24653555/154391264-312b448b-f851-41bf-bb8d-4c21ec6795b6.gif" />
</a>

### [🧩 Also available as free chrome extension](https://chrome.google.com/webstore/detail/star-history/iijibbcdddbhokfepbblglfgdglnccfn)

<a href="https://chrome.google.com/webstore/detail/star-history/iijibbcdddbhokfepbblglfgdglnccfn"><img width="800px" src="https://user-images.githubusercontent.com/24653555/154391326-61b65d8f-3f9f-4432-b773-5988be75b0ea.png" /></a>

## 🏗 Development

star-history is built with a modern tech stack: Vue + Vite + TailwindCSS.

### Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [Yarn](https://yarnpkg.com/)

### Install dependencies

```shell
yarn
```

### Start with your interest

- **Main website** is the homepage of star-history with most of useful features and blogs about open source.

  ```shell
  yarn dev
  ```

  The website will be served at http://localhost:3000.

- **Chrome extension** supports the basic chart viewer as a free additional product.

  ```shell
  yarn build:ext
  ```

  Load the built `./dist` folder as unpacked project to chrome extensions page.

- **API server** is an experimental feature. It's mainly used to generate chart SVG image file that can be embeded into GitHub readme.

  ```shell
  cd server
  yarn && yarn dev
  ```

  The API server will be running on http://localhost:8080.

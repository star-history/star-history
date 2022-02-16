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

<a href="https://star-history.com"><img width="800px" src="https://user-images.githubusercontent.com/24653555/154277513-62771f05-f408-486c-88fc-bb104e4b1261.gif" />
</a>

### [🧩 Also available as free chrome extension](https://chrome.google.com/webstore/detail/star-history/iijibbcdddbhokfepbblglfgdglnccfn)

<a href="https://chrome.google.com/webstore/detail/star-history/iijibbcdddbhokfepbblglfgdglnccfn"><img width="800px" src="https://user-images.githubusercontent.com/24653555/154291891-fb297858-c93a-4c56-bc00-a1620304b8ca.png" /></a>

## 💪 Contributions are welcome

Many of the above features come from the users engaging with us by issues and PRs. If you

### Prerequisites

- Node.js
- Yarn

### Steps

1. Initial dependencies:

   ```shell
   yarn
   ```

2. Start main website develop:

   ```shell
   yarn dev
   ```

   The frontend will be served at http://localhost:3000.

3. Start extension develop:

   ```shell
   yarn build:ext
   ```

   Then unpack the `./dist` folder to chrome extension page;

4. Start SVG server develop:

   ```shell
   cd server
   yarn && yarn dev
   ```

   The API server will be served at http://localhost:8080.

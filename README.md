🧩 [Also available as chrome extension](https://chrome.google.com/webstore/detail/iijibbcdddbhokfepbblglfgdglnccfn)

# Star History

[https://star-history.com](https://star-history.com) the missing GitHub star history graph of GitHub repos.

[![Star History Chart](https://api.star-history.com/svg?repos=bytebase/star-history&type=Date)](https://star-history.com/#bytebase/star-history&Date)

**Sponsor**

<a href="https://bytebase.com/"> <img height="80px" src="https://i.v2ex.co/3VSATzOl.png" /> </a>

[Bytebase.com](https://bytebase.com) is an open source, web-based database schema change and version control tool for teams.

## [As a website](https://star-history.com)

**Support comparing multiple repos**

<img width="800px" src="https://user-images.githubusercontent.com/24653555/154239111-37d8abf4-86bc-475d-8eef-ba4360af6844.gif" />

## [As an extension](https://chrome.google.com/webstore/detail/star-history/iijibbcdddbhokfepbblglfgdglnccfn)

<img width="800px" src="https://user-images.githubusercontent.com/24653555/154238843-b17a22c8-8adf-4a2e-9c9a-f4d45206c1f9.gif" />

## Access Token

[star-history.com](https://star-history.com) uses GitHub API to retrieve repository metadata. When user exceed the rate [limit of unauthenticated requests](https://developer.github.com/v3/#rate-limiting). Star history will need your personal access token to unlimit it.

If you don't already have one, [create one](https://github.com/settings/tokens/new), and add to star-history (no scope to your personal data is needed)

## Develop

### Website

```bash
npm run startWebsite
```

### Extension

```bash
npm run buildExtension
# load the extension folder as unpacked extension into chrome to view it
```

## Build and Deploy

### Website

```bash
# deploy to star-history.com
npm run deployWebsite
```

### Extension

```bash
npm run buildExtension
# zip extension folder and publish to chrome web store
```

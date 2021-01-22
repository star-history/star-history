> [star-history chrome extension](https://chrome.google.com/webstore/detail/iijibbcdddbhokfepbblglfgdglnccfn)

# Star History

The missing star history graph of GitHub repos

## [As a website](https://star-history.t9t.io)

![](https://raw.githubusercontent.com/timqian/images/master/star-history.gif)

## [As an extension](https://chrome.google.com/webstore/detail/star-history/iijibbcdddbhokfepbblglfgdglnccfn)

![](https://raw.githubusercontent.com/timqian/images/master/star-history-extension.gif)

> Note: You can [load the `./extension` folder to chrome](https://superuser.com/a/247654) to install the extension too.

## Access Token

Star-history use GitHub API to retrieve repository metadata. When user exceed the rate [limit of unauthenticated requests](https://developer.github.com/v3/#rate-limiting). Star-history will need your personal access token to unlimit it.

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
# deploy to star-history.t9t.io
npm run deployWebsite
```

### Extension

```bash
npm run buildExtension
# zip extension folder and publish to chrome web store
```

## Updates

- 2019-8-28: use [chart.xkcd](https://github.com/timqian/chart.xkcd) to plot the graph

- 2019-3-06: Add personal access token; update style; mono repo

- 2016-6-30: Alert to notie

- 2016-6-28: Add clear btn

- 2016-6-28: Better view for "many star" repos (use current star number as the last point on the graph)

- 2016-6-26: **Store repo info into url hash**

- 2016-6-26: **multiple kinds of input styles (eg: github.com/timqian/star-history, ...)**

- 2016-6-26: Better view for less star repos #28

- 2016-6-14: **Toggle search by hit enter** #26, prevent crash while searching for not existing repo

- 2016-5-26: Update mobile view

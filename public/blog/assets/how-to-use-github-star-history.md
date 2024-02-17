When choosing a tool (especially an open-source one) to use, what's your thought process? What are the factors that matter to you?

-   Any other users out there?
-   Is it the most popular in this category?
-   Is this technology in decline?

Here's one obvious metric I'm sure you will also investigate: its GitHub stars.

We know, you can't fully trust a project's GitHub stars alone. It is, however, a good way to determine if a tool is an adequate one and if it's likely to grow, if you use it correctly.

![book](/blog/assets/how-to-use-github-star-history/book.webp)

Even if a project has hundreds of millions of stars now, doesn't mean that it's still gaining popularity or maintained. Or if the project had an explosive breakout in the past? There's no way of knowing these simply from gazing at the stars count. Here's when Star History comes in handy: it shows how the number of GitHub stars of a project is increasing over the years. And - it's free and [open-source](https://github.com/star-history/star-history).

## User Manual

![user-manual](/blog/assets/how-to-use-github-star-history/user-manual.webp)

It's just a simple search box, how hard could it be? Simplicity is indeed Star History's No 1 design principal. On the other hand, it also provides some handy features for power users. Below we will show you:

-   How to add a repo using 3 different formats.
-   How to add multiple repos.
-   How to align the timeline to compare multiple repos.
-   How to temporality show/hide a repo in the chart.
-   How to add your GitHub personal access token to remove GitHub API limits.
-   How to embed a live star history chart inside your GitHub project [README.md](http://README.md).
-   And don't forget we also have a [chrome extension](https://chrome.google.com/webstore/detail/star-history/iijibbcdddbhokfepbblglfgdglnccfn).

### How to add a repo using 3 different formats

![search-bar](/blog/assets/how-to-use-github-star-history/search-bar.webp)

To add a repo, you can:

1. Paste its whole URL in the search bar. e.g. `https://github.com/star-history/star-history`
2. If you are feeling lazy, skip the [https://github.com/](https://github.com/) part. e.g `star-history/star-history`
3. When the repo name matches the organization's, writing once is enough, e.g. `star-history`. However, for something like `hashicorp/terraform` , you can't do `hashicorp` nor `terraform`, cuz they don't match and you need to specify `hashicorp/terraform`.

### How to add multiple repos

After adding one repo, you can continue adding more by just typing the next repo in the input box. They will be rendered in the same chart.

![multiple-repos](/blog/assets/how-to-use-github-star-history/multiple-repos.webp)

For example, if you were wondering about which database change management tool to use, here we have the history of their growth.
Both [Flyway](https://flywaydb.org) and [Liquibase](https://liquibase.com) started way back and are gaining popularity over the years, but in reccent years, [Bytebase](https://bytebase.com) is picking up rapidly and has already bypassed Liquibase.
You can not naively choose the project based on mere stars, while stars and its trajectory give you a hint about those projects worth looking at.

### How to align the timeline to compare multiple repos

By checking **Align timeline**, the chart will be rerendered.

![align-timeline](/blog/assets/how-to-use-github-star-history/align-timeline.webp)

### How to temporality show/hide a repo in the chart

Instead of removing a repo from the chart, you can switch visibility of it by clicking the name in its label box.

![hide-show](/blog/assets/how-to-use-github-star-history/hide-show.webp)

### How to add your GitHub personal access token to remove GitHub API limits

Star History is free to use, but it uses GitHub API to retrieve repository metadata, which means you need to add your personal access token from GitHub to start using Star History. Rest assured, no personal data is needed in this process.
![home-add-access-token](/blog/assets/how-to-use-github-star-history/add-access-token.webp)

1. Login to your GitHub account, go to Personal Access Tokens: [https://github.com/settings/tokens](https://github.com/settings/tokens).
2. Click **Generate new token**.
   ![generate-new-token](/blog/assets/how-to-use-github-star-history/generate-new-token.webp)

3. Click **Generate new** **token** **(classic)**.
   ![new-token-classic](/blog/assets/how-to-use-github-star-history/new-token-classic.webp)

4. Fill in the form on the token details page,

-   Note: give it a name for identification.
-   Expiration: how long should it be valid for?
-   Select scopes: access boundary for this token, for Star History, **repo** access will do.

When you are done, click **Generate token** at the bottom of the page.

![classic-form](/blog/assets/how-to-use-github-star-history/classic-form.webp)

5. MAKE SURE to copy your personal access token NOW. You WON’T be able to see it again!

![personal-token-copy](/blog/assets/how-to-use-github-star-history/personal-token-copy.webp)

6. Go back to [star-history.com](/), and click **Edit Access Token**. Paste the token. (It's also where you edit in the future, when it expires and you'll need to generate a new one.) Hit **Save**, et voilà, the star history of all GitHub repos are at your fingertips. Simple as that.

![edit-gh-access-token](/blog/assets/how-to-use-github-star-history/edit-gh-access-token.webp)

### How to embed a live star history chart inside your GitHub project [README.md](http://README.md)

1. Click **Embed** below the chart.

![embed](/blog/assets/how-to-use-github-star-history/embed.webp)

2. You need to add your personal access token first. Copy the iframe snippet and paste it into your [README.md](http://README.md)

![copy-iframe-readme](/blog/assets/how-to-use-github-star-history/copy-iframe-readme.webp)

![gh-readme](/blog/assets/how-to-use-github-star-history/gh-readme.webp)

### Chrome extension

1. Visit [extension page](https://chrome.google.com/webstore/detail/star-history/iijibbcdddbhokfepbblglfgdglnccfn)
   ![home-chrome-extension](/blog/assets/how-to-use-github-star-history/home-chrome-extension.webp)

2. Go to any GitHub repo and click the extension. There will be a hovering
   ![chrome-extension-working](/blog/assets/how-to-use-github-star-history/chrome-extension-working.webp)

---

Play around and let us know [@StarHistoryHQ](https://twitter.com/StarHistoryHQ) what you think!

Special thanks to [https://kajiblo.com/git-hub-star-history/](https://kajiblo.com/git-hub-star-history/) for inspiring this post.

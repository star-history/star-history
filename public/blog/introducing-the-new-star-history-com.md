# Introducing the new star-history.com

After a month of hard work, we are happy to introduce you to the new [star-history.com](http://star-history.com/). It has been rebuilt using a modern tech stack while keeping the original sketching / xkcd feel. Besides, we have added several highly requested features.

## ⭐️ What is star-history

> The missing GitHub star history graph.

If you ever see a GitHub star chart before, it's likely from [star-history.com](https://star-history.com).
![star-history-image](/blog/assets/star-history-image.png)
[The star-history project](https://github.com/bytebase/star-history)started around 2016 as an open source project on GitHub, it has gained momentum over the years and accumulated over 2.5K GitHub stars. Today, it ranks No.1 on various GitHub Star related search keywords.
![star-history-google-result](/blog/assets/star-history-google-result.png)
star-history also has a [chrome extension](https://chrome.google.com/webstore/detail/star-history/iijibbcdddbhokfepbblglfgdglnccfn).
![star-history-chrome-extension](/blog/assets/star-history-chrome-extension.png)

## 🧵 The rewrite no one noticed

As [star-history](https://star-history.com) gains popularity, we have accumulated a decent backlog of good ideas suggested by our users. Recently, we finally got the resource to give an overhaul. The original app was written in plain javascript. To ease future development, we decide to choose a modern tech stack. Meanwhile, we want to keep its simplicity and the original sketching / xkcd feel. Because we believe that's the most important ingredient making it the top among 10+ other similar websites. So the first thing we do is to rewrite the entire app using a modern tech stack: Vue.js + Vite + TailwindCSS while keeping the UI look the same. Only after that, we begin to add those long-awaited features.

## 🚀 The enhancements

### Generate quality chart image

Previously, users could only screenshot the website to get the chart image. So we develop the chart image generator. Now with a single click, star-history generates a high resolution image. Below is an example of our own star-history project:
![star-history-image](/blog/assets/star-history-image.png)

### Support timeline view mode

This one also comes from our user's ask - “It would be nice to be able to compare projects in the sense how the number of stars have grown since it got launched.”

It's quite common that there are multiple open source projects targeting similar segments. And very often, these projects start at different times. To implement this, we rewrite the underlying chart library to give the power of comparing repos in the same timeline. Below lists the comparison among [Vue, React, Angular, Svelte w/o timeline view](https://star-history.com/#vuejs/vue&facebook/react&angular/angular&sveltejs/svelte&Timeline):
![star-history-date-mode](/blog/assets/star-history-date-mode.png)![star-history-timeline-mode](/blog/assets/star-history-timeline-mode.png)

### Embed chart into other websites

What's better than a high resolution, nice looking GitHub star history image for your repository? A live chart! Now with a single copy and paste, users can embed their observed repositories into another webpage.

**Cautions:** since it's quite easy to cross the GitHub rate limit when generating the star history, we require user to supply an access Token. We only suggest user to put it inside the trusted network and do NOT give any scope permission, otherwise it will leak that user's personal data on GitHub.
![embed-chart-with-iframe](/blog/assets/embed-chart-with-iframe.png)

### Toggle repo visibility

When comparing multiple repos, we now allow user to temporarily show/hide a particular one.
![star-history-repo-selector](/blog/assets/star-history-repo-selector.png)

### Support multiple repos (not new feature)

star-history supports charting multiple repos in the very beginning. After adding the first repo, the user just needs to input another repo and click "View star history" button to add the next one. But we realize many star-history users didn't know this feature. Thus, we add a couple visual cues to hint user. "Toggle repo visibility" above is one of them, and we would also change the placeholder to "... add the next repository" when there is already a repo.
![star-history-inputer](/blog/assets/star-history-inputer.png)

### Shortcut to input repo

GitHub repo is identified by {{organization}}/{{repository}}. For some repos, organization and repository names are the same. So if user only inputs a string without the / separator, we will try to find the repo having the same organization and repository name. e.g. If user just inputs bytebase, it will find the [bytebase/bytebase](https://github.com/bytebase/bytebase) project.

### Wrap up

As you can see, the above listed things are not big changes, that's why we call them enhancements. We think the original star-history version is quite solid. Unlike other similar websites offering bells and whistles, star-history only provides a single feature to chart the star history for the GitHub repos. But we try to do this one thing exceptionally well.

## ✨ Blogging about open source

> The world is full of "source code"—blueprints, recipes, rules—that guide and shape the way we think and act in it. We believe this underlying code (whatever its form) should be open, accessible, and shared—so many people can have a hand in altering it for the better.

As this article presents, star-history also obtains a new blog section. star-history has been an open source project since birth, it's also built upon many other open source projects. And many of the above enhancements come from the users engaging with us on our GitHub project. It's an honor that this project fulfills a small need in the overall open source and GitHub ecosystem. Down the road, we plan to publish more content around open source on this blog.

## 👋 Last

It has been quite a long time since star-history project started, and thanks for picking us to present your beloved open source project to your audience. As an open source project ourselves, we will keep contributing to the open source world with `code` and ❤️.

BTW, we also operate a twitter account [@StarHistoryHQ](https://twitter.com/StarHistoryHQ). It tweets interesting GitHub projects every day. These projects are hand picked by our staff. Follow us to receive those updates.

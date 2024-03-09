# Star History Monthly | Open-source GitHub Copilot alternatives

One of the places where AI has made a major breakthrough is in helping with coding. Who doesn't like a productivity boost? For software development at least, generative AI is definitely the new standard.

Here, we gathered a few open-source AI coding assistants to boost your productivity, but with privacy and safety in mind.

## Cody

![cody](/blog/assets/coding-ai/cody.webp)

[Cody](https://github.com/sourcegraph/cody) is an AI coding assistant open-sourced by Sourcegraph, available as a VS Code or JetBrains extension. It can write, understand and fix your code. Cody is powered by Sourcegraph’s code graph, and has knowledge of your entire codebase.

Aside from AI-powered code completion, writing unit tests, generating doc comments, summarizing code, the usual stuff you'd expect from an AI coding assis, it also has a chat interface meaning you can also chat with Cody or ask it to do something.

![how-cody-works](/blog/assets/coding-ai/how-cody-works.webp)

## Cursor

![cursor](/blog/assets/coding-ai/cursor.webp)

[Cursor](https://github.com/getcursor/cursor) is an AI-powered IDE built with LLMs, taking AI pair programming to the next level. It is also keeping me from naming this edition "Top VS Code AI-Coding Extensions"!

Cursor wants to fix the problem that comes after autocompletion: fixing the bug and bringing out a new feature.

The advantage Cursor has over VS Code is that, since they have way less users than VS Code (which is the preferred IDE of 73% of the respondents), as per Stack Overflow Developer Survey 2023, they get to iterate way faster and try out new stuff. After all, if the year 2023 has taught us anything, it's that you have to be fast and accepting of new things to keep up with the industry.

Plus, they are already standing on top of the giant: Cursor is actually a fork of VS Code, and in fact, I tried it out and it does look and feel a lot like VS Code, but with an AI-native twist.

![cursor-ui](/blog/assets/coding-ai/cursor-ui.webp)

It was [open-sourced](https://twitter.com/amanrsanger/status/1640220737851236353) in March this year and announced an [$8M funding](https://techcrunch.com/2023/10/11/anysphere-raises-8m-from-openai-to-build-an-ai-powered-ide/) led by the almighty OpenAI earlier this month.

## Tabby

![tabby](/blog/assets/coding-ai/tabby.webp)

[Tabby](https://github.com/TabbyML/tabby) is a self-hosted AI Coding Assistant. You can think of it as an open-source challenger to GitHub Copilot.

![tabby-llama](/blog/assets/coding-ai/tabby-llama.webp)

Tabby is good at assisting LLM in comprehending the entire codebase by helping it understand the complex code with dependencies. In English, Tabby generates new code that makes use of existing abstractions, and can accomplish this within a reasonable context window and quick response time. For example, check out [this example](https://github.com/TabbyML/tabby/blob/64908dad2f5e1fbaf8b9a032162a92dc5fc3ce97/website/blog/2023-10-16-repository-context-for-code-completion/index.md) of Tabby completing code for a repo.

On another note, it's been a big month for Tabby - they celebrated reaching 11k stargazers, and [scored a $3.2M funding round](https://techcrunch.com/2023/10/10/tabbyml-github-copilot-alternative-raises-3-2-million/).

## Continue

![continue](/blog/assets/coding-ai/continue.webp)

[Continue](https://github.com/continuedev/continue) is an IDE extension that brings the power of ChatGPT to VS Code and JetBrains.

Continue can explain code, allow you to edit in natural language, avoid laborious edits, making it no longer necessary to copy and paste from your LLM Interface. What's more, Continue works with any LLM, including local models hosted on your own cloud infrastructure, so that you get to remain 100% private.

Basically, if you use Copilot or ChatGPT, it's GitHub and OpenAI collecting and learning from the data. With Continue, you can collect data on how you build software - when your team commits code, it can be used to [improve the LLM](https://medium.com/@continuedev/its-time-to-collect-data-on-how-you-build-software-197d12a020d5) used by your team.

![continue-workflow](/blog/assets/coding-ai/continue-workflow.webp)

## Sweep

![sweep](/blog/assets/coding-ai/sweep.webp)

[Sweep](https://github.com/sweepai/sweep) is an AI-powered junior dev that transforms bugs & small features into code changes as a PR. Sweep cleans up after you... 🧹Get it?

![sweep-nightly](/blog/assets/coding-ai/sweep-nightly.webp)

Sweep is available as a GitHub App to integrate into your repos, and that's really smart because if a standalone tool that generates a PR for your repo, you will want to test it, ultimately defeating the whole purpose of the tool. But thanks to the extensive GitHub ecosystem, Sweep makes perfect sense as a handy add-on to your repos, saving you a lot of tedious work.

## Lastly

What do you think? Are you using any AI coding assistants at all? What's the key differentiator for you? Let us know!

---

## Star History Monthly Previous Editions

-   [CLI Tools for Working with LLMs](/blog/cli-tool-for-llm)
-   [Llama 2 and Ecosystem](/blog/llama2)
-   [ChatGPT Special](/blog/star-history-monthly-pick-202303)

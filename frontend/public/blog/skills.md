---
title: "Star History Monthly March 2026 | Skills"
author: "Adela"
featured: true
featureImage: "/assets/blog/skills/banner.webp"
publishedDate: "2026-03-31T12:00:00.000Z"
description: "A look at the projects defining what 'skills' mean for AI coding agents — from YC's CEO shipping 20K lines a day, to a Gumroad founder who'd rather you didn't write code at all."
---

Last month we covered [the OpenClaw ecosystem](/blog/clawflare). This month the spotlight shifts to **skills** — reusable instruction packs that turn a general-purpose agent into something opinionated.

A coding agent out of the box is a brilliant new hire on day one. It can do anything, but it doesn't know how you do things. Skills are the onboarding docs, except they're executable.

We picked seven projects. Two pairs of head-to-head competitors, and a trio of frontend-focused tools united by the conviction that AI-generated UIs shouldn't all look the same.

## Ship Code vs. Think First

Both target founders. They disagree on what a founder's bottleneck actually is.

### gstack

🔗 [https://github.com/garrytan/gstack](https://github.com/garrytan/gstack)

[![Star History Chart](https://api.star-history.com/svg?repos=garrytan/gstack&type=Date)](https://star-history.com/#garrytan/gstack&Date)

Garry Tan (YC's CEO) built `gstack` to turn Claude Code into an entire engineering org. 23 slash commands, each a specialist role: `/plan-ceo-review` for product direction, `/review` for staff-level code review, `/qa` for real Playwright browser testing, `/ship` for PR creation, `/cso` for security audits. You run a structured sprint — think, plan, build, review, test, ship, reflect — and the agent handles each phase.

Think of it as a movie set. You're the producer. Each slash command is a crew member. Gstack can run 10–15 agents in parallel across isolated workspaces, like shooting on multiple sets at once. Tan claims 10,000–20,000 lines of production code per day. Works across Claude Code, Codex, Gemini CLI, Cursor, and Factory Droid. MIT-licensed, completely free.

- **Best for:** founders who want to ship fast and don't mind a thick playbook.

### slavingia/skills

🔗 [https://github.com/slavingia/skills](https://github.com/slavingia/skills)

[![Star History Chart](https://api.star-history.com/svg?repos=slavingia/skills&type=Date)](https://star-history.com/#slavingia/skills&Date)

Sahil Lavingia (Gumroad CEO) took the opposite approach. 10 commands, none of them write code. Based on his book The Minimalist Entrepreneur, they walk you through building a business: `/find-community`, `/validate-idea`, `/mvp`, `/pricing`, `/marketing-plan`, `/grow-sustainably`.

The most interesting one is `/processize` — it tells you to deliver your product's value by hand before automating anything. Where gstack asks "how do I ship more code?", this asks "should I be writing this code at all?"

- **Best for:** first-time founders. Especially the ones who just spent three months building something nobody asked for.

## Task-Level vs. Scenario-Level

The second pair competes over how agents should organize development work. Same goal, different unit of work.

### superpowers

🔗 [https://github.com/obra/superpowers](https://github.com/obra/superpowers)

[![Star History Chart](https://api.star-history.com/svg?repos=obra/superpowers&type=Date)](https://star-history.com/#obra/superpowers&Date)

Jesse Vincent's `superpowers` is the most opinionated project here. Its skills fire automatically based on context — no manual invocation. Write code without a test? Superpowers deletes it and tells you to write the test first. It enforces strict TDD, dispatches subagents per task with two-stage code review, and runs everything in git worktrees.

If gstack is a movie set where you call each crew member by name, superpowers is a restaurant kitchen with a strict brigade system. You don't manage the brigade — you just order. It even has a meta-skill called `writing-skills` that teaches the agent to create new skills. Skills that write skills.

- **Best for:** teams who want their agent to enforce engineering discipline, not just follow orders.

### starmap

🔗 [https://github.com/rebelice/starmap](https://github.com/rebelice/starmap)

[![Star History Chart](https://api.star-history.com/svg?repos=rebelice/starmap&type=Date)](https://star-history.com/#rebelice/starmap&Date)

`starmap` exists because some problems have 500 scenarios, not 5. Think database migration compatibility matrices, cross-platform test suites, API coverage checklists.

`/starmap init` decomposes a goal into a `SCENARIOS-<project>.md` file — sometimes hundreds of checkboxes. It analyzes file-level dependencies to figure out which scenarios can run in parallel, spins up git worktrees, and guarantees that once a scenario passes, it stays passed.

The creators are explicit: "Superpowers handles individual tasks well... Starmap picks up where that leaves off: when the problem is too large for a single plan."

- **Best for:** large migrations, compatibility matrices, and any project where you'd otherwise maintain a Google Sheet with 200 rows and a prayer.

## The Frontend Trio

Three projects, one shared gripe: AI-generated frontends all look the same.

### Claude Code Frontend Design Skill

🔗 [https://github.com/anthropics/claude-code](https://github.com/anthropics/claude-code) (plugins/frontend-design)

Anthropic's first-party skill is a direct shot at "AI slop" — the generic, gradient-heavy interfaces every AI tool produces by default. It activates automatically when Claude detects frontend work and steers it toward bolder choices: distinctive typography, unexpected color palettes, higher-impact animations. A dashboard gets different treatment than a landing page.

It's a single skill, not a suite. But the real significance is strategic: Anthropic shipping a first-party skill signals that skills are a core part of Claude Code's future.

- **Best for:** solo developers shipping frontends who want something that looks like a human designed it.

### frontend-slides

🔗 [https://github.com/zarazhangrui/frontend-slides](https://github.com/zarazhangrui/frontend-slides)

[![Star History Chart](https://api.star-history.com/svg?repos=zarazhangrui/frontend-slides&type=Date)](https://star-history.com/#zarazhangrui/frontend-slides&Date)

A Claude Code skill for making animation-rich HTML presentations — zero dependencies, single file output. Start from scratch or feed it a PowerPoint.

The best part is style discovery. Instead of describing what you want in words, you get visual previews of 12 presets — Bold Signal, Neon Cyber, Terminal Green, Swiss Modern, Paper & Ink — and just pick one. Seeing beats describing every time. Deploys to Vercel with one command or exports to PDF via Playwright.

- **Best for:** developers who give conference talks and would rather write zero CSS to make slides look good.

### remotion

🔗 [https://github.com/remotion-dev/remotion](https://github.com/remotion-dev/remotion)

[![Star History Chart](https://api.star-history.com/svg?repos=remotion-dev/remotion&type=Date)](https://star-history.com/#remotion-dev/remotion&Date)

Remotion lets you make videos using React. Write components, use CSS and Canvas and WebGL, and it renders them to MP4. Fireship's "This video was made with code" and GitHub's "GitHub Unwrapped" were both built with it.

Why include it in a skills roundup? Because it's the missing piece. Agents can already generate landing pages and slide decks. Remotion is the infrastructure that lets them generate video. Agent writes React → Remotion renders it → you have a product demo that didn't exist 30 seconds ago. That workflow barely existed a year ago.

- **Best for:** developers who want to automate video production, especially if they're already generating React frontends.

## Closing Thoughts

Gstack and slavingia/skills both serve founders but disagree on whether the bottleneck is shipping code or knowing what to build. Superpowers and starmap both automate dev workflows but disagree on whether you organize by task or by scenario. These aren't just tool choices — they're bets on where human judgment matters most.

The question used to be "can AI write code?" Now it's "whose playbook should the AI follow?" Increasingly, the answer is: yours — packaged as a skill.

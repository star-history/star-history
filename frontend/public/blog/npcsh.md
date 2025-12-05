---
title: "Starlet #30 NPC Shell: Intelligent Bash Environment with AI Agents"
author: "NPC Worldwide"
featured: true
featureImage: "/assets/blog/npcsh/banner.webp"
publishedDate: "2025-10-28T12:00:00.000Z"
description: "NPC Shell extends the traditional bash environment with intelligent AI capabilities, providing seamless access to various LLM providers and specialized agents through a unified command-line interface."
---

*This is the 30th issue of The Starlet List. If you want to prompt your open source project on star-history.com for free, please check out our [announcement](/blog/list-your-open-source-project).*

---

[NPC Shell](https://github.com/npc-worldwide/npcsh) transforms your terminal into an intelligent workspace that extends the traditional bash environment with AI capabilities. Inspired by biological intelligence, it provides a unified command-line interface for seamless interaction with multiple LLM providers and specialized agents -- enabling multi-modal collaboration, code execution, and automation of complex tasks.

<img src="/assets/blog/npcsh/npcsh_sibiji.webp" alt="npcsh" width="200">

---

## Core Agent Tools

### npcsh - ReAct-style Agentic Shell

**npcsh** provides a ReAct-style agentic shell with tool capabilities through Jinxs. It processes natural language commands and routes to appropriate tools and NPCs using reasoning and action loops.

### corca - MCP Development Agent

<img src="/assets/blog/npcsh/corca.webp" alt="corca" width="300">

**corca** is an MCP tool-calling agent specialized for software development workflows. It uses Model Context Protocol for extended capabilities and code analysis.

### guac - Interactive Coding Agent

<img src="/assets/blog/npcsh/guac.webp" alt="guac" width="300">

**guac** is a coding agent that directly executes code in an active Python session. You can inspect outputs and it builds on code you input, creating an interactive development environment.

## Key Features

**Multi-Provider Support** - OpenAI, Anthropic, Gemini, Deepseek, Ollama, LMStudio, vLLM, MLX integration through LiteLLM.

**Data Management** - Database support for PostgreSQL, SQLite, and other databases for command history and conversations. Knowledge graph for structured information stored within the same database with knowledge derived with context (path, npc, team, etc) in mind, ChromaDB for vector embeddings and RAG, persistent state between sessions.

**Extensible Framework** - Jinxs are Jinja execution templates that provide function-like capabilities, allowing users to build reusable tools that reference each other. NPC files (.npc) for agent definitions, Context files (.ctx) for team preferences to make context management easier, Assembly lines for workflow pipelines.

**SQL Models with NPC Integration** - Create SQL models that call NPCs directly within queries using `nql.` functions. Execute complex data processing workflows where NPCs analyze, summarize, or transform data as part of SQL operations. Support coming soon for PostgreSQL, SQLite, Snowflake, Databricks, and other databases.

## Powerful Command Macros

npcsh comes with an extensive set of command macros:

- `/alicanto` - Deep research with multiple perspectives, identifying gold insights and cliff warnings
- `/corca` - Enter MCP-powered agentic shell for development
- `/guac` - Enter interactive coding shell with pomodoro workflow
- `/plonk` - Computer use and GUI automation with vision models
- `/vixynt` - Image generation and editing
- `/wander` - Temperature-based problem solving for thinking outside the box
- `/yap` - Voice chat mode with speech-to-text and text-to-speech
- `/rag` - Semantic search with ChromaDB embeddings and command history
- `/ots` - Take screenshot and analyze with vision models
- And many more for search, configuration, knowledge graphs, and workflow automation

<img src="/assets/blog/npcsh/yap.webp" alt="yap" width="300">

## Learn More

npcsh is MIT-licensed and actively maintained. Here are some links to get started:

- [Documentation](https://npc-shell.readthedocs.io/)
- [GitHub Repository](https://github.com/npc-worldwide/npcsh)
- [NPC Studio GUI](https://github.com/npc-worldwide/npc-studio) 
- [Community Newsletter](https://forms.gle/n1NzQmwjsV4xv1B2A)
- [Support the Project](https://buymeacoffee.com/npcworldwide)
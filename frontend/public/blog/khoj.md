*This is the twenty-first issue of The Starlet List. If you want to prompt your open source project on star-history.com for free, please check out our [announcement](/blog/list-your-open-source-project).*

---

## TL;DR

**[Khoj](https://khoj.dev)** is your open-source, personal AI companion for instant answers. Dive into knowledge effortlessly as Khoj simplifies complex info, integrates your personal context, and tailors responses to your unique needs.

![Screenshot of Khoj](/assets/blog/khoj/simple_usecase.webp)

## What is Khoj?

There's a huge opportunity to improve the way people work, think and engage now with AI. Now that we can scale friendly, usable interfaces, we can increase the overall capability of each of us individually.

With [Khoj](https://khoj.dev), we're reducing how much time people spend on research, looking through their documents, and repetitive information look-ups. Simplifying the way we interact with knowledge helps boost our capability, productivity, and well-being in one go. While we're deeply excited about all the ways this can help change things for the better, we're also cautiously aware that there's inherently risk in how unexplainable, novel technology reaches new people.

To that end, Khoj is a thinking tool that helps you reason, aggregate information, and create content in a transparent way.

### Core Capabilities

- **Retrieval Augmented Generation**: RAG with your personal notes and documents. You can manually share your PDFs and plaintext files, or hook it up to Obsidian to directly talk to your knowledge base.
- **AI Search Engine**: Khoj is connected to the internet, which means that you can build on top of and retrieve information straight from online sources. Summarize articles, blog posts, or just get realtime information. 
- **Automations**: Create smart, contextual notifications using our [automations service](https://app.khoj.dev/automations). Use it for writing prompts, news summaries, mindful moments, weekly summaries of trending songs. The limit is your imagination. 
- **Personalized Artwork**: [Create rich, personalized images](https://blog.khoj.dev/posts/how-khoj-generates-images/). Our image generation infrastructures helps ensure that you're creating beautiful, personalized images whenever you tell Khoj to create a picture for you.

You can see some of these capabilities highlighted here:
https://app.khoj.dev/share/chat/what-s-the-latest-tech-news-in-brazil-/

## Open-Source

On a personal basis, we're strong believers that products should be transparent, accessible, and self-hostable. Though Khoj is designed as a production-ready, multi-user personal AI application, it can also be self-hosted and run for a single user on a home server or laptop.

As AI becomes a mainstay in people's lives, it's important that ownership is retained in the hands of the people using our services. We definitely need an open-source alternative to ChatGPT, which is what Khoj is.

We've also made it easy for self-hosted users to integrate with open-source, local LLMs so that anyone can work completely offline. You can either hook the application up to [Ollama](http://ollama.ai/) or use any [gguf model off of HuggingFace](https://huggingface.co/models?library=gguf).

[Check out our GitHub](https://github.com/khoj-ai/khoj).

## Architecture

### Lifecycle of a chat message

When a query lands on the Khoj server, it goes through a series of subprocesses in order to deliver you an appropriate response. This can take a minute, which is why we've integrated a web socket into our web UI to provide realtime updates in Khoj's thought process.

![lifecycle of an image](/assets/blog/khoj/lifecycle_chat_message.webp)

### How we find the correct context

When you have data indexed with Khoj, we dynamically determine what information is most relevant to each of your queries. We use a sophisticated RAG pipeline to optimize the quality of matches returned to the LLM.

![finding the right context](/assets/blog/khoj/context_injection_pipeline.webp)

### How you can upload files

There's a number of ways to upload files from our different clients. The easiest way to do it is just to drag/drop your file into the chat window. Otherwise, you can use any of the below clients to get started. See [the docs](https://docs.khoj.dev/category/clients) for more details.

![upload files](/assets/blog/khoj/indexing_data.webp)

### How we help with recurring tasks

There's some information out there we're repeatedly looking up. Rather than Googling and investigating yourself, you can put Khoj on the job to help you with smart aggregation of information and reminders. You can go to our [automations page](https://app.khoj.dev/automations) to try it yourself.

![automations](/assets/blog/khoj/automations_process.webp)

## Our team

[Debanjum](https://www.linkedin.com/in/debanjum/) and [Saba](https://www.linkedin.com/in/sabaimran/) met at Microsoft while building products for Cortana AI. Within a massive organization, we'd managed to find a team that was building user-facing AI products for enterprise customers, and it was loads of fun. It was exciting watching it grow from 0 to 10s of millions of users over the course of a year. It quickly became apparent how useful personal AI productivity tools could be for everyone, not just enterprise users.

That was five years ago. Technology has advanced leaps and bounds since then, inspiring many more imaginations. Last summer, we got backed by [YCombinator](https://ycombinator.com)  to work on Khoj full time. We're really excited to be part of the process of making open, personal AI available for everyone. 

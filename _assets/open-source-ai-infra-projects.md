# Open Source AI Infra for Your Next Project

We have seen more mind-blowing AI-related tools in the past few months than ever before. And we noticed a rise to developer-friendly tools to build your own AI application, it's now easier than ever for developers to quickly build cool apps.

Here, we collected some open-source infra projects that can be directly used for your next project. 💡

## Chroma

Despite having only been in the industry for half a year, [Chroma](https://github.com/chroma-core/chroma) announced its $18 million seed round this April. It is a vector embedding storage. Embeddings represent different types of data, the AI-native way, making it an ideal choice for AI-driven tools and algorithms.

Although there are plenty vector database solutions out there, the Chroma team believes that none of them are friendly enough for dev environments. Chroma comes with everything you need to build an AI application in terms of embedding storage. Simply pip install chromadb, no additional configuration or installation needed.

![chroma](/blog/assets/open-source-ai-infra-projects/chroma.webp)

They also have a dazzling list of investors. ✨

![chroma-investors](/blog/assets/open-source-ai-infra-projects/chroma-investors.webp)

## LangChain 🦜🔗

[LangChain](https://github.com/hwchase17/langchain) was first released in October 2022. It is a framework that makes developing AI applications more flexible. Although LLMs can perform many cool tasks, they can't provide specific answers to problems requiring deep domain knowledge. LangChain can be seen as a tool that allows developers to chain different prompts together ⛓️. Chains can consist of multiple modules and components, such as:

-   Large language models (LLMs): such as GPT-3, BLOOM, etc.
-   Agents: what actions are to be taken?
-   Memory: short- or long-term memory.

🔗 You can link a series of commands together so that the AI model knows what it needs to do, generate what sort of answer, and perform which task.

![langchain-chroma](/blog/assets/open-source-ai-infra-projects/langchain-chroma.webp)

For example, Chroma and LangChain can seamlessly run together: you can use LangChain to build LLM applications powered by Chroma.

## GPTCache

[GPTCache](https://github.com/zilliztech/GPTCache) is a semantic caching layer developed by Zilliz. When your AI Chatbot gets more popular and the traffic gradually increases, GPTCache can help save API calling costs and maintain response speed. In fact, Zilliz open-sourced GPTCache because their Q&A bot OSSChat encountered performance degradation and increasing service costs. 🚑

![gptcache](/blog/assets/open-source-ai-infra-projects/gptcache.webp)

Besides improved performance and saved costs, you can customize cache rules to suit your own needs to maximize efficiency. Oh, and BTW - GPTCache is also [fully integrated](https://python.langchain.com/en/latest/modules/models/llms/examples/llm_caching.html?highlight=cache#gptcache) with LangChain.

## Dify

[Dify.AI](https://github.com/langgenius/dify) is an out of the box LLMOps platform that comes with an interface for prompt engineering and operations for you to create AI applications. It has several built-in application templates (e.g. their SQL Creator template to generate SQL statements 🤗).

![dify](/blog/assets/open-source-ai-infra-projects/dify.webp)

Even if writing code is not your forte, you can create simple LLM applications and share them with your friends. Some (relatively) advance operations include integrating your own dataset, selecting LLM models, improving and adjusting your prompts.

## Stable Diffusion

[Stable Diffusion](https://github.com/CompVis/stable-diffusion) is an ML model developed by [stability.ai](http://stability.ai) (they closed a $101M funding round last October) that can generate images from text. It can run on your own machine if you have confidence in your GPU. Other well-known text-to-image ML models include DALL·E 2 and Midjourney, and each has its own strengths.

Stable Diffusion is open-source, and there are already tons of projects based upon it, such as the prompt search engine for Stable Diffusion, Figma and PS plugins, etc.

![stable-diffusion](/blog/assets/open-source-ai-infra-projects/stable-diffusion.webp)

Recently, Stability AI announced the open-source of their AI image generation platform [StableStudio](https://github.com/Stability-AI/StableStudio), which is an open-source version of DreamStudio. Key features include online generation, editing and repairing of AI-generated images. Is this an attempt to one-up Midjourney? 🤔️

## To Sum Up

After taking a glance at the star history of these projects, it's obvious that there's a common trait - they are all still babies (in terms of age). It's wild that this time last year, none of them existed. Now they are on their way to become an integral part of the next generation application stack.

![star-history-ai](/blog/assets/open-source-ai-infra-projects/star-history-ai.webp)

Wowza. The only reasonable explanation for this graph is that Stable Diffusion is way too powerful. The other projects are actually really strong players in terms of growth.

As mentioned before, the outbreak of AIGC has driven the growth of many affiliated products and ecosystems. What will be the next popular product?

P.S. - If you have used the mentioned tool, Let us know what you think [@StarHistoryHQ](https://twitter.com/StarHistoryHQ)! 🤣

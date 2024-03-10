# Star History Monthly Pick | Llama 2 and Ecosystem Edition

On July 18th, Meta [released](https://ai.meta.com/blog/llama-2/) Llama 2, the next generation of Llama. It can be freely used for research and commercial purposes, and supports private deployment.

Therefore, we have located a few open-source projects to help you quickly get started with Llama 2 on your own machine, regardless of what it is!

## Llama

![llama](/assets/blog/llama2/llama.webp)

[Llama](https://github.com/facebookresearch/llama) itself is an open-source Large Language Model (LLM), trained with publicly available data. It was [officially open-sourced](https://ai.meta.com/blog/large-language-model-llama-meta-ai/) earlier this February and five months later, a new generation was released.

Compared to the original version, Llama 2 was trained on 2 trillion tokens, have double the context length than Llama 1, and comes with three different parameter sizes: 7B, 13B, and 70B. The difference in parameters allows you to choose between a smaller and faster model or a more accurate one based on your preferences.

![llama-models](/assets/blog/llama2/llama-models.webp)

## llama.cpp

![llama-cpp](/assets/blog/llama2/llama-cpp.webp)

[llama.cpp](https://github.com/ggerganov/llama.cpp) is one of the achievements by the community mentioned in Meta's official announcement. It has rewritten Llama's inference code in C++, and through various optimizations, it has challenged our understanding: it can run large-scale LLMs quickly on ordinary hardware. For example:

-   On the Google Pixel5, it can run the 7B model at 1 token/s.
-   On the M2 Macbook Pro, it can run the 7B model at 16 tokens/s.
-   On Raspberry Pi with 4GB RAM, it can run the 7B model at 0.1 token/s.

This project is so successful that the author, Georgi Gerganov, established his side project as a startup called [ggml.ai](http://ggml.ai) (a tensor library for machine learning, powering both llama.cpp and whisper.cpp).

![ggml-ai](/assets/blog/llama2/ggml-ai.webp)

## Ollama

![ollama](/assets/blog/llama2/ollama.webp)

[Ollama](https://github.com/jmorganca/ollama) is designed to run, create, and share LLMs easily. It was originally designed for macOS, (with Windows and Linux coming soon, as per their website).

Ollama's author [previously](https://news.ycombinator.com/item?id=36802582) worked at Docker, and the rise of open-source language models inspired him that LLMs could use something similar. This led to the idea of providing pre-compiled packages with adjustable parameters.

Once you have downloaded Ollama on your Mac, you can start chatting with Llama 2 by simply running `ollama run llama2`.

![0llama-mac](/assets/blog/llama2/ollama-mac.webp)

## MLC LLM

![mlc-llm](/assets/blog/llama2/mlc-llm.webp)

[MLC LLM](https://github.com/mlc-ai/mlc-llm) aims to enable you to develop, optimize, and deploy AI models on any device. You can natively deploy any LLM on a diverse set of hardware backends and native applications (supported devices include mobile phones, tablets, computers, and web browsers) without the need for server support. You can also further optimize the model performance to suit your own use cases.

MLC Chat already launched on the Apple App Store and now supports the Llama-2-7b model. It is simple and super easy to get started with, although my iPhone got really after 3 questions 😅 (Side note: looks like Llama 2 still has a lot of room for growth tho, is any of these SQL Editors real?).

![mlc-llm-app](/assets/blog/llama2/mlc-llm-app.webp)

## LlamaGPT

![llamagpt](/assets/blog/llama2/llamagpt.webp)

[LlamaGPT](https://github.com/getumbrel/llama-gpt) has proven that the AI tide is still at its highest, as it has already gained 6.6K stars on GitHub just five days after being open-sourced.

It is a self-hosted chatbot that offers a similar experience to ChatGPT but does not transmit any data to external devices. Currently, all three models of Llama are supported, and llama.cpp is utilized in the backend (all hail open source).

Compared to the aforementioned tools, LlamaGPT is a more complete application with a UI and does not require manual configuration or optimizing parameters. This makes it the most friendly for non-technical users to get started with Llama 2.

![llamagpt-ui](/assets/blog/llama2/llamagpt-ui.webp)

## Last but not least

As an open-source, free, and commercially available LLM, Llama has brought AI closer to us. Although it may not be as advanced as other paid models, just like Meta mentioned in the press release, "We have experienced the benefits of open source, such as React and PyTorch, which are now commonly used infrastructure for the entire technology industry. We believe that openly sharing today’s large language models will support the development of helpful and safer generative AI too." With the power of the community, Llama and its ecosystem will surely continue to iterate (quickly).

But of course, there are many other ways to start using Llama 2, via Homebrew, Poe, etc. For some further reading:

-   [Run Llama 2 on your own Mac using LLM and Homebrew](https://simonwillison.net/2023/Aug/1/llama-2-mac/)
-   [Llama 2 is here - get it on Hugging Face](https://huggingface.co/blog/llama2)
-   [A comprehensive guide to running Llama 2 locally](https://replicate.com/blog/run-llama-locally)

## AND: the Starlet Issues

Another piece of news for the month of July: we started a new column "[Starlet List](/blog/list-your-open-source-project)". If you are an open-source maintainer and would like to promote your project (for free!), shoot us an Email at [star@bytebase.com](mailto:star@bytebase.com), and tell us how your project wants to be presented to the audience.

In the meantime, check out the July starlets:

-   [Sniffnet](/blog/sniffnet)
-   [DLTA-AI](/blog/dlta-ai)

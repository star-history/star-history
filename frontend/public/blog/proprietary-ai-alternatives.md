
---

As proprietary AI softwares like ChatGPT, Midjourney, Perplexity, Claude, Devin, Lovable, VEO continue to dominate the headlines, open-source counterparts are not far behind. Developers and hobbyists wish to take back control: running models locally, avoiding vendor lock-in, and trying out infinite possibilities of customization.

This month, we highlight six outstanding projects shaping the "open vs proprietary" landscape:


|  |  |
| ------- | ----------- |
| **LocalAI**  | the **self-hosted GPT API** |
| **ComfyUI**  | the **power user’s Midjourney** |
| **Wan2.2**  | **cinematic video generation, open and hackable** |
| **OpenHands**  | the **community’s Devin** 
| **Perplexica**  | the **open-source Perplexity AI** |
| **Firecrawl**  | the **building blocks of Lovable-like app builders** |
|  |  |

---

## [LocalAI](https://github.com/mudler/LocalAI) 
#### → OpenAI GPT API / Anthropic Claude

[![Star History Chart](https://api.star-history.com/svg?repos=mudler/LocalAI\&type=Date)](https://star-history.com/#mudler/LocalAI&Date)

LocalAI is not a model, but an **inference layer** that wraps open models (LLaMA, Mistral, Gemma, Mixtral, Qwen) behind an OpenAI-compatible API. Developers can swap out OpenAI’s endpoint for LocalAI with minimal code changes.

![LocalAI](/assets/blog/proprietary-ai-alternatives/localai.webp)

* **Strengths**: API-compatible, multi-modal (text, embeddings, TTS, images), privacy-friendly, cost-saving.
* **Limitations**: Models still trail GPT-4o and Claude 3.5 in reasoning and creativity. Speed depends on hardware.

👉 The **closest open-source alternative to GPT APIs**. Not raw parity, but all about **control, cost, and freedom**.

## [ComfyUI](https://github.com/comfyanonymous/ComfyUI)
#### → Midjourney / Runway

[![Star History Chart](https://api.star-history.com/svg?repos=comfyanonymous/ComfyUI\&type=Date)](https://star-history.com/#comfyanonymous/ComfyUI&Date)

ComfyUI is a **node-based workflow editor** for diffusion models. Artists can wire together samplers, ControlNet modules, LoRA models, and video nodes like Lego blocks.

![ComfyUI](/assets/blog/proprietary-ai-alternatives/comfy.webp)

* **Ecosystem**: Hundreds of community plugins and nodes, covering 3D, video, and advanced controls.
* **Community & Marketing**: [comfy.org](https://www.comfy.org/) acts as both product site and gallery, showcasing user creations and workflows. Messaging is clear: *ComfyUI is for artists of the future*.

👉 Midjourney is easy but closed. ComfyUI is harder to learn but infinitely more flexible. Its rise shows creators want **control and community**, not just outputs.

## [Wan2.2](https://github.com/Wan-Video/Wan2.2)
#### → Google DeepMind VEO 3

[![Star History Chart](https://api.star-history.com/svg?repos=Wan-Video/Wan2.2\&type=Date)](https://star-history.com/#Wan-Video/Wan2.2&Date)

Developed by **Alibaba**, Wan2.2 is an ambitious open video generation model. It supports text-to-video, image-to-video, and speech-to-video.

![wan2.2](/assets/blog/proprietary-ai-alternatives/wan.webp)

* **Community**: Available on Hugging Face and ModelScope, integrated into ComfyUI workflows, with tutorials and guides shared widely.
* **Strengths**: Motion consistency, cinematic feel, multi-modal inputs.
* **Limitations**: Heavy GPU requirements, occasional artifacts, not plug-and-play.

👉 Proof that **open video generation is real** — and people are already experimenting with it despite the cost.

## [OpenHands](https://github.com/All-Hands-AI/OpenHands) 
#### → Devin

[![Star History Chart](https://api.star-history.com/svg?repos=All-Hands-AI/OpenHands\&type=Date)](https://star-history.com/#All-Hands-AI/OpenHands&Date)

Devin sparked huge buzz as the “AI software engineer,” but it’s closed. **OpenHands** is the community’s open alternative.

![openhands](/assets/blog/proprietary-ai-alternatives/allhands.webp)

* **Features**: AI coding agents that can plan, code, test, debug, and collaborate. Extensible and self-hostable.
* **Why it matters**: Proprietary dev agents are black boxes. OpenHands is transparent and hackable — designed as a **collaborative teammate**.
* **Challenges**: Early days, far from Devin’s demos, needs ecosystem growth.

👉 The **first step toward an open Devin** developers can actually use and extend.

## [Perplexica](https://github.com/ItzCrazyKns/Perplexica)
#### → Perplexity AI

[![Star History Chart](https://api.star-history.com/svg?repos=ItzCrazyKns/Perplexica\&type=Date)](https://star-history.com/#ItzCrazyKns/Perplexica&Date)

Perplexica is an **AI-powered search engine** that serves as an open-source alternative to Perplexity AI. It combines web search with AI reasoning to provide comprehensive answers with sources.

![perplexica](/assets/blog/proprietary-ai-alternatives/perplexica.webp)

* **Features**: Real-time web search, multiple AI model support (OpenAI, Ollama, Groq, Anthropic), focus modes for different search types, and chat-based interface.
* **Self-hosted**: Complete control over your search data and AI interactions, with Docker deployment for easy setup.
* **Limitations**: Requires technical setup, dependent on external search engines (SearXNG), and needs API keys for AI models.

👉 The **open alternative to Perplexity AI** — giving users control over their AI-powered search experience without vendor lock-in.

## [Firecrawl](https://github.com/firecrawl/firecrawl)
#### (with Open-Lovable demo) → Lovable

[![Star History Chart](https://api.star-history.com/svg?repos=firecrawl/firecrawl\&type=Date)](https://star-history.com/#firecrawl/firecrawl&Date)

Firecrawl is an open-source crawler that turns websites into **clean Markdown or JSON**, perfect for LLMs. To demonstrate its power, the community built **Open-Lovable**, a clone of Lovable’s instant app builder.

![firecrawl](/assets/blog/proprietary-ai-alternatives/firecrawl.webp)

* **Why it matters**: Proprietary app builders hide their stack. Firecrawl shows that **the building blocks for Lovable-style apps already exist in open source**.

👉 Less about cloning Lovable directly, more about proving you can rebuild it with open infrastructure.

---

✨ That's September: six open-source projects pursuing giants, each with its own story. The polish may be lacking, but the creativity, vibrancy, and freedom of open source are impossible to ignore.

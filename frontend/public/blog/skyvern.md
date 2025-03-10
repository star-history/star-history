*This is the nineteenth issue of The Starlet List. If you want to prompt your open source project on star-history.com for free, please check out our [announcement](/blog/list-your-open-source-project).*

---

Hello Star History readers! We're the team behind [Skyvern](https://www.skyvern.com/), an open-source tool that uses LLMs and computer vision to help companies automate and scale browser-based workflows. 

## The Birth of Skyvern

We talked to hundreds of companies bogged down by repetitive manual workflows. The pain points were clear: keeping it manual with hiring doesn’t scale well and traditional automation tools like Selenium are rigid and maintenance-heavy. We felt like there was a way to get the best of both worlds with LLMs. We could use LLMs to reason through a website’s layout while preserving the advantage of traditional browser automation allowing it to scale alongside demand. This led us to build Skyvern.

## Core Features of Skyvern

1. **Natural Web Navigation:** Skyvern can operate on websites it’s never seen before by connecting visible elements with the natural language instructions provided to us. We use a blend of computer vision and DOM parsing to identify a set of possible actions on a website, and multi-modal LLMs to map the natural language instructions to the available actions on the page.

2. **AI-driven Adaptability:** Skyvern is resistant to website layout changes, as it doesn’t depend on any predetermined XPaths or other selectors. If a layout ever changes, we can leverage the methodology in #1 to complete the user-specified goal.

3. **Contextual Information Matching:** Skyvern accepts a blob of information when navigating workflows—just a JSON blob of whatever information you want to put, and then we use LLMs to map that to information on the screen. For example: if you're generating an auto insurance quote in the US, they commonly ask “Were you eligible to drive at 21?”. The answer could be inferred from the driver receiving their license in 2012, and having a birth date of 1996.

## Skyvern in Action

Our project has seen exciting use cases, such as:

- Automating material procurement for companies.
    
![finditparts_recording_crop](/assets/blog/skyvern/finditparts_recording_crop.webp)
    
- Streamlining interactions with government websites for administrative tasks. [[demo](https://github.com/skyvern-ai/skyvern?tab=readme-ov-file#navigating-to-government-websites-to-register-accounts-or-fill-out-forms)]
    
![edd_services](/assets/blog/skyvern/edd_services.webp)
    
- Facilitating insurance quote generation through dynamic form navigation. [[demo](https://github.com/skyvern-ai/skyvern?tab=readme-ov-file#retrieving-insurance-quotes-from-insurance-providers-in-any-language)]
    
![geico_shu_recording_cropped](/assets/blog/skyvern/geico_shu_recording_cropped.webp)
    
![bci_seguros_recording](/assets/blog/skyvern/bci_seguros_recording.webp)
    

## Learn more about Skyvern

We had a great [open source launch on Hacker News](https://news.ycombinator.com/item?id=39706004) and following that, the Skyvern repository reached 2.7K ⭐ in less than a week.

[![Star History Chart](https://api.star-history.com/svg?repos=Skyvern-AI/skyvern&type=Date)](https://star-history.com/#Skyvern-AI/skyvern&Date)

If you’d like to try out Skyvern and see how it works yourself, visit our [GitHub](https://github.com/Skyvern-AI/skyvern). Contributions and feedback in any form are much appreciated.

If you’d like to learn more about how other people are trying to use Skyvern and what are the initial problems that they are facing, check out our [Discord](https://discord.com/invite/fG2XXEuQX3) or reach out to us directly at [founders@skyvern.com](mailto:founders@skyvern.com)
*This is the eighth issue of The Starlet List. If you want to prompt your open source project on star-history.com for free, please check out our [announcement](/blog/list-your-open-source-project).*

---


Open-sourced by Microsoft recently, [Prompt flow](https://github.com/microsoft/promptflow) is a suite of development tools designed to streamline the end-to-end development cycle of LLM-based AI applications, from ideation, prototyping, testing, evaluation to production deployment and monitoring. It makes prompt engineering much easier and enables you to build LLM apps with production quality.

## Why

The utilization of Large Language Models (LLMs), such as ChatGPT and GPT-4, to enhance existing software or create new applications has become a pivotal strategy for many developers. This trend has been largely catalyzed by the early access Microsoft had to OpenAI's models, which allowed them to pioneer in this domain. One significant shift that LLMs introduce to application development is the increased stochastic nature of applications. This means that traditional testing methods may not be adequate or even applicable. The project 'prompt flow' represents Microsoft's efforts to incorporate their insights on building quality into the process of LLM application development.

## How

Prompt flow provides a suite of developer tools including:

- A [VS Code extension](https://marketplace.visualstudio.com/items?itemName=prompt-flow.prompt-flow) that allows for visual development and testing of the flow within VS Code. Although it may initially appear as a low-code solution for creating static "graphs", it actually allows you to program within different Python nodes with as much flexibility as you need. This enables you to fully utilize the quality assurance capabilities that Prompt Flow offers.

![vs-code](/blog/assets/prompt-flow/vs-code.webp)

- A [Python SDK/CLI](https://pypi.org/project/promptflow/) that facilitates experimentation with batch tests and evaluations, and offers a clear visualization of test results and intermediate outcomes. This tool can also be integrated into your CI/CD process.

![python-sdk](/blog/assets/prompt-flow/python-sdk.webp)

- [Built-in support for prompt tuning](https://microsoft.github.io/promptflow/how-to-guides/tune-prompts-with-variants.html) is another feature that simplifies the process of testing multiple prompts. It allows you to easily select the best prompt using metrics.
- [Flexible deployment support](https://microsoft.github.io/promptflow/how-to-guides/deploy-a-flow/index.html) that enables you to package your flow as a Docker container, which can then be run on various cloud platforms. Additionally, you can integrate the flow into your existing Python application using the SDK.9/17/2023, 12:42:47 PMSend

Moreover, a cloud-based version of Prompt flow is available in Azure AI, which incorporates enterprise features and facilitates team collaboration on Azure. It is currently in public preview. You can find more details [here](https://learn.microsoft.com/en-us/azure/machine-learning/prompt-flow/overview-what-is-prompt-flow?view=azureml-api-2).

## Star growth

As for its popularity, Prompt flow was publicly released in early September and witnessed a significant increase in interest, accumulating 2,000 stars within the first two weeks🚀.

![star-history](/blog/assets/prompt-flow/star-history.webp)
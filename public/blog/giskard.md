*This is the twenty-second issue of The Starlet List. If you want to prompt your open source project on star-history.com for free, please check out our [announcement](/blog/list-your-open-source-project).*

---

# Giskard: Open-Source Evaluation & Testing for LLMs and ML models

Giskard develops an open-source **AI testing framework** that helps to identify risks of AI models  - with a specific focus on LLM agents. This helps AI developers save time by ***automating the evaluation*** process, and save money by avoiding costly AI incidents.

## Problem: Why is AI testing important?

LLMs are susceptible to issues that traditional models don't face, such as hallucinations, prompt injection, and vulnerabilities to adversarial attacks. Developers often struggle with where to start, what issues to focus on, and how to implement effective tests for these risks.

Meanwhile, the pressure to deploy LLMs quickly is constant, often pushing models into production with hidden vulnerabilities. But failures in LLMs can lead to legal liability, reputational damage, and costly service disruptions.

This is why we created Giskard, an open-source framework to test AI models automatically, with a holistic coverage of AI risks, specifically designed to address the challenges of testing LLMs.

## Solution: Giskard’s Open-Source Evaluation & Testing for LLMs and ML models
Our open-source solution offers a Python library that you can use in your notebook. It helps you **test AI models**, whether it's an ***LLM application*** such as a ***RAG agent*** or a tabular model. 

With the `giskard.scan` method, our library can **detect the main vulnerabilities** of AI models using advanced adversarial testing techniques. For LLMs, it helps you detect hallucinations, sensitive information disclosure, prompt injections, and more. 

![Giskard LLM scan for vulneabilities](/assets/blog/giskard/llm-scan.webp)

You can export this scan with a customizable test suite, which you can integrate into your CI/CD pipeline.

If you're testing a RAG application, you can automate its evaluation using RAGET, Giskard's RAG Evaluation Toolkit. It generates realistic test cases automatically to detect weaknesses and evaluate answer correctness across your RAG agent components.

![Giskard RAG Evaluation toolkit](/assets/blog/giskard/raget.webp)

![Giskard RAG Evaluation toolkit](/assets/blog/giskard/raget-plot.webp)

## Open-source and fully integrated with the ML and LLM ecosystem

- Fully open-source Python library
- Compatible with all proprietary and open-source LLM providers
- Integrated with:
	- Databricks MLFlow
	- Pytest
	- GitHub
	- Nvidia NeMo Guardrails
	- And more!

![Giskard's integrations](/assets/blog/giskard/integrations.webp)

## Getting started

Install Giskard

```sh
pip install "giskard[llm]"
}
```

In this tutorial we will use Giskard’s LLM Scan to automatically detect issues on a Retrieval Augmented Generation (RAG) task:

<iframe src="https://colab.research.google.com/github/giskard-ai/giskard/blob/main/docs/getting_started/quickstart/quickstart_llm.ipynb" width="100%" height="600"></iframe>

For more details, check out the [docs](https://docs.giskard.ai/en/stable/getting_started/quickstart/quickstart_llm.html).

## Future development

Giskard is simplifying AI testing for developers. We want to become the go-to testing library for Data Scientists and AI Engineers and empower you to build AI applications without the usual complexities.

To stay up-to-date with our progress or contribute to the project, we welcome your feedback, questions, and comments. You can check out our [GitHub](https://github.com/Giskard-AI/giskard) or join our community on [Discord](https://discord.com/invite/ABvfpbu69R) to chat with us directly!

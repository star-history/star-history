*This is the twenty-seventh issue of The Starlet List. If you want to prompt your open source project on star-history.com for free, please check out our [announcement](/blog/list-your-open-source-project).*

---

[**Langfuse**](https://github.com/langfuse/langfuse) is the open-source LLM engineering platform. Langfuse helps engineers understand their LLM applications and offers ways to [improve](https://langfuse.com/faq/all/llm-analytics-101) them. At its core lie LLM Observability, execution metrics, evaluations, prompt management and application testing with datasets.

Langfuse is MIT-licensed and has \> 5.9k stars [on GitHub](https://github.com/langfuse/langfuse/). It is incredibly easy to self-host (one docker container) and has a community of thousands of self-hosting deployments.

![Langfuse LLM Monitoring][/assets/blog/langfuse/langfuse-llm-monitoring.webp]

## Core Features of Langfuse

At its core, Langfuse allows you to track any LLM call, no matter which model or framework you are using. Even beyond that, Langfuse is an application [tracing](https://langfuse.com/docs/tracing) solution, meaning that you can log additional workloads in your application, such as API calls, embedding calls etc., to gain a holistic understanding of your LLM app.

**Debugging & Iterating**  
The most common use cases for Langfuse are inspecting and debugging executions of your LLM app in the Langfuse UI and testing different versions of your app.  
[Langfuse Prompt Management](https://langfuse.com/docs/prompts/get-started) and its [Prompt Playground](https://langfuse.com/docs/playground) help in trying out new things and tracking what works.

**Monitoring Cost, Quality & Latency**  
Langfuse records a large amount of data about your application. Using its [dashboards](https://langfuse.com/docs/analytics/overview) and data exports, you can get fine-grained insights on the cost and latency of your application. This is useful for improving user experience while keeping an eye on your unit economics.

Extensive evaluation capabilities allow you to get a handle on quality. You can run automated [LLM-as-a-judge evaluations](https://langfuse.com/docs/scores/model-based-evals), let your users [rate outputs](https://langfuse.com/docs/scores/user-feedback), or manually [label data](https://langfuse.com/docs/scores/annotation) within Langfuse.

**Structured testing & experimentation**  
You can test your application in Langfuse by versioning it and by running tests of expected inputs and outputs via [curated datasets](https://langfuse.com/docs/datasets/overview). This allows you to build a pipeline of tests you can use to quantitatively understand if changes you make to your application (e.g. switching out a model, changing a prompt, etc.) improves your application.

For a detailed list of features, have a look at [Langfuse Features](https://langfuse.com/docs#overview-core-platform-features).

## Why use Langfuse Tracing to gain Observability in an LLM Application?

* Capture the full context of the execution, including API calls, context, prompts, parallelism, and more  
* Track model usage and cost  
* Collect user feedback  
* Identify low-quality outputs  
* Build fine-tuning and testing datasets

## Quick-Start: Tracing OpenAI Generations with Langfuse (Python)

Not using OpenAI? Langfuse can be used with any model or framework. It natively integrates with popular frameworks such as [Langchain](https://langfuse.com/docs/integrations/langchain/tracing), [LlamaIndex](https://langfuse.com/docs/integrations/llama-index/get-started), [LiteLLM](https://langfuse.com/docs/integrations/litellm/tracing) and [more](https://langfuse.com/docs/integrations/overview).

### Step 1: Create a New Project in Langfuse

1. [Create a Langfuse account](https://cloud.langfuse.com/auth/sign-up) or [self-host](https://langfuse.com/docs/deployment/self-host).  
2. Create a new project within Langfuse.   
3. Generate API credentials via the project settings.

### Step 2: Log Your First LLM Call to Langfuse

The [@observe() decorator](https://langfuse.com/docs/sdk/python/decorators) makes it easy to trace any Python LLM application. In this quickstart, we also use the Langfuse [OpenAI integration](https://langfuse.com/docs/integrations/openai) to automatically capture all model parameters.

```bash
pip install langfuse openai
```

```py
# Get keys for your project from the project settings page https://cloud.langfuse.com
os.environ["LANGFUSE_SECRET_KEY"] = ""
os.environ["LANGFUSE_PUBLIC_KEY"] = ""
os.environ["LANGFUSE_HOST"] = "https://cloud.langfuse.com" # 🇪🇺 EU region
# os.environ["LANGFUSE_HOST"] = "https://us.cloud.langfuse.com" # 🇺🇸 US region
```

```py
from langfuse.decorators import observe
from langfuse.openai import openai # OpenAI integration
 
@observe()
def story():
    return openai.chat.completions.create(
        model="gpt-3.5-turbo",
        max_tokens=100,
        messages=[
          {"role": "system", "content": "You are a great storyteller."},
          {"role": "user", "content": "Once upon a time in a galaxy far, far away..."}
        ],
    ).choices[0].message.content
 
@observe()
def main():
    return story()
 
main()
```

### Step 3: See your Traces in Langfuse

Once the script runs, visit the [Langfuse UI](https://cloud.langfuse.com/) to view the trace created.

![Example trace in the Langfuse UI][/assets/blog/langfuse/example-trace-in-langfuse.webp]

*Example trace in the Langfuse UI:* [https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/fac231bc-90ee-490a-aa32-78c4269474e3](https://cloud.langfuse.com/project/cloramnkj0002jz088vzn1ja4/traces/fac231bc-90ee-490a-aa32-78c4269474e3) 

You can now take it further by managing your prompts through Langfuse or by starting to test or evaluate your LLM executions.

## Learn more about Langfuse

![Langfuse star-history graph][/assets/blog/langfuse/langfuse-star-history-graph.webp]

Langfuse has a community of thousands of active users ranging from hobbyists to enterprises. We are most active on [GitHub discussions](https://github.com/orgs/langfuse/discussions) and you can also join [our Discord](https://langfuse.com/discord) for a chat. 

You can find more information in [our documentation](https://langfuse.com/docs) and on our [GitHub repo](https://github.com/langfuse/langfuse/).
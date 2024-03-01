_This is the fifth issue of The Starlet List. If you want to prompt your open source project on star-history.com for free, please check out our [announcement](/blog/list-your-open-source-project)._

---

## The Vision

Machine learning has reached an inflection point. The models have become so big and powerful that the current data sources are not enough to train them. ChatGPT was trained on the entire **public** internet. Our current data sources are dangerously running out of data leading the so called **AI Data Starvation** problem. Additionally, end-users are becoming more and more privacy-cautious and are reluctant to share their data with third parties. This makes it harder for companies to use the data they need to train their models. The solution to this problem is to train the models on distributed data sources. However, the current federated learning solutions are still in their beginnings and not suitable for production use-cases. We are set out to change that!

![Transition to Federated Learning](/blog/assets/metisfl/transition.webp)

Our vision is to drive this transition from machine learning to federated learning. We want to make it easy for developers and enterprises to train their models on distributed data sources. We believe that such a transition will eventually happen and will be beneficial for everyone. The end-users will be able to keep their data private and secure, while the enterprises will be able to train better models and provide better services to their customers.

## What is MetisFL?

![MetisFL Architecture](/blog/assets/metisfl/MetisFL-Components-Internal-02.webp)

[MetisFL](https://github.com/nevronAI/metisfl/) is an open-source federated learning framework that allows developer to train machine learning models on distributed data sources. Currently, the project is transitioning from a private, experimental version to a public, beta phase. We are actively encouraging developers, researchers and data scientists to experiment with the framework and contribute to the codebase.Please have a look at our [draft documentation](https://docs.nevron.ai/metisfl/) and [GitHub repository](https://github.com/nevronAI/metisfl/) to get a better understanding of the framework and how to use it.

## Why MetisFL?

-   **Scalability**: MetisFL is the only federated learning framework with the core controller developed purely in C++. This allows for the system to scale and support up to 100K+ learners!

-   **Speed**: The core operations at the controller as well as the controller-learner communication overhead has been optimized for efficiency. This allows MetisFL to achieve improvements of up to 1000x on the federation round time compared to other federated learning frameworks.

-   **Efficiency and Flexibility**: MetisFL supports synchronous, semi-synchronous and asynchronous protocols. The different choices make our framework flexible enough to adapt to the needs of each use-case. Additionally, the support of fully asynchronous protocol makes MetisFL a highly efficient solution for use-cases with high heterogeneity on the compute/communication capabilities of the learners.

-   **Strong Security**: MetisFL supports secure aggregations with fully homomorphic encryption using the [Palisade](https://gitlab.com/palisade/palisade-release) C++ cryptographic library. This ensures that the weights of the produced models remain private and secure in transit.

-   **Developer-Friendly**: MetisFL is designed to be developer-friendly. It provides a simple API that allows developers to federate their machine learning workflows with minimal effort. Additionally, it provides a set of tools that allow developers to easily monitor and debug their federated learning experiments.

## MetisFL History

MetisFL sprung up from the Information and Science Institute (ISI) in the University of Southern California (USC). It was initially built as a research prototype to support research efforts in the field of federated learning. The mastermind behind the project is [Dimitris Stripelis](https://www.linkedin.com/in/dstripelis/), a Federated Learning expert, who has been working on the project for several years as part of his Ph.D. research. At its current state, the source code has been re-engineered and open-sourced to support a wide range of use-cases and to be easily extensible to support new federated learning algorithms and protocols.

## Applications

MetisFL is a general purpose federated learning framework. It provides out-of-the box support for different communication protocols (synchronous, semi-synchronous, asynchronous) and federated algorithmic optimizations (e.g., FedAvg, FedOPT, FedProx) and it can be extended to support any type of federated learning topology (centralized, peer-to-peer). The framework has been used

The framework has been used to produce extensive research results and train models in academia across different application domains such as in Computer Vision, Natural Language Processing and Neuroimaging. Further use-cases and applications are currently being explored.

## Future Development

MetisFL is currently in its beta phase. We are actively working on improving the framework and adding new features. We are actively inviting developers to contribute to the [repository](https://github.com/nevronAI/metisfl/).

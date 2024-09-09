*This is the twenty-fourth issue of The Starlet List. If you want to prompt your open source project on star-history.com for free, please check out our [announcement](/blog/list-your-open-source-project).*

---

[**Superlinked**](https://www.superlinked.com/?utm_source=StarHistory&utm_medium=referral&utm_campaign=Starlet_AUG_2024) is an open-source vector compute framework for your information retrieval and feature engineering systems, focused on turning complex (structured+unstructured) data into ultra-modal vector embeddings within your RAG, Search, Recommendations and Analytics stack. Integrate Superlinked into your machine learning stack to achieve custom model performance with pre-trained model convenience.

![Example query requiring structured and unstructured data](/assets/blog/superlinked/example_query.webp)


## The Challenge of Structured Data in GenAI Applications 

Structured data is the backbone of most internal and customer-facing enterprise systems. Consider a Q&A chatbot of a financial analyst - we would expect it to understand that the analyst refers to “recent” or “at risk” reports from a particular range of dates, or a recommender system of an e-commerce store - we would expect it to recommend similarly priced or popular products to the product that the customer is currently viewing, in real-time. Unfortunately, traditional GenAI models struggle with numbers, timestamps and categorical data - let alone more complex data structures like time series or graphs. Their strength lies in processing and understanding certain types of unstructured data like text and images, but they falter with structured data, treating important attributes of the data, such as product prices, document dates, store locations, and content categories as if they were merely text. This mismatch often leads to tech teams discovering that their applications deliver subpar results.

In response, many teams attempt to develop and train custom re-ranking models tailored to their specific needs. However, this is a daunting task, which requires significant expertise, time, and resources—luxuries that many enterprises cannot afford. Consequently, most GenAI-powered solutions remain stuck in the proof of concept phase, unable to realize their full potential.


## Superlinked: Bridging the Gap Between Structured and Unstructured Data

Superlinked’s vector compute [framework](https://github.com/superlinked/superlinked) is a game-changer for data science teams. It enables the creation of custom vector embeddings that seamlessly integrate structured and unstructured data into the same vector space. This unique approach allows enterprises to use vector search to deliver results that take into account both data types, effectively tailoring GenAI models to their specific use cases. The result combines the high-quality performance of a custom model with the convenience of pre-trained GenAI models, offering a significant boost in time-to-market and explainability of the results.

![Overview of superlinked framework](/assets/blog/superlinked/superlinked_framework.webp)


## Take your GenAI Apps from POCs to Production with Superlinked

Developing your GenAI applications with Superlinked you’ll be able to:

- **Build & launch faster:** From notebook to production in a week with a single declarative framework
- **4 use-cases, 1 solution:** Use one solution for consistent results in RAG, RecSys, Search & Analytics w/o work & compute duplication
- **Improve retrieval quality:** Use more data to boost relevance and multi-encoder approach for improved control and explainability
- **Improve efficiency & cost:** Switch Vector DBs without changing your application code, manage streaming & batch updates in a unified solution with partial vector updates


## Getting Started with Superlinked

Start by exploring Superlinked’s [example notebooks](https://github.com/superlinked/superlinked?tab=readme-ov-file#use-cases) to get yourself familiar with the framework, and check out the deployable [Server](https://github.com/superlinked/superlinked/tree/main/server) solution that comes with native integrations to Redis Vector Search and MongoDB Atlas.

New to vector search? Learn more about building high-performance vector-powered applications at [VectorHub](https://superlinked.com/vectorhub/) - a free and community-run learning hub for people interested in adding vector retrieval to their ML stack.

Don’t hesitate getting in touch with us by e-mail: contact (at) superlinked.com.
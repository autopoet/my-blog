---
title: 从 Prompt 到 Harness：一点关于 AI 开发的思考
date: 2026-04-19
categories:
  - AI
tags:
  - AI
  - 工程
---

<ArticleViews slug="ai-arch-evolution-prompt-to-harness" />

> 以前觉得只要会写提示词（Prompt）就行了，但真动手时才发现，怎么让 AI 稳健地在生产环境跑起来才是大头。这个过程演变有三个阶段：**Prompt Engineering**、**Context Engineering** 和 **Harness Engineering**。

### 1. Prompt Engineering（提示词工程）

最开始接触 AI 的时候，大家都在研究怎么写出完美的 Prompt。我当时也觉得这可能就是 AI 开发的全部。

现在回想起来，这其实是在挖掘模型已有的**概率分布**。核心手段从最简单的指令（Zero-shot），慢慢演进到提供示例（Few-shot），再到后来大家常说的 **Chain of Thought (CoT)**——通过引导模型输出中间推理步骤来提高复杂逻辑的准确率。

在这个阶段，为了让输出更稳定，我还学到了一些结构化的技巧，比如用 Markdown 或者 XML 来规范角色（Role）和任务（Task）。但折腾久了就发现，Prompt 本质上是一种“软性约束”，它太脆了。模型版本一更新，或者换成不同参数量的模型，之前调好的逻辑可能就崩了。更致命的是，它解决不了模型“没见过某些私有知识”的问题。

### 2. Context Engineering（上下文工程）

为了让模型更懂业务，就需要引入 **RAG (Retrieval-Augmented Generation)**。这时候开发者的角色就从“写咒语的”变成了“做知识检索的”。

简单理解就是：不要让模型死记硬背，而是当它需要回答问题时，我们先去向量数据库里帮它找到最相关的**文本块（Chunks）**，再把这些内容作为 Context 塞给它看。

这块儿我学到了不少专业策略。比如简单的相似度检索往往不够精准，还需要引入 **Reranking（重排）** 模型来对搜索结果进行二次过滤；或者通过查询重写（Query Rewriting）来理解用户真实意图。这个阶段的核心挑战不再是 Prompt 本身，而是如何管理模型的**上下文窗口（Context Window）**，以及如何提高检索部分的“信噪比”。

### 3. Harness Engineering（基建/外壳工程）

“Harness”这个词字面意思是马具或线束，在工程里通常指测试线束或支撑架构。大概意思就是，既然 AI 模型是高度**非确定性（Stochastic）**的，那我们必须给它焊上一层牢固的、确定性的“铁杠子”。

光有 Prompt 和 Context 只能保证 AI “能说话”，但要在真实环境里跑，还得考虑这些硬核问题：
- **Evaluation (评估平台)：** 不能只靠肉眼看每一个结果。需要构建 **Evals 流程**，无论是用规则断言还是 LLM-as-a-Judge，都要量化地评估每一版改动的优劣。
- **Guardrails (安全护栏)：** 建立输入输出的硬核过滤机制。比如防止 Prompt 注入攻击，或者通过敏感词库确保模型不乱说话。
- **Agentic Infrastructure：** 当模型需要调用外部工具时，它可能会出错。我们需要一个能够处理状态管理、异常捕获和**自修复（Self-correction）**的运行环境。比如模型写错了 SQL，Harness 应该能捕获这个报错并反馈给模型让其重试，而不是直接崩掉。

**未完待续...**

<ArticleComments slug="ai-arch-evolution-prompt-to-harness" />


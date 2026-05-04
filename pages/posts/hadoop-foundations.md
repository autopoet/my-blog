---
title: Hadoop 基础：HDFS、MapReduce 与 YARN
date: 2025-08-10
categories:
  - 大数据
tags:
  - Hadoop
  - HDFS
  - MapReduce
---
<ArticleViews slug="hadoop-foundations" />

> Hadoop 是大数据学习里绕不开的基础。
> 它解决的核心问题是：数据太大，一台机器放不下、算不动时怎么办。

## 1. Hadoop 解决什么问题

传统单机处理数据有两个瓶颈：

- 存储不够。
- 计算太慢。

Hadoop 的思路是把很多普通机器组织起来，形成一个集群。

数据分散存储在多台机器上，计算也分散到多台机器上执行。

这背后的思想很朴素：

> 一台机器处理不了，就让很多机器一起处理。

## 2. HDFS：分布式文件系统

HDFS 是 Hadoop Distributed File System。

它负责存储大规模文件。

HDFS 会把大文件切成多个块，分布到不同机器上，并保存多个副本。

这样做有两个好处：

- 单台机器坏了，数据不容易丢。
- 计算时可以靠近数据所在机器执行。

可以把 HDFS 理解成一个跨多台机器的大硬盘。

## 3. MapReduce：分布式计算模型

MapReduce 是一种计算模型。

它把任务分成两个阶段：

- Map：把数据拆开处理，生成中间结果。
- Reduce：把中间结果汇总。

经典例子是词频统计。

Map 阶段：

```txt
hello world -> hello:1, world:1
hello data  -> hello:1, data:1
```

Reduce 阶段：

```txt
hello -> 2
world -> 1
data  -> 1
```

MapReduce 的优点是模型清晰，适合批处理；缺点是中间结果频繁落盘，效率不够高。

## 4. YARN：资源调度

集群里有很多任务要运行，也有很多机器资源。

YARN 负责管理和调度资源：

- 哪个任务能跑。
- 分配多少 CPU 和内存。
- 任务失败后怎么处理。

如果 HDFS 负责“数据放哪里”，MapReduce 负责“怎么算”，YARN 就负责“资源怎么分”。

## 5. 小结

Hadoop 的三个基础组件可以这样记：

- HDFS：存数据。
- MapReduce：算数据。
- YARN：管资源。

虽然现在很多场景会使用 Spark、Flink 等更高效的计算框架，但 Hadoop 的思想仍然是理解大数据系统的基础。

<ArticleComments slug="hadoop-foundations" />


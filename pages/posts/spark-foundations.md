---
title: Spark 基础：RDD、DAG 与内存计算
date: 2025-08-17
categories:
  - 大数据
tags:
  - Spark
  - RDD
  - 大数据计算
---
<ArticleViews slug="spark-foundations" />

> Spark 经常被拿来和 MapReduce 对比。
> 它更常用的原因之一，是把很多计算尽量放在内存中完成，减少反复读写磁盘。

## 1. Spark 想解决什么问题

MapReduce 适合批处理，但每一轮计算都会产生较多磁盘读写。

如果一个任务需要多轮迭代，比如机器学习或图计算，MapReduce 的效率会比较低。

Spark 的思路是：

> 尽量把中间数据放在内存里，让多步骤计算更快。

所以 Spark 常用于：

- 批处理。
- 交互式分析。
- 机器学习。
- 流式计算。

## 2. RDD 是什么

RDD 是 Resilient Distributed Dataset，弹性分布式数据集。

可以先把它理解成：

> 分布在集群多台机器上的数据集合。

RDD 有几个特点：

- 分布式：数据分散在不同节点。
- 可容错：某个分区丢了，可以根据血缘重新计算。
- 不可变：转换操作会生成新的 RDD。
- 懒执行：只有遇到 action 操作时才真正计算。

## 3. Transformation 和 Action

Spark 操作大致分两类：

Transformation 不会立刻执行：

```txt
map
filter
flatMap
groupByKey
reduceByKey
```

Action 会触发执行：

```txt
count
collect
saveAsTextFile
reduce
```

比如：

```txt
读取数据 -> filter -> map -> count
```

前面的 `filter` 和 `map` 只是记录计算逻辑，直到 `count` 才真正触发任务。

## 4. DAG 是什么

DAG 是 Directed Acyclic Graph，有向无环图。

Spark 会把一连串计算步骤组织成 DAG，再拆成多个 stage 执行。

这样做可以优化计算流程，减少不必要的中间落盘。

简单理解：

> Spark 会先看完整条计算链路，再决定怎么执行。

## 5. 小结

Spark 的核心可以先抓住三个词：

- RDD：分布式数据抽象。
- DAG：计算流程图。
- 内存计算：减少磁盘读写，提高迭代任务效率。

学习 Spark 时，不要一开始就背 API，而要先理解它为什么比传统 MapReduce 更适合复杂分析任务。

<ArticleComments slug="spark-foundations" />


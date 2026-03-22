---
title: JS 进阶：Promise 异步编程
date: 2025-11-07
categories:
  - 啃啃原理
tags:
  - JavaScript
  - 进阶
  - 异步
  - Promise
---
<ArticleViews slug="js-promise" />

> Promise 是异步编程的一种解决方案，比传统的回调函数更合理且更强大。它是一个构造函数，用于生成 Promise 实例。

## 1. 三种状态与过程

Promise 实例在其生命周期内只可能处于以下三种状态之一：

- **Pending**（进行中）：初始状态，既不是成功，也不是失败。
- **Fulfilled**（已成功）：意味着操作成功完成。
- **Rejected**（已失败）：意味着操作失败。

**状态转换规则**：

- 状态只能从 `Pending` 变为 `Fulfilled` 或 `Rejected`。
- **一旦状态改变，就不会再变**，任何时候都可以得到这个结果。
- 这两个过程通常被称为：
  - `Pending` -> `Fulfilled` : **Resolved**（已完成）
  - `Pending` -> `Rejected` : **Rejected**（已拒绝）


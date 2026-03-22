---
title: JavaScript 面试题 - 第二梯队（高频）
date: 2025-12-23
categories:
  - 啃啃原理
tags:
  - JavaScript
  - 面试
  - 高频
---
<ArticleViews slug="js-interview-tier-2" />

## 1. JavaScript 为什么是单线程？如何实现异步编程？

- **原因**：作为浏览器脚本语言，JS 主要用于操作 DOM。如果是多线程，两个线程同时修改同一个 DOM，会产生严重的冲突（如一个删除一个修改）。为保证一致性和简单性，采用了单线程模型。
- **实现异步**：通过**事件循环 (Event Loop)** 机制。JS 将费时的任务（如 IO、定时器）交给 Web API 处理，完成后将回调放入任务队列，主线程在空闲时去队列中提取分批执行。



<ArticleComments slug="js-interview-tier-2" />

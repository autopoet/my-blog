---
title: JavaScript 面试题 - 第一梯队（极高频）
date: 2025-12-20
categories:
  - 啃啃原理
tags:
  - JavaScript
  - 面试
  - 极高频
---
<ArticleViews slug="js-interview-tier-1" />

## 1. 什么是 JavaScript 事件循环 (Event Loop)？宏任务和微任务执行顺序是怎样的？

### 为什么需要事件循环
JavaScript 是 **单线程语言**，同一时间只能执行一个任务。但浏览器中存在大量异步任务（网络请求、定时器、DOM 事件等），因此需要一种机制协调同步代码和异步回调的执行顺序，这就是 Event Loop。

### 执行模型
JS 运行时主要包含：
1. **Call Stack（调用栈）**：同步代码在此执行。
2. **Web APIs / Node APIs**：处理异步操作（如 setTimeout）。
3. **Task Queue（任务队列）**：存储待执行的异步回调。

**流程：** 同步代码入栈执行 -> 遇到异步交给 Web API -> 回调进入任务队列 -> 调用栈为空时，事件循环将队列首位推入栈。

### 宏任务与微任务
- **宏任务 (MacroTask)**：script (整体代码), setTimeout, setInterval, setImmediate (Node), I/O, UI 渲染。
- **微任务 (MicroTask)**：Promise.then, MutationObserver, queueMicrotask, process.nextTick (Node)。

### 执行顺序规则
1. 执行一个宏任务（初始为 script）。
2. 执行过程中遇到微任务，放入微任务队列。
3. 宏任务执行完成，**立即清空所有微任务队列中的任务**。
4. 尝试进行页面渲染。
5. 开始下一个宏任务。


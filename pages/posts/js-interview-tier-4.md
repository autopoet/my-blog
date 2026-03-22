---
title: JavaScript 面试题 - 第四梯队（中频）
date: 2025-12-28
categories:
  - 啃啃原理
tags:
  - JavaScript
  - 面试
  - 中频
---
<ArticleViews slug="js-interview-tier-4" />

## 1. JavaScript 模块化机制是什么？ESM 如何运行？

- **CommonJS (CJS)**：Node.js 默认，使用 `require/module.exports`。是动态加载，运行时确定，输出的是值的拷贝。
- **ES Module (ESM)**：浏览器与现代前端标准，使用 `import/export`。是静态编译，编译时加载，输出的是值的只读引用（绑定）。
- **运行机制**：ESM 在解析阶段建立依赖树，执行阶段再填充具体值，支持 Tree-Shaking。


---
title: 手撕代码-前端面试场景题（一）
date: 2026-02-02
categories:
  - 写写代码
tags:
  - 前端面试
  - 场景模拟
---
<ArticleViews slug="frontend-scenario-questions-part1" />


> 本篇文章主要整理前端常见的面试场景题。本部分模拟真实业务需求，考察开发者在特定约束条件下的技术方案选型与组件设计。这不再是单一知识点的考察，而是对 Vue/React 框架特性、CSS 布局及工程化手段的综合运用。面试官通过“你怎么实现”或“怎么优化”的提问，观察你是否具备系统设计思维。你给出的方案（如：虚拟滚动、防抖节流、Hook 封装）直接决定了你是否具备独立承担复杂业务模块的能力。

## 题目列表

### 1. 虚拟列表 (Virtual List) 简易版
```javascript
// 仅保留计算 offset 和渲染逻辑
function updateVisibleItems(scrollTop) {
  const start = Math.floor(scrollTop / itemHeight);
  const end = start + visibleCount;
  this.visibleList = allList.slice(start, end);
  this.offset = start * itemHeight; // 维持滚动条位置
}
```

### 2. 图片懒加载 (IntersectionObserver)
```javascript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      observer.unobserve(img);
    }
  });
});
```

### 3. 异步并发控制 (limit)
```javascript
async function limitRequests(urls, limit) {
  const pool = new Set();
  for (const url of urls) {
    const task = fetch(url).then(() => pool.delete(task));
    pool.add(task);
    if (pool.size >= limit) await Promise.race(pool);
  }
}
```

<ArticleComments slug="frontend-scenario-questions-part1" />

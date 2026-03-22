---
title: HTML 核心知识总结
date: 2025-10-21
categories:
  - 啃啃原理
tags:
  - HTML
  - 基础
---

> HTML (HyperText Markup Language) 是构建 Web 页面的基础。理解其核心概念，如语义化、DOM 结构及常见元素，是每个前端开发者的基本功。

## 1. 语义化标签 (Semantic HTML)

语义化是指使用恰当的 HTML 标签来让页面结构更清晰，让机器（搜索引、辅助技术）和人类都能更好地理解内容。

- **优势**：
  - 利于 SEO。
  - 提高可访问性（Screen Readers）。
  - 代码可读性更高。

- **常用标签**：`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`。

---

## 2. DOM 树结构

浏览器会将 HTML 解析为文档对象模型 (DOM)，这是一个树状结构，每个节点代表页面上的一个元素、属性或文本。

---

## 3. HTML5 新特性

- **多媒体**：`<video>`, `<audio>`。
- **图形**：`<canvas>`, `<svg>`。
- **存储**：`localStorage`, `sessionStorage`。
- **语义化**：如上所述的新布局标签。

---

## 4. 常见面试点

### HTML5 离线缓存 (Manifest)
（注：现代 Web 开发更多使用 Service Workers）

### Script 标签的 defer 与 async
- `defer`：异步下载，在 HTML 解析完成后，`DOMContentLoaded` 事件前执行。
- `async`：异步下载，下载完成后立即执行，可能阻塞 HTML 解析。

> **总结**：HTML 不仅仅是标签的堆砌，合理的结构和语义化是高质量 Web 应用的基石。

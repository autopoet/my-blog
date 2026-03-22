---
title: CSS 核心知识总结
date: 2025-10-21
categories:
  - 啃啃原理
tags:
  - CSS
  - 基础
---
<ArticleViews slug="css-core" />

> CSS (Cascading Style Sheets) 赋予了网页灵魂。从盒模型到布局方案，再到现代的 Grid 和 CSS 变量，CSS 的深度远超想象。

## 1. 盒模型 (Box Model)

所有 HTML 元素都可以被看作盒子。
- **标准盒模型 (content-box)**：`width` = 内容宽度。
- **怪异盒模型 (border-box)**：`width` = 内容 + padding + border。

```css
/* 推荐做法 */
* {
  box-sizing: border-box;
}
```



<ArticleComments slug="css-core" />

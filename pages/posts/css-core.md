---
title: CSS 核心知识总结
date: 2025-10-21
categories:
  - 前端
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

---

## 2. 布局方案

### Flexbox (弹性布局)
最常用的一维布局方案。
- `justify-content`
- `align-items`
- `flex-direction`

### Grid (网格布局)
强大的二维布局方案，适合复杂的整体架构。

---

## 3. 层叠与优先级 (Specificity)

1. `!important`
2. 行内样式 (In-line style)
3. ID 选择器
4. 类、伪类、属性选择器
5. 标签、伪元素选择器

---

## 4. 现代 CSS 特性

- **CSS Variables (Custom Properties)**：
  ```css
  :root {
    --primary-color: #42b983;
  }
  ```
- **CSS Modules / Scoped CSS**：解决命名冲突。

---

> **总结**：CSS 需要大量的实践。理解布局原理和层叠机制是进阶的关键。

<ArticleComments slug="css-core" />

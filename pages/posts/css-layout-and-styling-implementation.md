---
title: CSS 核心布局与样式手写实现专题
date: 2025-11-07
categories:
  - 写写代码
tags:
  - CSS
  - 手写实现
  - 样式方案
---

<ArticleViews slug="css-layout-and-styling-implementation" />


# CSS 核心布局与样式手写实现专题

> **技术深度探讨**：在处理布局问题时，通常优先采用 **Flexbox** 作为现代标准方案，在大规模网格控制下会结合 **CSS Grid**。同时，深入理解 **Float**、**Positioning** 等传统实现方案及其底层原理（如 BFC、文档流特性），能够确保在复杂兼容性场景或特殊视觉需求下，灵活选择最稳健的工程实践。

---

## 一、 两栏布局（左定宽，右自适应）

**HTML 结构**：

```html
<div class="container">
  <div class="left">left</div>
  <div class="right">right</div>
</div>
```

### 方案 1：Float + Margin（经典必会）

```css
.left {
  float: left;
  width: 200px;
}
.right {
  margin-left: 200px;
}
```

- **特点**：最老牌方案，面试官常用。需处理浮动塌陷（Clearfix）。

### 方案 2：Flex（推荐方案）

```css
.container {
  display: flex;
}
.left {
  width: 200px;
}
.right {
  flex: 1;
}
```

- **特点**：语义清晰，自适应强，实际项目首选。

### 方案 3：Absolute + Padding

```css
.container {
  position: relative;
}
.left {
  position: absolute;
  width: 200px;
  left: 0;
}
.right {
  padding-left: 200px;
}
```

- **特点**：不参与文档流，常用于整体布局容器。

---

## 二、 三栏布局（中间自适应）

**HTML 结构**：

```html
<div class="container">
  <div class="left">left</div>
  <div class="center">center</div>
  <div class="right">right</div>
</div>
```

### 方案 1：Float（传统三栏）

```css
.left, .right {
  width: 200px;
  float: left;
}
.center {
  margin: 0 200px;
}
```

### 方案 2：Flex

```css
.container {
  display: flex;
}
.left, .right {
  width: 200px;
}
.center {
  flex: 1;
}
```

### 方案 3：Grid

```css
.container {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
}
```

- **架构建议**：Grid 更适合二维布局，复杂页面结构下可读性最佳。

---

## 三、 水平垂直居中方案汇总

**HTML 结构**：

```html
<div class="parent">
  <div class="child"></div>
</div>
```

### 方案 1：Flex (推荐)

```css
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

### 方案 2：Absolute + Transform

```css
.parent {
  position: relative;
}
.child {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
```

### 方案 3：Grid

```css
.parent {
  display: grid;
  place-items: center;
}
```

### 方案 4：Table-cell (向下兼容)

```css
.parent {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}
```

---

## 四、 CSS 三角形（零宽高技巧）

```css
.triangle {
  width: 0;
  height: 0;
  border: 20px solid transparent;
  border-top-color: red; /* 向下三角形 */
}

/* 向右三角形 */
.triangle-right {
  border-left-color: red;
}
```

- **核心要点**：本质是 Border 相交区域，元素本身宽高设为 0。

---

## 五、 Loading 动画

### 方案 1：旋转圆环

```css
.loading {
  width: 40px;
  height: 40px;
  border: 4px solid #ccc;
  border-top-color: #000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
```

### 方案 2：三点跳动

```css
.dot {
  width: 10px;
  height: 10px;
  background: #000;
  border-radius: 50%;
  animation: bounce 1.4s infinite;
}
@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}
```

---

## 六、 弹窗实现（遮罩 + 居中）

**HTML 结构**：

```html
<div class="mask">
  <div class="modal"></div>
</div>
```

### 基本实现

```css
.mask {
  position: fixed;
  inset: 0; /* 相当于 top/left/right/bottom: 0 */
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
}
```

---

## 七、 补充题实战集锦

### 1. 文本溢出省略

- **单行省略**：

```css
.single-line {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

- **多行省略 (Webkit 内核)**：

```css
.multi-line {
  display: -webkit-box;
  -webkit-line-clamp: 3; /* 限制 3 行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

### 2. 清除浮动 (Clearfix)

**原理**：在父元素末尾添加一个不可见的块元素，并设置 `clear: both`，撑开父元素高度。

```css
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
```

### 3. 自适应正方形

**方案一：CSS 变量 / Aspect-ratio (现代)**

```css
.square {
  width: 20%;
  aspect-ratio: 1 / 1;
}
```

**方案二：Padding 技巧 (兼容性好)**

```css
.square {
  width: 20%;
  height: 0;
  padding-bottom: 20%; /* 相对于父元素宽度的百分比 */
}
```

### 4. Sticky 吸顶效果

```css
.header {
  position: sticky;
  top: 0;
  z-index: 100;
}
```

- **注意**：父元素不能设置 `overflow: hidden`，否则会被切断无法粘滞。

### 5. BFC 触发方式

- `float` 不为 `none`
- `position` 为 `absolute` 或 `fixed`
- `overflow` 不为 `visible` (常用 `auto` 或 `hidden`)
- `display` 为 `inline-block`、`flex`、`grid`、`table-cell` 等

### 6. 纯 CSS Tooltip

```css
.tooltip {
  position: relative;
}
.tooltip::after {
  content: attr(data-tip);
  position: absolute;
  bottom: 120%;
  left: 50%;
  transform: translateX(-50%);
  background: #333;
  color: #fff;
  padding: 5px;
  border-radius: 4px;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.3s;
}
.tooltip:hover::after {
  visibility: visible;
  opacity: 1;
}

<ArticleComments slug="css-layout-and-styling-implementation" />

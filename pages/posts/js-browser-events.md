---
title: 浏览器进阶：彻底理解 DOM 事件体系
date: 2025-11-09
categories:
  - 啃啃原理
tags:
  - JavaScript
  - 浏览器
  - 事件流
---
<ArticleViews slug="js-browser-events" />

> 浏览器的事件体系是前端交互的核心。理解事件流的三个阶段和事件委托的原理，是编写高性能代码的基础。

## 1. DOM 事件流

当你在页面上点击一个按钮时，事件并不是只发生在按钮上，而是在元素节点与根节点之间按照特定的顺序传播。这个过程称为 **事件流**。

根据 W3C 标准，事件流分为三个阶段：

### **三个阶段**


1. **捕获阶段 (Capturing Phase)**：事件从 `window` 对象开始，向下经过 `document`、`html`、`body`，直到到达目标节点的父节点。**目的是在事件到达预定目标之前捕获它。**
2. **目标阶段 (Target Phase)**：事件到达实际触发事件的元素（`e.target`）。
3. **冒泡阶段 (Bubbling Phase)**：事件从目标节点开始，沿 DOM 树向上回溯，直到 `window` 对象。**目的是让父元素有机会响应子元素的事件。**

### **注意事项**


- 默认状态：大多数事件（如 `click`）默认在冒泡阶段触发。
- 不可冒泡事件：所有事件都要经过捕获阶段和处于目标阶段，但并非所有事件都会冒泡，例如 `focus`（获得焦点）、`blur`（失去焦点）、`mouseenter`、`mouseleave`。
- 监听设置：`addEventListener(type, handler, useCapture)` 的第三个参数 `useCapture` 若为 `true`，则在捕获阶段执行；默认为 `false`（冒泡阶段执行）。

### **1.1 原始事件模型 (DOM Level 0)**


- **绑定方式**：
  1. 通过 HTML 属性绑定：`<input type="button" onclick="fun()">`
  2. 通过 DOM 属性绑定：`btn.onclick = fun;`
- **特性**：
  - **绑定速度快**：直接操作 DOM 属性。
  - **唯一性**：同一个类型的事件只能绑定一次，后绑定的会覆盖之前的。
  - **局限性**：只支持冒泡，不支持捕获。

- **示例**：

```javascript
var btn = document.getElementById('btn');
btn.onclick = fun1;
btn.onclick = fun2; // 出错：后绑定的事件会覆盖掉之前的事件
```

- **移除事件**：将对应事件属性置为 `null`。

```javascript
btn.onclick = null;
```

### **1.2 标准事件模型 (DOM Level 2)**

遵循 W3C 标准，包含完整的事件流阶段。在同一个 DOM 元素上绑定多个事件处理器不会产生冲突。

- **阶段说明**：
  1. **事件捕获**：从 `document` 向下传播到目标元素，检查并执行捕获阶段监听函数。
  2. **事件处理**：到达目标元素，触发目标元素的监听函数。
  3. **事件冒泡**：从目标元素向上回溯到 `document`，检查并执行冒泡阶段监听函数。

- **核心 API**：
  - `addEventListener(eventType, handler, useCapture)`：绑定监听。
  - `removeEventListener(eventType, handler, useCapture)`：移除监听。
- **参数说明**：
  - `eventType`：事件类型（不加 `on`）。
  - `handler`：处理函数。
  - `useCapture`：是否在捕获阶段执行，默认 `false`（冒泡阶段执行）。

- **示例**：
```javascript
var btn = document.getElementById('btn');
// 绑定多个不冲突
btn.addEventListener('click', showMessage1, false);
btn.addEventListener('click', showMessage2, false);
// 移除
btn.removeEventListener('click', showMessage1, false);
```



<ArticleComments slug="js-browser-events" />

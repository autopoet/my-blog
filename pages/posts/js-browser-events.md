---
title: 浏览器进阶：彻底理解 DOM 事件体系
date: 2025-10-06
categories:
  - 前端八股
tags:
  - JavaScript
  - 浏览器
  - 事件流
---

> 浏览器的事件体系是前端交互的核心。理解事件流的三个阶段和事件委托的原理，是编写高性能代码的基础。

### 1. DOM 事件流

当一个 DOM 事件触发时，它并不是只发生在目标元素上，而是在目标元素与根节点之间进行传播。这个传播过程称为 **事件流**。

根据 W3C 标准，事件流分为三个阶段：

#### **三个阶段**
1. **捕获阶段 (Capturing Phase)**：事件从 `window` 对象开始，向下经过 `document`、`html`、`body`，直到到达目标节点的父节点。
2. **目标阶段 (Target Phase)**：事件到达实际触发事件的元素（`e.target`）。
3. **冒泡阶段 (Bubbling Phase)**：事件从目标节点开始，沿 DOM 树向上回溯，直到 `window` 对象。

#### **addEventListener 的第三个参数**
`element.addEventListener(event, handler, useCapture)`
- `false` (默认)：在**冒泡**阶段触发。
- `true`：在**捕获**阶段触发。

```javascript
// 冒泡
child.addEventListener('click', () => console.log('Child Clicked'), false);
// 捕获
parent.addEventListener('click', () => console.log('Parent Clicked'), true);
```

---

### 2. 事件委托 (Event Delegation)

#### **原理**
事件委托是利用**事件冒泡**机制，将子元素的事件监听器绑定到其父元素（或更高层级）上。当子元素被点击时，事件会冒泡到父元素，由父元素的监听器通过检查 `event.target` 来处理。

#### **性能优势**
1. **减少内存消耗**：不需要为成百上千个子元素分别绑定监听器，只需绑定一个到父元素。
2. **动态绑定**：对于新增的子元素，无需重新绑定事件，父元素的监听器依然有效。

#### **应用场景**
最经典的场景是列表（`<ul>`）下的列表项（`<li>`）点击处理。

```javascript
const list = document.querySelector('#myList');

list.addEventListener('click', function(e) {
  // 检查点击的是否是 li 标签
  if (e.target && e.target.nodeName === 'LI') {
    console.log('List item clicked:', e.target.innerText);
  }
});
```

---

### 3. 事件对象常用 API

在处理事件时，`event` 对象提供了几个关键控制方法：

- **e.target**：真正触发事件的元素（在委托中很有用）。
- **e.currentTarget**：绑定监听器的元素（始终是父级或本身）。
- **e.stopPropagation()**：阻止事件继续向上冒泡。
- **e.stopImmediatePropagation()**：阻止冒泡，并阻止该元素上绑定的其他后续监听器执行。
- **e.preventDefault()**：阻止默认行为（如 A 标签跳转、表单提交）。

> **总结**：熟练掌握事件流能帮你处理复杂的 UI 交互嵌套，而善用事件委托则是优化长列表性能的不二法门。

---
title: JS 基础：闭包 (Closure)
date: 2025-10-04
categories:
  - 前端八股
tags:
  - JavaScript
  - 基础
---

> 闭包是 JavaScript 中最强大的特性之一，也是面试中的“常客”。

### 1. 什么是闭包？

内部函数引用了外部函数作用域中的变量。简单来说，闭包 = 函数 + 该函数能访问的外部变量环境。

### 2. 闭包的特点

- **函数嵌套**：闭包必须是函数嵌套，即内部函数访问外部函数的变量。
- **持久访问**：闭包可以持续访问外部函数的变量，即使外部函数已经执行完毕。
- **变量保存**：外部函数的变量会被保存在内存中，直到闭包不再使用这些变量。

### 3. 闭包的用途

- **创建私有变量**：防止外部直接修改函数内部状态。
- **延长变量生命周期**：让外部环境可以持续访问函数内部的局部变量。

### 4. 示例代码

```javascript
// 计数器闭包
function createCounter() {
  let count = 0;
  return {
    increment: function() {
      count++;
      return count;
    },
    decrement: function() {
      count--;
      return count;
    },
    getCount: function() {
      return count;
    }
  };
}
const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount());  // 2
```
### 5.定时器陷阱

```javascript
for (var i = 1; i <= 5; i++) {
    setTimeout(() => console.log(i), 1000);
}
```
#### 为何输出 5 个 6？

- **单线程与事件循环**：for 循环是同步的，会瞬间跑完。此时 $i$ 已经累加到 6。异步排队：`setTimeout` 的回调函数在任务队列排队。即使是 0 毫秒，也要等同步循环跑完。作用域：`var` 没有块级作用域，5 个闭包函数共享同一个 $i$ 变量。解决方案：使用 `let`（创建块级作用域副本）或立即执行函数 IIFE（手动创建闭包快照）。

### 6. 回调函数

- **定义**：把函数作为参数传给另一个函数，等特定时机再回头调用。

- **关系**：在异步任务中，回调函数往往通过闭包持有外部环境的变量。

---
> 过度使用闭包可能导致内存泄漏，因为闭包引用的变量不会被垃圾回收机制轻易回收。

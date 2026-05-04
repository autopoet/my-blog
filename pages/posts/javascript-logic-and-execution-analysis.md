---
title: JavaScript 代码执行逻辑静态分析
date: 2026-01-10
categories:
  - 前端
tags:
  - JavaScript
  - 代码分析
  - 底层机制
---

<ArticleViews slug="javascript-logic-and-execution-analysis" />

> 本篇文章深度解析 JavaScript 中的代码执行逻辑（Event Loop, Closure, This, Promise 等），侧重于模拟浏览器引擎，对 JavaScript 的底层执行路径进行静态拆解。通过这类分析可以深化对 JS 内存管理、任务优先级排布等核心原理的掌握。

## 一、 事件循环 (Event Loop) 调度分析

### 1. 任务队列执行优先级测试
```javascript
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
```

- **解析逻辑**：同步任务优先执行（1, 4），紧接着微任务（Microtask）清空（3），最后宏任务（Macrotask）执行（2）。
- **执行结果**: `1 4 3 2`

---

## 二、 执行上下文与 This 绑定机制

### 1. 箭头函数与作用域绑定
```javascript
const obj = {
  name: 'Antigravity',
  say: function() {
    setTimeout(() => console.log(this.name), 0);
  },
  say2: () => console.log(this.name)
};

obj.say();  
obj.say2(); 
```

- **解析逻辑**：
    - `obj.say()`：箭头函数在 `say` 函数的作用域内定义，继承了 `say` 被调用时的 `this` 指向（即 `obj`）。
    - `obj.say2()`：箭头函数在定义时绑定到外部的全局/模块对象，无法感知 `obj` 的上下文。
- **执行结果**: `Antigravity`  /  `undefined`

---

## 三、 异步函数顺序 (Async/Await)

### 1. Await 后的代码微任务转换
```javascript
async function async1() {
  console.log('a');
  await async2();
  console.log('b');
}
async function async2() { console.log('c'); }

async1();
console.log('d');
```

- **解析逻辑**：`await async2()` 会立即执行 `async2` 同步部分，并将后续代码 `console.log('b')` 放入微任务队列。随后主线程继续执行同步代码 `console.log('d')`。
- **执行结果**: `a c d b`

<ArticleComments slug="javascript-logic-and-execution-analysis" />

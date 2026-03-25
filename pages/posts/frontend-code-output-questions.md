---
title: 手撕代码-前端代码输出题
date: 2026-01-10
categories:
  - 写写代码
tags:
  - 前端面试
  - JavaScript
---

<ArticleViews slug="frontend-code-output-questions" />

> 本篇文章主要整理前端常见的代码输出题（Event Loop, Closure, This, Promise 等）。侧重于模拟浏览器引擎，对 JavaScript 的底层执行逻辑进行静态分析。面试官通过这类题考察你对 JS 内存管理、任务优先级排布等底层原理的掌握深度，确保你在处理高并发或复杂交互业务时，能写出运行结果符合预期的代码

## 题目列表

### 1. 事件循环 (Event Loop)
```javascript
console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');
// 输出: 1 4 3 2
// 原理: 同步任务 -> 微任务 -> 宏任务
```

### 2. This 指向与闭包
```javascript
const obj = {
  name: 'Antigravity',
  say: function() {
    setTimeout(() => console.log(this.name), 0);
  },
  say2: () => console.log(this.name)
};
obj.say();  // 'Antigravity' (箭头函数继承 say 的 this)
obj.say2(); // undefined (箭头函数指向全局/模块)
```

### 3. 异步顺序 (Async/Await)
```javascript
async function async1() {
  console.log('a');
  await async2();
  console.log('b');
}
async function async2() { console.log('c'); }
async1();
console.log('d');
// 输出: a c d b
// 原理: await 后的代码会被包装成微任务
```

<ArticleComments slug="frontend-code-output-questions" />


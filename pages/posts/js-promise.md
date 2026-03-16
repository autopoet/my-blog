---
title: JS 进阶：Promise 异步编程
date: 2025-10-05
categories:
  - 前端八股
tags:
  - JavaScript
  - 进阶
  - 异步
---

> Promise 是异步编程的一种解决方案，比回调函数更合理且更强大。

### 1. 三种状态

- **Pending**（进行中）
- **Fulfilled**（已成功）
- **Rejected**（已失败）

### 2. 常用 API

- Promise.resolve() - 返回一个 resolved 状态的 Promise
- Promise.reject() - 返回一个 rejected 状态的 Promise
- Promise.all() - 所有 Promise 都成功时返回结果数组
- Promise.race() - 第一个完成的 Promise 的结果
- Promise.allSettled() - 所有 Promise 完成后返回结果
- Promise.prototype.then() - 添加成功回调
- Promise.prototype.catch() - 添加失败回调
- Promise.prototype.finally() - 无论成功失败都执行

### 3. 示例代码

```javascript
const promise1 = Promise.resolve(3);
const promise2 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'foo');
});
const promise3 = Promise.reject('error');
Promise.all([promise1, promise2])
  .then(values => console.log(values)) // [3, "foo"]
  .catch(error => console.error(error));
Promise.race([promise1, promise2])
  .then(value => console.log(value)); // 3 (更快完成)
```

### 4. 异步（事件循环）
**题目**：解释 JavaScript 的事件循环机制
**解答**：
JavaScript 是单线程语言，通过事件循环实现异步。
**执行顺序**：
1. 执行同步代码（主线程）
2. 遇到异步任务，交给相应模块处理（如定时器、I/O）
3. 异步任务完成，回调放入任务队列
4. 主线程空闲时，检查任务队列并执行回调
**任务队列**：
1. 宏任务：script、setTimeout、setInterval、setImmediate、I/O、UI渲染
2. 微任务：Promise.then、process.nextTick、MutationObserver
**执行规则**：
1. 执行一个宏任务（从宏任务队列）
2. 执行所有微任务（清空微任务队列）
3. 如有必要渲染UI
4. 重复上述过程
```js
console.log('1'); // 同步
setTimeout(() => {
  console.log('2'); // 宏任务
}, 0);
Promise.resolve().then(() => {
  console.log('3'); // 微任务
});
console.log('4'); // 同步
// 输出顺序: 1, 4, 3, 2
```

### 5. 语法糖：




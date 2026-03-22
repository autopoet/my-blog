---
title: JS 进阶：Promise 异步编程
date: 2025-11-22
categories:
  - 啃啃原理
tags:
  - JavaScript
  - 进阶
  - 异步
  - Promise
---

> Promise 是异步编程的一种解决方案，比传统的回调函数更合理且更强大。它是一个构造函数，用于生成 Promise 实例。

## 1. 三种状态与过程

Promise 实例在其生命周期内只可能处于以下三种状态之一：

- **Pending**（进行中）：初始状态，既不是成功，也不是失败。
- **Fulfilled**（已成功）：意味着操作成功完成。
- **Rejected**（已失败）：意味着操作失败。

**状态转换规则**：

- 状态只能从 `Pending` 变为 `Fulfilled` 或 `Rejected`。
- **一旦状态改变，就不会再变**，任何时候都可以得到这个结果。
- 这两个过程通常被称为：
  - `Pending` -> `Fulfilled` : **Resolved**（已完成）
  - `Pending` -> `Rejected` : **Rejected**（已拒绝）

---

## 2. 基本用法：Executor 构造函数

通过 `new Promise()` 创建实例时，需要传入一个回调函数（称为 **executor**），它会被立即执行。

```javascript
const promise = new Promise((resolve, reject) => {
  // executor 会被立即执行，并传入 resolve 和 reject 函数
  // 异步操作
  if (/* 成功 */) {
    resolve(value); // 调用 resolve 会触发 then 的第一个回调
  } else {
    reject(error); // 调用 reject 会触发 then 的第二个回调或 catch 回调
  }
});
```

**resolve 函数的参数：**

- **情况一**：传入普通值 or 对象，该值将作为 `then` 回调的参数。
- **情况二**：传入另外一个 Promise，则原 Promise 的状态将由这个新的 Promise 决定。
- **情况三**：传入一个 **thenable** 对象（实现 `then` 方法的对象），Promise 会执行该 `then` 方法并根据结果决定状态。

---

## 3. 实例方法 (Prototype Methods)

### **then()**

`then` 方法接受两个参数：`fulfilled` 回调函数和 `rejected` 回调函数。
- 当 `then` 方法中的回调函数本身在执行时，它处于 `pending` 状态。
- 当回调函数返回一个结果时，`then` 返回的新 Promise 变为 `Fulfilled`。
- 返回结果的情况：
  - 返回一个普通的值。
  - 返回另一个 Promise。
  - 返回一个 thenable 值。
- 当回调中断并抛出异常时，新 Promise 变为 `Rejected`。

### **catch()**

用于指定发生错误时的回调函数，等同于 `.then(null, rejection)`。

### **finally()**

无论 Promise 最终状态如何，都会执行的操作。

---

## 4. 静态方法 (Static Methods)

- **Promise.resolve() / .reject()**：快速返回一个特定状态的 Promise 实例。
- **Promise.all([p1, p2, ...])**：所有 Promise 都成功时才成功，返回结果数组；只要有一个失败就立即失败。
- **Promise.race([p1, p2, ...])**：返回第一个“敲定”（无论成功失败）的 Promise 的结果。
- **Promise.allSettled([p1, p2, ...])**：等待所有 Promise 都敲定，返回一个描述每个结果的对象数组，永不失败。

---

## 5. 示例代码

```javascript
const promise1 = Promise.resolve(3);
const promise2 = new Promise((resolve, reject) => {
  setTimeout(resolve, 100, 'foo');
});
const promise3 = Promise.reject('error');

// Promise.all 示例
Promise.all([promise1, promise2])
  .then(values => console.log(values)) // [3, "foo"]
  .catch(error => console.error(error));

// Promise.race 示例
Promise.race([promise1, promise2])
  .then(value => console.log(value)); // 3 (更快完成)

// Promise.allSettled 示例
Promise.allSettled([promise1, promise2, promise3])
  .then(results => console.log(results));
// 输出:
// [
//   { status: 'fulfilled', value: 3 },
//   { status: 'fulfilled', value: 'foo' },
//   { status: 'rejected', reason: 'error' }
// ]
```

---

## 6. 异步机制与事件循环

Promise 的回调属于 **微任务 (Microtask)**。在 JavaScript 事件循环中，微任务的优先级高于宏任务。

**执行顺序规则**：

1. 执行同步代码（宏任务主线程）。（如果遇到异步任务，会将其放入对应的宏任务队列或微任务队列中）。
2. 执行微任务队列中的所有回调（如 `Promise.then`）。
3. 渲染 UI（如果需要）。
4. 执行下一个宏任务（如 `setTimeout`）。

- 宏任务：`script`、`setTimeout`、`setInterval`、`setImmediate`、I/O、UI渲染
- 微任务：`Promise.then`、`process.nextTick`、`MutationObserver`

### **示例演示**

```javascript
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

---

## 7. 语法糖：async & await

### **async/await 是 Generator 的语法糖**

- 内置执行器：Generator函数的执行必须靠执行器，不能一次执行完成
- 可读性更好：`async` 代表异步，`await` 代表等待,比起使用 `*`号和 `yield`，语义清晰明了
- 如果不使用async/await的话，Promise需要通过链式调用执行then之后的代码

### **Promise 搭配 async/await 的使用才是正解！**

- 消灭“匿名函数”:async/await基于Promise。async把promise包装了一下，async函数更简洁，不需要像promise一样需要写then，不需要写匿名函数处理promise of resolve值。
- async函数返回值是promise对象，比generator函数返回值 iterator对象更方便，可使用 await 代替then 指定下一步操作(`await==promise.then`)
- 错误处理更统一:在 Promise 中，你需要用 `.catch()`。如果有嵌套异步，报错位置很难定位。
使用 async/await，你可以直接用 `try...catch` 捕获所有异步环节的错误。

> **总结**：Promise 的出现规范了异步操作的标准化，通过链式调用解决了“回调地狱”问题。理解其状态机模型和在事件循环中的位置是掌握异步编程的关键。

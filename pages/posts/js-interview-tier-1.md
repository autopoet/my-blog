---
title: JavaScript 面试题 - 第一梯队（极高频）
date: 2025-10-27
categories:
  - 啃啃原理
tags:
  - JavaScript
  - 面试
  - 极高频
---

# JavaScript 第一梯队面试题 (极高频)

> 这些题目几乎在每个公司的前端面试中都会出现，是必须掌握的基础核心。

---

## 1. 什么是 JavaScript 事件循环 (Event Loop)？宏任务和微任务执行顺序是怎样的？

### 为什么需要事件循环
JavaScript 是 **单线程语言**，同一时间只能执行一个任务。但浏览器中存在大量异步任务（网络请求、定时器、DOM 事件等），因此需要一种机制协调同步代码和异步回调的执行顺序，这就是 Event Loop。

### 执行模型
JS 运行时主要包含：
1. **Call Stack（调用栈）**：同步代码在此执行。
2. **Web APIs / Node APIs**：处理异步操作（如 setTimeout）。
3. **Task Queue（任务队列）**：存储待执行的异步回调。

**流程：** 同步代码入栈执行 -> 遇到异步交给 Web API -> 回调进入任务队列 -> 调用栈为空时，事件循环将队列首位推入栈。

### 宏任务与微任务
- **宏任务 (MacroTask)**：script (整体代码), setTimeout, setInterval, setImmediate (Node), I/O, UI 渲染。
- **微任务 (MicroTask)**：Promise.then, MutationObserver, queueMicrotask, process.nextTick (Node)。

### 执行顺序规则
1. 执行一个宏任务（初始为 script）。
2. 执行过程中遇到微任务，放入微任务队列。
3. 宏任务执行完成，**立即清空所有微任务队列中的任务**。
4. 尝试进行页面渲染。
5. 开始下一个宏任务。

---

## 2. Promise 的状态有哪些？状态如何变化？
- **三种状态**：
    - `pending`：初始状态。
    - `fulfilled`：成功状态。
    - `rejected`：失败状态。
- **状态转换**：只能由 `pending → fulfilled` 或 `pending → rejected`。
- **特点**：状态一旦改变就不可逆（settled），且只能改变一次。

---

## 3. Promise.then 的返回值规则是什么？
`then` 总是返回一个新的 Promise，其结果取决于回调函数的执行：
1. **返回普通值**：新 Promise 状态为 fulfilled，值为该返回值。
2. **不返回 (undefined)**：新 Promise 状态为 fulfilled，值为 undefined。
3. **返回 Promise**：新 Promise 的状态和值将跟随返回的那个 Promise。
4. **抛出异常**：新 Promise 状态变为 rejected，值为捕获到的错误。

---

## 4. async / await 和 Promise 的关系是什么？
- **本质**：`async/await` 是 Promise 的语法糖，让异步代码写起来像同步代码。
- **async 函数**：返回值永远是 Promise（非 Promise 会被 `Promise.resolve` 包裹）。
- **await**：必须在 async 函数内部使用，用于等待一个变量或 Promise 的结果。
- **原理**：`await` 后面的内容会被放入微任务队列（相当于 `.then` 的回调）。

---

## 5. JavaScript 有哪些数据类型？如何判断？

### 数据类型分类 (8 种)
- **原始类型 (Primitive)**：number, string, boolean, null, undefined, symbol, bigint。
- **引用类型 (Reference)**：object (包含 Array, Function, Date, Map, Set 等)。

### 判断方法
1. **typeof**：判断基础类型（注意 `typeof null === "object"` 为历史遗留 bug）。
2. **instanceof**：基于原型链判断，适用于对象类型。
3. **Object.prototype.toString.call()**：最准确的方法，返回 `[object Type]`。

---

## 6. 原型链是什么？JavaScript 的继承是如何实现的？
- **定义**：每个对象都有 `__proto__` 指向其原型对象，原型对象又有自己的原型，直到指向 `Object.prototype` (其为 null)。这构成了原型链。
- **作用**：实现属性查找、方法复用与继承。
- **继承实现**：早期常用寄生组合继承；ES6 后使用 `class` 和 `extends`。尽管语法变了，底层依然是基于原型的委托模式。

---

## 7. 闭包是什么？有哪些应用场景？
- **定义**：函数及其词法环境的组合。简单说，就是一个函数能记忆并访问其定义时所在的词法作用域。
- **应用场景**：数据私有化（私有变量）、函数柯里化、模块化封装（IIFE）。
- **潜在问题**：如果闭包引用的变量庞大且未释放，会导致内存泄漏。

---

## 8. var / let / const 的区别是什么？
- **作用域**：`var` 是函数作用域，`let/const` 是块级作用域。
- **提升**：`var` 存在变量提升；`let/const` 也有提升但受限于暂时性死区 (TDZ)，不能在声明前访问。
- **重复声明**：`var` 允许；`let/const` 不允许。
- **修改**：`const` 声明后必须初始化且内存地址不可变。

---

## 9. 箭头函数和普通函数的区别是什么？
1. **this 绑定**：箭头函数没有自己的 this，而是继承外层作用域的 this。
2. **arguments**：箭头函数没有 arguments 对象，可用 `...rest` 代替。
3. **构造函数**：箭头函数不能作为构造函数（不能 `new`），没有 `prototype`。
4. **绑定丢失**：普通函数的 this 是调用时确定的，箭头函数的 this 是定义时确定的。

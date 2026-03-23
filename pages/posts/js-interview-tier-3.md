---
title: JavaScript 面试题 - 第三梯队（中高频）
date: 2025-12-25
categories:
  - 啃啃原理
tags:
  - JavaScript
  - 面试
  - 中高频
---

## 1. JavaScript 数组有哪些常用方法？

- **增加/删除**：`push`, `pop`, `shift`, `unshift`, `splice`。
- **查找**：`indexOf`, `find`, `findIndex`, `includes`, `some`, `every`。
- **遍历**：`forEach`, `map`, `reduce`, `filter`。
- **转换**：`join`, `toString`, `flat` (扁平化), `concat`。

---

## 2. 哪些数组方法会改变原数组？

- 常用的“修改器方法”有：
  - `push`, `pop` (末尾加/删)
  - `shift`, `unshift` (头部删/加)
  - `splice` (任意位置增删)
  - `sort` (排序)
  - `reverse` (反转)
  - `fill` (填充)

---

## 3. for...in 和 for...of 的区别是什么？

- **for...in**：用于遍历对象的**键 (key)**。会遍历整个原型链上的可枚举属性，通常用于对象。
- **for...of**：用于遍历可迭代对象的**值 (value)**。只能用于实现了 `[Symbol.iterator]` 的对象（如 Array, Map, Set, String），不会遍历原型链。

---

## 4. map 和 forEach 的区别是什么？

- **返回结果**：`map` 返回一个新的数组；`forEach` 返回 `undefined`。
- **链式调用**：因为 `map` 返回数组，所以支持后续的链式调用（如 `.map().filter()`）。
- **共性**：都不能通过 `break` 或 `continue` 中断循环。

---

## 5. reduce 的使用场景是什么？

- `reduce` 极其强大，常用于：
  - **累加/求积**：处理数据总计。
  - **数组去重**：利用累加器判断是否存在。
  - **对象属性统计**：统计字符出现频率。
  - **数据结构转化**：将数组转化为对象映射。

---

## 6. 数组去重有哪些方法？

- **Set 方案**：`[...new Set(array)]` (最推荐，代码最简练)。
- **filter 方案**：`arr.filter((item, index) => arr.indexOf(item) === index)`。
- **Map/Object 方案**：利用键的唯一性进行缓存。

---

## 7. 数组扁平化如何实现？

- **原生方法**：`arr.flat(Infinity)`。
- **递归方案**：判断每个元素是否为数组，是则递归，否则合并。
- **reduce 方案**：结合递归使用 `reduce` 拼接。

---

## 8. 如何判断一个对象是空对象？

- `Object.keys(obj).length === 0`：最常用。
- `JSON.stringify(obj) === '{}'`：简单但受限于不可枚举属性。
- `Reflect.ownKeys(obj).length === 0`：更严谨，能包含 Symbol 和不可枚举属性。

---

## 9. Object 和其他数据类型的本质区别是什么？

- **存储方式**：Object 是引用类型，存储在**堆 (Heap)** 中，通过指针引用；而原始类型存储在栈中。
- **属性动态性**：Object 可以动态添加、删除属性，而原始类型作为值是不可变的。
- **比较机制**：Object 比较的是引用地址；原始类型比较的是值本身。

---

## 10. Object.defineProperty 和 Proxy 的区别是什么？

- **defineProperty**：劫持具体属性；无法检测新增或删除属性；需要递归处理嵌套对象；性能较重。
- **Proxy**：劫持整个对象；原生支持检测新增/删除、数组下标变化；支持 13 种拦截操作；通过惰性处理提升性能。

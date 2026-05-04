---
title: JavaScript 知识拓宽与周边生态
date: 2025-12-28
categories:
  - 前端
tags:
  - JavaScript
  - 拓宽
  - 知识体系
---
<ArticleViews slug="js-system-design-and-architecture-level-4" />


## 1. JavaScript 模块化机制是什么？ESM 如何运行？

- **CommonJS (CJS)**：Node.js 默认，使用 `require/module.exports`。是动态加载，运行时确定，输出的是值的拷贝。
- **ES Module (ESM)**：浏览器与现代前端标准，使用 `import/export`。是静态编译，编译时加载，输出的是值的只读引用（绑定）。
- **运行机制**：ESM 在解析阶段建立依赖树，执行阶段再填充具体值，支持 Tree-Shaking。

---

## 2. JS 模块导入时会不会执行内部代码？

- **会执行**。无论是在 ESM 还是 CJS 中，模块在第一次被导入时其顶层作用域的代码会执行。如果模块包含 IIFE（立即调用函数表达式）或外部副作用代码，它们将立即运行且只运行一次（因为模块会被缓存）。

---

## 3. ES6 有哪些新特性？

- 常用的包括：`let/const`、箭头函数、模板字符串、解构赋值、扩展运算符、`Promise`、`Class`、`Map/Set`、`Symbol`、迭代器与生成器等。

---

## 4. class 和 function 构造函数的区别是什么？

- **语法糖**：`class` 是构造函数的语法糖，逻辑仍然基于原型。
- **提升**：构造函数支持变量提升，`class` 不支持。
- **new 调用**：`class` 必须通过 `new` 调用，否则报错；构造函数可以直接执行。
- **严谨性**：`class` 内部默认开启严格模式。

---

## 5. WeakMap 和 Map 的区别是什么？

- **键的类型**：`Map` 键可以是任意类型；`WeakMap` 键必须是**对象**或非全局登记的 Symbol。
- **垃圾回收**：`WeakMap` 对键的引用是“弱引用”。如果该键对象在外部没有其他强引用，垃圾回收机制会将其自动清除。
- **不可遍历**：由于 GC 的延迟性，`WeakMap` 不支持遍历和 `size` 属性。

---

## 6. WeakMap 的应用场景有哪些？

- **DOM 关联数据**：保存 DOM 节点的状态，当 DOM 移除后自动释放内存。
- **私有变量存储**：在类中存储私有变量，防止实例被销毁后变量残留。
- **元数据存储**：不干扰对象本身的引用生命周期。

---

## 7. typeof null 为什么是 object？

- 这是一个从 JS 第一版就带有的 **Bug**。在 JS 的最初实现中，值以二进制形式存储，前三位代表类型标识。`000` 被定义为 Object 类型，而 `null` 在大多数系统上是全零，因此被错误地识别为了 Object。

---

## 8. 为什么不可迭代对象不能用 for...of？

- `for...of` 背后的原理是调用对象的 `[Symbol.iterator]` 方法。如果对象没有实现该方法，它就不是一个“可迭代对象”，JS 引擎不知道如何分步骤输出它的值，因此会抛出错误。

<ArticleComments slug="js-system-design-and-architecture-level-4" />

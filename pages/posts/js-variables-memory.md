---
title: JS 基础：变量特性、内存管理与数组方法
date: 2025-10-23
categories:
  - 啃啃原理
tags:
  - JavaScript
  - 基础
  - 变量
  - 内存管理
---
<ArticleViews slug="js-variables-memory" />

> 本文涵盖了 JavaScript 基础中最重要的三个部分：变量声明的区别、数据类型与内存管理，以及数组常用方法的分类解析。

## 1. let、const、var 的深度对比

在 ES6 之前，我们只能使用 `var` 来声明变量。ES6 引入了 `let` 和 `const`，解决了 `var` 的诸多缺陷。

| 特性 | var | let | const |
| :--- | :--- | :--- | :--- |
| **作用域** | 函数作用域 | 块级作用域 | 块级作用域 |
| **变量提升** | 会提升（值为 undefined） | 不会提升（存在暂时性死区） | 不会提升（存在暂时性死区） |
| **重复声明** | 允许 | 不允许 | 不允许 |
| **重新赋值** | 允许 | 允许 | 不允许（常量） |
| **暂时性死区 (TDZ)** | 无 | 有 | 有 |

**const 的本质**：const 保证的不是变量的值不能改，而是变量指向的那个内存地址不能改。对于复合类型（对象、数组），修改其内部属性是允许的。

### **暂时性死区 (TDZ)**

在使用 `let/const` 声明变量之前的区域，该变量都是不可用的。这在语法上称为“暂时性死区”。

```javascript
console.log(a); // undefined (var 提升)
var a = 1;

console.log(b); // ReferenceError: Cannot access 'b' before initialization
let b = 2;
```


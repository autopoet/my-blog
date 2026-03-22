---
title: ES6+ 进阶：现代 JavaScript 常用新特性
date: 2025-11-09
categories:
  - 啃啃原理
tags:
  - JavaScript
  - ES6+
  - 进阶
---
<ArticleViews slug="js-es6-plus" />

> 从 ES6 开始，JavaScript 进入了高速迭代期。掌握这些现代语法特性，不仅能提升开发效率，还能让代码更加简洁优雅。

## 1. 解构赋值 (Destructuring)

解构可以快速从数组或对象中提取值，并赋值给变量。

```javascript
// 对象解构
const user = { name: 'Alice', age: 25, city: 'Shanghai' };
const { name, ...rest } = user;
console.log(name); // 'Alice'
console.log(rest); // { age: 25, city: 'Shanghai' }

// 数组解构
const [first, second] = [10, 20, 30];
console.log(first); // 10
```


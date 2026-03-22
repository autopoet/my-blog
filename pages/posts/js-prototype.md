---
title: JS 基础：原型与原型链
date: 2025-10-31
categories:
  - 啃啃原理
tags:
  - JavaScript
  - 基础
  - 原型
---
<ArticleViews slug="js-prototype" />

## 1. 什么是原型 (Prototype)？

- 每个函数都有一个 `prototype` 属性，指向原型对象
- 原型对象包含共享的属性和方法
- 实例通过 `__proto__` 访问其构造函数的原型


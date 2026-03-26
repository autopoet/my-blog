---
title: 核心功能手写实现：原生 JS 强化（下）
date: 2026-01-23
categories:
  - 核心技术原理
tags:
  - JavaScript
  - 函数式编程
  - 设计模式
---

<ArticleViews slug="javascript-core-functions-implementation-ii" />

> 本篇文章继续探索 JavaScript 的核心实现，涵盖函数柯里化、发布订阅模式以及原型链操作的底层逻辑模拟。

## 一、 函数范式与逻辑复用

### 1. 函数柯里化 (Currying) 的递归实现
柯里化是一种将多参数函数转化为一系列单参数函数的技术，有助于参数复用与逻辑延迟执行：
```javascript
function curry(fn, ...args) {
  return args.length >= fn.length 
    ? fn(...args) 
    : (...newArgs) => curry(fn, ...args, ...newArgs);
}
```

### 2. 发布订阅模式 (EventEmitter) 的基础架构
作为现代框架（如 Vue、Node.js）的核心设计模式，发布订阅解耦了事件的触发与响应流程：
```javascript
class EventEmitter {
  constructor() { this.events = {}; }
  on(type, cb) {
    (this.events[type] || (this.events[type] = [])).push(cb);
  }
  emit(type, ...args) {
    if (this.events[type]) {
      this.events[type].forEach(cb => cb(...args));
    }
  }
  off(type, cb) {
    if (this.events[type]) {
      this.events[type] = this.events[type].filter(fn => fn !== cb);
    }
  }
}
```

---

## 二、 数组与结构处理

### 1. 递归实现数组深度扁平化 (Flatten)
```javascript
function flatten(arr) {
  return arr.reduce((pre, cur) => 
    pre.concat(Array.isArray(cur) ? flatten(cur) : cur), []
  );
}
```

---

## 三、 模拟原生对象行为

### 1. 模拟 New 操作符的四个必经阶段
手写 `new` 能帮助我们理解构造函数调用时的 `this` 绑定与原型链映射：
```javascript
function myNew(constructor, ...args) {
  // 1. 创建空对象并链接到构造函数的原型
  const obj = Object.create(constructor.prototype);
  // 2. 绑定 this 并执行构造函数
  const result = constructor.apply(obj, args);
  // 3. 处理构造函数的返回值类型
  return (typeof result === 'object' && result !== null) ? result : obj;
}
```

### 2. 利用原型链机制模拟 Instanceof
```javascript
function myInstanceof(left, right) {
  let proto = Object.getPrototypeOf(left);
  const prototype = right.prototype;
  while (proto !== null) {
    if (proto === prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}
```

<ArticleComments slug="javascript-core-functions-implementation-ii" />

---
title: 手撕代码-前端高频手写题（二）
date: 2026-01-23
categories:
  - 写写代码
tags:
  - 前端面试
  - JavaScript
  - 手写
---
<ArticleViews slug="frontend-handwritten-questions-part2" />


> 本篇文章主要整理前端高频的手写题要求脱离框架与类库，利用原生 JS 实现核心功能函数及标准 API。无论是手写 Promise 还是实现深拷贝，其核心都在于代码的健壮性与性能效率（Big O）。面试官关注的不仅是你能不能写出来，而是你代码中的逻辑闭环——比如是否考虑了循环引用、闭包导致的内存泄漏、或者异步任务的并发控制。它反映了你将抽象逻辑转化为高性能代码的基本功。

## 题目列表

### 1. 函数柯里化 (Currying)
```javascript
function curry(fn, ...args) {
  return args.length >= fn.length 
    ? fn(...args) 
    : (...newArgs) => curry(fn, ...args, ...newArgs);
}
```

### 2. 发布订阅模式 (EventEmitter)
```javascript
class EventEmitter {
  constructor() { this.events = {}; }
  on(type, cb) {
    (this.events[type] || (this.events[type] = [])).push(cb);
  }
  emit(type, ...args) {
    if (this.events[type]) this.events[type].forEach(cb => cb(...args));
  }
  off(type, cb) {
    if (this.events[type]) {
      this.events[type] = this.events[type].filter(fn => fn !== cb);
    }
  }
}
```

### 3. 数组扁平化 (Flatten)
```javascript
function flatten(arr) {
  return arr.reduce((pre, cur) => 
    pre.concat(Array.isArray(cur) ? flatten(cur) : cur), []
  );
}
```

### 4. 模拟 new 操作符
```javascript
function myNew(constructor, ...args) {
  const obj = Object.create(constructor.prototype);
  const result = constructor.apply(obj, args);
  return (typeof result === 'object' && result !== null) ? result : obj;
}
```

### 5. 模拟 instanceof
```javascript
function myInstanceof(left, right) {
  let proto = Object.getPrototypeOf(left);
  let prototype = right.prototype;
  while (proto !== null) {
    if (proto === prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}
```

<ArticleComments slug="frontend-handwritten-questions-part2" />

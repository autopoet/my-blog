---
title: 手撕代码-前端高频手写题（一）
date: 2026-01-16
categories:
  - 写写代码
tags:
  - 前端面试
  - JavaScript
  - 手写
---
<ArticleViews slug="frontend-handwritten-questions-part1" />


> 本篇文章主要整理前端高频的手写题。要求脱离框架与类库，利用原生 JS 实现核心功能函数及标准 API。无论是手写 Promise 还是实现深拷贝，其核心都在于代码的健壮性与性能效率（Big O）。面试官关注的不仅是你能不能写出来，而是你代码中的逻辑闭环——比如是否考虑了循环引用、闭包导致的内存泄漏、或者异步任务的并发控制。它反映了你将抽象逻辑转化为高性能代码的基本功。

## 题目列表

### 1. 防抖 (Debounce)
```javascript
function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
```

### 2. 节流 (Throttle)
```javascript
function throttle(fn, delay) {
  let last = 0;
  return function (...args) {
    let now = Date.now();
    if (now - last >= delay) {
      fn.apply(this, args);
      last = now;
    }
  };
}
```

### 3. 深拷贝 (Deep Clone)
```javascript
function deepClone(obj, cache = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (cache.has(obj)) return cache.get(obj);
  
  const clone = Array.isArray(obj) ? [] : {};
  cache.set(obj, clone);
  
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) clone[key] = deepClone(obj[key], cache);
  }
  return clone;
}
```

### 4. 手写 Promise.all
```javascript
Promise.myAll = function(promises) {
  return new Promise((resolve, reject) => {
    let results = [], count = 0;
    promises.forEach((p, i) => {
      Promise.resolve(p).then(res => {
        results[i] = res;
        count++;
        if (count === promises.length) resolve(results);
      }).catch(reject);
    });
  });
};
```

<ArticleComments slug="frontend-handwritten-questions-part1" />

---
title: 核心功能手写实现：原生 JS 强化（上）
date: 2026-01-16
categories:
  - 写写代码
tags:
  - JavaScript
  - 核心实现
  - 逻辑强化
---

<ArticleViews slug="javascript-core-functions-implementation-i" />

> 本篇文章聚焦于前端开发中常用的核心功能函数手写实现，要求脱离框架与第三方类库，利用原生 JavaScript 构建稳健的标准 API。

## 一、 交互优化策略

### 1. 防抖函数 (Debounce) 的工业级实现
防抖旨在确保在指定的时间间隔内，连续触发的事件仅执行最后一次：
```javascript
function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
```

### 2. 节流函数 (Throttle) 的性能平衡
节流控制函数在固定频率内仅执行一次，有效缓解高频滚动（Scroll）或调整窗口（Resize）带来的计算开销：
```javascript
function throttle(fn, delay) {
  let last = 0;
  return function (...args) {
    const now = Date.now();
    if (now - last >= delay) {
      fn.apply(this, args);
      last = now;
    }
  };
}
```

---

## 二、 对象治理与数据拷贝

### 1. 支持循环引用的深拷贝 (Deep Clone)
利用 `WeakMap` 作为缓存机制，处理复杂的嵌套结构与循环引用，确保内存不溢出：
```javascript
function deepClone(obj, cache = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (cache.has(obj)) return cache.get(obj);
  
  const clone = Array.isArray(obj) ? [] : {};
  cache.set(obj, clone);
  
  for (let key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clone[key] = deepClone(obj[key], cache);
    }
  }
  return clone;
}
```

---

## 三、 异步流程并发控制

### 1. 模拟 Promise.all 的并行聚合
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

<ArticleComments slug="javascript-core-functions-implementation-i" />

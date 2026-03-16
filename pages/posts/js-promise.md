---
title: JS 进阶：Promise 异步编程
date: 2025-10-11
categories:
  - 前端八股
tags:
  - JavaScript
  - Promise
  - 异步
---

> Promise 是异步编程的一种解决方案，比回调函数更合理且更强大。

### 1. 三种状态

- **Pending**（进行中）
- **Fulfilled**（已成功）
- **Rejected**（已失败）

### 2. 基本用法

```javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve('成功啦！');
    } else {
      reject('出错啦...');
    }
  }, 1000);
});

promise
  .then(res => console.log(res))
  .catch(err => console.error(err));
```

### 3. 常用 API

- `Promise.all()`: 所有成功才成功。
- `Promise.race()`: 谁快就听谁的。
- `Promise.resolve()` / `Promise.reject()`: 快速返回状态。

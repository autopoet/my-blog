---
title: JavaScript 常用核心手写实现
date: 2026-04-11
categories:
  - 写写代码
tags:
  - JavaScript
  - 手写实现
---

<ArticleViews slug="javascript-essential-poly-fills" />

> 本篇文章汇总了 JavaScript 开发中最为频繁遇到的核心手写题目，包括函数增强、常用工具函数、原型链模拟以及异步处理等。

## 1. 函数柯里化 (Currying)
柯里化是一种将多参数函数转换为一系列单参数函数的技术。

```javascript
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function (...args2) {
        return curried.apply(this, args.concat(args2));
      };
    }
  };
}
```

## 2. 深拷贝 (Deep Clone)
递归实现对象的深拷贝，处理基本类型与引用类型。

```javascript
function deepClone(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;

  let newObj = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = deepClone(obj[key]);
    }
  }
  return newObj;
}
```

## 3. 防抖 (Debounce)
在事件被触发 n 秒后再执行回调，如果在这 n 秒内又被触发，则重新计时。

```javascript
function debounced(fn, time) {
  let timer;
  return function (...args) {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, time);
  };
}
```

## 4. 节流 (Throttle)
规定在一个单位时间内，只能触发一次函数。

```javascript
function throttle(fn, time) {
  let lastTime = 0;
  return function (...args) {
    let now = Date.now();

    if (now - lastTime > time) {
      fn.apply(this, args);
      lastTime = now;
    }
  };
}
```

## 5. Function.prototype.bind
```javascript
Function.prototype.myBind = function (obj, ...args) {
  const context = (obj !== null && typeof obj === 'object') ? obj : window;

  return (...args2) => {
    this.call(context, ...args, ...args2);
  };
}
```

## 6. Function.prototype.call
```javascript
Function.prototype.myCall = function (obj, ...args) {
  const context = (obj !== null && typeof obj === 'object') ? obj : window;

  const key = Symbol();
  context[key] = this;
  const result = context[key](...args);
  delete context[key];

  return result;
}
```

## 7. Function.prototype.apply
```javascript
Function.prototype.myApply = function (obj, argArray) {
  const context = (obj !== null && typeof obj === 'object') ? obj : window;

  const key = Symbol();
  context[key] = this;
  let result;
  if (!argArray) {
    result = context[key]();
  } else {
    result = context[key](...argArray);
  }
  delete context[key];

  return result;
}
```

## 8. 实现数组 reduce 方法
```javascript
Array.prototype.myReduce = function (fn, init) {
  let total;
  let list = this;
  let startIndex;

  if (list.length === 0 && arguments.length < 2) {
    throw new TypeError('error');
  }

  if (arguments.length > 1) {
    total = init;
    startIndex = 0;
  } else {
    total = list[0];
    startIndex = 1;
  }

  for (let i = startIndex; i < list.length; i++) {
    total = fn(total, list[i], i, list);
  }

  return total;
};
```

## 9. 数组拍平 (Flat)
```javascript
function myFlat(arr, depth = 1) {
  const result = [];

  arr.forEach((item) => {
    if (Array.isArray(item) && depth > 0) {
      result.push(...myFlat(item, depth - 1));
    } else {
      result.push(item);
    }
  });

  return result;
}
```

## 10. 实现 new 操作符
```javascript
function myNew(fn, ...args) {
  const obj = Object.create(fn.prototype);
  fn.apply(obj, args);
  return obj;
}
```

## 11. 实现 instanceof
```javascript
function myInstanceof(left, right) {
  let proto = Object.getPrototypeOf(left);
  const prototype = right.prototype;

  while (proto) {
    if (proto === prototype) {
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }

  return false;
}
```

## 12. 实现 Promise.all
```javascript
Promise.myAll = function (list) {
  let finishNums = 0;
  const result = [];

  return new Promise((resolve, reject) => {
    if (list.length === 0) return resolve([]);

    list.forEach((item, index) => {
      Promise.resolve(item).then(
        (res) => {
          finishNums++;
          result[index] = res;
          if (finishNums === list.length) {
            resolve(result);
          }
        },
        (err) => {
          reject(err);
        }
      );
    });
  });
};
```

<ArticleComments slug="javascript-essential-poly-fills" />

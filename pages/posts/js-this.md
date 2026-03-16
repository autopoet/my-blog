---
title: JS 基础：this 指向详解
date: 2025-10-04
categories:
  - 前端八股
tags:
  - JavaScript
  - 基础
  - this
---

> JavaScript 中的 `this` 是动态绑定的，它的值取决于函数的调用方式。

## 1. 绑定规则

- **默认绑定**：非严格模式下指向 `window`，严格模式下为 `undefined`。

```js
function foo() {
  console.log(this); // 浏览器中为 window
}
foo();
```

- **隐式绑定**：被对象调用时，`this` 指向该对象（谁调用指向谁）。

```js
const obj = {
  name: 'Alice',
  sayName: function() {
    console.log(this.name);
  }
};
obj.sayName(); // "Alice"
```

- **显式绑定**：使用 `call`、`apply`、`bind` 强制指定。

```js
const obj = {
  name: 'Alice',
  sayName: function() {
    console.log(this.name);
  }
};
obj.sayName(); // "Alice"
```

- **new 绑定**：构造函数创建实例，`this` 指向新创建的对象。

```js
function Person(name) {
  this.name = name;
}
const p = new Person('Charlie');
console.log(p.name); // "Charlie"
```

- **箭头函数**：没有自己的 `this`，继承外层作用域的 `this`。

```js
const obj = {
  name: 'Dave',
  sayName: () => {
    console.log(this.name); // 取决于外层作用域
  }
};
obj.sayName(); // 可能不是 "Dave"
```

## 2. 优先级对比

`new` 绑定 > 显式绑定 > 隐式绑定 > 默认绑定。

## 3. call / apply / bind 的区别

- call：传参是一个个传，fn.call(obj, arg1, arg2)。立即执行。
- apply：传参是数组，fn.apply(obj, [args])。立即执行。
- bind：传参和 call 一样，但它返回一个新函数，不会立即执行（常用于 Vue 或 React 的事件处理）。

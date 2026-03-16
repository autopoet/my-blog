---
title: ES6+ 进阶：现代 JavaScript 常用新特性
date: 2025-10-08
categories:
  - 前端八股
tags:
  - JavaScript
  - ES6+
  - 进阶
---

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

---

## 2. 展开与剩余运算符 (Spread / Rest)

虽然二者长得一样（都是 `...`），但用法截然相反。

- **展开 (Spread)**：将数组或对象“展开”成零散的值。
- **剩余 (Rest)**：将多个值“收拢”成一个数组。

```javascript
// 展开：浅拷贝或合并
const arr1 = [1, 2];
const arr2 = [...arr1, 3, 4]; // [1, 2, 3, 4]

// 剩余：函数参数
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b);
}
```

---

## 3. 安全导航：可选链与空值合并

这是在 **ES2020 (ES11)** 中引入的极其实用的特性，大大减少了对 `undefined` 的检查。

### **可选链 (?.)**

如果前面的值为 `null` 或 `undefined`，则直接返回 `undefined` 而不报错。

```javascript
const user = { profile: null };
// 以前：user && user.profile && user.profile.name
// 现在：
console.log(user?.profile?.name); // undefined
```

### **空值合并 (??)**

仅当左侧操作数为 `null` 或 `undefined` 时，才返回右侧操作数。与 `||` 不同，它不会过滤 `0` 或空字符串。

```javascript
const count = 0;
const result1 = count || 10; // 10 (因为 0 是 falsy)
const result2 = count ?? 10; // 0 (安全！)
```

---

## 4. 代理拦截：Proxy

`Proxy` 用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。它是 **Vue 3 响应式系统** 的核心。

```js
const p = new Proxy(target, handler);
```

```javascript
const target = { message: "hello" };
const handler = {
  get(obj, prop) {
    return prop in obj ? obj[prop] : "404 Not Found";
  }
};

const proxy = new Proxy(target, handler);
console.log(proxy.message); // hello
console.log(proxy.foo);     // 404 Not Found
```

**Proxy vs Object.defineProperty**：

1. `Proxy` 可以直接监听整个对象而非单一属性。
2. `Proxy` 可以监听数组索引和长度的变化。
3. `Proxy` 提供了多达 13 种拦截方法（trap）。

![Axios与Proxy对比](/JS-Proxy.png)

> **总结**：ES6+ 的语法不仅仅是“语法糖”，它们通过更严谨的语义（如 Proxy、Optional Chaining）极大提升了 JS 处理复杂业务逻辑的能力。

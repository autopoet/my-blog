---
title: JS 基础：原型与原型链
date: 2025-10-04
categories:
  - 前端八股
tags:
  - JavaScript
  - 基础
  - 原型

---

### 1. 什么是原型 (Prototype)？

- 每个函数都有一个 `prototype` 属性，指向原型对象
- 原型对象包含共享的属性和方法
- 实例通过 `__proto__` 访问其构造函数的原型

### 2. 什么是原型链？

- 当访问对象属性时，如果对象本身没有，会通过 `__proto__` 向上查找
- 直到找到 `Object.prototype` (顶层原型，`__proto__` 为 `null`)
- 这种链式查找机制称为原型链

### 3. 查找逻辑

- 第一站：在 `person` 对象自身找。
- 第二站：顺着 `person.__proto__` 找到 `Person.prototype` 找。
- 终点站：顺着链条一直找到 `Object.prototype`。如果到 `null` 还没找到，返回 `undefined`。

### 4. 示例代码

-  `prototype`：函数特有的属性，指向它的原型对象，里面存放着所有实例共享的方法。

-  `__proto__`：对象特有的属性，指向创建它的构造函数的 `prototype`。

- 实例.__proto__ === 构造函数.prototype

- 原型对象.constructor === 构造函数本身

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.sayHello = function() {
  console.log(`Hello, I'm ${this.name}`);
};

const person = new Person('Alice');
person.sayHello(); // 通过原型链访问方法

console.log(person.__proto__ === Person.prototype); // true
console.log(Person.prototype.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__); // null
```

### 5. 深度理解 `new`

当执行 `new Student()` 时，JS 做了三件事：

- 创建一个空对象。
- 连线：将新对象的 `__proto__` 指向 `Student.prototype`。
- 注入：将 `this` 指向新对象并运行构造函数代码。

### 6. 函数的本质

- 函数是一等公民：它既可以像普通对象一样拥有 `__proto__`（指向 `Function.prototype`），又因为它是构造函数，所以拥有 `prototype`。

- **原型链终点**：`Object.prototype.__proto__ === null`。


> 这是面试中最高频的问题之一，建议熟练背诵并能手画原型链图。

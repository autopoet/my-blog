---
title: JS 进阶：继承实现方式理解原型链
date: 2026-03-26
categories:
  - 啃啃原理
tags:
  - JavaScript
  - 原型链
  - 继承
---

<ArticleViews slug="js-prototype-inheritance" />

## 第一部分：核心前置知识

在深入继承之前，必须理解 `this` 的绑定机制与 `call` 的本质：

- **构造函数中的 this**：当使用 `new` 操作符时，`this` 指向新创建的实例对象。
- **call() 的本质**：“借用执行并手动改变 `this` 指向”。
- **Parent.call(this)**：意为立刻执行父类构造函数，但将其内部的 `this` 强行替换为当前的子类实例，从而将父类的属性“烙印”在子类身上。

---

## 第二部分：继承实现方式的演进史

### 1. 原型链继承 (Prototype Chain Inheritance)

- **核心实现**：`Child.prototype = new Parent();`
- **原理**：直接重写子类的原型对象，将其指向父类的一个实例。
- **优点**：父类原型上的方法（共享方法）可以被子类实例访问。
- **致命缺陷**：
  - **引用类型共享污染**：由于 `Child.prototype` 变成了一个具体的 `Parent` 实例，父类的引用类型属性（如数组）会被挂载到子类原型上。所有子类实例将共享同一个内存地址的数组，一个修改，全员受影响。
  - **无法传参**：实例化子类时，无法向父类构造函数传递参数。

### 2. 借用构造函数继承 (Constructor Stealing)

- **核心实现**：
  ```javascript
  function Child(name) {
      Parent.call(this, name); // 在子类内部执行父类构造逻辑
  }
  ```
- **原理**：在子类构造函数中调用 `Parent.call(this)`，将父类的实例属性拷贝到子类实例上。
- **优点**：
  - **隔离性**：每个实例拥有独立的属性副本，解决了引用类型污染。
  - **可传参**：可以向父类构造函数传递参数。
- **致命缺陷**：
  - **原型链断裂**：无法继承父类 `prototype` 上的方法（因为没连天线）。
  - **内存浪费**：方法如果写在构造函数内，每次 `new` 实例都会重新创建函数。

### 3. 组合继承 (Combination Inheritance)

- **核心实现**：融合前两者（`call` 继承属性 + 原型链继承方法）。
  ```javascript
  function Child(name, age) {
      Parent.call(this, name); // 第一次调用 Parent
  }
  Child.prototype = new Parent(); // 第二次调用 Parent
  Child.prototype.constructor = Child;
  ```
- **优点**：融合了前两者的优点，是 ES5 时代最常用的模式。
- **致命缺陷**：**性能瑕疵**。父类构造函数被执行了两次。这导致子类原型上产生了一份多余且被遮蔽的父类实例属性，造成内存冗余。

### 4. 寄生组合式继承 (Parasitic Combination Inheritance) —— 【推荐方案】

- **核心实现**：
  ```javascript
  function Child(name, age) {
      Parent.call(this, name); // 仅在这里调用一次父类
      this.age = age;
  }
  // 使用 Object.create 创建一个空对象，其 __proto__ 指向 Parent.prototype
  Child.prototype = Object.create(Parent.prototype);
  // 修复丢失的构造器指向
  Child.prototype.constructor = Child;
  ```
- **原理**：不通过 `new Parent()`，而是通过 `Object.create` 建立一个干净的中间桥梁，直接连接到父类的原型。
- **优点**：最完美的 ES5 继承方式。只调用一次父类构造函数，原型链完整，且避免了原型上的属性冗余。

### 5. ES6 class 与 extends

- **核心概念**：语法糖 (Syntactic Sugar)。底层依然基于“寄生组合式继承”。
- **super() 的意义**：ES6 规定子类没有自己的 `this`，必须先通过 `super()` 调用父类构造函数生成 `this` 后，才能对其进行加工。
- **静态继承**：`class` 额外实现了 `Child.__proto__ === Parent`，使得子类可以直接继承父类的静态方法 (Static Methods)。

---

## 第三部分：深度理解 —— 为什么需要“修复” Constructor？

- **身份丢失原因**：`Child.prototype = Object.create(...)` 是一次暴力赋值（替换）。它丢弃了原本自带 `constructor: Child` 名牌的旧原型对象，换成了一个不带名牌的“毛坯房”。
- **不修复的后果**：
  - **认祖归宗失败**：子类实例通过原型链查找 `constructor` 时会找到 `Parent`，导致实例身份识别错误。
  - **动态实例化失效**：在依赖 `new instance.constructor()` 进行同类对象克隆的底层库中，会错误地创建出父类对象，引发逻辑崩溃。

---

## 第四部分：易混淆概念辨析

| 概念 | 归属 | 职能（专业描述） |
| :--- | :--- | :--- |
| `__proto__` | 所有对象 | 隐式原型。指向其构造函数的原型对象，负责属性查找路径。 |
| `prototype` | 仅限函数 | 原型属性。指向该构造函数创建的实例所共享的公共技能池。 |
| `Object.create` | 静态方法 | 创建一个新对象，并将其隐式原型 `__proto__` 链接到参数对象上。 |

<ArticleComments slug="js-prototype-inheritance" />

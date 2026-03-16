---
title: JS 基础：变量特性、内存管理与数组方法
date: 2025-10-04
categories:
  - 前端八股
tags:
  - JavaScript
  - 基础
  - 变量
  - 内存管理
---

> 本文涵盖了 JavaScript 基础中最重要的三个部分：变量声明的区别、数据类型与内存管理，以及数组常用方法的分类解析。

### 1. let、const、var 的深度对比

在 ES6 之前，我们只能使用 `var` 来声明变量。ES6 引入了 `let` 和 `const`，解决了 `var` 的诸多缺陷。

| 特性 | var | let | const |
| :--- | :--- | :--- | :--- |
| **作用域** | 函数作用域 | 块级作用域 | 块级作用域 |
| **变量提升** | 会提升（值为 undefined） | 不会提升（存在暂时性死区） | 不会提升（存在暂时性死区） |
| **重复声明** | 允许 | 不允许 | 不允许 |
| **重新赋值** | 允许 | 允许 | 不允许（常量） |
| **暂时性死区 (TDZ)** | 无 | 有 | 有 |

**const 的本质**：const 保证的不是变量的值不能改，而是变量指向的那个内存地址不能改。对于复合类型（对象、数组），修改其内部属性是允许的。

#### **暂时性死区 (TDZ)**
在使用 `let/const` 声明变量之前的区域，该变量都是不可用的。这在语法上称为“暂时性死区”。

```javascript
console.log(a); // undefined (var 提升)
var a = 1;

console.log(b); // ReferenceError: Cannot access 'b' before initialization
let b = 2;
```

---

### 2. 数据类型判断与内存管理

#### **数据类型**
- **基本类型**：String, Number, Boolean, Null, Undefined, Symbol, BigInt。
- **引用类型**：Object (包含 Array, Function, Date, RegExp 等)。

#### **类型判断**
1. **typeof**：能判断基本类型（除 null 显示 "object"）和 function，**无法区分数组和对象**。
2. **instanceof**：判断构造函数的 `prototype` 是否在实例的原型链上。基于原型链判断。适用于判断对象家族成员（如 `arr instanceof Array`）。
3. **Object.prototype.toString.call()**：**最准确**的方法。

```javascript
Object.prototype.toString.call([]); // "[object Array]"
Object.prototype.toString.call({}); // "[object Object]"
```

#### **内存管理：堆 (Heap) 与 栈 (Stack)**
- **栈内存 (Stack)**：存储基本类型值和引用类型的**地址**。物理内存空间固定，由系统自动分配和释放，函数执行完，它的作用域直接“弹出”销毁，里面的变量瞬间清除，效率极高。
- **堆内存 (Heap)**：存储引用类型的**具体内容**。物理空间不固定，需要 JS 引擎通过垃圾回收机制释放。

#### **垃圾回收机制 (GC)**
JS 自动回收不再使用的内存。
- **引用计数 (Reference Counting)**：记录对象被引用的次数，归零时回收（易产生循环引用问题）。
  > 如果 A 引用了 B，B 也引用了 A（互相拽着对方），它们的计数器永远是 1，即使它们已经和外部断开了，也永远不会被回收。
- **标记清除 (Mark-and-Sweep)**：目前主流算法。从根部（window/global）出发，无法触达的对象即被标记并清除。
  > 完美解决了循环引用问题。如果 A 和 B 互相引用但从根部找不到它们，它们一样会被清理。

#### **全局变量 vs 局部变量**
- **局部变量**：函数跑完，如果没有闭包“拽”着它，它就失去了根部的连接，下次 GC 来的时候就被标记清除了。
- **全局变量**：生命周期最长，除非你手动设为 null 或者关闭浏览器标签页，否则它永远在“根部”名单上，不会被回收。

---

### 3. 数组常用方法全解析

根据是否改变原数组，可以将数组方法分为两大类：

#### **改变原数组的方法 (Mutating)**
> 记忆口号：*“增删三雄，排列倒转，切片替换”*
- `push()` / `pop()`：末尾增/删
- `unshift()` / `shift()`：开头增/删
- `sort()`：排序
- `reverse()`：翻转
- `splice(start, count, ...items)`：万能增删改

#### **不改变原数组的方法 (Non-mutating)**
> 记忆口号：*“映射过滤，查找合并，累加连接”*
- `slice(start, end)`：截取
- `concat()`：合并
- `map()`：映射成新数组
- `filter()`：过滤
- `reduce()`：累加计算
- `forEach()`：遍历（无返回值）
- `join()`：转字符串

```javascript
const arr = [1, 2, 3];

// 改变原数组
arr.push(4);
console.log(arr); // [1, 2, 3, 4]

// 不改变原数组
const newArr = arr.map(x => x * 2);
console.log(arr);    // [1, 2, 3, 4]
console.log(newArr); // [2, 4, 6, 8]
```

> **总结**：理解变量的作用域有助于代码安全，掌握内存机制有助于性能优化，而熟练分类数组方法则是日常业务开发的基础。

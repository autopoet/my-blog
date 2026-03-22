---
title: Node.js 相关教学
date: 2026-02-01
categories:
  - 学学技术
tags:
  - Node.js
  - 后端
  - JavaScript
---

> 运行在服务器端的 JavaScript。它不是新语言，而是新的运行时环境。

## 1. Node.js 的架构

- **V8 引擎**：由 Google 开发的高性能 JavaScript 解析引擎。
- **Libuv**：处理异步 I/O 的核心库（实现事件循环）。
- **非阻塞 I/O**：让同一线程可以并发处理成千上万个请求。

---

## 2. 模块化：CommonJS vs ESM

在 Node.js 中，我们可以自由选择两种主要的模块系统。

### **CommonJS (经典)**
```javascript
const fs = require('fs');
module.exports = { data: 'test' };
```

### **ES Module (现代)**
在 `package.json` 中设置 `"type": "module"` 后：
```javascript
import fs from 'fs';
export const data = 'test';
```

---

## 3. 核心 API：文件系统 `fs`

### **读取文件（异步）**
```javascript
import fs from 'fs/promises';

try {
  const content = await fs.readFile('./test.txt', 'utf-8');
  console.log(content);
} catch (err) {
  console.error('读取出错：', err);
}
```

> [!CAUTION]
> **切记**：在生产环境中，尽量使用异步 API（如 `fs.promises`），避免阻塞主线程（Event Loop）。

---

## 4. 总结
Node.js 极大地拓宽了前端开发者的技术栈，使其能够胜任全栈工程师。通过学习内置模块和 NPM 的海量资源，你可以快速构建高性能的后端服务。

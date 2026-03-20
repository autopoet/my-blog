---
title: Ajax, Fetch 与 Axios 核心对比
date: 2025-10-15
categories:
  - 啃啃原理
tags:
  - JavaScript
  - 网络请求
  - Axios
---

> **一句话定义**：Ajax 是一种异步通信技术方案；XMLHttpRequest (XHR) 是其最早的浏览器实现；Fetch 是现代原生的 Promise 替代品；而 Axios 是目前最流行的同构请求库。

---

## 1. 核心概念梳理

### 1.1 Ajax 与 XMLHttpRequest (XHR)

* **本质**：Ajax (Asynchronous JavaScript and XML) 并不是单一技术，而是利用 `XMLHttpRequest` 实现局部更新、避免页面刷新的 **技术集合**。
* **流程**：创建 `xhr` 对象 -> `open` 建立连接 -> `send` 发送 -> 监听 `onreadystatechange`。
* **代码示例**：

```javascript
const xhr = new XMLHttpRequest();
xhr.open('GET', '/api/data', true);
xhr.onreadystatechange = () => {
  if (xhr.readyState === 4 && xhr.status === 200) {
    console.log(xhr.responseText);
  }
};
xhr.send();
```

### 1.2 Fetch API

* **本质**：浏览器原生提供的用于替代 XHR 的 **Promise** 化 API。
* **痛点（大厂考点）**：
  * **错误处理怪异**：即便服务器返回 404 或 500，Fetch 依然会 `resolve`（只有网络故障或请求被阻止才会 `reject`）。
  * **功能原始**：原生不支持请求超时控制、上传进度监控。

### 1.3 Axios

* **本质**：基于 Promise 的 **同构**（浏览器端用 XHR，Node 环境用 `http` 模块）请求库。
* **优势**：拦截器、自动 JSON 转换、CSRF 防御、极佳的错误处理机制。

---

## 2. 三者深度对比

| 维度 | Ajax (XHR) | Fetch API | Axios (推荐) |
| :--- | :--- | :--- | :--- |
| **范式** | 回调函数 (Callback) | Promise | Promise |
| **底层实现** | 浏览器原生 | 浏览器原生 | 浏览器 (XHR) / Node (http) |
| **拦截器** | ❌ | ❌ | ✅ (请求 & 响应拦截) |
| **JSON 格式化** | ❌ (需手动) | ❌ (需手动) | ✅ (自动识别) |
| **错误判断** | ✅ (状态码手动) | ⚠️ (404 不 Reject) | ✅ (非 2xx 自动 Reject) |
| **中断/超时** | `xhr.abort()` | `AbortController` | `AbortController` |

---

## 面试真题：大厂高频考点

### Q1：既然有了原生 Fetch，为什么大厂项目依然首选 Axios？

**【核心要点】**
1. **同构性**：Axios 在 SSR（服务端渲染）场景下可以无缝切换 Node/浏览器 环境，Fetch 的实现往往不透明。
2. **切面编程 (AOP)**：Axios 强大的拦截器机制使得 Token 注入、响应码全局处理、Loading 状态切换非常优雅。
3. **安全性**：Axios 内置了简单的 CSRF 防御策略。
4. **易用性补全**：Fetch 需要写两行（`fetch` -> `.json()`），Axios 一行搞定且错误处理符合直觉。

### Q2：Axios 拦截器 (Interceptors) 的底层原理？

**【深度拆解】**
Axios 内部维护了一个 **任务队列 (Promise Chain)**。
1. 它将 `requestInterceptors` 推入数组的前端，将 `responseInterceptors` 推入数组的末端。
2. 中间夹着 `dispatchRequest`（真正的发请求函数）。
3. 通过 `while` 循环不断执行 `promise.then(chain.shift(), chain.shift())`，形成一条流水线：
   `[请求拦截器2, 请求拦截器1, 发起请求, 响应拦截器1, 响应拦截器2]`。

### Q3：如何取消一个正在进行的 HTTP 请求？

**【区分场景回答】**
* **XMLHttpRequest**：调用 `xhr.abort()`。
* **Fetch**：使用 `AbortController` 信号（Signal）。
* **Axios**：推荐统一使用 `AbortController`，与标准对齐。

### Q4：Ajax 跨域请求时，Cookie 为什么不生效？

**【避坑点】**
Ajax 跨域默认不携带身份凭证。
1. **前端**：需设置 `withCredentials: true`。
2. **后端**：CORS 策略中的 `Access-Control-Allow-Credentials` 必须设为 `true`，且 `Access-Control-Allow-Origin` 不能设为 `*`（必须是具体域名）。


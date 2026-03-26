---
title: Ajax, Fetch 与 Axios 核心对比
date: 2025-11-18
categories:
  - 啃啃原理
tags:
  - JavaScript
  - 网络请求
  - Axios
---
<ArticleViews slug="js-async-requests" />


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
* **核心局限与挑战**：
  * **错误处理机制**：即使服务器返回 404 或 500 状态码，Fetch 依然会执行 `resolve` 逻辑（仅在网络故障或请求被阻止时才会 `reject`），这要求开发者进行额外的手动状态校验。
  * **功能基座较薄**：原生 Fetch 不支持请求超时控制、上传进度监控及请求拦截器等高级工程化特性。

### 1.3 Axios

* **本质**：基于 Promise 的 **同构**（网络层在浏览器端封装 XHR，Node 环境封装 `http` 模块）网络请求库。
* **核心优势**：提供强大的拦截器机制、自动 JSON 转换、CSRF 安全防御以及更符合直觉的错误处理链路。

---

## 2. 三者技术深度对比

| 维度 | Ajax (XHR) | Fetch API | Axios (推荐) |
| :--- | :--- | :--- | :--- |
| **编程范式** | 回调函数 (Callback) | Promise | Promise |
| **底层实现** | 宿主环境原生 | 宿主环境原生 | 浏览器 (XHR) / Node (http) |
| **切面编程** | ❌ | ❌ | ✅ (请求 & 响应拦截) |
| **自动化处理** | ❌ (需手动格式化) | ❌ (需手动格式化) | ✅ (自动识别 JSON) |
| **错误容错率** | ✅ (状态码需手动判断) | ⚠️ (404/500 不 Reject) | ✅ (非 2xx 自动 Reject) |
| **中断与超时** | `xhr.abort()` | `AbortController` | `AbortController` |

---

## 3. 技术进阶与工程实践

### 3.1 既然有了原生 Fetch，为什么现代工程化项目依然首选 Axios？

**【技术解析】**
1. **环境自适应（同构设计）**：Axios 在 SSR（服务端渲染）架构下能自动适配 Node 或浏览器网络环境，而 Fetch 的具体实现往往依赖于具体的 Polyfill 或宿主能力。
2. **切面编程能力 (AOP)**：Axios 完善的拦截器机制允许开发者以流水线方式注入 Token、全局处理业务响应码（如 Token 过期自动登出）、统筹 Loading 状态，代码组织极为优雅。
3. **内置防御机制**：Axios 在封装层集成了针对 CSRF 攻击的基础防御策略。
4. **易用性与鲁棒性**：Fetch 在获取响应体时通常需要 `fetch().then(r => r.json())` 两步走，而 Axios 通过内置解析器将单次请求闭环，且错误处理逻辑更贴合实际业务需求。

### 3.2 Axios 拦截器 (Interceptors) 的底层设计模式

**【深度剖析】**
Axios 内部采用了 **Promise 链式传递** 的设计模式来构建任务流水线：
1. 它将 `requestInterceptors` 逐个压入任务队列的头部（Head），将 `responseInterceptors` 压入队列的尾部（Tail）。
2. 发起请求的 `dispatchRequest` 函数被放置在队列正中心。
3. 通过一个经典的 `while` 循环结构，利用 `promise.then(chain.shift(), chain.shift())` 逐步消耗并执行这条链路：
   `[请求拦截器 B, 请求拦截器 A, 发起请求动作, 响应拦截器 A, 响应拦截器 B]`。

### 3.3 HTTP 请求的撤销与并发控制

**【方案对比】**
* **XMLHttpRequest**：调用实例原生的 `xhr.abort()` 方法。
* **Fetch**：引入 `AbortController` 控制器，通过 `signal` 信号量实现异步操作的终止。
* **Axios**：推荐采用符合 Web 标准的 `AbortController` 方案，确保在跨框架场景下的技术一致性。

### 3.4 跨域请求中的身份凭证 (Cookie) 处理

**【工程踩坑点】**
在涉及跨域访问时，网络请求默认不携带敏感身份凭证：
1. **客户端配置**：必须显式设置 `withCredentials: true`。
2. **服务端配置**：CORS 响应头中 `Access-Control-Allow-Credentials` 必须声明为 `true`，且 `Access-Control-Allow-Origin` 应指向具体的源域名而非通配符 `*`。

<ArticleComments slug="js-async-requests" />

---
title: my-blog：全栈交互体验（上）- 浏览量统计
date: 2026-03-06
categories:
  - 聊聊项目
tags:
  - my-blog
  - 面试
  - 全栈思维
---

<ArticleViews slug="project-highlight-pageviews" />

## 1. 简历上的项目亮点描述

> **核心亮点：构建基于 Serverless 的全栈交互引擎（包含浏览量统计与动态评论）**
> *   **项目介绍**：基于 **Vue 3** & Valaxy 开发的静态博客。引入轻量级 **Serverless** 架构与原生 API 渲染优化策略，打造全栈功能拓展与极致首屏体验。
> *   **后端微服务交互**：独立开发基于边缘函数的微服务集合。利用 Upstash Redis的 `INCR` 与 `LPUSH` 等**原子操作**解决高并发下的**数据竞争与多重写入阻塞**脏读问题。
> *   **前端深度状态流转**：结合 Vue `onMounted` 生命周期规避 **SSG 预编译环境**对真实请求的污染。在前端评论组件中主导了网络请求封装与表单状态防抖；更基于**乐观更新（Optimistic UI）**策略完成视图渲染，在通过 Vue 模板安全转义防范 **XSS 注入**的同时，极致提升了动态发布时的用户感知速度。

---

## 2. 功能背景：为什么做？有什么好处？学到了什么？

*   **为什么要实现这个功能？**
    传统的纯静态博客没有后端服务器，无法记录用户的交互数据。为了让简历体现出“前后端数据交互”的全栈能力，并解决纯前端项目“没有真实后端数据支撑”的痛点，我们需要引入一个数据持久化方案。
*   **有什么好处？**
    *   **极低成本**：使用 Serverless（边缘函数）和免费的云端 Redis，不需要自己购买服务器或维护后端环境。
    *   **高性能**：Serverless 边缘函数和 Redis 内存数据库响应极快，不会拖慢博客原本的极速加载体验。
*   **我们能从中学习到什么？**
    *   熟悉了**前后端分离**的数据交互链路（前端发请求 -> 后端接口处理逻辑 -> 操作数据库 -> 返回数据渲染）。
    *   理解了无服务器架构（Serverless）的思想，以及利用环境变量保护敏感密钥的安全意识。
    *   掌握了 Redis 的核心特性（内存级高速 KV 存储、单线程执行带来的原子性优势）。

---

## 3. 核心代码逐行深度解析

以下是对代码的逐行拆解，你需要完全理解每行代码的意义，才能在被问到细节时不慌。

### 3.1 前端：Vue 组件代码 (`components/ArticleViews.vue`)

```vue
<script setup>
// 【逻辑】引入 Vue3 Composition API 的核心函数。
import { ref, onMounted } from 'vue'

// 【逻辑】定义组件接收的入参 (props)。这里接收一个 `slug`（文章的唯一英文标识）。
// 【考点】组件化思想。通过传入不同的 slug，同一个组件可以复用在任意文章中，实现解耦。
const props = defineProps({
  slug: {
    type: String,
    required: true // 指定为必传，提升组件健壮性
  }
})

// 【逻辑】定义响应式变量。views存浏览量数字，isLoading存当前的加载状态。
// 【考点】响应式原理。数据改变时，Vue 会自动拦截并触发视图更新。
const views = ref(null)
const isLoading = ref(true)

// 【逻辑】在组件挂载到真实 DOM 后，触发内部的异步回调函数。
// 【考点】Vue 生命周期。由于构建静态博客(SSG)时也会执行一次 Vue 代码，如果在 setup 顶层直接发网络请求，打包时就会不断请求数据库。`onMounted` 确保只有真实用户的浏览器打开页面、且 DOM ready 后，才会去触发真实的网络请求。
onMounted(async () => {
  try {
    // 【逻辑】使用原生 fetch 发起 GET 请求，请求同域名下的 `/api/views` 并携带参数。
    // 【考点】网络基础与同源策略。因为请求的是同域名接口，所以不会触发跨域(CORS)拦截。
    const response = await fetch(`/api/views?slug=${props.slug}`)

    // 【逻辑】异步解析后端返回的 JSON 数据。
    const data = await response.json()

    // 【逻辑】将真实的浏览量赋值给响应式变量，触发页面重绘。
    views.value = data.views
  } catch (err) {
    // 【逻辑】容错处理：断网或接口报错时，在控制台打印并设置默认值 0，防止页面显示异常。
    console.error('获取浏览量失败', err)
    views.value = 0
  } finally {
    // 【逻辑】无论成功或失败，都停止 loading 状态。
    // 【考点】Promise 的 finally 机制，用于执行必须的收尾清理工作。
    isLoading.value = false
  }
})
</script>

<template>
  <span class="article-views">
    <i class="i-ri-eye-line mr-1" />
    <!-- 【逻辑】根据 isLoading 状态决定渲染加载文案还是具体数字。 -->
    <!-- 【考点】条件渲染。v-if 根据条件动态创建或销毁 DOM 节点，由于加载状态只显示一次，所以用 v-if 更好。 -->
    <span v-if="isLoading">加载中...</span>
    <span v-else>{{ views }}</span>
    浏览
  </span>
</template>
```

### 3.2 后端：Serverless 接口代码 (`api/views.js`)

```javascript
// 【逻辑】导出一个默认异步函数，Vercel 会自动将其识别并部署为后端的 API 接口。
// req 表示请求对象，res 表示响应对象。
export default async function handler(req, res) {

  // 【逻辑】从请求的 URL 中提取查询参数 `slug`。
  const { slug } = req.query;

  // 【逻辑】参数校验：如果前端恶意请求没传参数，直接阻断逻辑。
  if (!slug) {
    // 【考点】HTTP 状态码。400 代表 Bad Request（客户端请求错误）。
    return res.status(400).json({ error: '缺少参数 slug' });
  }

  // 【逻辑】从环境变量读取 Redis 的连接地址和密钥。
  // 【考点】工程安全。重要密钥切忌硬编码在代码中提交到 Github，应放在运行环境的配置中隔离保护。
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  // 【逻辑】容错降级：如果本地开发忘记配环境变量，直接返回 0 让前端能展示，不导致服务奔溃。
  if (!url || !token) {
    return res.status(200).json({ views: 0 });
  }

  try {
    // 【逻辑】向云端 Redis 发起 HTTP 请求执行 `INCR pageviews:前端面试题` 命令。
    // headers 携带鉴权 Token 证明你有访问数据库的权限。
    const response = await fetch(`${url}/incr/pageviews:${slug}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // 【逻辑】反序列化 Redis 返回的 JSON 结果。
    const data = await response.json();

    // 【逻辑】将因为自增操作返回的最新数值随 HTTP 200 状态码发还给前端。
    // 【考点】HTTP 状态码。200 代表请求完全成功 (OK)。
    return res.status(200).json({ views: data.result });
  } catch (error) {
    // 【逻辑】捕获连接 Redis 时可能发生的网络超时等异常。
    console.error('Redis 请求报错:', error);
    // 【考点】HTTP 状态码。500 代表 Internal Server Error（服务器内部出错）。
    return res.status(500).json({ error: '服务器内部错误' });
  }
}
```

---

## 4. 模拟面试：高频“八股”与对答策略

面试官如果对你的项目感兴趣，大概率会根据这里的技术点展开以下提问。

### 场景一：深挖并发、Redis与数据竞争（最核心的含金量）
**面试官提问：** “这个功能其实就是加 1，如果你不用 Redis，自己用 Node fs 存一个普通 json 文件来记录行不行？为什么专门用 Redis？”

**你的完美回答：**
“为了应对并发访问可能导致的**数据竞争（Race Condition）**问题，用普通文件是**绝对不行**的。
因为用文件存的逻辑是：读数据 -> 内存中+1 -> 写回文件。如果有 A 和 B 这两个用户**同时**访问：
1. A 读取文件发现数值 is 100。
2. 由于 A 还没来得及写回，B `同时` 读取文件，拿到的也是 100。
3. A 把 101 写回文件，B 把 101 写回文件。
实际上两次访问，数值却只涨了 1（脏读导致了更新丢失）。

而使用了 Redis 就是专业解法，因为我调用了 Redis 的 `INCR` (Increment) 命令，这个命令具有**原子性（Atomicity）**。由于 Redis 处理命令是**单线程**模型，即使一百万人同时并发请求，它也会像排队一样一个个执行加 1 操作，无法被中断，**绝对保证数据正确无误**。考虑到未来可能的高并发，我运用了这种后端常见的并发安全思想。”

### 场景二：深挖前端生命周期时机 (SSR 与 CSR 差异)
**面试官提问：** “为什么你的请求要包在 `onMounted` 里？如果写在最外层（或者 Vue2 的 `created` 里）会发生什么？”

**你的完美回答：**
“因为我的博客是用 Valaxy 框架在 Vercel 预编译构建 HTML 静态页面的（属于 SSG/SSR 体系）。
如果我在组件的 setup 顶层甚至 created 里发请求，**在云端打包构建的时候**（非真实用户浏览器环境），这个代码也会执行去调我的接口。这会导致构建服务器凭空增加数据量，并且还会把加载请求阻塞在构建阶段。
而 `onMounted` 生命周期明确保证：这段代码**只在真实用户的客户端浏览器完成 DOM 挂载之后**才会触发，这既确保了统计的真实性，也不干扰客户端的首次页面渲染（FP），是获取数据的最佳时机。”

### 场景三：深挖网络协议与跨域 (CORS)
**面试官提问：** “你的前端向后端的 `/api/views` 请求数据，在浏览器里没报错吗？平时前端调后端接口很容易遇到跨域问题，你怎么处理的？”

**你的完美回答：**
“因为我的前端页面和 `/api` 目录下的 Serverless 端，是部署在一起的。根据浏览器的**同源策略安全机制**，只要**协议、域名、端口**这三者完全一样，就不算跨域。所以我不需要特殊处理。

（主动抛出懂跨域的证明）：如果以后我的接口抽出去了，变成了 `api.abc.com`，这就会触发跨域。
纯本地测试时，我可以在 `Vite.config` 中配置代理服务器转发；如果是线上环境，必须让服务端的接口加上响应头 `Access-Control-Allow-Origin: *` 支持 CORS，前端才能拿到数据。”

### 场景四：深挖容错与健壮性 (Elegant Degradation)
**面试官提问：** “如果 Upstash 数据库突然瘫痪连不上了，接口抛异常，会导致你的整个文章页面白屏或者崩溃吗？”

**你的完美回答：**
“完全不会，我在代码里落实了前端**‘优雅降级（Graceful Degradation）’**的思想。
我使用 `try-catch-finally` 包裹了 await 请求逻辑。如果服务挂掉抛出异常，catch 块捕捉它并在底层安静地输出给控制台，同时强制给响应式变量赋一个保底数字 `0`。然后 `finally` 阶段保证关闭 loading 骨架。
对于用户来说，极端情况也只是看到‘0浏览’字样，绝不牵连、阻塞博客的正文渲染。以不伤大雅的细节缺失，保全了整个页面核心内容的高可用。”


<ArticleComments slug="project-highlight-pageviews" />

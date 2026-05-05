<p align="center">
  <img src="./public/logo.png" width="120" height="120" alt="想想的学习笔记 logo" style="border-radius: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
</p>

<h1 align="center">想想的学习笔记</h1>

<p align="center">
  <strong>一个记录技术学习、工程实践与思考成长的个人博客</strong>
</p>

<p align="center">
  <a href="https://vuejs.org/">
    <img src="https://img.shields.io/badge/Vue-3.x-42b883?style=flat-square&logo=vue.js" alt="Vue 3" />
  </a>
  <a href="https://valaxy.site/">
    <img src="https://img.shields.io/badge/Valaxy-SSG-6200ee?style=flat-square&logo=visualstudiocode" alt="Valaxy" />
  </a>
  <a href="https://upstash.com/">
    <img src="https://img.shields.io/badge/Redis-Upstash-ff0000?style=flat-square&logo=redis" alt="Upstash Redis" />
  </a>
  <a href="https://vercel.com/">
    <img src="https://img.shields.io/badge/Vercel-Serverless-000000?style=flat-square&logo=vercel" alt="Vercel" />
  </a>
</p>

---

## 为什么要做这个项目？

我是一名正在持续学习计算机技术的学生。在过去的一段时间里，我习惯使用 **Typora** 在本地记录笔记。虽然 Typora 的书写体验极佳，但随着笔记数量的增加，我发现：

1. **查阅不便**：本地笔记散落在不同文件夹，难以实现快速的交叉索引和随时随地的复习。
2. **缺乏交流**：学习是一个输入与输出的过程，我希望有一个平台能将我的所思所想分享给更多志同道合的朋友，在交流中共同进步。

因此，我决定通过二次开发优秀开源项目，搭建这个属于我自己的学习笔记与技术博客站点。

## 在原作者基础上的学习与思考

本项目基于 [YunYouJun/valaxy](https://github.com/YunYouJun/valaxy) 进行二次开发。在阅读和修改源码的过程中，我收获颇丰：

- **深度理解 SSG (静态站点生成)**：通过 Valaxy 了解到 Vite 驱动的预渲染机制，理解了为什么静态站点能拥有如此快的首屏加载速度。
- **插件化架构思想**：原作者将主题、搜索、评论等功能高度插件化，这种解耦的设计思路对我以后设计组件和系统有很大的启发。
- **现代化工具链**：第一次在实战中深度接触 **UnoCSS**（原子化 CSS）和 **Vue 3 Composition API**，深刻体会到了开发效率的提升。

## 我做了哪些改进？

为了让博客更符合我的使用习惯和学习需求，我重点围绕着**知识整理体验**、**前端首屏优化**与**后端全栈交互**进行了以下功能的改造与设计：

### 1. 构建基于 Serverless 的轻量级全栈交互引擎

- **改进原因**：传统静态站点无法记录访客的浏览量与交互留言，缺乏社区生命力。
- **实现方案**：独立开发基于 Node.js Vercel 边缘函数的跨端微服务。利用 Upstash Redis 的 `INCR` 和 `LPUSH` 等**原子操作**有效解决高并发下的数据竞争与脏读问题。
- **前端深度集成**：在自研的 Vue 评论组件中主导了表单状态防抖；基于**乐观更新（Optimistic UI）**策略完成视图的瞬间更新，极大地提升了用户感知的动态发布体验；同时，通过 Vue 模板层面的严格转义严密拦截了**跨站脚本（XSS）注入攻击**，实现了一套极简但高标准的闭环全栈功能。

### 2. 基于底层原生 API 的首屏渲染调优 (v-lazy)

- **改进原因**：作为个人知识库，多媒体与代码截图经常拖慢首屏加载，抢占核心资源（js/css）的网络带宽。
- **实现方案**：摒弃传统但昂贵的 `window.addEventListener('scroll')` 等原生监听位置的写法，自研并全站接入 Vue 懒加载自定义指令 `v-lazy`。
- **性能红利**：深度运用浏览器底层的异步 `IntersectionObserver` API 进行跨区交叉监测。不仅大幅降低了运行时的内存开销，还彻底根除了因频繁获取 `offsetTop` 尺寸信息引发的浏览器**强迫同步布局（频繁重排）**底层隐患，让整个长列表和多图文章的滚动始终如丝般顺滑。

### 3. 构建结构化“八股文”面试知识库

- **改进原因**：作为学生，沉淀并内化面试考点是核心诉求。
- **实现方案**：深入梳理了包括但不限于 Vue 响应式原理、计算机网络、JS 底层执行机制与高频手写题的核心脉络，利用自动化路由体系随时提供极速且系统化的沉浸式复习体验。

## 内容方向

- **前端**：HTML、CSS、JavaScript、Vue、React 与工程化实践。
- **AI**：机器学习基础、模型评估、特征工程与后续学习笔记。
- **大数据**：数据分析、数据挖掘、数据仓库、Hadoop、Spark、Hive 等专业方向内容。
- **计算机基础**：网络、操作系统、数据结构与常见工程基础。
- **项目实践**：个人项目、实习准备、功能实现与踩坑记录。
- **碎碎念**：学习方法、阶段复盘、工具使用和一些成长思考。

## 技术栈

- **前端框架**: Vue 3.x (Composition API)
- **静态生成**: Valaxy (Vite-based SSG)
- **自定义指令系统**: 原生 TypeScript + Vue Directives
- **后端支持**: Vercel Serverless Functions
- **高性能云数据库**: Upstash Redis
- **样式方案**: UnoCSS (原子化 CSS)
- **部署自动化**: GitHub Actions + Vercel

## 快速开始

如果你也想基于此架构搭建自己的博客：

```bash
# 1. 克隆项目
git clone https://github.com/autopoet/my-blog.git

# 2. 安装依赖 (推荐使用 pnpm)
pnpm install

# 3. 运行预览
pnpm run dev

# 4. 构建 (SSG)
pnpm run build
```

---

> **致谢**：特别感谢 [YunYouJun](https://github.com/YunYouJun) 提供的极其优秀的开源框架 Valaxy。没有巨人的肩膀，就没有现在的视野。

<p align="center">
  期待与你在学习、工程与思考的路上相遇。
</p>

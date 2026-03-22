---
title: 前端工程化高频面试题
date: 2026-03-22
categories:
  - 啃啃原理
tags:
  - 工程化
  - 面试
  - 构建工具
---
<ArticleViews slug="frontend-engineering-high-frequency-questions" />

## 一、 错误捕获与白屏问题排查

### Q1：你在项目中是如何捕获 JavaScript 错误的？有哪些方式？

**答：**
- 使用 **try...catch** 捕获同步代码错误
- 利用 **window.onerror** 捕获运行时错误
- 使用 **window.addEventListener('unhandledrejection')** 捕获未处理的 Promise 异常
- 使用 **ErrorBoundary**（React 项目）捕获组件渲染错误
- **日志上报（埋点）系统** + **source map** 映射调试

### Q2：项目上线出现白屏问题，你是如何排查的？

**答：**
- 检查是否有**主 JS 加载失败**（查看 Chrome DevTools Network）
- 查看是否有**资源跨域**、**CDN 缓存**、**source map 报错**等问题
- 控制台是否有报错（如**模块加载失败**、**运行时错误**）
- **index.html** 是否渲染，或根组件是否挂载成功
- 加入 **loading skeleton** 或 **fallback** 机制防止页面完全空白
- 使用**性能监控平台**（如 Sentry 等开源库 or 公司自研的平台）追踪首屏渲染失败


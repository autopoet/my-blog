---
title: Vite 基础教程
date: 2025-11-12
categories:
  - 学学技术
tags:
  - Vite
  - 前端工具
  - 构建工具
---
<ArticleViews slug="vite-basics" />

> 为什么 Vite 这么快？因为它利用了浏览器原生的 ES 模块 (ESM)。

## 1. 为什么选择 Vite？

| 特性 | Webpack (传统) | Vite (现代) |
| :--- | :--- | :--- |
| **冷启动** | 慢 (需要先打包才能运行) | **快** (按需编译) |
| **HMR (热更新)** | 随着文件增多而变慢 | **恒定** (由于缓存机制) |
| **配置复杂度** | 较高 (loader/plugin 繁琐) | **开箱即用** (配置极简) |


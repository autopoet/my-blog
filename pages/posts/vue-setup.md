---
title: Vue 安装与项目创建
date: 2025-11-10
categories:
  - 前端
tags:
  - Vue
  - 脚手架
  - 前端工具
---
<ArticleViews slug="vue-setup" />


> 开启 Vue 开发之旅的第一步是环境搭建。本文将介绍从 CDN 引入到现代脚手架工具的多种安装方式，并告诉你开发者的主流选择。

## 1. Vue 的三种安装方式

### （1）CDN 引入（初学者/简单练习）
直接在 HTML 中通过 `<script>` 标签引入。适合快速原型开发或在现有项目中局部使用 Vue。
```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
```

### （2）Vue CLI（传统方式 / 基于 Webpack）
曾经是官方标准，现在进入维护阶段。适合旧项目的维护。
```bash
npm install -g @vue/cli
vue create my-project
```

### （3）Create-Vue / Vite（现代方式 / 官方推荐） ✅
这是目前 **Vue 官方最推荐** 的方式。它基于 Vite，启动速度极快，开发体验极佳。
```bash
npm create vue@latest
```

---

## 2. 什么是脚手架 (Scaffolding)？

脚手架就像是一个“项目模板生成器”。它可以帮你自动完成：
-   目录结构创建。
-   配置 Webpack/Vite 构建环境。
-   配置 Babel/TypeScript 转换。
-   配置单元测试与 Lint 检查。
-   **一键运行**：只需 `npm run dev` 即可开始开发。

---

## 3. 创建你的第一个 Vue 文件

Vue 推荐使用 **SFC（单文件组件）**，文件后缀为 `.vue`。一个典型的 Vue 文件包含三个部分：

```vue
<!-- 1. 结构 (HTML) -->
<template>
  <div class="hello">
    <h1>{{ message }}</h1>
  </div>
</template>

<!-- 2. 逻辑 (JavaScript/TypeScript) -->
<script setup>
import { ref } from 'vue'
const message = ref('你好，Vue！')
</script>

<!-- 3. 样式 (CSS) -->
<style scoped>
.hello {
  color: #42b983;
}
</style>
```

---

## 4. 开发者一般用哪种方法？

目前行业内的 **标准选择** 是：**Vite (create-vue)**。

**原因：**
1.  **快**：由于利用了浏览器原生的 ES 模块，开发环境启动和热更新几乎是秒开。
2.  **轻量**：配置项极简，开箱即用。
3.  **官方支持**：Vue 核心团队已经将重心全面转向 Vite 生态。

> [!TIP]
> 如果你是刚开始学习，建议先在 CodeSandbox 等在线环境玩一下，然后直接上 **Vite** 的本地开发环境。

<ArticleComments slug="vue-setup" />

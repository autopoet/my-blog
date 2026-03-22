---
title: Vue 安装与项目创建
date: 2025-11-10
categories:
  - 学学技术
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


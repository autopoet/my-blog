---
title: Vue 实战类高频面试题 (Vue 3)
date: 2025-12-18
categories:
  - 啃啃原理
tags:
  - Vue
  - 核心
  - 面试
---
<ArticleViews slug="vue-practical-high-frequency-questions" />

# Vue 实战类高频面试题

## 1. v-if 与 v-show 的区别

| 特性 | v-if | v-show |
| :--- | :--- | :--- |
| **实现方式** | 条件为 true 时渲染元素，false 时销毁 DOM | DOM 一直存在，通过 CSS 的 display 控制显示/隐藏 |
| **渲染开销** | 条件切换时会销毁/重建 DOM，开销大 | 初始渲染时渲染 DOM，切换显示隐藏开销小 |
| **适用场景** | 条件不频繁切换，如页面入口、动态表单字段 | 条件频繁切换，如标签页切换、弹窗显示隐藏 |
| **生命周期** | 切换会触发组件的 created/mounted/unmounted | 生命周期只在初始渲染时触发，不会重复执行 |

**补充说明：**
- `v-if` 在条件很少变化的场景性能更优，因为避免了初始不必要的渲染。
- `v-show` 初始渲染消耗高，但切换速度快，适合频繁显示隐藏的场景。


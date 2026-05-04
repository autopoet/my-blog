---
title: 路由与状态管理
date: 2025-12-15
categories:
  - 前端
tags:
  - Vue
  - Vue Router
  - Pinia
---
<ArticleViews slug="vue-router-and-state-management" />


## 1. Vue Router 的导航守卫有哪些？分别用于什么场景

Vue Router 的导航守卫可以分为三类：**全局守卫、路由独享守卫和组件内守卫**

**全局守卫**中，beforeEach 会在每次路由跳转开始时最先执行，常用于登录状态校验、权限判断和路由白名单控制。如果不满足条件，可以中断或重定向导航。beforeResolve 会在所有守卫执行完成、组件渲染之前触发，适合依赖最终路由状态的逻辑，例如精确埋点或确认跳转结果。afterEach 在路由跳转完成后执行，不能中断导航，一般用于页面访问统计、修改 document.title 等纯副作用操作。

**路由独享守卫**通过在路由配置中使用 beforeEnter 定义，只对某一个路由生效，适合某些页面有特殊权限或前置条件判断的场景，避免将逻辑写进全局守卫。

**组件内守卫**定义在组件内部，包括 beforeRouteEnter、beforeRouteUpdate 和 beforeRouteLeave。进入组件前可以做数据校验或权限确认，离开组件时常用于表单未保存的离开提示。

### 总结与实践
Vue Router 导航守卫提供了精细的跳转控制能力：全局守卫处理通用逻辑（如鉴权），路由独享守卫处理特定路由逻辑，组件内守卫则聚焦于页面生命周期相关的数据校验或用户交互确认。

---

## 2. Pinia / Vuex 的核心概念？为什么需要集中式状态管理？

Pinia 和 Vuex 都是 Vue 的集中式状态管理方案，其核心目的是在多个组件之间共享状态，并保证数据流清晰、可控。

核心概念包括 State、Getter、Action 和 Mutation（Vuex 中）。State 用于存储全局共享数据，Getter 用于派生状态，类似计算属性，Action 负责处理业务逻辑和异步操作，在 Vuex 中最终通过 Mutation 修改状态。Pinia 去除了 Mutation 的概念，直接在 Action 中修改 State，使模型更加简单直观。

集中式状态管理的价值在于避免多组件之间通过层层 props 或事件传递共享数据，统一管理全局状态，使数据来源清晰、修改路径可追踪，有利于大型中后台项目的维护和扩展。

### 总结与实践
在复杂应用中，集中式状态管理是解耦组件依赖、统一数据流向的核心手段。Pinia 通过更轻量的设计与对组合式 API 的原生支持，显著提升了状态定义的直观性与开发效率，是现代 Vue 项目的首选方案。

<ArticleComments slug="vue-router-and-state-management" />

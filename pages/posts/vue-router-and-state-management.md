---
title: 路由与状态管理
date: 2025-12-09
categories:
  - 啃啃原理
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

### 面试话术
Vue Router 的守卫用于控制路由跳转流程，全局守卫适合通用的权限和登录控制，路由独享守卫适合单页面特殊逻辑，组件内守卫更关注页面级生命周期和用户操作控制。



<ArticleComments slug="vue-router-and-state-management" />

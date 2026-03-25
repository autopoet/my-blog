---
title: CampusHub：基于状态与路由的跨页面缓存隔离
date: 2026-03-18
categories:
  - 聊聊项目
tags:
  - 面试
  - CampusHub
  - Vue Router
  - Pinia
---

<ArticleViews slug="campushub-highlight-pinia" />

## 1. 为什么要做这个优化？
在之前的许多原生 HTML 页面中（多页应用 MPA），点击链接会产生白屏并在新页面重新走一遍所有流程。
但 CampusHub 是基于 Vue3 架构的**单页应用（SPA）**。在组队平台中，大量相似的页面如『A 同学的个人主页』和『B 同学的个人主页』往往共用同一个 `<UserProfile />` 组件，而只是 `url` 的末尾 `ID` 变成了 `?id=A` 和 `?id=B`。
这就引出了一头 Vue 当中隐藏极深的恶兽——**状态污染（脏读内存泄漏）**。当我在短时间内从 A 的主页跳到 B 的主页，Vue 为了底层性能，它并不会把 A 的主页 DOM 销毁再建一遍 B，而是采用了**就地原样组件复用（Patch 算法更新）**。
如果全局响应式对象 Pinia 中的旧数据没清理干净，B 的主页会在新数据请求回来前的一瞬间“闹鬼般”展现 A 同学的数据。

## 2. 关键源码解释

如果不借助原生拦截的武器，页面很容易发生闪烁，用户体验极差。

### 【武器 1：Pinia Store 的规范化声明】
我们必须为数据仓库配置能够秒重置本身状态的功能。
```javascript
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const currentViewedUser = ref(null)
  const isFetching = ref(false)

  // 【八股实战】必须抛出一个主动还原出厂设置的动作
  const resetStore = () => {
    currentViewedUser.value = null
    isFetching.value = false
  }

  // 组件在 created 时应当带着前缀 ID 去请求数据
  const fetchUserByPrefix = async (prefixId) => {
     // ... 拉取后端数据
  }

  return { currentViewedUser, isFetching, resetStore, fetchUserByPrefix }
})
```

### 【武器 2：Vue Router 全局路由守卫】
在“过安检”跳往下一个页面之前，我们做第一道拦截。
```javascript
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [/*...*/]
})

// 【核心八股考点】使用 Vue Router 的全局前置守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // 隔离拦截大闸：如果要去的页面是用户的详情页，或者我们即将离开详情页
  // 先一棒子打死，强制清空之前停留所缓存在响应式树中的旧数据（阻止脏读现象跑出 UI）
  if (to.name === 'UserProfile' || from.name === 'UserProfile') {
     userStore.resetStore()
  }

  // 放行
  next()
})

export default router
```

## 3. 核心面试 Q&A

### 面问：你简历提到“SPA 下组件复用”，你能不能讲讲如果我不借助 Vue router 和 pinia reset，在 Vue 中有什么原生的方法能强制不复用组件吗？
**你的回答：**
“这是 Vue 虚拟 DOM 算法的默认优化策略（就地更新）。如果某些页面非常奇葩，我坚决要求在切换页面时必须让组件走完销毁和重建的生命周期，最直接的原生手段就是给 `<router-view>` 加一个绑定的唯一 `key` 属性。
例如 `<router-view :key="$route.fullPath" />`。
这样，每当页面的 `path` 哪怕带的参数（或者说你问的那个 ID 映射）发生改变，Vue Diff 算法比对新老树的 `key` 不一致时，就会判定这不是同一个节点，老老实实执行完整卸载（Unmount）后挂载（Mount），这样它自己的响应式里也不会保留上次脏数据了。”

### 面问：你熟不熟 Vue Router 的导航守卫？说一下当你点击 A 跳转 B，完整的导航守卫执行顺序是怎样的？
**你的回答（深扒八股文，能背出来直接通杀）：**
“这是一套相当复杂但也严格对称的生命周期。从 A 跳转到 B 时：
1. 先是在离开的 A 组件内部调用 `beforeRouteLeave`。
2. 随后触发全局的最外层拦截 `beforeEach`（正如我在该项目中写 Pinia 清空拦截的地方）。
3. 如果是在复用 B 组件里，会触发内部的 `beforeRouteUpdate`。
4. 如果是新的 B 组件，则触发对应路由配置块里的 `beforeEnter`。
5. 接着触发 B 组件刚开始构建里的 `beforeRouteEnter`。
6. 一切解析无误准备好了，触发全局的 `beforeResolve`。
7. 正式确认跳转完毕，触发全局的 `afterEach`（到这里基本上进度条也可以关了）。”

### 面问：在这个项目里，你为什么会选择用 Pinia，而不去用以前的 Vuex，有考虑过它们的本质区别吗？
**你的回答：**
“在 Vue3 + TypeScript 的技术栈背景下，Pinia 拥有压倒性的优势。
最本质的区别有两点：
1. **彻底移除了 Mutataions 这个冗余物**：在老派 Vuex 中，你不能在 Action 中直接改 State 的值，必须使用 `commit` 拐个弯去发命令到 Mutation 中才能改，这导致每次为了该一个微小且没有任何副作用的变量都要建两三个文件。Pinia 直接允许在 actions 中写原生响应式的 `v.value = 1`，将大山推平了。
2. **对 TypeScript 和自动推导的顶级原原生支持**：在写代码的时候不用再写一堆魔鬼字符串比如 `store.dispatch('xxx/xxx')`，而是原生模块化导出引用 `store.login()`，具备极高的前端开发健壮性。而且它支持了 Vite 支持的极速打包与 HMR 热更新模块。”

<ArticleComments slug="campushub-highlight-pinia" />

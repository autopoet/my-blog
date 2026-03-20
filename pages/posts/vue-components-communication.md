---
title: Vue 组件与通信
date: 2025-10-20
categories:
  - 啃啃原理
tags:
  - Vue
  - 组件通信
---

> **核心摘要：** 本文深入探讨 Vue 组件间通信的多样化方式、动态与异步组件的应用，以及插槽（Slots）的各类场景，助力开发者构建高可维护性的 Vue 应用。

## 1. 组件通信方式

| 通信类型 | 适用场景 | 常用方案 |
| :--- | :--- | :--- |
| **父子通信** | 直接层级传递 | `props` / `emit` |
| **跨层通信** | 祖孙、深度嵌套 | `provide` / `inject` |
| **全局通信** | 状态共享、跨模块 | `Pinia` / `Vuex` |

### 面试话术
> 组件通信应根据**层级**和**用途**灵活选择方案。常用的父子通信使用 `props` 和 `emit`；跨层级通信推荐使用 `provide` 和 `inject`；而对于复杂的全局状态管理，则应采用 `Pinia` 或 `Vuex` 以确保代码的清晰与可维护性。

### 1.1 父子通信 (Props / Emit)

* **父传子：Props**
  * **特点**：单向数据流。子组件接收数据，但不应直接修改父组件传入的状态。
  * **原则**：遵循“Props Down”原则，确保数据流向清晰。
* **子传父：Emit**
  * **特点**：事件驱动。子组件通过触发自定义事件通知父组件。
  * **场景**：表单更新、关闭弹窗、异步数据回传。

### 1.2 跨层通信 (Provide / Inject)

* **定义**：祖先组件提供（Provide）数据，后代组件注入（Inject）数据。
* **优势**：摆脱了逐层透传（Prop Drilling）的痛点，适用于插件开发或深度嵌套布局。
* **注意点**：
  * 默认情况下，`provide/inject` 绑定并不是响应式的。
  * **解决方案**：若需响应式，可将数据包装为 `reactive` 或 `ref` 对象。

### 1.3 全局状态管理 (Pinia / Vuex)

* **功能**：构建全局状态仓库，实现“一处存储，处处访问”。
* **适用场景**：
  * 用户信息、登录状态、权限配置。
  * 购物车、全局通知、暗黑模式切换。

---

## 2. 动态组件与异步组件

> **考点直达：** 如何提高组件复用性与首屏加载速度？
> **关键点：** `<component :is>`、`defineAsyncComponent`、路由懒加载。

### 动态组件 (Dynamic Components)

通过 `<component :is="...">` 标签，可以在同一个挂载点根据状态动态切换组件。

* **常用场景**：Tab 切换栏、分步指南、根据配置渲染的动态表单。
* **示例代码**：

```vue
<template>
  <component :is="activeTabComponent" />
</template>

<script setup>
import { shallowRef } from 'vue';
import TabA from './TabA.vue';
const activeTabComponent = shallowRef(TabA);
</script>
```

### 异步组件 (Async Components)

利用 Vite/Webpack 的按需加载特性，配合 `defineAsyncComponent` 能够显著减少初始包体积。

* **核心优势**：延迟加载，分包打包（Code Splitting）。
* **示例代码**：

```javascript
import { defineAsyncComponent } from 'vue';

// 只有在组件需要渲染时才会加载 MyComp.vue
const AsyncComp = defineAsyncComponent(() =>
  import('./MyComp.vue')
);
```

* **应用场景**：大型页面、弹窗组件、路由页面懒加载。

---

## 3. 插槽（Slots）的深度应用

> 插槽是 Vue 提供的一种强大的内容分发机制，让父组件可以控制子组件的部分 DOM 结构。

### 3.1 默认插槽 (Default Slot)

* **机制**：组件内部使用 `<slot></slot>`，父组件标签内的任意内容都会填充于此。
* **场景**：通用容器组件（Card, Panel, Container）。

### 3.2 具名插槽 (Named Slots)

* **机制**：通过 `name` 属性区分位置，父组件使用 `v-slot:name` (简写 `#name`) 填充。
* **场景**：复杂布局控制（如 Modal 弹窗通常包含 `header`、`body`、`footer`）。

### 3.3 作用域插槽 (Scoped Slots)

* **痛点**：父组件决定“怎么画”（样式），但渲染所需的数据在子组件手中。
* **典型案例：MyList 组件**
  * **子组件**：通过 `<slot :data="item">` 把数据“回传”给父组件。
  * **父组件**：通过 `#default="{ data }"` 接收并渲染。

* **示例场景**：封装一个列表组件，子组件处理分页循环，父组件决定每一行展示图片还是文字。

---

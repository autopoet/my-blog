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

---

## 2. v-for 为什么需要 Key

- **唯一标识**：Key 用于 **唯一标识节点身份**，让 Vue 能正确追踪节点对应关系。
- **性能优化**：优化 **Diff 算法** 的效率，避免在列表更新时出现渲染错误或 DOM 重排。
- **使用场景举例**：
    - 渲染动态列表：`<li v-for="item in list" :key="item.id">{{item.name}}</li>`
    - 不使用 key 可能会导致：删除或新增列表项时，Vue 复用错误的 DOM 节点，出现数据错位。

---

## 3. Vue 性能优化手段

### 1. 缓存静态内容
- `v-once`：渲染一次后不再响应数据变化。
- `v-memo`：缓存函数渲染结果，减少重复计算。

### 2. 路由懒加载或组件异步加载
- 减少首屏加载体积，提高渲染速度。
- 异步加载组件可以按需加载，避免一次性加载全部。

### 3. 避免深层响应式对象
- 深层对象响应式会增加依赖追踪开销。
- 对不需要响应的数据可以用 `Object.freeze()` 冻结。

### 4. 其他优化方法
- 合理拆分组件，减少不必要的重渲染范围。
- 使用 `computed` 或 `watch` 替代频繁调用 `methods`。
- 渲染大列表时可以使用虚拟列表，减少 DOM 节点数量。

---

## 4. 模板渲染流程

**考察点：**
- Vue 模板到真实 DOM 的渲染过程
- setup 中数据如何绑定到模板

**判断点：**
- 能描述 `template → render function → VNode → DOM` 的完整流程
- 理解响应式数据在 `setup` 中如何驱动模板更新

**答案示例：**
- **流程说明**：Vue 的模板首先被编译为 render 函数，再由 render 函数生成虚拟 DOM（VNode），最终 Vue 对比新旧 VNode，将差异更新到真实 DOM。
- **setup 数据绑定**：组合式 API 中，setup 返回的数据、方法、计算属性会被绑定到模板形成响应式依赖。数据变化时，通过依赖追踪机制触发对应 VNode 更新，实现视图自动刷新。

**面试话术示例：**
> 模板渲染流程可以总结为 `template → 编译 → render function → VNode → DOM`。在 setup 中返回的数据会建立响应式依赖，数据变化会驱动模板对应的 DOM 更新。

<ArticleComments slug="vue-practical-high-frequency-questions" />

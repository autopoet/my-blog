---
title: Vue 3 开发者的 React 入门笔记
date: 2026-04-09
categories:
  - 学学技术
tags:
  - Vue3
  - React
---
<ArticleViews slug="vue3-vs-react-transition-guide" />

作为一名正在从 Vue 3 学习转向 React 的开发者，我发现两者的思维方式有很大不同。这篇文章记录了我在学习这两个框架时发现的一些核心差异，希望能帮助同样在探索这两个生态的同学。

## 1. 核心心智模型：模版驱动 vs UI 即函数

Vue 3 依然保留了类 HTML 的**模版（Template）**系统，而 React 则是彻底的 **All in JS**。

- **Vue 3**: 像是给 HTML 增强了逻辑（v-if, v-for）。
- **React**: 像是用 JavaScript 生成 HTML（map, 三元表达式）。

### 代码对比：条件渲染与列表

Vue 3 (Template)：

```vue
<template>
  <div v-if="isVisible">
    <ul>
      <li v-for="item in items" :key="item.id">{{ item.text }}</li>
    </ul>
  </div>
</template>
```

React (JSX)：

```jsx
function List({ isVisible, items }) {
  return (
    isVisible && (
      <div>
        <ul>
          {items.map(item => (
            <li key={item.id}>{item.text}</li>
          ))}
        </ul>
      </div>
    )
  );
}
```

## 2. 响应式原理：自动追踪 vs 不可变数据

这是两者最本质的区别。

- **Vue 3 (Proxy-base)**: 你直接修改数据：`state.count++`，Vue 会自动追踪并更新视图。
- **React (State Snapshot)**: 你必须显式调用 Setter：`setCount(count + 1)`。React 强调**不可变性（Immutability）**，每次更新都是一次全新的“渲染快照”。

### 代码对比：计数器

Vue 3 (Composition API)：

```javascript
const count = ref(0);
const increment = () => {
  count.value++; // 直接修改
};
```

React (Hooks)：

```javascript
const [count, setCount] = useState(0);
const increment = () => {
  setCount(prev => prev + 1); // 通过函数更新
};
```

## 3. 生命周期与副作用：Explicit vs Implicit

在 Vue 3 中，我们有明确的 `onMounted`, `onUpdated` 等钩子。而在 React 中，一切副作用都统一由 `useEffect` 处理。

- **Vue 3**: `watch` 也是自动追踪依赖。
- **React**: `useEffect` 必须手动声明依赖数组 `[deps]`。

### 代码对比：数据请求

Vue 3：

```javascript
onMounted(async () => {
  data.value = await fetchData();
});

watch(userId, async (newId) => {
  data.value = await fetchUser(newId);
});
```

React：

```jsx
useEffect(() => {
  const loadData = async () => {
    const res = await fetchUser(userId);
    setData(res);
  };
  loadData();
}, [userId]); // 必须手动添加依赖，否则会有过时闭包问题
```

## 4. 组件通信：Props & Events vs Props & Callbacks

Vue 有专门的 `emit` 机制，而 React 仅仅是父组件向子组件传递一个函数。

- **Vue 3**: `defineProps`, `defineEmits`。
- **React**: 统一通过 `props` 接收数据和回调函数。

### 代码对比：子传父

Vue 3：

```vue
<!-- Parent -->
<ChildComponent @update="handleUpdate" />

<!-- Child -->
<button @click="$emit('update', 'data')">Click</button>
```

React：

```jsx
// Parent
<ChildComponent onUpdate={handleUpdate} />

// Child
function ChildComponent({ onUpdate }) {
  return <button onClick={() => onUpdate('data')}>Click</button>;
}
```

## 5. 跨组件状态：Provide/Inject vs Context API

逻辑上非常相似，但 React 的 Context 在配合 `useReducer` 时，能达到类似 Redux 的效果。Vue 3 的 `provide/inject` 则更偏向于依赖注入。

## 6. 总结：该选哪一个？

| 特性 | Vue 3 | React |
| :--- | :--- | :--- |
| **上手难度** | 较低（贴近 HTML/CSS） | 较高（纯 JS 逻辑更多） |
| **编程模型** | 响应式、自动优化 | 声明式、手动控制渲染 |
| **生态环境** | 官方工具链极强 (Vite, Pinia, Vue Router) | 社区百花齐放 (Next.js, Query, Tailwind) |
| **心智负担** | 较小，很多事情隐式处理了 | 较大，需注意闭包、依赖数组、重新渲染 |

对于正在转到 React 的同学，**我觉得最需要花时间适应的是“不可变数据”和“状态管理”的概念**。React 给了开发者更多的控制权，但也意味着我们要自己处理更多的逻辑。

如果你也是刚刚开始接触其中一个框架，希望这些对比能让你对两者的工作方式有一个初步的了解。学习新东西总是很难的，大家一起加油！

<ArticleComments slug="vue3-vs-react-transition-guide" />

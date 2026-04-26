---
title: Vue3 转 React 学习笔记（一）：创建项目与 JSX 基础
date: 2026-04-25
categories:
  - 啃啃原理
tags:
  - Vue3
  - React
  - JSX
---
<ArticleViews slug="vue3-to-react-project-jsx-basics" />

> 从 Vue3 转向 React，第一步不是急着背 API，而是先把 React 项目的创建方式、组件写法和 JSX 的思维方式理清楚。
> 本文参考 React 官方中文文档，整理一份适合 Vue3 开发者阅读的入门笔记。

## 1. React 项目怎么创建

React 本身是一个用于构建 UI 的 JavaScript 库，它不直接规定路由、构建、数据请求、部署等完整工程方案。

所以在创建项目时，React 官方文档更推荐根据目标选择合适的框架或工具：

- 如果要做生产级 Web 应用，可以优先考虑 Next.js、React Router 框架模式、Expo 等生态方案。
- 如果只是学习 React 或做一个轻量前端项目，可以使用 Vite 从零搭一个 React 应用。

对于刚从 Vue3 转过来的同学，Vite 会非常熟悉，因为 Vue3 项目里常见的 `create-vue` 也是基于 Vite。

```bash
npm create vite@latest my-react-app
```

然后选择：

```bash
React
JavaScript 或 TypeScript
```

进入项目并启动：

```bash
cd my-react-app
npm install
npm run dev
```

启动成功后，浏览器里看到的页面就是第一个 React 应用。

## 2. 项目结构先看哪里

一个 Vite React 项目通常会有这些核心文件：

```txt
my-react-app
├─ index.html
├─ package.json
├─ src
│  ├─ main.jsx
│  ├─ App.jsx
│  └─ assets
└─ vite.config.js
```

最值得先看的两个文件是 `main.jsx` 和 `App.jsx`。

`main.jsx` 负责把 React 应用挂载到页面里：

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

如果类比 Vue3，它大概对应：

```js
import { createApp } from 'vue';
import App from './App.vue';

createApp(App).mount('#app');
```

`App.jsx` 则是根组件。Vue3 里我们常写 `.vue` 单文件组件，而 React 里组件通常就是一个 JavaScript 函数。

```jsx
function App() {
  return <h1>Hello React</h1>;
}

export default App;
```

## 3. React 组件就是返回 UI 的函数

在 Vue3 里，我们习惯把结构写在 `<template>`，逻辑写在 `<script setup>`。

```vue
<template>
  <h1>{{ title }}</h1>
</template>

<script setup>
const title = 'Hello Vue';
</script>
```

React 的写法更像是“用 JavaScript 函数描述 UI”：

```jsx
function Title() {
  const title = 'Hello React';

  return <h1>{title}</h1>;
}
```

这里有一个很重要的心智切换：

- Vue3 更像是给 HTML 模板增加响应式能力。
- React 更像是用 JavaScript 组织和返回 UI 结构。

所以 React 里没有 `v-if`、`v-for`、`v-bind` 这类模板指令，很多事情都直接回到 JavaScript 本身。

## 4. JSX 是什么

JSX 是 JavaScript 的语法扩展，可以让我们在 JavaScript 里写类似 HTML 的结构。

```jsx
const element = <h1>Hello React</h1>;
```

它看起来像 HTML，但本质上不是 HTML，而是 JavaScript 表达式。构建工具会把 JSX 转换成浏览器能理解的 JavaScript。

React 官方文档强调，JSX 的价值在于把“渲染逻辑”和“标记结构”放在一起。也就是说，一个组件的 UI 结构和它需要的变量、条件、列表逻辑会天然写在同一个函数里。

这点和 Vue3 的单文件组件不太一样：

- Vue3 用 `<template>`、`<script>`、`<style>` 分区。
- React 用函数组件把 UI 和相关逻辑放在同一个 JavaScript 上下文里。

## 5. JSX 的几个基本规则

### 只能返回一个根节点

组件返回 JSX 时，通常只能返回一个根节点。

```jsx
function Profile() {
  return (
    <div>
      <h1>Lin</h1>
      <p>Frontend Developer</p>
    </div>
  );
}
```

如果不想额外增加一层真实 DOM，可以使用 Fragment：

```jsx
function Profile() {
  return (
    <>
      <h1>Lin</h1>
      <p>Frontend Developer</p>
    </>
  );
}
```

这有点像 Vue3 template 里需要一个清晰的结构边界，只是 React 更强调“函数返回一个值”。

### 标签必须闭合

JSX 里标签必须闭合。

```jsx
<img src="/avatar.png" alt="avatar" />
<input value="React" readOnly />
```

这比 HTML 更严格。原因也很简单：JSX 最终还是 JavaScript 表达式，结构必须明确。

### 属性使用驼峰命名

JSX 更接近 JavaScript，所以很多 DOM 属性会使用驼峰写法。

```jsx
<button className="primary-button" onClick={handleClick}>
  Submit
</button>
```

几个常见差异：

| HTML / Vue 模板 | JSX |
| :--- | :--- |
| `class` | `className` |
| `for` | `htmlFor` |
| `onclick` / `@click` | `onClick` |
| `tabindex` | `tabIndex` |

## 6. 在 JSX 中使用 JavaScript

JSX 里用 `{}` 嵌入 JavaScript 表达式。

```jsx
function UserCard() {
  const user = {
    name: 'Alex',
    role: 'Vue3 learner',
  };

  return (
    <section>
      <h2>{user.name}</h2>
      <p>{user.role}</p>
    </section>
  );
}
```

注意：花括号里放的是表达式，不是完整语句。

可以这样写：

```jsx
<p>{user.name}</p>
<p>{count + 1}</p>
<p>{isLogin ? '已登录' : '未登录'}</p>
```

不能直接这样写：

```jsx
<p>{if (isLogin) { return '已登录'; }}</p>
```

如果逻辑复杂，可以先在 `return` 前面用 JavaScript 算好结果。

```jsx
function LoginText({ isLogin }) {
  const text = isLogin ? '已登录' : '未登录';

  return <p>{text}</p>;
}
```

## 7. 条件渲染：从 v-if 到 JavaScript 表达式

Vue3 中我们会写：

```vue
<p v-if="isLogin">欢迎回来</p>
<p v-else>请先登录</p>
```

React 中没有 `v-if`，直接使用 JavaScript 条件表达式。

```jsx
function Welcome({ isLogin }) {
  return (
    <div>
      {isLogin ? <p>欢迎回来</p> : <p>请先登录</p>}
    </div>
  );
}
```

如果只在条件为真时渲染，可以用 `&&`：

```jsx
function Notice({ hasMessage }) {
  return (
    <div>
      {hasMessage && <p>你有新的消息</p>}
    </div>
  );
}
```

## 8. 列表渲染：从 v-for 到 map

Vue3 中常用 `v-for`：

```vue
<li v-for="item in list" :key="item.id">
  {{ item.name }}
</li>
```

React 中通常使用数组的 `map`：

```jsx
function TodoList({ list }) {
  return (
    <ul>
      {list.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}
```

这里的 `key` 和 Vue3 的 `:key` 思路很像，都是帮助框架识别列表项，减少不必要的更新。

## 9. 样式怎么写

最简单的方式是引入 CSS 文件：

```jsx
import './App.css';

function App() {
  return <h1 className="title">Hello React</h1>;
}
```

也可以写行内样式，但要注意它接收的是对象：

```jsx
function App() {
  return (
    <h1 style={{ color: 'tomato', fontSize: 24 }}>
      Hello React
    </h1>
  );
}
```

`style={{ ... }}` 看起来有两层花括号：

- 外层 `{}` 表示在 JSX 中进入 JavaScript。
- 内层 `{}` 是 JavaScript 对象。

## 10. 小结

从 Vue3 转 React，第一阶段要先适应三件事：

1. React 组件本质上是返回 UI 的 JavaScript 函数。
2. JSX 不是模板语法，而是 JavaScript 的语法扩展。
3. 条件渲染、列表渲染、事件绑定等操作都更依赖 JavaScript 表达式。

如果用一句话总结：**Vue3 是在模板里写逻辑，React 是用 JavaScript 组织 UI。**

刚开始会觉得 JSX 把结构和逻辑混在一起，但习惯后会发现它的好处是统一、直接、可组合。下一篇继续沿着 React 官方学习路径的第一部分“描述 UI”，系统整理组件、props、条件渲染和列表渲染这些基础能力。

<ArticleComments slug="vue3-to-react-project-jsx-basics" />

---
title: Vue3 转 React 学习笔记（二）：描述 UI
date: 2026-04-26
categories:
  - 啃啃原理
tags:
  - Vue3
  - React
  - UI
---
<ArticleViews slug="vue3-to-react-describing-ui" />

> React 官方学习路径可以理解为四个部分：描述 UI、添加交互、状态管理、脱围机制。
> 这篇先写第一部分：描述 UI。对于 Vue3 开发者来说，这一部分的重点是理解 React 如何用组件、JSX 和 props 组织界面。

## 1. 描述 UI 是什么意思

React 的核心思路不是手动操作 DOM，而是根据当前数据“描述”页面应该长什么样。

你写的组件会返回一段 JSX：

```jsx
function Profile() {
  return (
    <section>
      <h2>Alex</h2>
      <p>Frontend Developer</p>
    </section>
  );
}
```

React 根据这段描述去更新真实页面。

从 Vue3 的角度看，这和 template 的目标很像：我们都不是直接 `document.createElement`，而是声明 UI 结构。但 React 的表达方式更偏 JavaScript 函数。

## 2. 第一个核心：组件

React 组件就是一个返回 JSX 的函数。

```jsx
function Avatar() {
  return <img src="/avatar.png" alt="avatar" />;
}
```

组件名必须以大写字母开头。小写标签会被 React 当作原生 HTML 标签，比如 `<div>`、`<span>`；大写标签才会被当作自定义组件，比如 `<Avatar />`。

使用组件：

```jsx
function Profile() {
  return (
    <article>
      <Avatar />
      <h2>Alex</h2>
    </article>
  );
}
```

类比 Vue3：

```vue
<template>
  <article>
    <Avatar />
    <h2>Alex</h2>
  </article>
</template>
```

区别在于，Vue3 的结构主要在 template 里表达，而 React 的组件组合直接发生在 JSX 里。

## 3. 第二个核心：导入和导出组件

项目变大以后，不可能所有组件都写在一个文件里。React 中通常用 ES Module 组织组件。

`Avatar.jsx`：

```jsx
export default function Avatar() {
  return <img src="/avatar.png" alt="avatar" />;
}
```

`Profile.jsx`：

```jsx
import Avatar from './Avatar.jsx';

export default function Profile() {
  return (
    <article>
      <Avatar />
      <h2>Alex</h2>
    </article>
  );
}
```

如果一个文件导出多个组件，也可以使用命名导出：

```jsx
export function Avatar() {
  return <img src="/avatar.png" alt="avatar" />;
}

export function UserName() {
  return <h2>Alex</h2>;
}
```

导入时：

```jsx
import { Avatar, UserName } from './UserInfo.jsx';
```

从 Vue3 转过来时，可以先记住一个简单习惯：一个文件一个默认组件，写熟以后再根据需要拆分命名导出。

## 4. 第三个核心：JSX 中的标记

JSX 不是 HTML，但它很像 HTML。它的规则更严格：

```jsx
function Todo() {
  return (
    <>
      <h1>Today</h1>
      <img src="/cover.png" alt="cover" />
    </>
  );
}
```

重点规则：

- 返回多个节点时，用一个父节点包住，或者用 `<>...</>`。
- 所有标签都要闭合，比如 `<img />`、`<input />`。
- 属性大多使用驼峰命名，比如 `className`、`onClick`、`htmlFor`。

在 Vue3 里，模板会帮我们屏蔽不少 HTML 和 JavaScript 之间的差异；在 React 里，JSX 更接近 JavaScript，所以规则会更统一，也更严格。

## 5. 第四个核心：用花括号进入 JavaScript

JSX 中使用 `{}` 插入 JavaScript 表达式。

```jsx
function Profile() {
  const name = 'Alex';
  const age = 18;

  return (
    <section>
      <h2>{name}</h2>
      <p>{age + 1}</p>
    </section>
  );
}
```

Vue3 中我们会写：

```vue
<h2>{{ name }}</h2>
```

React 中对应：

```jsx
<h2>{name}</h2>
```

花括号里可以放变量、函数调用、三元表达式、数组 `map` 的结果，但不能直接放 `if`、`for` 这类语句。

```jsx
function Price({ count, price }) {
  return <p>总价：{count * price}</p>;
}
```

这也是 React 学习中非常关键的一个转变：**模板指令少了，JavaScript 表达式多了。**

## 6. 第五个核心：props

props 是父组件传给子组件的数据。

```jsx
function Avatar({ src, name }) {
  return <img src={src} alt={name} />;
}

function Profile() {
  return (
    <Avatar
      src="/avatar.png"
      name="Alex"
    />
  );
}
```

类比 Vue3：

```vue
<script setup>
defineProps({
  src: String,
  name: String,
});
</script>
```

React 里没有 `defineProps`，函数组件的参数就是 props。

```jsx
function Avatar(props) {
  return <img src={props.src} alt={props.name} />;
}
```

更常见的写法是直接解构：

```jsx
function Avatar({ src, name }) {
  return <img src={src} alt={name} />;
}
```

传递字符串可以直接写：

```jsx
<Avatar name="Alex" />
```

传递变量、数字、对象、数组时，用 `{}`：

```jsx
<Avatar size={80} user={user} tags={['React', 'Vue3']} />
```

## 7. 第六个核心：条件渲染

React 的条件渲染直接使用 JavaScript。

```jsx
function LoginPanel({ isLogin }) {
  if (isLogin) {
    return <p>欢迎回来</p>;
  }

  return <p>请先登录</p>;
}
```

也可以在 JSX 中使用三元表达式：

```jsx
function LoginPanel({ isLogin }) {
  return (
    <div>
      {isLogin ? <p>欢迎回来</p> : <p>请先登录</p>}
    </div>
  );
}
```

只需要在条件成立时显示，可以用 `&&`：

```jsx
function MessageTip({ count }) {
  return (
    <div>
      {count > 0 && <p>你有 {count} 条新消息</p>}
    </div>
  );
}
```

Vue3 的思路是：

```vue
<p v-if="count > 0">你有 {{ count }} 条新消息</p>
```

React 的思路是：

```jsx
{count > 0 && <p>你有 {count} 条新消息</p>}
```

## 8. 第七个核心：列表渲染

React 使用 JavaScript 的 `map` 渲染列表。

```jsx
const todos = [
  { id: 1, text: '学习 JSX' },
  { id: 2, text: '学习 props' },
  { id: 3, text: '学习条件渲染' },
];

function TodoList() {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
```

`key` 很重要。它帮助 React 判断列表里的每一项是谁，尤其是在新增、删除、排序时，可以减少错误复用和不必要的更新。

Vue3 中我们也会写 `:key`：

```vue
<li v-for="todo in todos" :key="todo.id">
  {{ todo.text }}
</li>
```

所以这里不用重新理解一套新概念，只需要把 `v-for` 换成 `map`。

## 9. 第八个核心：保持组件纯粹

React 官方文档会强调一个概念：组件应该尽量保持纯粹。

简单说，纯粹组件有两个特点：

1. 相同输入应该得到相同输出。
2. 渲染过程中不要修改外部变量或产生副作用。

不推荐：

```jsx
let count = 0;

function CounterText() {
  count++;
  return <p>{count}</p>;
}
```

这个组件每渲染一次都会修改外部变量，结果不再只由输入决定。

更推荐：

```jsx
function CounterText({ count }) {
  return <p>{count}</p>;
}
```

从 Vue3 转过来时，可以把它理解成：组件的渲染阶段只负责“算出 UI”，不要在这个阶段做请求、改外部状态、操作 DOM。那些事情后面会放到事件和 Effect 中处理。

## 10. Vue3 开发者的学习对照表

| Vue3 | React |
| :--- | :--- |
| `.vue` 单文件组件 | `.jsx` / `.tsx` 函数组件 |
| `<template>` | `return (...)` 中的 JSX |
| `{{ message }}` | `{message}` |
| `v-if` / `v-else` | `if`、三元表达式、`&&` |
| `v-for` | `array.map()` |
| `:key` | `key` |
| `defineProps` | 函数参数 props |
| `class` | `className` |
| `@click` | `onClick` |

## 11. 小结

React 学习路径的第一部分“描述 UI”，核心不是状态，也不是 Hooks，而是先学会用组件和 JSX 把页面结构描述出来。

这一部分可以归纳为四句话：

1. 用函数组件拆分 UI。
2. 用 JSX 表达结构。
3. 用 props 传递数据。
4. 用 JavaScript 表达条件和列表。

对于 Vue3 开发者来说，React 最需要适应的是：它把很多模板指令都还给了 JavaScript。刚开始会觉得写法更“裸”，但这也是 React 组合能力强的来源。

下一阶段再进入“添加交互”，也就是事件处理、state、组件响应用户操作等内容。到那里，React 和 Vue3 的响应式差异会变得更明显。

<ArticleComments slug="vue3-to-react-describing-ui" />

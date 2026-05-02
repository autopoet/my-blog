---
title: Vue3 转 React 学习笔记（六）：脱围机制
date: 2026-05-02
categories:
  - 啃啃原理
tags:
  - Vue3
  - React
  - Effect
---
<ArticleViews slug="vue3-to-react-escape-hatches" />

> 前面几篇主要在讲 React 的主线：用组件描述 UI，用 state 响应交互，用 reducer 和 context 管理复杂状态。
> 这一篇进入 React 官方学习路径的最后一块：脱围机制，也就是当组件需要和 React 外部世界打交道时，该怎么写。

官方文档把这一章叫 **Escape Hatches**，中文翻译为“脱围机制”。

这个名字很形象：React 希望大部分 UI 都能通过 props、state 和 JSX 来描述，但真实项目里总会遇到一些 React 管不到的东西，比如 DOM 节点、浏览器 API、定时器、视频播放器、WebSocket、第三方库。这时就需要“走出 React”。

## 1. 什么是脱围机制

React 的正常工作方式是：

```txt
state / props -> render -> React 更新 DOM
```

也就是说，我们通常不需要手动操作 DOM，也不需要手动同步页面。只要把状态设计好，React 会根据状态渲染 UI。

但有些事情不属于 React 的渲染系统：

- 聚焦某个输入框。
- 滚动到某个 DOM 节点。
- 测量元素宽高。
- 控制原生视频播放和暂停。
- 连接 WebSocket。
- 设置定时器。
- 接入第三方非 React 组件。
- 在组件显示后发送埋点。

这些事情不是单纯的“根据 state 计算 JSX”，而是要和 React 外部系统同步。

所以脱围机制的核心可以这样理解：

> 当 React 的声明式渲染不够用时，用 ref 和 Effect 去连接外部世界。

但是也要记住另一句话：

> 脱围机制是例外，不是主线。大多数业务逻辑不应该依赖它。

## 2. useRef：记住值，但不触发渲染

`useRef` 可以让组件在多次渲染之间记住一个值。

```jsx
import { useRef } from 'react';

function Counter() {
  const countRef = useRef(0);

  function handleClick() {
    countRef.current += 1;
    alert(`你点击了 ${countRef.current} 次`);
  }

  return <button onClick={handleClick}>点我</button>;
}
```

`ref.current` 可以被修改，但修改它不会触发重新渲染。

这点和 `useState` 很不一样：

| 能力 | `useState` | `useRef` |
| :--- | :--- | :--- |
| 跨渲染保存值 | 可以 | 可以 |
| 修改后触发渲染 | 会 | 不会 |
| 适合影响 UI 的数据 | 适合 | 不适合 |
| 适合保存定时器 id、DOM、外部对象 | 不太适合 | 适合 |

所以判断标准很简单：

> 如果这个值变化后要影响页面显示，用 state；如果只是想记住某个值，但不想触发渲染，用 ref。

比如保存定时器 id：

```jsx
const timerRef = useRef(null);

function startTimer() {
  timerRef.current = setTimeout(() => {
    console.log('done');
  }, 1000);
}

function stopTimer() {
  clearTimeout(timerRef.current);
}
```

`timerRef.current` 的变化不需要显示在页面上，所以它不应该是 state。

## 3. ref 和 Vue3 ref 的区别

Vue3 里也有 `ref`：

```js
const count = ref(0);
count.value++;
```

Vue3 的 `ref` 是响应式数据。它变化后，依赖它的模板或计算逻辑会更新。

React 的 `useRef` 不是响应式数据。它更像组件内部的一个可变容器：

```jsx
const countRef = useRef(0);
countRef.current++;
```

修改 `countRef.current` 后，React 不会重新渲染。

所以从 Vue3 转 React 时要特别注意：

- Vue3 `ref`：响应式状态。
- React `useRef`：不参与渲染的可变引用。

如果你希望 UI 跟着变化，不要用 React ref，要用 state。

## 4. 使用 ref 操作 DOM

React 通常不需要你手动操作 DOM，但有些场景确实需要拿到真实 DOM 节点。

比如点击按钮后聚焦输入框：

```jsx
import { useRef } from 'react';

function FocusInput() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        聚焦输入框
      </button>
    </>
  );
}
```

这里的流程是：

```txt
React 渲染 input
-> React 把真实 DOM 节点放进 inputRef.current
-> 点击按钮
-> 调用 inputRef.current.focus()
```

常见 DOM ref 场景：

- 聚焦输入框。
- 滚动到某个位置。
- 测量元素尺寸。
- 控制视频、音频等原生 DOM API。

但不要用 ref 去做 React 本来能做的事。

不推荐：

```jsx
inputRef.current.value = 'hello';
```

如果输入框内容要由页面状态控制，应该写成受控组件：

```jsx
const [value, setValue] = useState('');

<input
  value={value}
  onChange={e => setValue(e.target.value)}
/>
```

ref 适合“命令式操作”，state 适合“声明式渲染”。

## 5. Effect：渲染之后和外部系统同步

`useEffect` 是脱围机制里最重要，也最容易被滥用的 API。

官方文档里有一个判断很关键：

> Effect 用来让组件和 React 外部系统同步。

比如根据 React state 控制视频播放：

```jsx
import { useEffect, useRef } from 'react';

function VideoPlayer({ src, isPlaying }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      videoRef.current.play();
    }
    else {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  return (
    <video
      ref={videoRef}
      src={src}
      loop
      playsInline
    />
  );
}
```

这段代码的意思是：

```txt
React 负责渲染 video
isPlaying 变化后
Effect 在渲染完成后运行
根据 isPlaying 调用原生 video.play() 或 video.pause()
```

为什么不能直接在渲染时调用？

因为渲染阶段应该保持纯粹。组件函数只负责计算 JSX，不应该在渲染过程中操作 DOM、发请求、订阅事件。

Effect 的位置是：

```txt
渲染完成之后，执行同步逻辑
```

## 6. Effect 和事件处理函数的区别

很多初学者容易把事件处理函数和 Effect 混在一起。

它们的区别是：

| 类型 | 什么时候运行 | 适合做什么 |
| :--- | :--- | :--- |
| 事件处理函数 | 用户做了某个具体操作时 | 提交表单、点击按钮、更新状态 |
| Effect | 渲染完成后，根据依赖同步 | 连接外部系统、订阅、定时器、DOM 同步 |

比如用户点击提交表单：

```jsx
async function handleSubmit(e) {
  e.preventDefault();
  await submitForm(answer);
}
```

这应该放在事件处理函数里，因为它是某次用户操作造成的。

不要写成：

```jsx
useEffect(() => {
  if (shouldSubmit) {
    submitForm(answer);
  }
}, [shouldSubmit, answer]);
```

这会让逻辑绕一圈，变得难读。

一句话：

> 如果逻辑是因为用户某次操作发生的，放事件处理函数；如果逻辑是因为组件需要和外部系统保持同步，放 Effect。

## 7. 你可能不需要 Effect

这是 React 官方文档里非常重要的一节。

很多人一看到“某个值变化后要计算另一个值”，就想写 `useEffect`。

比如：

```jsx
const [firstName, setFirstName] = useState('Ada');
const [lastName, setLastName] = useState('Lovelace');
const [fullName, setFullName] = useState('');

useEffect(() => {
  setFullName(`${firstName} ${lastName}`);
}, [firstName, lastName]);
```

这其实是不必要的。

因为 `fullName` 可以在渲染时直接计算：

```jsx
const fullName = `${firstName} ${lastName}`;
```

这条原则很重要：

> 如果一个值可以由已有 props 或 state 推导出来，就不要额外放进 state，也不要用 Effect 去同步它。

不需要 Effect 的常见场景：

- 根据 state 计算另一个展示值。
- 根据 props 过滤列表。
- 处理用户点击、输入、提交。
- 在渲染时可以完成的数据转换。

需要 Effect 的典型场景：

- 连接服务器。
- 订阅浏览器事件。
- 设置定时器。
- 调用第三方库。
- 控制 React 外部对象。

Effect 不是“监听器语法”，也不是 Vue `watch` 的直接替代品。它更像是同步外部系统的工具。

## 8. Effect 的生命周期

组件有生命周期：

```txt
挂载 -> 更新 -> 卸载
```

但 Effect 的生命周期更适合这样理解：

```txt
开始同步 -> 停止同步
```

比如聊天室连接：

```jsx
useEffect(() => {
  const connection = createConnection(roomId);
  connection.connect();

  return () => {
    connection.disconnect();
  };
}, [roomId]);
```

它的意思是：

```txt
当 roomId 对应的聊天室需要同步时，建立连接
当 roomId 改变或组件卸载时，断开旧连接
然后再根据新的 roomId 建立新连接
```

如果 `roomId` 从 `general` 变成 `music`：

```txt
停止同步 general
开始同步 music
```

所以 cleanup 函数很重要。

凡是 Effect 里做了“持续性事情”，通常都要考虑清理：

- 建立连接，要断开连接。
- 添加事件监听，要移除监听。
- 设置定时器，要清除定时器。
- 启动第三方实例，要销毁实例。

## 9. 依赖数组到底是什么意思

Effect 的依赖数组不是你随便挑几个变量放进去。

它表达的是：

> 这个 Effect 读取了哪些响应式值，就应该依赖哪些响应式值。

响应式值包括：

- props
- state
- 组件内部定义的变量和函数

比如：

```jsx
function ChatRoom({ roomId }) {
  useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect();
  }, [roomId]);
}
```

Effect 里读取了 `roomId`，所以依赖数组里要有 `roomId`。

如果漏掉它，组件可能还连接着旧房间。

依赖数组不是为了“控制它什么时候运行”而随意修改的开关。更好的说法是：

> 先写正确的 Effect 逻辑，再让依赖数组诚实地描述它读取了哪些响应式值。

如果依赖太多导致频繁运行，不要强行删依赖，而是调整代码结构。

## 10. 把事件从 Effect 中分开

有时 Effect 里会混入两类逻辑：

- 响应式同步逻辑。
- 某个时刻才需要执行的事件逻辑。

比如聊天室连接成功后弹一个通知：

```jsx
useEffect(() => {
  const connection = createConnection(roomId);

  connection.on('connected', () => {
    showNotification('已连接', theme);
  });

  connection.connect();
  return () => connection.disconnect();
}, [roomId, theme]);
```

这里的问题是：切换 `theme` 也会导致 Effect 重新执行，从而重新连接聊天室。

但我们真正想要的是：

- `roomId` 变化时重新连接。
- 通知显示时使用最新的 `theme`。
- `theme` 变化本身不应该触发重连。

React 官方文档会用 Effect Event 来解释这个问题。先不纠结 API 细节，重要的是这个判断：

> 哪些代码应该响应依赖变化而重新同步？哪些代码只是某个事件发生时读取最新值？

如果两个东西混在一起，Effect 依赖就会变得很别扭。

## 11. 移除 Effect 依赖，不是欺骗检查器

很多人遇到 Effect 重复执行，会想：

```jsx
// eslint-disable-next-line react-hooks/exhaustive-deps
```

这通常不是好习惯。

依赖检查器提醒你，是因为 Effect 读取了某个响应式值，但依赖数组没有写。

正确思路不是“把警告关掉”，而是问：

1. 这个逻辑真的需要 Effect 吗？
2. 能不能放到事件处理函数里？
3. 能不能在渲染期间计算？
4. 能不能把对象或函数移到 Effect 内部？
5. 能不能把非响应式逻辑拆出去？

比如这个写法会导致 `options` 每次渲染都是新对象：

```jsx
const options = {
  serverUrl,
  roomId,
};

useEffect(() => {
  const connection = createConnection(options);
  connection.connect();
  return () => connection.disconnect();
}, [options]);
```

更好的方式是把对象放进 Effect 里：

```jsx
useEffect(() => {
  const options = {
    serverUrl,
    roomId,
  };

  const connection = createConnection(options);
  connection.connect();
  return () => connection.disconnect();
}, [roomId]);
```

这样依赖就更稳定，也更贴近真实需求。

## 12. 自定义 Hook：复用脱围逻辑

如果多个组件都需要同一套 Effect 或 ref 逻辑，可以把它抽成自定义 Hook。

比如监听窗口尺寸：

```jsx
import { useEffect, useState } from 'react';

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return width;
}
```

组件里就可以这样用：

```jsx
function Layout() {
  const width = useWindowWidth();

  return (
    <main>
      当前宽度：{width}
    </main>
  );
}
```

自定义 Hook 的价值不是“少写几行代码”，而是把复杂的同步逻辑封装起来，让组件继续保持声明式。

组件只关心：

```txt
我要窗口宽度
```

Hook 内部负责：

```txt
监听 resize
更新 state
清理监听
```

## 13. Vue3 开发者怎么理解脱围机制

从 Vue3 转过来，可以这样类比：

| Vue3 | React |
| :--- | :--- |
| `ref` 响应式数据 | `useState` |
| DOM 模板 ref | `useRef` 指向 DOM |
| `watch` / `watchEffect` | 部分场景类似 `useEffect` |
| `onMounted` / `onUnmounted` | `useEffect` + cleanup |
| composable | 自定义 Hook |

但要注意：React 的 Effect 不应该被简单理解成 `watch`。

Vue3 里 `watch` 常用于响应式数据变化后的副作用；React 里更推荐先判断：

```txt
这是渲染期间能算出来的吗？
这是用户事件导致的吗？
这是外部系统同步吗？
```

只有第三种才是 Effect 的主场。

## 14. 一个判断模板

遇到一个逻辑，不知道该放哪里，可以按这个顺序问：

1. 这个值会影响 UI 吗？
   - 会：用 state。
   - 不会，只是想跨渲染保存：用 ref。

2. 这个逻辑是用户某次操作触发的吗？
   - 是：放事件处理函数。

3. 这个值能由 props 或 state 算出来吗？
   - 能：直接在渲染期间计算，不要用 Effect。

4. 这个逻辑是在和外部系统同步吗？
   - 是：使用 Effect。

5. 这个同步逻辑需要清理吗？
   - 需要：在 Effect 里返回 cleanup 函数。

可以记成一句话：

> state 管 UI，ref 存非渲染数据，事件处理函数处理用户操作，Effect 同步外部系统。

## 15. 小结

React 的脱围机制不是让我们随便跳出 React，而是在必要时有控制地连接外部系统。

这一章可以抓住四个关键词：

1. **ref**：保存不触发渲染的值，或者拿到 DOM 节点。
2. **DOM 操作**：只在聚焦、滚动、测量、原生 API 等必要场景使用。
3. **Effect**：渲染后同步 React 外部系统。
4. **自定义 Hook**：把可复用的同步逻辑抽出来。

最重要的是克制：

- 能用渲染计算解决的，不用 Effect。
- 能用事件处理函数解决的，不用 Effect。
- 会影响 UI 的数据，用 state，不用 ref。
- 需要清理的外部连接，一定写 cleanup。

如果用一句话总结：

> 脱围机制是 React 给你的出口，但不是日常走路的主路。

理解这点以后，`useRef` 和 `useEffect` 就不会变成到处乱用的万能工具，而会成为你在真正需要连接外部世界时，精准使用的工具。

<ArticleComments slug="vue3-to-react-escape-hatches" />

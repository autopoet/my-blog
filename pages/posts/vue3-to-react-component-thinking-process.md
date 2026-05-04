---
title: Vue3 转 React 学习笔记（五）：如何从需求写出一个组件
date: 2026-05-01
categories:
  - 前端
tags:
  - Vue3
  - React
  - 组件设计
---
<ArticleViews slug="vue3-to-react-component-thinking-process" />

> 写 React 组件时，最容易犯的错不是语法写错，而是一上来就写代码。
> 更好的顺序是：先描述用户流程，再列 UI 状态，最后把状态翻译成 JSX。

这篇参考 React 官方文档中“用 State 响应输入”的思路，用一个城市测验表单来拆解：一个 React 交互组件应该怎么从 0 开始设计。

官方示例页面：<https://zh-hans.react.dev/learn/reacting-to-input-with-state>

## 1. 先用人话描述需求

先不要急着写代码，先用一句话描述用户要做什么：

> 用户看到一个问题，输入答案，点击提交。提交时不能重复点。答错显示错误，答对显示成功页面。

这句话看起来很普通，但里面已经藏着组件状态了。

我们把用户行为链路拆出来：

1. 用户输入答案。
2. 用户点击提交。
3. 系统检查答案。
4. 如果答案错误，显示错误，允许继续输入。
5. 如果答案正确，显示成功页面。

这一步是前端最核心的思考之一：**把模糊需求拆成用户行为链路。**

如果这一步没有想清楚，后面代码很容易变成：

- 到处写 `if`。
- 到处手动禁用按钮。
- 到处手动隐藏元素。
- 状态越来越多，但不知道谁控制谁。

React 的写法不是“我现在要操作哪个 DOM”，而是“页面现在处于什么状态，应该显示什么 UI”。

## 2. 列出 UI 状态，而不是直接写变量

这个组件最重要的状态，其实不是 `answer`，而是这个表单“现在处于什么阶段”。

它至少有三个阶段：

| 状态 | 含义 |
| :--- | :--- |
| `typing` | 用户正在输入 |
| `submitting` | 正在提交 |
| `success` | 提交成功 |

所以可以先设计一个状态：

```jsx
const [status, setStatus] = useState('typing');
```

然后再想每个状态下 UI 应该怎么变：

| 状态 | 输入框 | 按钮 | 页面内容 |
| :--- | :--- | :--- | :--- |
| `typing` | 可输入 | 有答案时可点 | 显示表单 |
| `submitting` | 禁用 | 禁用 | 显示表单，等待结果 |
| `success` | 不显示 | 不显示 | 显示“答对了！” |

这一步很重要。

你不是在想：

- 怎么禁用按钮？
- 怎么隐藏表单？
- 怎么显示成功？

而是在想：

- 当 `status` 是 `submitting` 时，按钮自然应该禁用。
- 当 `status` 是 `success` 时，表单自然不该显示。

这就是 React 思维：**UI 由状态推导出来。**

## 3. 列出需要保存的数据

除了阶段状态，还需要保存哪些数据？

### 用户输入了什么

```jsx
const [answer, setAnswer] = useState('');
```

输入框内容会变化，而且 UI 要根据它变化。

比如按钮是否禁用：

```jsx
answer.length === 0
```

所以它必须是状态。

### 当前有没有错误

```jsx
const [error, setError] = useState(null);
```

错误信息会影响 UI 是否显示：

```jsx
{error !== null && <p>{error.message}</p>}
```

所以它也应该是状态。

最终初始状态设计就出来了：

```jsx
const [answer, setAnswer] = useState('');
const [error, setError] = useState(null);
const [status, setStatus] = useState('typing');
```

这三个状态分别回答三个问题：

| 状态 | 回答的问题 |
| :--- | :--- |
| `answer` | 用户输入了什么？ |
| `error` | 当前有没有错误？ |
| `status` | 当前进行到哪一步？ |

这里也有一个小优化：错误不是单独加一个 `status = 'error'`，而是用 `error` 保存错误信息，同时让 `status` 回到 `typing`。这样用户答错后仍然处在“可继续输入”的阶段，只是多显示一条错误信息。

## 4. 先写静态 JSX 骨架

刚开始不要急着写异步逻辑。先把页面静态结构写出来：

```jsx
export default function CityQuiz() {
  return (
    <>
      <h2>城市测验</h2>
      <p>哪个城市有把空气变成饮用水的广告牌？</p>

      <form>
        <textarea />
        <br />
        <button>提交</button>
      </form>
    </>
  );
}
```

这一步只关心页面大概长什么样。

很多人会跳过这一步，直接写 `useState`、`handleSubmit`、`fetch`。但从组件设计角度看，先把静态 UI 搭出来很有价值：你会更容易看清楚哪些地方后续要被状态控制。

## 5. 把输入框变成受控组件

然后再处理用户输入。

原本：

```jsx
<textarea />
```

改成：

```jsx
<textarea
  value={answer}
  onChange={handleTextareaChange}
/>
```

再写函数：

```jsx
function handleTextareaChange(e) {
  setAnswer(e.target.value);
}
```

这时候你已经完成了第一条链路：

```txt
用户输入 -> 更新 answer -> 页面重新渲染 -> textarea 显示 answer
```

这里的判断标准是：

> 只要用户输入的内容后续会影响页面或提交逻辑，就应该放进 state。

Vue3 中我们可能用 `v-model`：

```vue
<textarea v-model="answer" />
```

React 里通常显式写成 `value` + `onChange`：

```jsx
<textarea
  value={answer}
  onChange={e => setAnswer(e.target.value)}
/>
```

这就是受控组件：输入框显示什么，由 React state 控制。

## 6. 设计提交行为

接着才写提交函数。

先写最粗糙版本：

```jsx
async function handleSubmit(e) {
  e.preventDefault();
  await submitForm(answer);
}
```

然后逐步补状态。

提交开始时：

```jsx
setStatus('submitting');
```

提交成功时：

```jsx
setStatus('success');
```

提交失败时：

```jsx
setStatus('typing');
setError(err);
```

最后形成：

```jsx
async function handleSubmit(e) {
  e.preventDefault();
  setStatus('submitting');

  try {
    await submitForm(answer);
    setStatus('success');
  }
  catch (err) {
    setStatus('typing');
    setError(err);
  }
}
```

这背后的思维是：

> 提交不是一个瞬间动作，而是一段过程。

过程开始：

```txt
status -> submitting
```

过程成功：

```txt
status -> success
```

过程失败：

```txt
status -> typing
error -> 错误对象
```

如果想让用户重新输入时清掉旧错误，可以在输入时补一行：

```jsx
function handleTextareaChange(e) {
  setAnswer(e.target.value);
  setError(null);
}
```

这不是必须的，但体验会更自然。

## 7. 把状态映射到 UI

现在状态都有了，开始让 UI 根据状态变化。

### 成功后显示成功页面

```jsx
if (status === 'success') {
  return <h1>答对了！</h1>;
}
```

意思是：成功状态下，整个组件不再显示表单，而是显示成功结果。

### 提交时禁用输入框

```jsx
<textarea
  disabled={status === 'submitting'}
/>
```

意思是：只要正在提交，输入框就不允许编辑。

### 空答案或提交中时禁用按钮

```jsx
<button
  disabled={
    answer.length === 0 ||
    status === 'submitting'
  }
>
  提交
</button>
```

这不是“手动操作按钮”，而是让按钮自己根据状态判断。

### 有错误时显示错误

```jsx
{error !== null && (
  <p className="Error">
    {error.message}
  </p>
)}
```

意思是：如果 `error` 有值，就显示错误信息；没有就不显示。

这一整步可以总结成一句话：

> 不要命令式地显示、隐藏、禁用元素，而是让 JSX 根据 state 自己算出来。

## 8. 补模拟接口

最后才写 `submitForm`。

```jsx
function submitForm(answer) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shouldError = answer.toLowerCase() !== 'lima';

      if (shouldError) {
        reject(new Error('猜的不错，但答案不对。再试试看吧！'));
      }
      else {
        resolve();
      }
    }, 1500);
  });
}
```

注意：这个函数不是 UI 的核心，它只是模拟服务端校验。

真实项目里这里可能是：

```jsx
await fetch('/api/submit', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ answer }),
});
```

所以设计组件时，应该先想 UI 状态和交互，再想接口怎么接。

接口只是状态变化的触发来源之一，不应该让接口逻辑反过来主导组件结构。

## 9. 完整组件代码

把上面的步骤合在一起：

```jsx
import { useState } from 'react';

export default function CityQuiz() {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('typing');

  if (status === 'success') {
    return <h1>答对了！</h1>;
  }

  function handleTextareaChange(e) {
    setAnswer(e.target.value);
    setError(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');

    try {
      await submitForm(answer);
      setStatus('success');
    }
    catch (err) {
      setStatus('typing');
      setError(err);
    }
  }

  const isSubmitting = status === 'submitting';
  const isSubmitDisabled = answer.length === 0 || isSubmitting;

  return (
    <>
      <h2>城市测验</h2>
      <p>哪个城市有把空气变成饮用水的广告牌？</p>

      <form onSubmit={handleSubmit}>
        <textarea
          value={answer}
          disabled={isSubmitting}
          onChange={handleTextareaChange}
        />
        <br />
        <button disabled={isSubmitDisabled}>
          {isSubmitting ? '提交中...' : '提交'}
        </button>
        {error !== null && (
          <p className="Error">
            {error.message}
          </p>
        )}
      </form>
    </>
  );
}

function submitForm(answer) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shouldError = answer.toLowerCase() !== 'lima';

      if (shouldError) {
        reject(new Error('猜的不错，但答案不对。再试试看吧！'));
      }
      else {
        resolve();
      }
    }, 1500);
  });
}
```

这里我额外加了两个派生变量：

```jsx
const isSubmitting = status === 'submitting';
const isSubmitDisabled = answer.length === 0 || isSubmitting;
```

它们不是新的 state，因为它们可以由已有 state 计算出来。

这也呼应了前一篇状态管理里的原则：**能推导出来的数据，不要放进 state。**

## 10. 从 0 开始的顺序

你可以用这个顺序去写几乎所有交互组件：

1. 用人话描述用户流程。
2. 列出页面有哪些状态。
3. 列出需要保存的数据。
4. 先写静态 JSX。
5. 把会变化的输入接到 state。
6. 写事件处理函数。
7. 用 state 控制 UI 展示。
8. 最后补异步、错误、禁用、防重复提交等边界。

这套顺序比“直接让 AI 生成代码”重要多了。

AI 可以帮你写代码，但你要告诉它：

- 这个组件有 `typing`、`submitting`、`success` 三种状态。
- 输入 `answer` 是受控组件。
- 提交时按钮要禁用。
- 错误时保留用户输入并展示错误。
- 成功时替换成成功页面。

这就是你负责的“思维过程”。

## 11. 真实思考过程应该长什么样

假设我从 0 开始写这个答题表单，我脑子里会这么想：

我要做的是一个答题表单。

用户需要输入答案，所以我要有 `answer` 状态。

提交可能需要等待接口，所以不能只有“点了按钮”这个概念。我要有 `status` 状态表示当前是 `typing`、`submitting` 还是 `success`。

提交失败要展示错误，所以我要有 `error` 状态。

页面初始状态：

```jsx
answer = '';
error = null;
status = 'typing';
```

用户输入时：

```txt
更新 answer
```

用户提交时：

```txt
阻止默认刷新
status -> submitting
调用 submitForm(answer)
```

如果成功：

```txt
status -> success
```

如果失败：

```txt
status -> typing
error -> 错误对象
```

UI 根据状态变化：

- `status` 是 `success`，显示成功页。
- `status` 是 `submitting`，禁用 `textarea` 和 `button`。
- `answer` 为空，禁用 `button`。
- `error` 不为空，显示错误信息。

你看，这里面还没开始写完整代码，但组件已经基本成型了。

## 12. 先画状态表

以后做交互组件前，可以先画一个这样的表：

| 用户动作 | 当前状态 | 发生什么 | 新状态 | UI 变化 |
| :--- | :--- | :--- | :--- | :--- |
| 打字 | `typing` | 更新 `answer` | `typing` | 输入框内容变化 |
| 点提交 | `typing` | 发请求 | `submitting` | 禁用输入框和按钮 |
| 请求成功 | `submitting` | 设置成功 | `success` | 显示成功页面 |
| 请求失败 | `submitting` | 保存错误 | `typing` | 显示错误，恢复可输入 |

这个表一出来，代码基本就是翻译。

它还能帮你发现遗漏：

- 提交中还能不能继续输入？
- 请求失败后答案要不要保留？
- 请求失败后按钮是否恢复可点？
- 成功后还能不能回到表单？
- 用户重新输入时错误要不要清掉？

这些都是代码之前就应该想清楚的问题。

## 13. AI Coding 时代怎么指挥 AI

不要只说：

> 帮我写一个表单组件。

这样 AI 很容易写出能跑但不一定合理的代码。

更好的说法是：

> 帮我写一个 React 表单组件：
> - 有 `answer`、`status`、`error` 三个状态。
> - `status` 有 `typing`、`submitting`、`success`。
> - `textarea` 是受控组件。
> - 提交时 `status` 变成 `submitting`，并禁用输入框和按钮。
> - 提交成功后显示成功页面。
> - 提交失败后恢复 `typing`，并展示错误信息。
> - 按钮在答案为空或 `submitting` 时禁用。

这才是你作为开发者的价值。

你不是负责“打字”，你是负责：

- 定义状态。
- 定义状态变化。
- 定义 UI 和状态的映射关系。
- 定义边界条件。

AI 可以帮你生成代码，但组件的状态模型最好由你来决定。

## 14. 一个通用模板

以后写任何 React 交互组件，都可以先问自己这 5 个问题：

1. 用户能做什么？
2. 组件有哪些状态？
3. 哪些数据会变化？
4. 每个状态下 UI 应该长什么样？
5. 用户操作后，状态如何变化？

套到这个组件里：

| 问题 | 答案 |
| :--- | :--- |
| 用户能做什么？ | 输入答案，点击提交 |
| 组件有哪些状态？ | `typing`、`submitting`、`success` |
| 哪些数据会变化？ | `answer`、`error`、`status` |
| 每个状态下 UI 怎么显示？ | `typing` 可输入，`submitting` 禁用，`success` 显示成功 |
| 用户操作后状态怎么变？ | 输入更新 `answer`，提交进入 `submitting`，成功进入 `success`，失败回到 `typing` 并设置 `error` |

## 15. 小结

写 React 组件时，不要从 `useState` 开始，也不要从接口开始。

更稳的顺序是：

```txt
用户流程 -> UI 状态 -> 状态数据 -> 静态 JSX -> 事件处理 -> 状态映射 UI -> 边界处理
```

React 的声明式思维可以概括成一句话：

> 先定义状态，再让 UI 成为状态的结果。

当你能把一个组件拆成状态表，代码就不再是一团临时拼出来的逻辑，而是一个清晰的状态机。组件越复杂，这个习惯越有价值。

<ArticleComments slug="vue3-to-react-component-thinking-process" />

---
title: Vue3 转 React 学习笔记（四）：状态管理
date: 2026-04-30
categories:
  - 啃啃原理
tags:
  - Vue3
  - React
  - 状态管理
---
<ArticleViews slug="vue3-to-react-managing-state" />

> 前三篇分别写了 JSX 基础、描述 UI 和添加交互。
> 这一篇继续参考 React 官方中文文档的“状态管理”，重点理解 React 如何组织组件状态、如何避免状态混乱，以及什么时候使用 Reducer 和 Context。

## 1. React 里的状态管理在解决什么

上一节“添加交互”里，我们已经知道了 `useState` 可以让组件记住数据。

但项目稍微复杂一点，就会出现新的问题：

- 一个表单有多个状态，怎么判断当前应该显示什么？
- 一个状态被多个组件需要，应该放在哪里？
- state 是对象或数组时，怎么设计才不容易写错？
- 组件切换时，状态为什么有时会保留，有时会重置？
- 多个组件都要读写同一份状态时，props 一层层传递会不会太麻烦？

React 官方“状态管理”这一章，其实不是一上来就讲 Redux 或 Zustand，而是先讲清楚 React 自己的状态设计原则。

从 Vue3 转过来，可以先这样理解：

| Vue3 | React |
| :--- | :--- |
| `ref` / `reactive` | `useState` |
| `computed` | 从 state 推导出的变量 |
| `emit` / props | props + 回调函数 |
| Pinia | Context / Reducer / 外部状态库 |
| 响应式依赖追踪 | state 改变后重新渲染组件 |

React 状态管理的第一原则是：**先把 state 放在最需要它的地方，等多个组件都需要时再提升。**

## 2. 用状态响应输入

React 不是直接命令式地修改页面，而是让 UI 根据 state 呈现不同状态。

比如一个提交表单，可能有这些状态：

- 正在输入。
- 正在提交。
- 提交成功。
- 提交失败。

我们可以用 state 描述这些状态：

```jsx
import { useState } from 'react';

function FeedbackForm() {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('typing');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('submitting');

    try {
      await submitFeedback(text);
      setStatus('success');
    }
    catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return <p>提交成功，感谢反馈。</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={text}
        disabled={status === 'submitting'}
        onChange={e => setText(e.target.value)}
      />
      <button disabled={status === 'submitting'}>
        提交
      </button>
      {status === 'error' && <p>提交失败，请稍后再试。</p>}
    </form>
  );
}
```

这里的重点不是 `textarea` 怎么写，而是 UI 完全由 `text` 和 `status` 决定。

Vue3 里我们可能写：

```js
const text = ref('');
const status = ref('typing');
```

React 的思路类似，但它更强调：每次 `setStatus` 都是在提交“下一次渲染的状态”。

## 3. 不要把能计算出来的数据放进 state

React 官方文档在“选择 state 结构”中强调：不要保存冗余状态。

比如有一个姓名表单：

```jsx
function NameForm() {
  const [firstName, setFirstName] = useState('Ada');
  const [lastName, setLastName] = useState('Lovelace');
  const [fullName, setFullName] = useState('Ada Lovelace');
}
```

这里的 `fullName` 是冗余的，因为它可以由 `firstName` 和 `lastName` 计算出来。

更好的写法是：

```jsx
function NameForm() {
  const [firstName, setFirstName] = useState('Ada');
  const [lastName, setLastName] = useState('Lovelace');

  const fullName = `${firstName} ${lastName}`;

  return <p>{fullName}</p>;
}
```

这很像 Vue3 里 `computed` 的思想：

```js
const fullName = computed(() => `${firstName.value} ${lastName.value}`);
```

区别是 React 里简单派生值可以直接在渲染时计算，不一定需要额外 API。

状态设计时可以问自己三个问题：

1. 这个值是否会随时间变化？
2. 这个值是否能由已有 props 或 state 推导出来？
3. 这个值是否需要触发重新渲染？

如果答案是“能推导出来”，就不要额外放进 state。

## 4. 避免互相矛盾的 state

有些状态组合会让 UI 进入不合理状态。

比如：

```jsx
const [isSending, setIsSending] = useState(false);
const [isSent, setIsSent] = useState(false);
```

理论上可能出现：

```js
isSending === true && isSent === true
```

但一个表单不应该既“正在发送”又“已经发送”。

更好的方式是用一个状态枚举：

```jsx
const [status, setStatus] = useState('typing');
```

可能的值包括：

```js
'typing'
'sending'
'sent'
'error'
```

这样 UI 状态就变成互斥关系，不容易出现矛盾组合。

从 Vue3 转过来，这一点也很实用。很多时候我们会写多个 `ref(false)`，结果越写越乱。React 的状态设计提醒我们：**多个布尔值不一定比一个明确的状态字段更清晰。**

## 5. 避免重复 state

再看一个列表选择的例子。

不推荐：

```jsx
const [items, setItems] = useState(initialItems);
const [selectedItem, setSelectedItem] = useState(items[0]);
```

如果后面 `items` 变了，`selectedItem` 可能还指向旧对象，导致数据不同步。

更好的方式是只保存选中项的 id：

```jsx
const [items, setItems] = useState(initialItems);
const [selectedId, setSelectedId] = useState(initialItems[0].id);

const selectedItem = items.find(item => item.id === selectedId);
```

这背后的原则是：**state 中尽量保存最小必要数据。**

Vue3 里也一样，如果既保存列表，又保存列表里的完整对象引用，后续更新时就容易出现“旧引用”和“新列表”不同步的问题。

## 6. 状态提升：多个组件共享状态

当两个组件需要同步同一份数据时，就把 state 移动到它们最近的共同父组件。

比如两个面板，只允许同时展开一个：

```jsx
import { useState } from 'react';

function Accordion() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <Panel
        title="关于 React"
        isActive={activeIndex === 0}
        onShow={() => setActiveIndex(0)}
      >
        React 使用组件描述 UI。
      </Panel>
      <Panel
        title="关于 Vue3"
        isActive={activeIndex === 1}
        onShow={() => setActiveIndex(1)}
      >
        Vue3 使用响应式系统驱动更新。
      </Panel>
    </>
  );
}

function Panel({ title, isActive, onShow, children }) {
  return (
    <section>
      <h3>{title}</h3>
      {isActive ? (
        <p>{children}</p>
      ) : (
        <button onClick={onShow}>展开</button>
      )}
    </section>
  );
}
```

这里 `Panel` 自己不再管理是否展开，而是由父组件 `Accordion` 统一管理 `activeIndex`。

这和 Vue3 中父组件通过 props 控制子组件很像：

```vue
<Panel :active="activeIndex === 0" @show="activeIndex = 0" />
```

React 的说法是：把 state 提升到共同父组件，然后通过 props 和回调函数传下去。

## 7. 受控组件和非受控组件

当组件的重要信息由 props 控制时，可以说它是“受控”的。

刚才的 `Panel` 就是受控组件：

```jsx
function Panel({ isActive, onShow }) {
  // 是否展开由父组件传入
}
```

如果 `Panel` 内部自己写：

```jsx
const [isActive, setIsActive] = useState(false);
```

那它就是非受控组件，因为展开状态由自己管理。

二者没有绝对好坏：

- 局部状态只影响自己时，可以放在组件内部。
- 多个组件需要同步时，应该交给父组件控制。

Vue3 里也有类似区分：

- 组件内部自己 `ref` 管理状态。
- 父组件通过 `v-model` 或 props 控制状态。

## 8. 保留和重置 state

React 会根据组件在 UI 树中的位置来决定是否保留 state。

看这个例子：

```jsx
function App() {
  const [showA, setShowA] = useState(true);

  return (
    <>
      {showA ? <Counter name="A" /> : <Counter name="B" />}
      <button onClick={() => setShowA(!showA)}>切换</button>
    </>
  );
}
```

虽然 JSX 里写的是两个不同的 `<Counter />`，但它们出现在同一个位置，React 可能会复用组件状态。

如果希望切换时重置 state，可以加 `key`：

```jsx
{showA ? (
  <Counter key="A" name="A" />
) : (
  <Counter key="B" name="B" />
)}
```

`key` 不只用于列表，也可以用来告诉 React：“这是两个不同的组件实例”。

这点和 Vue3 很像。Vue 中我们也会用 `:key` 强制组件重建：

```vue
<Counter :key="name" :name="name" />
```

## 9. 用 Reducer 整理复杂状态逻辑

当一个组件里有很多 state 更新逻辑时，`useState` 会逐渐变得分散。

比如 todo 列表可能有：

- 添加任务。
- 删除任务。
- 修改任务。
- 切换完成状态。
- 清空已完成任务。

这时可以用 `useReducer` 把状态更新逻辑集中起来。

```jsx
import { useReducer } from 'react';

function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false,
        },
      ];
    }
    case 'changed': {
      return tasks.map(task =>
        task.id === action.task.id ? action.task : task
      );
    }
    case 'deleted': {
      return tasks.filter(task => task.id !== action.id);
    }
    default: {
      throw Error(`未知 action：${action.type}`);
    }
  }
}

function TaskApp() {
  const [tasks, dispatch] = useReducer(tasksReducer, []);

  function handleAddTask(text) {
    dispatch({
      type: 'added',
      id: crypto.randomUUID(),
      text,
    });
  }
}
```

`useReducer` 的核心是：

- 组件里发出 action。
- reducer 根据旧 state 和 action 返回新 state。
- reducer 必须保持纯粹，不要直接修改旧 state。

更专业一点说，`dispatch` 接收的是一个 **action 对象**。`type` 是 action 的标识，用来告诉 reducer 发生了什么事件；除 `type` 之外的字段，是这个事件携带的上下文数据，也就是 reducer 计算下一个 state 所需的最小信息。

比如：

```jsx
dispatch({
  type: 'added',
  id: crypto.randomUUID(),
  text,
});
```

这里的 `type: 'added'` 表示“发生了新增任务事件”，`id` 和 `text` 则是新增任务所需的上下文数据。reducer 不关心按钮在哪里点的，也不关心表单长什么样，它只关心：发生了什么事件，以及根据这次事件计算新 state 需要哪些信息。

判断 action 字段时，可以用一个很实用的问题：

> reducer 处理这个事件时，需要知道哪些额外信息？

如果不需要额外信息，只传 `type`：

```jsx
dispatch({ type: 'claim_started' });
```

如果需要一个 id：

```jsx
dispatch({ type: 'deleted', id });
```

如果需要一个对象：

```jsx
dispatch({ type: 'changed', task });
```

如果需要接口返回数据：

```jsx
dispatch({ type: 'progress_loaded', progress });
```

如果需要错误信息：

```jsx
dispatch({ type: 'claim_failed', error });
```

一句话：**action 除了 `type` 之外，只放 reducer 计算下一个 state 必须知道的信息。** 不要把组件内部临时变量、DOM 事件对象、按钮文案这类和状态计算无关的东西塞进 action。

这有点像把“状态怎么变”的逻辑从组件里抽出去。它不等于 Redux，但心智模型很接近。

## 10. 用 Context 避免层层传 props

如果很多层级的组件都需要同一份数据，props 会一层层传下去。

```jsx
<App>
  <Layout>
    <Sidebar>
      <UserPanel user={user} />
    </Sidebar>
  </Layout>
</App>
```

如果中间组件并不关心 `user`，只是负责继续往下传，就会产生“props drilling”。

React 提供 Context 来解决这类问题。

```jsx
import { createContext, useContext } from 'react';

const ThemeContext = createContext('light');

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Page />
    </ThemeContext.Provider>
  );
}

function Button() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>按钮</button>;
}
```

Vue3 里对应的能力是 `provide` / `inject`：

```js
provide('theme', 'dark');
const theme = inject('theme');
```

Context 适合放什么？

- 当前主题。
- 当前登录用户。
- 当前语言。
- 路由或全局配置。
- 被一组组件共同使用的状态和 dispatch。

不建议什么都放 Context。局部状态还是应该放在局部，否则组件之间会过早耦合。

## 11. Reducer 和 Context 组合

当状态逻辑复杂，并且很多组件都需要访问时，可以把 `useReducer` 和 Context 组合起来。

```jsx
import { createContext, useContext, useReducer } from 'react';

const TasksContext = createContext(null);
const TasksDispatchContext = createContext(null);

function TasksProvider({ children }) {
  const [tasks, dispatch] = useReducer(tasksReducer, []);

  return (
    <TasksContext.Provider value={tasks}>
      <TasksDispatchContext.Provider value={dispatch}>
        {children}
      </TasksDispatchContext.Provider>
    </TasksContext.Provider>
  );
}

function useTasks() {
  return useContext(TasksContext);
}

function useTasksDispatch() {
  return useContext(TasksDispatchContext);
}
```

业务组件里就可以直接读取：

```jsx
function TaskList() {
  const tasks = useTasks();
  const dispatch = useTasksDispatch();

  return tasks.map(task => (
    <label key={task.id}>
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => {
          dispatch({
            type: 'changed',
            task: {
              ...task,
              done: !task.done,
            },
          });
        }}
      />
      {task.text}
    </label>
  ));
}
```

这套组合可以理解成 React 内置的轻量状态管理方案：

- Reducer 负责“状态怎么改”。
- Context 负责“状态怎么传”。

如果项目规模更大，或者需要缓存请求、跨页面持久化、复杂调试工具，再考虑 Zustand、Redux Toolkit、TanStack Query 等外部方案会更合适。

## 12. Vue3 开发者的状态管理迁移心法

从 Vue3 转 React，状态管理最容易混淆的是“能不能直接改”。

Vue3：

```js
state.user.name = 'Alex';
list.push(newItem);
```

React：

```jsx
setUser({
  ...user,
  name: 'Alex',
});

setList([
  ...list,
  newItem,
]);
```

React 更强调不可变数据，因为它依赖“新 state 描述下一次 UI”这个模型。

可以用这几条规则帮助判断：

1. 能由已有数据算出来的，不放进 state。
2. 多个布尔状态互斥时，改用一个枚举状态。
3. 多个组件要共享时，把 state 提升到共同父组件。
4. 组件需要强制重置时，考虑使用 `key`。
5. 状态更新逻辑复杂时，使用 `useReducer`。
6. 状态需要跨很多层组件读取时，使用 Context。

## 13. 小结

React 的状态管理不是从全局 store 开始，而是从 state 设计开始。

这一章真正重要的不是背 API，而是理解三个层次：

1. **局部状态**：用 `useState` 管理组件自己的变化。
2. **共享状态**：通过状态提升让多个组件保持同步。
3. **复杂状态**：用 Reducer 整理更新逻辑，用 Context 解决跨层传递。

对 Vue3 开发者来说，可以把 React 状态管理理解为：少一点自动响应式，多一点显式数据流。它一开始写起来会更啰嗦，但状态来源、更新路径和组件关系会更清楚。

下一篇如果继续沿着官方学习路径，就会进入“脱围机制”，也就是 ref、Effect、非 React 系统同步等内容。

<ArticleComments slug="vue3-to-react-managing-state" />

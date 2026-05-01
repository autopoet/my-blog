---
title: 遇到一大段 React 代码，应该怎么读懂它
date: 2026-05-01
categories:
  - 碎碎念
tags:
  - React
  - 前端学习
  - 代码阅读
---
<ArticleViews slug="how-to-read-react-code" />

> 读 React 代码最怕的不是代码长，而是没有顺序。
> 如果从第一行开始硬啃，很容易陷进变量、Hook、组件嵌套和回调函数里，最后每一行都看了，但还是不知道它在干什么。

这篇想记录一个更实用的读法：遇到一大段 React 代码时，先不要急着理解每一行，而是按顺序建立“组件地图”。

## 1. 先看这个组件想解决什么问题

读代码前，先问一句最朴素的问题：

> 这个组件是给用户做什么用的？

不要一上来就看 `useState`、`useEffect`、`map`、`dispatch`。

先找这些信息：

- 组件名是什么？
- 文件名是什么？
- 页面上大概渲染什么？
- 有没有标题、按钮、表单、列表、弹窗？
- 它像是一个页面、一个表单、一个列表，还是一个小组件？

比如看到：

```jsx
export default function TodoBoard() {
  return (
    <section>
      <h1>Todo Board</h1>
      <TodoForm />
      <TodoList />
    </section>
  );
}
```

你先不用管 `TodoForm` 和 `TodoList` 里面怎么写。

先得到第一层结论：

> 这是一个 Todo 看板组件，它大概率负责新增任务和展示任务列表。

这一步是在建立阅读方向。

代码再复杂，也应该先回到“它对用户呈现了什么”。

## 2. 再看 return，先读 UI 骨架

React 组件最终要返回 JSX，所以读一个组件时，通常可以先跳到 `return`。

因为 `return` 会告诉你：

- 页面结构是什么？
- 哪些组件被组合在一起？
- 哪些地方有条件渲染？
- 哪些地方在循环列表？
- 哪些按钮和输入框是交互入口？

比如：

```jsx
return (
  <>
    <SearchBox
      value={keyword}
      onChange={setKeyword}
    />

    {isLoading && <Loading />}
    {error && <ErrorMessage error={error} />}

    <ProductList products={filteredProducts} />
  </>
);
```

只看这段 JSX，你已经能读出很多东西：

- 有一个搜索框。
- 有加载状态。
- 有错误状态。
- 最后展示商品列表。
- `keyword` 会影响列表。
- `filteredProducts` 可能是筛选后的数据。

所以读 React 代码时，不要从上往下死读。

更好的顺序是：

```txt
组件名 -> return JSX -> 页面结构 -> 交互入口
```

先知道它“长什么样”，再回头看它“怎么做到”。

## 3. 找 props：这个组件从外面拿了什么

接着看组件参数。

```jsx
function UserCard({ user, onFollow, isFollowing }) {
  return (
    <article>
      <h2>{user.name}</h2>
      <button onClick={() => onFollow(user.id)}>
        {isFollowing ? '已关注' : '关注'}
      </button>
    </article>
  );
}
```

这里先不要纠结按钮怎么点。

先看 props：

| props | 含义 |
| :--- | :--- |
| `user` | 用户数据 |
| `onFollow` | 点击关注时通知父组件 |
| `isFollowing` | 当前是否已关注 |

props 说明这个组件不是完全独立的。它有一部分数据和行为来自父组件。

读 props 时，可以问：

1. 这个组件需要外部给它什么数据？
2. 它会不会通过回调函数通知外部？
3. 哪些状态不是它自己管理的，而是父组件控制的？

如果一个组件 props 很多，优先按类型分组：

- 数据类 props：`user`、`list`、`value`。
- 状态类 props：`loading`、`disabled`、`selected`。
- 回调类 props：`onSubmit`、`onChange`、`onClose`。
- 配置类 props：`size`、`mode`、`placeholder`。

props 是组件和外部世界的接口。

先读接口，能帮你判断这个组件的职责边界。

## 4. 找 state：这个组件自己记住了什么

然后看 `useState`。

```jsx
const [keyword, setKeyword] = useState('');
const [isOpen, setIsOpen] = useState(false);
const [selectedId, setSelectedId] = useState(null);
```

每一个 state 都是在回答一个问题：

| state | 组件记住了什么 |
| :--- | :--- |
| `keyword` | 用户搜索了什么 |
| `isOpen` | 面板是否打开 |
| `selectedId` | 当前选中了哪一项 |

读 state 时，不要只看变量名，要问：

1. 这个状态影响哪块 UI？
2. 哪个事件会更新它？
3. 它能不能由 props 或其他 state 推导出来？
4. 它是临时 UI 状态，还是业务数据？

比如：

```jsx
const [fullName, setFullName] = useState('');
```

如果下面还有：

```jsx
const [firstName, setFirstName] = useState('');
const [lastName, setLastName] = useState('');
```

那你就要警觉：`fullName` 可能是冗余状态。

React 代码是否好理解，很大程度上取决于 state 设计是否清楚。

读懂 state，就读懂了一半组件逻辑。

## 5. 找派生数据：哪些值是算出来的

React 组件里经常会有一些变量不是 state，而是由 props 或 state 算出来的。

```jsx
const filteredProducts = products.filter(product =>
  product.name.includes(keyword)
);

const totalPrice = cartItems.reduce(
  (sum, item) => sum + item.price * item.count,
  0
);

const isSubmitDisabled = answer.length === 0 || status === 'submitting';
```

这些变量很重要，因为它们通常直接影响 UI。

读派生数据时，可以问：

- 它依赖哪些 state 或 props？
- 它最终被用在哪里？
- 它是不是在帮 JSX 变得更清晰？

比如：

```jsx
const isSubmitDisabled = answer.length === 0 || status === 'submitting';
```

这句话读懂后，下面的按钮就很好理解：

```jsx
<button disabled={isSubmitDisabled}>提交</button>
```

这比直接在 JSX 里塞一大段条件更好读。

所以读代码时，看到 `const xxx = ...` 不要一眼略过。很多组件的业务逻辑就藏在这些派生变量里。

## 6. 找事件处理函数：用户能做什么

接着看所有 `handleXxx` 或 `onXxx` 函数。

```jsx
function handleSubmit(e) {
  e.preventDefault();
  setStatus('submitting');
  submitForm(answer);
}

function handleClose() {
  setIsOpen(false);
}

function handleSelect(id) {
  setSelectedId(id);
}
```

事件函数是用户行为和状态变化之间的桥。

读事件函数时，可以按这个模板拆：

```txt
用户做了什么 -> 改了哪些 state -> 触发了哪些副作用 -> UI 会怎么变
```

比如：

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

它的意思不是“这里有一个异步函数”这么简单。

真正应该读成：

```txt
用户提交表单
-> 阻止浏览器默认刷新
-> 进入 submitting 状态
-> 请求成功就进入 success
-> 请求失败就回到 typing，并记录错误
```

如果你能把事件函数翻译成这条链路，代码就已经读懂了。

## 7. 找条件渲染：页面有哪些分支

React 代码里经常会出现：

```jsx
if (status === 'success') {
  return <SuccessPage />;
}
```

或者：

```jsx
{error && <ErrorMessage error={error} />}
{isLoading ? <Spinner /> : <Content />}
```

这些地方说明 UI 有分支。

读条件渲染时，要把它们整理成状态表。

比如：

| 条件 | 显示什么 |
| :--- | :--- |
| `status === 'success'` | 成功页 |
| `error !== null` | 错误提示 |
| `isLoading === true` | 加载中 |
| `items.length === 0` | 空状态 |

很多复杂组件看起来乱，是因为它同时处理了很多 UI 分支：

- loading
- error
- empty
- success
- editing
- readonly

读的时候不要被 JSX 嵌套吓到。

先把分支列出来，你就知道它到底有几种页面状态。

## 8. 找列表渲染：数据是怎么变成 UI 的

看到 `map`，就说明有列表渲染。

```jsx
{todos.map(todo => (
  <TodoItem
    key={todo.id}
    todo={todo}
    onToggle={handleToggle}
    onDelete={handleDelete}
  />
))}
```

读列表时先看三件事：

1. 遍历的数据是谁？
2. 每一项渲染成什么组件？
3. 每一项有哪些操作？

上面这段可以读成：

```txt
把 todos 数组渲染成 TodoItem 列表
每个 TodoItem 拿到自己的 todo
每个 TodoItem 可以 toggle 和 delete
```

再继续往下追：

```jsx
function handleToggle(id) {
  setTodos(todos.map(todo =>
    todo.id === id
      ? { ...todo, done: !todo.done }
      : todo
  ));
}
```

这时你就能连起来：

```txt
用户点击某一项
-> TodoItem 调用 onToggle(todo.id)
-> 父组件更新 todos
-> 列表重新渲染
```

React 代码里，列表通常是理解数据流的关键位置。

## 9. 找 useEffect：组件和外部世界怎么同步

如果组件里有 `useEffect`，要格外注意。

因为 `useEffect` 通常意味着它在和 React 之外的东西同步：

- 请求接口。
- 订阅事件。
- 操作浏览器 API。
- 设置定时器。
- 同步第三方库。

比如：

```jsx
useEffect(() => {
  async function loadUser() {
    const data = await fetchUser(userId);
    setUser(data);
  }

  loadUser();
}, [userId]);
```

读这个 Effect，要看三个点：

1. 它什么时候执行？
2. 它做了什么副作用？
3. 它依赖什么数据？

这段可以读成：

```txt
当 userId 变化时
-> 请求用户数据
-> 请求回来后更新 user
```

如果 Effect 里有 return：

```jsx
useEffect(() => {
  const timer = setInterval(tick, 1000);

  return () => {
    clearInterval(timer);
  };
}, []);
```

就说明它有清理逻辑：

```txt
组件挂载时启动定时器
组件卸载时清除定时器
```

读 `useEffect` 时不要只看函数体，还要看依赖数组。依赖数组决定了它什么时候重新执行。

## 10. 找数据流：数据从哪里来，到哪里去

读完整个组件后，要把数据流串起来。

可以用一句话描述：

```txt
数据从 props / 请求 / 用户输入来
经过 state 和派生变量
最后变成 JSX
用户操作再通过事件函数更新 state
```

比如一个搜索列表组件：

```txt
products 从 props 来
keyword 来自输入框 state
filteredProducts 由 products + keyword 计算出来
ProductList 渲染 filteredProducts
用户输入时 setKeyword
组件重新计算 filteredProducts
列表更新
```

如果你能把这条链路说出来，就说明你不是只看懂了语法，而是真正理解了组件。

React 组件的核心就是数据流：

```txt
props/state -> render -> events -> setState -> render
```

## 11. 最后再看细节和边界

前面几步读完后，才适合回头看细节。

比如：

- 有没有防重复提交？
- 空数据怎么显示？
- 接口失败怎么处理？
- 按钮什么时候禁用？
- 输入时错误要不要清除？
- 列表项的 `key` 是否稳定？
- 对象和数组更新有没有保持不可变？
- `useEffect` 有没有遗漏依赖？

这些细节很重要，但不要一开始就看。

一开始就看细节，很容易迷路。

先看整体，再看局部，最后看边界。

## 12. 一套固定阅读顺序

以后遇到一大段 React 代码，可以按这个顺序读：

1. 看组件名和文件名：它大概负责什么？
2. 看 `return`：页面结构是什么？
3. 看 props：外部传进来什么？
4. 看 state：组件自己记住什么？
5. 看派生变量：哪些 UI 是算出来的？
6. 看事件函数：用户操作会怎么改变状态？
7. 看条件渲染：页面有几种分支？
8. 看列表渲染：数组怎么变成组件？
9. 看 `useEffect`：它和外部系统怎么同步？
10. 串数据流：数据从哪里来，到哪里去？
11. 查边界：loading、error、empty、disabled、cleanup。

这个顺序的好处是：你不是逐行读代码，而是在给组件画地图。

## 13. 用一个小例子练习

假设看到这段代码：

```jsx
function SearchUsers({ users }) {
  const [keyword, setKeyword] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <>
      <input
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
        placeholder="搜索用户"
      />

      <ul>
        {filteredUsers.map(user => (
          <li key={user.id}>
            <button onClick={() => setSelectedId(user.id)}>
              {user.name}
            </button>
          </li>
        ))}
      </ul>

      {selectedId !== null && (
        <p>当前选中用户 ID：{selectedId}</p>
      )}
    </>
  );
}
```

按照刚才的顺序读：

| 角度 | 结论 |
| :--- | :--- |
| 组件名 | `SearchUsers`，搜索用户 |
| props | `users` 从外部传入 |
| state | `keyword` 记录搜索词，`selectedId` 记录选中用户 |
| 派生变量 | `filteredUsers` 是根据 `users` 和 `keyword` 算出来的 |
| 事件 | 输入框更新 `keyword`，点击按钮更新 `selectedId` |
| 列表 | `filteredUsers.map` 渲染用户列表 |
| 条件渲染 | 有选中用户时显示 ID |
| 数据流 | 外部 users + 输入 keyword -> filteredUsers -> 列表 UI |

这样一拆，这段代码就不复杂了。

你甚至可以把它翻译成人话：

> 这是一个用户搜索组件。它从父组件拿到用户列表，自己维护搜索关键词和当前选中的用户 ID。输入关键词后筛选列表，点击用户后显示当前选中的用户 ID。

能翻译成人话，才是真的读懂。

## 14. 读 React 代码时不要陷入这些坑

### 不要从 import 开始纠结

很多文件开头会有一堆 import。

```jsx
import { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { fetchUsers } from '@/api/user';
```

刚开始不用逐个研究。

先知道它大概用了哪些能力就行：

- React Hook。
- 样式工具。
- API 请求函数。

等你读到具体使用位置，再回来确认 import 来源。

### 不要一开始就钻进子组件

看到：

```jsx
<UserList users={users} onSelect={handleSelect} />
```

先不要马上跳进 `UserList`。

先在当前组件里弄清楚：

- 传了什么数据？
- 传了什么事件？
- 子组件在当前组件里扮演什么角色？

只有当你需要理解子组件内部行为时，再进去读。

### 不要把每个变量都当成同等重要

有些变量是核心状态，有些只是格式化结果。

优先读这些：

- props
- state
- dispatch
- event handler
- effect
- return JSX

临时变量和样式变量可以后看。

### 不要只看代码，不说人话

读完一段代码后，强迫自己用一句话总结：

> 这个组件从哪里拿数据，用户能做什么，操作后 UI 怎么变？

如果说不出来，就说明还没真正读懂。

## 15. 小结

遇到一大段 React 代码，不要从第一行开始硬读。

更好的顺序是：

```txt
先看它是什么
再看它长什么样
再看它从外面拿什么
再看它自己记住什么
再看用户能做什么
再看状态如何映射 UI
最后检查副作用和边界
```

React 代码看起来复杂，通常不是因为语法复杂，而是因为里面同时混着：

- UI 结构
- 组件通信
- 状态设计
- 事件处理
- 条件分支
- 列表渲染
- 副作用
- 边界情况

读代码的本质，就是把这些东西拆开，再重新连成一条数据流。

以后看到一大段 React 代码，可以先别慌，按这句话走：

> 先读 UI，再读数据；先读状态，再读事件；先读主流程，再读边界。

这套顺序练熟以后，你读 React 代码会快很多，也更容易判断一段代码到底是清晰还是混乱。

<ArticleComments slug="how-to-read-react-code" />

---
title: Vue3 转 React 学习笔记（三）：添加交互
date: 2026-04-27
categories:
  - 前端
tags:
  - Vue3
  - React
  - State
---
<ArticleViews slug="vue3-to-react-adding-interactivity" />

> 前两篇分别整理了 React 项目创建、JSX 基础和“描述 UI”。
> 这一篇继续参考 React 官方中文文档的“添加交互”，从 Vue3 开发者的视角理解事件、state、渲染流程和不可变更新。

## 1. 添加交互到底在学什么

“描述 UI”解决的是页面静态结构怎么写，“添加交互”解决的是用户操作之后页面怎么变化。

比如：

- 点击按钮切换展开状态。
- 在输入框里输入内容并同步显示。
- 点击下一张切换轮播图。
- 勾选列表项并更新列表数据。

React 里会把随时间变化、需要影响页面显示的数据称为 **state**。组件通过事件处理函数响应用户操作，再通过更新 state 触发新的渲染。

从 Vue3 转过来，可以先建立一个对应关系：

| Vue3 | React |
| :--- | :--- |
| `@click="handleClick"` | `onClick={handleClick}` |
| `ref(0)` | `useState(0)` |
| `count.value++` | `setCount(count + 1)` |
| 直接改响应式对象 | 创建新对象后 `setState` |
| 模板自动追踪依赖 | state 更新触发重新渲染 |

## 2. 响应事件：从 @click 到 onClick

Vue3 中我们常写：

```vue
<button @click="handleClick">点击</button>
```

React 中写法是：

```jsx
function Button() {
  function handleClick() {
    alert('Clicked!');
  }

  return <button onClick={handleClick}>点击</button>;
}
```

注意这里传的是函数本身，不是函数调用结果。

正确：

```jsx
<button onClick={handleClick}>点击</button>
```

不推荐：

```jsx
<button onClick={handleClick()}>点击</button>
```

第二种会在渲染时立刻执行函数，而不是等点击时执行。

如果要传参数，可以包一层箭头函数：

```jsx
function TodoItem({ todo }) {
  function handleDelete(id) {
    console.log('delete', id);
  }

  return (
    <button onClick={() => handleDelete(todo.id)}>
      删除
    </button>
  );
}
```

## 3. 自定义组件的事件，本质还是 props

React 内置 DOM 标签支持浏览器事件，比如 `onClick`、`onChange`、`onSubmit`。

但自定义组件没有所谓“内置事件系统”，父组件传给子组件的事件处理函数，本质上只是一个函数 props。

```jsx
function Toolbar() {
  function handlePlayMovie() {
    alert('播放电影');
  }

  function handleUploadImage() {
    alert('上传图片');
  }

  return (
    <div>
      <Button onClick={handlePlayMovie}>播放</Button>
      <Button onClick={handleUploadImage}>上传</Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

类比 Vue3：

```vue
<Child @submit="handleSubmit" />
```

React 中更直接：

```jsx
<Child onSubmit={handleSubmit} />
```

子组件内部再决定什么时候调用：

```jsx
function Child({ onSubmit }) {
  return <button onClick={onSubmit}>提交</button>;
}
```

所以 React 的组件通信会更统一：数据是 props，回调函数也是 props。

## 4. State：组件的记忆

组件需要记住某些会变化的东西，比如当前页码、输入框内容、是否展开。这就是 state。

React 中使用 `useState` 声明 state：

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <button onClick={handleClick}>
      count: {count}
    </button>
  );
}
```

`useState(0)` 返回两个值：

- `count`：当前渲染中的 state 值。
- `setCount`：请求更新 state 的函数。

Vue3 中我们会写：

```js
const count = ref(0);

function handleClick() {
  count.value++;
}
```

React 不推荐直接修改变量，而是通过 setter 告诉 React：请基于新的 state 重新渲染组件。

## 5. 表单输入：受控组件

在 React 里，输入框常见写法是让 `value` 受 state 控制。

```jsx
import { useState } from 'react';

function MessageInput() {
  const [message, setMessage] = useState('');

  return (
    <label>
      留言：
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <p>你输入的是：{message}</p>
    </label>
  );
}
```

用户输入时，浏览器触发 `onChange`，我们调用 `setMessage` 更新 state，然后 React 重新渲染页面。

这和 Vue3 的 `v-model` 很像：

```vue
<input v-model="message" />
<p>你输入的是：{{ message }}</p>
```

不同点是：

- Vue3 用 `v-model` 封装了 value 和事件。
- React 通常显式写出 `value` 和 `onChange`。

也就是说，React 的表单双向绑定更像是“手动版 v-model”。

## 6. 渲染和提交：React 更新 UI 的流程

React 官方文档把一次 UI 更新分成三个阶段：

1. 触发渲染。
2. 渲染组件。
3. 提交到 DOM。

触发渲染的常见原因有两个：

- 组件第一次显示。
- 组件或父组件的 state 被更新。

比如点击按钮：

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}
```

点击后并不是直接把按钮里的文字改掉，而是：

1. `setCount(count + 1)` 请求一次新渲染。
2. React 再次调用 `Counter` 函数。
3. 新的 JSX 中 `count` 变成新值。
4. React 把必要的变化提交到 DOM。

从 Vue3 的角度看，Vue 会追踪响应式依赖并更新相关 DOM；React 则更强调“state 变化后重新执行组件函数，得到下一次 UI 描述”。

## 7. State 如同一张快照

这是 React 里非常容易踩坑的一点：一次渲染中的 state 是固定的快照。

看这个例子：

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    console.log(count); // 0
    setCount(count + 1);
    console.log(count); // 仍然是 0
  }

  return <button onClick={handleClick}>{count}</button>;
}
```

`setCount` 不会立刻修改当前函数里的 `count`。它只是告诉 React：下一次渲染请使用新的 state。

所以当前这一次事件处理函数里的 `count`，仍然是本次渲染时拿到的快照。

这和 Vue3 的直觉很不一样：

```js
count.value++;
console.log(count.value); // 通常能看到新值
```

React 的心智模型更像是：

> 每一次渲染都有自己的 props 和 state。事件处理函数也“记住”了创建它时那次渲染里的值。

理解这一点，对后面学习闭包、Effect 依赖和异步更新都很重要。

## 8. 多次 state 更新：使用更新函数

再看一个常见问题：

```jsx
function Counter() {
  const [score, setScore] = useState(0);

  function addThree() {
    setScore(score + 1);
    setScore(score + 1);
    setScore(score + 1);
  }

  return <button onClick={addThree}>+3：{score}</button>;
}
```

很多初学者会以为点击后加 3，但实际可能只加 1。

原因是这三次 `score + 1` 用到的都是同一份快照里的 `score`。

正确写法是传入更新函数：

```jsx
function Counter() {
  const [score, setScore] = useState(0);

  function addThree() {
    setScore(s => s + 1);
    setScore(s => s + 1);
    setScore(s => s + 1);
  }

  return <button onClick={addThree}>+3：{score}</button>;
}
```

`s => s + 1` 的意思是：基于队列中的上一个 state 计算下一个 state。

以后只要遇到“下一次 state 依赖上一次 state”的场景，都建议优先写成函数式更新：

```jsx
setCount(c => c + 1);
setOpen(open => !open);
```

## 9. 更新对象：不要直接改原对象

React state 可以保存对象，但更新对象时不要直接修改原对象。

不推荐：

```jsx
function ProfileForm() {
  const [person, setPerson] = useState({
    name: 'Alex',
    city: 'Shanghai',
  });

  function handleNameChange(e) {
    person.name = e.target.value;
    setPerson(person);
  }
}
```

应该创建新对象：

```jsx
function ProfileForm() {
  const [person, setPerson] = useState({
    name: 'Alex',
    city: 'Shanghai',
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value,
    });
  }

  return (
    <input
      value={person.name}
      onChange={handleNameChange}
    />
  );
}
```

嵌套对象也要逐层复制：

```jsx
setPerson({
  ...person,
  artwork: {
    ...person.artwork,
    title: nextTitle,
  },
});
```

Vue3 中我们习惯直接改响应式对象：

```js
person.name = nextName;
```

React 则更强调不可变更新：不要修改旧对象，而是创建一个新对象表达“下一份状态”。

## 10. 更新数组：map、filter、展开语法

数组也是对象，所以 state 中的数组也要当作只读数据处理。

### 新增一项

```jsx
setTodos([
  ...todos,
  { id: nextId, text: input },
]);
```

### 删除一项

```jsx
setTodos(
  todos.filter(todo => todo.id !== id)
);
```

### 修改一项

```jsx
setTodos(
  todos.map(todo => {
    if (todo.id === id) {
      return {
        ...todo,
        done: !todo.done,
      };
    }

    return todo;
  })
);
```

这里和 Vue3 的差异仍然是同一个核心：Vue3 可以对响应式数组做 `push`、`splice` 等操作；React 更推荐用新数组替换旧数组。

| 操作 | Vue3 常见写法 | React 推荐写法 |
| :--- | :--- | :--- |
| 新增 | `list.push(item)` | `setList([...list, item])` |
| 删除 | `list.splice(index, 1)` | `setList(list.filter(...))` |
| 修改 | `list[index].done = true` | `setList(list.map(...))` |

## 11. 一个完整的小例子

把事件、state、表单和数组更新合在一起：

```jsx
import { useState } from 'react';

let nextId = 1;

function TodoApp() {
  const [text, setText] = useState('');
  const [todos, setTodos] = useState([]);

  function handleAdd() {
    if (!text.trim()) return;

    setTodos([
      ...todos,
      {
        id: nextId++,
        text,
        done: false,
      },
    ]);
    setText('');
  }

  function handleToggle(id) {
    setTodos(
      todos.map(todo =>
        todo.id === id
          ? { ...todo, done: !todo.done }
          : todo
      )
    );
  }

  return (
    <>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <button onClick={handleAdd}>添加</button>

      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <label>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => handleToggle(todo.id)}
              />
              {todo.text}
            </label>
          </li>
        ))}
      </ul>
    </>
  );
}
```

这个例子里有几个 React 交互的基本动作：

- 输入框通过 `value` 和 `onChange` 受 state 控制。
- 点击按钮时通过 `setTodos` 新增数组项。
- 勾选时通过 `map` 创建新数组。
- 每一次 state 更新都会触发组件重新渲染。

## 12. 小结

React 的“添加交互”可以先抓住四个关键词：

1. **事件**：用 `onClick`、`onChange`、`onSubmit` 响应用户操作。
2. **state**：用 `useState` 记住会变化的数据。
3. **快照**：一次渲染中的 state 不会因为调用 setter 立刻改变。
4. **不可变更新**：对象和数组要创建新值，再交给 setter。

对 Vue3 开发者来说，真正需要适应的不是事件写法，而是 state 的快照模型和不可变更新。

Vue3 的响应式系统像是“我改了数据，框架帮我追踪影响”；React 的模型更像是“我提交下一份状态，组件重新计算下一份 UI”。理解这个差异之后，后面的状态管理、Reducer、Context 和 Effect 都会清晰很多。

<ArticleComments slug="vue3-to-react-adding-interactivity" />

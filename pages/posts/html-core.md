---
title: HTML 核心知识总结
date: 2025-07-05
categories:
  - 前端
tags:
  - HTML
  - 基础
---
<ArticleViews slug="html-core" />

> HTML 是 Web 页面的骨架。刚开始学前端时，很容易觉得 HTML 只是“写标签”，但真正写页面时会发现：结构是否清晰、语义是否合理、表单是否可用、资源是否正确加载，都会影响页面质量。

## 1. HTML 负责什么

HTML 的全称是 HyperText Markup Language，超文本标记语言。

它不负责页面样式，也不负责复杂交互，主要负责描述页面结构和内容含义。

可以简单分工：

| 技术 | 主要职责 |
| :--- | :--- |
| HTML | 页面结构和内容 |
| CSS | 页面样式和布局 |
| JavaScript | 页面交互和逻辑 |

所以 HTML 的重点不是“标签越多越好”，而是用合适的标签表达合适的内容。

## 2. 基本页面结构

一个最基础的 HTML 页面大概是这样：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>我的页面</title>
  </head>
  <body>
    <h1>Hello HTML</h1>
    <p>这是一个段落。</p>
  </body>
</html>
```

几个关键点：

- `<!doctype html>`：告诉浏览器使用 HTML5 标准解析。
- `<html lang="zh-CN">`：声明页面语言，有利于可访问性和搜索引擎理解。
- `<head>`：放页面元信息，比如编码、标题、SEO 信息、资源链接。
- `<body>`：放用户真正能看到的页面内容。

## 3. 常见文本标签

HTML 中有很多文本相关标签。

```html
<h1>一级标题</h1>
<h2>二级标题</h2>
<p>段落内容</p>
<strong>重要内容</strong>
<em>强调内容</em>
<span>行内容器</span>
```

标题标签不是为了字体大小，而是为了表达内容层级。不推荐为了变大就乱用 `h1`，页面中应该有清晰的标题层级。

## 4. 语义化标签

语义化的意思是：用有含义的标签表达页面结构，而不是所有地方都用 `div`。

常见语义化标签：

```html
<header>页面或区域头部</header>
<nav>导航区域</nav>
<main>页面主体内容</main>
<article>独立文章或内容块</article>
<section>页面中的一个章节</section>
<aside>侧边栏或补充内容</aside>
<footer>页面或区域底部</footer>
```

语义化的好处：

- 代码更容易阅读。
- 搜索引擎更容易理解页面。
- 屏幕阅读器等辅助工具更容易工作。
- 页面结构更清晰，后期维护更轻松。

比如一个博客页面可以这样组织：

```html
<header>
  <h1>想想的学习笔记</h1>
  <nav>
    <a href="/">首页</a>
    <a href="/archives">归档</a>
  </nav>
</header>

<main>
  <article>
    <h2>HTML 核心知识总结</h2>
    <p>这里是文章内容。</p>
  </article>
</main>

<footer>
  <p>© 2026 想想的学习笔记</p>
</footer>
```

这比一堆没有含义的 `div` 更容易理解。

## 5. 链接和图片

链接用 `a` 标签：

```html
<a href="https://example.com">访问网站</a>
```

常见属性：

- `href`：跳转地址。
- `target="_blank"`：新窗口打开。
- `rel="noopener noreferrer"`：新窗口打开外部链接时更安全。

图片用 `img` 标签：

```html
<img src="/logo.png" alt="网站 logo" />
```

`alt` 很重要。它不是随便写的装饰文字，而是在图片加载失败或辅助阅读场景下说明图片内容。

## 6. 列表、表格和表单

无序列表：

```html
<ul>
  <li>HTML</li>
  <li>CSS</li>
  <li>JavaScript</li>
</ul>
```

表格适合展示二维结构数据：

```html
<table>
  <thead>
    <tr>
      <th>姓名</th>
      <th>成绩</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>小明</td>
      <td>90</td>
    </tr>
  </tbody>
</table>
```

表单是前端开发里非常高频的内容：

```html
<form>
  <label for="username">用户名</label>
  <input id="username" name="username" type="text" />

  <label for="password">密码</label>
  <input id="password" name="password" type="password" />

  <button type="submit">提交</button>
</form>
```

几个注意点：

- `label` 的 `for` 应该对应输入框的 `id`。
- `input` 的 `name` 会影响表单提交字段。
- 按钮最好明确 `type`，比如 `submit` 或 `button`。
- 表格应该用于表格数据，不应该用来做页面布局。

## 7. DOM 树结构

浏览器会把 HTML 解析成 DOM，也就是文档对象模型。

```html
<body>
  <h1>标题</h1>
  <p>段落</p>
</body>
```

会变成类似这样的树：

```txt
document
└─ html
   └─ body
      ├─ h1
      └─ p
```

JavaScript 操作页面，本质上很多时候就是在读取或修改 DOM。

## 8. script 的 defer 和 async

页面中引入 JavaScript 时，经常会看到：

```html
<script src="/main.js"></script>
<script src="/main.js" defer></script>
<script src="/main.js" async></script>
```

它们区别如下：

| 写法 | 下载 | 执行 |
| :--- | :--- | :--- |
| 普通 script | 阻塞 HTML 解析 | 下载后立即执行 |
| defer | 不阻塞 HTML 解析 | HTML 解析完成后按顺序执行 |
| async | 不阻塞 HTML 解析 | 下载完成后立即执行，顺序不保证 |

一般业务脚本更常用 `defer`，因为它既不阻塞 HTML 解析，又能保证执行顺序。

## 9. 常见误区

### 误区一：HTML 很简单，不值得学

HTML 语法确实不复杂，但写出结构清晰、语义合理、可访问性好的页面并不简单。

### 误区二：所有布局都用 div

`div` 没有语义。能用语义化标签表达时，优先使用语义化标签。

### 误区三：图片 alt 可以不写

装饰性图片可以留空 `alt=""`，但内容性图片应该写清楚说明。

### 误区四：按钮都用 a 标签模拟

跳转用 `a`，操作用 `button`。这是语义和可访问性上的区别。

## 10. 小结

HTML 的核心不是背标签，而是理解页面结构。

可以先抓住这些重点：

1. HTML 负责内容和结构。
2. 语义化标签让页面更清晰。
3. 表单、链接、图片、列表、表格是基础能力。
4. 浏览器会把 HTML 解析成 DOM。
5. `defer` 和 `async` 会影响脚本加载时机。

写好 HTML，是写好前端页面的第一步。

<ArticleComments slug="html-core" />

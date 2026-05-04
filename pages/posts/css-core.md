---
title: CSS 核心知识总结
date: 2025-07-11
categories:
  - 前端
tags:
  - CSS
  - 基础
---
<ArticleViews slug="css-core" />

> CSS 负责页面的样式和布局。刚开始学 CSS 时，最容易觉得它只是“改颜色、调大小”，但真正写页面时会发现，布局、层叠、响应式、可维护性才是 CSS 的重点。

## 1. CSS 负责什么

HTML 描述页面结构，CSS 控制页面长什么样。

比如：

- 文字颜色。
- 字体大小。
- 间距。
- 背景。
- 布局。
- 动画。
- 响应式适配。

可以先记住一句话：

> HTML 是骨架，CSS 是表现。

## 2. CSS 的三种引入方式

### 行内样式

```html
<p style="color: red;">文字</p>
```

不推荐大量使用，因为样式和结构混在一起，不方便维护。

### 内部样式

```html
<style>
  p {
    color: red;
  }
</style>
```

适合简单页面或临时示例。

### 外部样式

```html
<link rel="stylesheet" href="/style.css" />
```

真实项目中最常见，结构和样式分离，便于复用和维护。

## 3. 选择器基础

CSS 通过选择器找到要应用样式的元素。

```css
p {
  color: red;
}

.card {
  padding: 16px;
}

#app {
  min-height: 100vh;
}
```

含义：

- `p`：标签选择器。
- `.card`：类选择器。
- `#app`：ID 选择器。

选择器不是写得越复杂越好。选择器越复杂，后期覆盖和维护越麻烦。

## 4. 层叠与优先级

CSS 的 C 是 Cascading，意思是层叠。

当多个规则作用于同一个元素时，浏览器需要决定谁生效。

常见优先级大致是：

```txt
!important
行内样式
ID 选择器
类 / 属性 / 伪类
标签 / 伪元素
通配符
```

比如：

```css
p {
  color: black;
}

.text {
  color: blue;
}
```

```html
<p class="text">Hello</p>
```

最终文字是蓝色，因为类选择器优先级高于标签选择器。

不过不建议依赖很高优先级解决问题。如果需要到处写 `!important`，通常说明样式结构已经有点混乱。

## 5. 盒模型

页面中的每个元素都可以看作一个盒子。

盒子由几部分组成：

```txt
content
padding
border
margin
```

两种盒模型：

| 盒模型 | width 表示 |
| :--- | :--- |
| `content-box` | 只包含内容宽度 |
| `border-box` | 包含内容、padding、border |

推荐全局设置：

```css
* {
  box-sizing: border-box;
}
```

这样元素宽度更容易计算，布局更稳定。

## 6. display 和文档流

常见 `display` 值：

```css
display: block;
display: inline;
display: inline-block;
display: flex;
display: grid;
display: none;
```

简单理解：

- `block`：独占一行，可以设置宽高。
- `inline`：不独占一行，宽高通常不生效。
- `inline-block`：不独占一行，但可以设置宽高。
- `none`：不显示，也不占位置。

文档流是浏览器默认排列元素的方式。很多布局问题，本质上是在理解元素是否仍在文档流中。

## 7. 定位 position

常见定位方式：

```css
position: static;
position: relative;
position: absolute;
position: fixed;
position: sticky;
```

简单理解：

- `static`：默认定位。
- `relative`：相对自己原位置偏移。
- `absolute`：相对最近的定位祖先元素定位。
- `fixed`：相对浏览器视口定位。
- `sticky`：滚动到某个位置后吸附。

`absolute` 经常配合父元素 `relative` 使用：

```css
.card {
  position: relative;
}

.badge {
  position: absolute;
  top: 8px;
  right: 8px;
}
```

## 8. Flex 布局

Flex 是一维布局，适合处理一行或一列中的排列。

```css
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}
```

常用属性：

- `flex-direction`：主轴方向。
- `justify-content`：主轴对齐。
- `align-items`：交叉轴对齐。
- `gap`：元素间距。
- `flex-wrap`：是否换行。

Flex 很适合导航栏、按钮组、卡片内部横向排列、垂直居中。

经典居中：

```css
.box {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

## 9. Grid 布局

Grid 是二维布局，适合同时控制行和列。

```css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
```

Grid 适合：

- 图片墙。
- 仪表盘。
- 商品列表。
- 页面整体布局。

Flex 更像处理“一条线”，Grid 更像处理“一张网”。

## 10. 响应式布局

响应式布局是让页面适配不同屏幕。

```css
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
```

常用思路：

- 使用百分比、`fr`、`minmax` 等弹性单位。
- 小屏幕减少列数。
- 图片设置最大宽度。
- 避免固定死宽度。

图片常见写法：

```css
img {
  max-width: 100%;
  height: auto;
}
```

响应式不是最后补丁，而应该从布局设计时就考虑。

## 11. CSS 变量

CSS 变量可以保存可复用的值。

```css
:root {
  --primary-color: #42b983;
  --space-md: 16px;
}

.button {
  background: var(--primary-color);
  padding: var(--space-md);
}
```

它适合管理主题色、间距、字体大小、阴影、圆角，在主题切换和设计系统里很常见。

## 12. 常见误区

### 误区一：CSS 只靠试

可以调试，但不能完全靠试。盒模型、文档流、定位、层叠这些原理要理解。

### 误区二：一遇到问题就 absolute

`absolute` 能快速解决位置问题，但也容易破坏布局流。能用 Flex/Grid 解决时，优先用布局系统。

### 误区三：到处写固定宽高

固定宽高会让响应式变困难。列表、卡片、容器尽量使用弹性布局。

### 误区四：过度使用 !important

`!important` 可以救急，但不是长期方案。

## 13. 小结

CSS 基础可以先抓住这些主线：

1. 选择器决定样式作用到谁。
2. 层叠和优先级决定谁最终生效。
3. 盒模型决定元素尺寸。
4. 文档流和定位决定元素位置。
5. Flex 和 Grid 是现代布局核心。
6. 响应式让页面适配不同设备。
7. CSS 变量和模块化方案提升可维护性。

CSS 的难点不是属性多，而是布局问题背后的规则多。把盒模型、层叠、Flex、Grid 这几块打牢，后面写页面会稳很多。

<ArticleComments slug="css-core" />

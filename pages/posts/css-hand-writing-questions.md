---
title: CSS 手写专题
date: 2025-10-04
categories:
  - 写写代码
tags:
  - CSS
  - 手写
  - 面试
---

# CSS 手写专题

---

面试话术
同一个布局问题，我通常会优先使用 flex  作为现代方案。（grid也更多在特定场景）
同时我也清楚 float、absolute 等传统实现方式及其原理和适用场景，在需要兼容或特殊布局时可以切换
一、两栏布局（左定宽，右自适应）
HTML 统一结构：
<div class="container">
  <div class="left">left</div>
  <div class="right">right</div>
</div>
方案 1：float + margin（经典必会）
.left {
  float: left;
  width: 200px;
}

.right {
  margin-left: 200px;
}
特点
● 最老牌方案，面试官爱问
● 需要处理浮动塌陷（clearfix）
方案 2：flex（推荐方案）
.container {
  display: flex;
}

.left {
  width: 200px;
}

.right {
  flex: 1;
}
特点
● 语义清晰
● 自适应能力强
● 实际项目首选
方案 3：absolute + padding
.container {
  position: relative;
}

.left {
  position: absolute;
  width: 200px;
  left: 0;
}

.right {
  padding-left: 200px;
}
特点
● 不参与文档流
● 常用于整体布局容器
二、三栏布局（中间自适应）
HTML：
<div class="container">
  <div class="left">left</div>
  <div class="center">center</div>
  <div class="right">right</div>
</div>
方案 1：float（三栏老题）
.left, .right {
  width: 200px;
  float: left;
}

.center {
  margin: 0 200px;
}
方案 2：flex
.container {
  display: flex;
}

.left, .right {
  width: 200px;
}

.center {
  flex: 1;
}
方案 3：grid
.container {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
}
面试加分点
Grid 更适合二维布局，复杂页面结构可读性最好
三、水平垂直居中（高频必考）
HTML：
<div class="parent">
  <div class="child"></div>
</div>
方案 1：flex
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}
方案 2：absolute + transform（经典）
.parent {
  position: relative;
}

.child {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
方案 3：grid
.parent {
  display: grid;
  place-items: center;
}
方案 4：table-cell（偏老，但要认识）
.parent {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}
四、CSS 三角形（零宽高技巧）
.triangle {
  width: 0;
  height: 0;
  border: 20px solid transparent;
  border-top-color: red;
}
向右三角形
border-left-color: red;
面试表达要点
本质是 border 相交区域，宽高为 0
五、Loading 动画
方案 1：旋转圆环
.loading {
  width: 40px;
  height: 40px;
  border: 4px solid #ccc;
  border-top-color: #000;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
方案 2：三点跳动
.dot {
  width: 10px;
  height: 10px;
  background: #000;
  border-radius: 50%;
  animation: bounce 1.4s infinite;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}
方案 3：条形加载
.bar {
  width: 4px;
  height: 20px;
  background: #333;
  animation: stretch 1s infinite;
}

@keyframes stretch {
  50% {
    height: 40px;
  }
}
六、弹窗实现（遮罩 + 居中）
HTML：
<div class="mask">
  <div class="modal"></div>
</div>
方案 1：position + transform
.mask {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.5);
}

.modal {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
方案 2：flex 居中
.mask {
  position: fixed;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
方案 3：grid 居中
.mask {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
}
七、补充题（可以继续练）
● 单行 / 多行文本省略
● 清除浮动（clearfix 原理）
● 自适应正方形
● sticky 吸顶
● BFC 触发方式
● 纯 CSS tooltip

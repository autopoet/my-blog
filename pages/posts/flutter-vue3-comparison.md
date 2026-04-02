---
title:  快速了解 Flutter
date: 2026-04-02
categories:
  - 写写代码
tags:
  - Flutter
  - Vue3
  - 案例实践
---
<ArticleViews slug="flutter-vue3-comparison" />

作为一个使用 **Vue3** 的前端开发者，今天利用 **AICoding**的能力，快速构建一个基于**flutter**的“动漫 Feed 流视频应用” Demo。

目的：
1. **快速成片**：不纠结于搭建环境的每一个微小报错，而是通过 AI 快速生成业务代码。
2. **原理摸底**：通过对比熟悉的 Vue3，理解 Flutter 的渲染机制和状态管理。
3. **异同分析**：弄清楚前端思维在 Flutter 中哪些能复用。

---

## 2. 核心技术原理：Flutter vs Vue3

在编写这个 Demo 的过程中，我深刻体会到了两者底层逻辑的碰撞：

### 2.1 UI 描述：声明式 UI 的共鸣
- **Vue3**: 使用 `template` 或 `JSX`。通过数据驱动视图，响应式变量改变，DOM 自动更新。
- **Flutter**: “Everything is a Widget”。同样是声明式 UI，通过构建 Widget 树来描述界面。
- **联系**：两者都摆脱了手动操作 DOM/原生节点的低效。

### 2.2 渲染引擎：DOM vs Skia
- **Vue3 (Web)**: 依赖浏览器的 HTML/CSS 解析引擎。虽然有虚拟 DOM 优化，但最终还是落脚在 DOM 树。
- **Flutter**: 彻底绕过了原生控件和浏览器引擎，直接使用 **Skia/Impeller** 绘图引擎在屏幕上“画”出像素。
- **区别**：Flutter 的性能上限更高，因为它能控制到每一帧的绘制逻辑，且在各端表现高度统一。

---

## 3. 开发体验对比

### 3.1 状态管理：Pinia 与 Provider/ChangeNotifier
在 Demo 中，我实现了一个“点赞”功能：
- **Vue3 方向**：我会习惯性地找 Pinia。
- **Flutter 实践**：使用了 `Provider`。
- **感悟**：Flutter 的 `ChangeNotifier` 配合 `context.watch`，玩起来其实非常像 Pinia 的 `actions` 和响应式监听。

### 3.2 布局逻辑：Flexbox 与 Widget 嵌套
- **Vue3/CSS**: 使用 `display: flex`。
- **Flutter**: 使用 `Row`, `Column`, `Stack`。
- **难点**：Flutter 嵌套层级深（传说中的 Widget 炼狱），但通过 AI 辅助排版，这种层级感反而让组件边界变得非常清晰。

---

## 4. 总结

通过 AICoding，我在短短几小时内完成了一个包含：
- **响应式全局导航**（类似 YouTube 的 Sidebar 与 BottomBar）
- **高性能瀑布流**（SliverMasonryGrid 驱动）
- **沉浸式视频播放**（VideoPlayer 深度定制）
的 App。

**我的结论是**：
如果你掌握了 Vue3 的组件化思维和状态管理逻辑，转战 Flutter 的门槛并不高。最大的挑战在于从“操作文档流”向“控制像素点”的思维转变。

---
最后，附上一张 Demo 的效果图（火影忍者高清 Banner）：
![Naruto Banner](file:///d:/DEVELOP/LearningCode/flutter-learning/flutter_demo1/assets/images/banner.jpg)

<ArticleComments slug="flutter-vue3-comparison" />
